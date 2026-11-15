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

export type BrowserFocusPreset = 'overview' | 'tabs' | 'privacy' | 'downloads';

interface FloatingBrowserSceneProps {
  focusPreset: BrowserFocusPreset;
  themeMode: BrowserThemeMode;
}

const PRESET_TARGETS: Record<
  BrowserFocusPreset,
  { camPos: [number, number, number]; lookAt: [number, number, number]; rotY: number; rotX: number }
> = {
  overview: { camPos: [0, 0.08, 6.7], lookAt: [0, 0, 0], rotY: -0.14, rotX: 0.04 },
  tabs: { camPos: [-0.35, 0.92, 5.1], lookAt: [-0.25, 0.78, 0], rotY: -0.06, rotX: 0.08 },
  privacy: { camPos: [0, 0.05, 5.9], lookAt: [0, 0, 0], rotY: 0.08, rotX: 0.02 },
  downloads: { camPos: [0, 0.05, 5.9], lookAt: [0, 0, 0], rotY: -0.09, rotX: 0.02 },
};

const _camTarget = new THREE.Vector3();
const _lookTarget = new THREE.Vector3();
const _currentLook = new THREE.Vector3();

function resolveScreenKey(preset: BrowserFocusPreset, theme: BrowserThemeMode): BrowserScreenKey {
  if (preset === 'privacy') return 'privacyDashboard';
  if (preset === 'downloads' || preset === 'tabs') return 'downloadsPanel';
  return theme === 'aether' ? 'aetherHome' : 'aurousHome';
}

export function FloatingBrowserScene({ focusPreset, themeMode }: FloatingBrowserSceneProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const presetRef = useRef<BrowserFocusPreset>(focusPreset);
  const themeRef = useRef<BrowserThemeMode>(themeMode);
  const modelRef = useRef<ReturnType<typeof buildBrowserModel> | null>(null);
  const [webglFailed, setWebglFailed] = useState(false);

  useEffect(() => {
    presetRef.current = focusPreset;
    modelRef.current?.setScreen(resolveScreenKey(focusPreset, themeRef.current));
  }, [focusPreset]);

  useEffect(() => {
    themeRef.current = themeMode;
    modelRef.current?.setTheme(themeMode);
    modelRef.current?.setScreen(resolveScreenKey(presetRef.current, themeMode));
  }, [themeMode]);

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

    const w = container.clientWidth || 640;
    const h = container.clientHeight || 420;
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
    camera.position.set(...PRESET_TARGETS.overview.camPos);

    scene.add(new THREE.HemisphereLight(0xe0e7ff, 0x090b16, 0.85));
    const key = new THREE.DirectionalLight(0xffffff, 1.8);
    key.position.set(4, 6, 7);
    scene.add(key);

    const rim = new THREE.PointLight(0x8b5cf6, 12, 18, 1.5);
    rim.position.set(-4.5, 2, 3);
    scene.add(rim);

    const fill = new THREE.PointLight(0x22d3ee, 10, 18, 1.5);
    fill.position.set(4.5, -2, 3);
    scene.add(fill);

    const maxAniso = renderer.capabilities.getMaxAnisotropy();
    const model = buildBrowserModel(maxAniso, isSoftwareGl);
    model.setTheme(themeRef.current);
    model.setScreen(resolveScreenKey(presetRef.current, themeRef.current));
    modelRef.current = model;
    scene.add(model.root);

    // Subtle drag tilt capped so screenshot always stays readable
    const drag = { active: false, lastX: 0, lastY: 0, offsetY: 0, offsetX: 0 };
    const onPointerDown = (e: PointerEvent) => {
      drag.active = true;
      drag.lastX = e.clientX;
      drag.lastY = e.clientY;
    };
    const onPointerMove = (e: PointerEvent) => {
      if (!drag.active) return;
      const dx = e.clientX - drag.lastX;
      const dy = e.clientY - drag.lastY;
      drag.lastX = e.clientX;
      drag.lastY = e.clientY;
      drag.offsetY = THREE.MathUtils.clamp(drag.offsetY + dx * 0.004, -0.32, 0.32);
      drag.offsetX = THREE.MathUtils.clamp(drag.offsetX + dy * 0.003, -0.2, 0.2);
    };
    const onPointerUp = () => {
      drag.active = false;
    };

    const domEl = renderer.domElement;
    domEl.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerup', onPointerUp);

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
      const nw = container.clientWidth || 640;
      const nh = container.clientHeight || 420;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    };
    window.addEventListener('resize', onResize);

    const onContextLost = (e: Event) => {
      e.preventDefault();
      setWebglFailed(true);
    };
    domEl.addEventListener('webglcontextlost', onContextLost);

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    let disposed = false;
    let rafId = 0;
    const timers: number[] = [];
    const registerTimer = (id: number) => timers.push(id);
    const clock = new THREE.Clock();

    const tick = () => {
      if (disposed) return;
      const delta = Math.min(clock.getDelta(), 0.05);
      const elapsed = clock.getElapsedTime();

      if (isVisible && !document.hidden) {
        const target = PRESET_TARGETS[presetRef.current];
        _camTarget.set(...target.camPos);
        _lookTarget.set(...target.lookAt);

        const damping = reducedMotion ? 1 : 1 - Math.exp(-5 * delta);
        camera.position.lerp(_camTarget, damping);
        _currentLook.lerp(_lookTarget, damping);
        camera.lookAt(_currentLook);

        if (!drag.active && !reducedMotion) {
          drag.offsetX = THREE.MathUtils.damp(drag.offsetX, 0, 1.8, delta);
          drag.offsetY = THREE.MathUtils.damp(drag.offsetY, 0, 1.8, delta);
        }

        const floatY = reducedMotion ? 0 : Math.sin(elapsed * 1.1) * 0.035;
        model.root.position.y = floatY;
        model.root.rotation.y = THREE.MathUtils.damp(
          model.root.rotation.y,
          target.rotY + drag.offsetY,
          5,
          delta,
        );
        model.root.rotation.x = THREE.MathUtils.damp(
          model.root.rotation.x,
          target.rotX + drag.offsetX,
          5,
          delta,
        );

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
      domEl.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      domEl.removeEventListener('webglcontextlost', onContextLost);
      modelRef.current = null;
      model.disposeTextures();
      disposeObject3D(scene);
      envTarget.dispose();
      renderer.dispose();
      if (domEl.parentElement === container) {
        container.removeChild(domEl);
      }
    };
  }, []);

  return (
    <div className="relative h-full w-full cursor-grab active:cursor-grabbing">
      <div
        ref={mountRef}
        className="absolute inset-0"
        aria-label="Interactive 3D NEXORA XTINS Windows browser preview"
      />
      {webglFailed && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#090d1a] p-4">
          <img
            src="./assets/aistudio/image_64121c10.png"
            alt="NEXORA XTINS Windows desktop browser interface"
            referrerPolicy="no-referrer"
            className="max-h-full w-auto rounded-xl border border-slate-700/70 object-contain"
          />
        </div>
      )}
    </div>
  );
}
