import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import {
  buildBrowserModel,
  BrowserScreenKey,
  BrowserThemeMode,
} from './buildBrowserModel';
import {
  afterDraw,
  detectSoftwareWebGL,
  disposeObject3D,
  isWebGLAvailable,
  prefersReducedMotion,
} from '../utils/webgl';

interface ScrollAssemblySceneProps {
  /** Normalized progress from 0 to 1 across the 7 assembly stages */
  progress: number;
}

const _camVec = new THREE.Vector3();
const _lookVec = new THREE.Vector3();

export function ScrollAssemblyScene({ progress }: ScrollAssemblySceneProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const progressRef = useRef(progress);
  const [webglFailed, setWebglFailed] = useState(false);

  useEffect(() => {
    progressRef.current = progress;
  }, [progress]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    if (!isWebGLAvailable()) {
      setWebglFailed(true);
      return;
    }

    const isSoftwareGl = detectSoftwareWebGL();
    const reducedMotion = prefersReducedMotion();

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl,
        alpha: true,
        powerPreference: 'high-performance',
      });
    } catch {
      setWebglFailed(true);
      return;
    }

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x06070d, 0);

    const w = container.clientWidth || 720;
    const h = container.clientHeight || 480;
    renderer.setSize(w, h);
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envTarget = pmremGenerator.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = envTarget.texture;
    pmremGenerator.dispose();

    const camera = new THREE.PerspectiveCamera(38, w / h, 0.1, 80);
    camera.position.set(0, 0.15, 7.2);

    scene.add(new THREE.HemisphereLight(0xdbeafe, 0x090b16, 0.9));
    const key = new THREE.DirectionalLight(0xffffff, 1.85);
    key.position.set(5, 6, 8);
    scene.add(key);

    const violet = new THREE.PointLight(0x8b5cf6, 14, 22, 1.5);
    violet.position.set(-4.5, 2, 3.5);
    scene.add(violet);

    const cyan = new THREE.PointLight(0x22d3ee, 11, 20, 1.5);
    cyan.position.set(4.5, -1.5, 3.5);
    scene.add(cyan);

    const maxAniso = renderer.capabilities.getMaxAnisotropy();
    const model = buildBrowserModel(maxAniso, isSoftwareGl);
    scene.add(model.root);

    let activeTheme: BrowserThemeMode = 'aurous';
    let activeScreen: BrowserScreenKey = 'aurousHome';

    let isVisible = true;
    const observer = new IntersectionObserver(
      (entries) => {
        isVisible = entries[0]?.isIntersecting ?? true;
      },
      { threshold: 0.05 },
    );
    observer.observe(container);

    const onResize = () => {
      if (!container) return;
      const nw = container.clientWidth || 720;
      const nh = container.clientHeight || 480;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    };
    window.addEventListener('resize', onResize);

    const onContextLost = (e: Event) => {
      e.preventDefault();
      setWebglFailed(true);
    };
    renderer.domElement.addEventListener('webglcontextlost', onContextLost);

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    let disposed = false;
    let rafId = 0;
    const timers: number[] = [];
    const registerTimer = (id: number) => timers.push(id);
    const clock = new THREE.Clock();

    let smoothedProgress = progressRef.current;

    const tick = () => {
      if (disposed) return;
      const delta = Math.min(clock.getDelta(), 0.05);
      const elapsed = clock.getElapsedTime();

      if (isVisible && !document.hidden) {
        const targetP = THREE.MathUtils.clamp(progressRef.current, 0, 1);
        smoothedProgress = reducedMotion
          ? targetP
          : THREE.MathUtils.damp(smoothedProgress, targetP, 6.5, delta);

        const p = smoothedProgress;

        // Subtle, legible 3D choreography synced to the 7 real XTINS views
        const sIntro = THREE.MathUtils.smoothstep(p, 0.0, 0.16);
        model.root.scale.setScalar(THREE.MathUtils.lerp(0.84, 1.0, sIntro));

        // Gentle perspective rotation that settles straight-on for readability
        const targetRotY =
          p < 0.28
            ? THREE.MathUtils.lerp(-0.28, -0.06, sIntro)
            : p < 0.56
              ? 0.08
              : p < 0.85
                ? -0.08
                : 0.0;
        const swayY = reducedMotion ? 0 : Math.sin(elapsed * 0.65) * 0.025;
        model.root.rotation.y = THREE.MathUtils.damp(
          model.root.rotation.y,
          targetRotY + swayY,
          4.5,
          delta,
        );
        model.root.rotation.x = THREE.MathUtils.damp(
          model.root.rotation.x,
          p > 0.86 ? 0.01 : 0.05,
          4.5,
          delta,
        );

        // Select real screenshot & theme matching each stage
        let nextScreen: BrowserScreenKey = 'aurousHome';
        let nextTheme: BrowserThemeMode = 'aurous';

        if (p < 0.28) {
          nextScreen = 'aurousHome';
          nextTheme = 'aurous';
        } else if (p < 0.43) {
          // Stage 3: Multi-tab + study Tab Group workspace
          nextScreen = 'downloadsPanel';
          nextTheme = 'aurous';
        } else if (p < 0.58) {
          // Stage 4: Privacy Dashboard
          nextScreen = 'privacyDashboard';
          nextTheme = 'aurous';
        } else if (p < 0.72) {
          // Stage 5: Downloads Panel
          nextScreen = 'downloadsPanel';
          nextTheme = 'aurous';
        } else if (p < 0.87) {
          // Stage 6: AETHER glass theme showcase
          nextScreen = 'aetherHome';
          nextTheme = 'aether';
        } else {
          // Stage 7: Complete NEXORA XTINS Home reveal
          nextScreen = 'aurousHome';
          nextTheme = 'aurous';
        }

        if (nextTheme !== activeTheme) {
          activeTheme = nextTheme;
          model.setTheme(activeTheme);
        }
        if (nextScreen !== activeScreen) {
          activeScreen = nextScreen;
          model.setScreen(activeScreen);
        }

        // Gentle camera zoom framing (focusing slightly upper during tab/group stage, full frame otherwise)
        const tabFocus = p >= 0.14 && p < 0.43;
        _camVec.set(
          tabFocus ? -0.25 : 0,
          tabFocus ? 0.52 : 0.04,
          tabFocus ? 5.65 : p > 0.86 ? 6.45 : 6.75,
        );
        _lookVec.set(tabFocus ? -0.15 : 0, tabFocus ? 0.42 : 0, 0);

        const dampFactor = 1 - Math.exp(-5 * delta);
        camera.position.lerp(_camVec, dampFactor);
        camera.lookAt(_lookVec);

        renderer.render(scene, camera);
      }

      if (isSoftwareGl) {
        afterDraw(renderer, tick, registerTimer);
      } else {
        rafId = requestAnimationFrame(tick);
      }
    };

    if (isSoftwareGl) {
      afterDraw(renderer, tick, registerTimer);
    } else {
      rafId = requestAnimationFrame(tick);
    }

    return () => {
      disposed = true;
      cancelAnimationFrame(rafId);
      timers.forEach((t) => clearTimeout(t));
      observer.disconnect();
      window.removeEventListener('resize', onResize);
      renderer.domElement.removeEventListener('webglcontextlost', onContextLost);
      model.disposeTextures();
      disposeObject3D(scene);
      envTarget.dispose();
      renderer.dispose();
      if (renderer.domElement.parentElement === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="relative h-full w-full">
      <div
        ref={mountRef}
        className="absolute inset-0"
        aria-label="Scroll-driven 3D NEXORA XTINS browser presentation"
      />
      {webglFailed && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#090d1a] p-4">
          <img
            src="./assets/aistudio/image_64121c10.png"
            alt="NEXORA XTINS Windows desktop browser"
            referrerPolicy="no-referrer"
            className="max-h-full w-auto rounded-xl border border-slate-700/70 object-contain"
          />
        </div>
      )}
    </div>
  );
}
