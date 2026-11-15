import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import {
  afterDraw,
  detectSoftwareWebGL,
  disposeObject3D,
  isMobileViewport,
  isWebGLAvailable,
  prefersReducedMotion,
} from '../utils/webgl';

const _targetVec = new THREE.Vector3();

function createExtrudedOctagonRing(): THREE.BufferGeometry {
  const outer = new THREE.Shape();
  const R = 2.05;
  const r = 1.66;
  const sides = 8;
  for (let i = 0; i < sides; i++) {
    const a = (i / sides) * Math.PI * 2 + Math.PI / 8;
    const x = Math.cos(a) * R;
    const y = Math.sin(a) * R;
    if (i === 0) outer.moveTo(x, y);
    else outer.lineTo(x, y);
  }
  outer.closePath();

  const hole = new THREE.Path();
  for (let i = 0; i < sides; i++) {
    const a = (i / sides) * Math.PI * 2 + Math.PI / 8;
    const x = Math.cos(a) * r;
    const y = Math.sin(a) * r;
    if (i === 0) hole.moveTo(x, y);
    else hole.lineTo(x, y);
  }
  hole.closePath();
  outer.holes.push(hole);

  const geo = new THREE.ExtrudeGeometry(outer, {
    depth: 0.16,
    bevelEnabled: true,
    bevelThickness: 0.04,
    bevelSize: 0.035,
    bevelSegments: 2,
  });
  geo.center();
  return geo;
}

function createXtinsBarGeometry(length: number, width: number, depth: number): THREE.BufferGeometry {
  const hw = length / 2;
  const hh = width / 2;
  const cut = width * 0.45;

  const shape = new THREE.Shape();
  shape.moveTo(-hw + cut, -hh);
  shape.lineTo(hw - cut, -hh);
  shape.lineTo(hw, 0);
  shape.lineTo(hw - cut, hh);
  shape.lineTo(-hw + cut, hh);
  shape.lineTo(-hw, 0);
  shape.closePath();

  const geo = new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.025,
    bevelSegments: 2,
  });
  geo.center();
  return geo;
}

function createGlassPanelTexture(label: string, accent: string): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 320;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = 'rgba(10, 14, 28, 0.9)';
    ctx.fillRect(0, 0, 512, 320);

    ctx.strokeStyle = accent;
    ctx.lineWidth = 3;
    ctx.strokeRect(12, 12, 488, 296);

    ctx.fillStyle = accent;
    ctx.fillRect(28, 28, 120, 6);

    ctx.fillStyle = '#e2e8f0';
    ctx.font = '600 22px "Outfit", sans-serif';
    ctx.fillText(label, 28, 72);

    ctx.fillStyle = 'rgba(148, 163, 184, 0.35)';
    ctx.fillRect(28, 108, 420, 10);
    ctx.fillRect(28, 134, 340, 10);
    ctx.fillRect(28, 160, 290, 10);

    ctx.strokeStyle = 'rgba(148, 163, 184, 0.25)';
    ctx.lineWidth = 1.5;
    for (let i = 0; i < 4; i++) {
      ctx.strokeRect(28 + i * 112, 200, 96, 72);
    }
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function HeroSpaceScene() {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [webglFailed, setWebglFailed] = useState(false);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    if (!isWebGLAvailable()) {
      setWebglFailed(true);
      return;
    }

    const isSoftwareGl = detectSoftwareWebGL();
    const reducedMotion = prefersReducedMotion();
    const mobile = isMobileViewport();

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl,
        alpha: false,
        powerPreference: 'high-performance',
      });
    } catch {
      setWebglFailed(true);
      return;
    }

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = false;
    renderer.setClearColor(0x06070d, 1);

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;
    renderer.setSize(width, height);
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x06070d);
    scene.fog = new THREE.FogExp2(0x06070d, 0.032);

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envTarget = pmremGenerator.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = envTarget.texture;
    pmremGenerator.dispose();

    const camera = new THREE.PerspectiveCamera(46, width / height, 0.1, 140);
    camera.position.set(0, 0.25, mobile ? 11.5 : 9.4);

    // Three-point + cosmic accent lighting
    const hemiLight = new THREE.HemisphereLight(0x93c5fd, 0x090b16, 0.85);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xf8fafc, 2.2);
    keyLight.position.set(6, 7, 8);
    scene.add(keyLight);

    const violetRim = new THREE.PointLight(0x8b5cf6, 18, 26, 1.6);
    violetRim.position.set(-4.5, 2.5, 3.2);
    scene.add(violetRim);

    const cyanAccent = new THREE.PointLight(0x22d3ee, 14, 24, 1.6);
    cyanAccent.position.set(4.8, -1.8, 3.5);
    scene.add(cyanAccent);

    // Master emblem group positioned gracefully to the right on desktop, centered subtly behind on mobile
    const emblemAnchor = new THREE.Group();
    emblemAnchor.position.set(mobile ? 0 : 2.35, mobile ? 0.55 : 0.05, 0);
    scene.add(emblemAnchor);

    // Composite 8-part 3D NEXORA XTINS Emblem
    const emblemCore = new THREE.Group();
    emblemAnchor.add(emblemCore);

    const titaniumMat = new THREE.MeshStandardMaterial({
      color: 0x161c32,
      metalness: 0.92,
      roughness: 0.22,
    });
    const violetChromeMat = new THREE.MeshPhysicalMaterial({
      color: 0x7c3aed,
      metalness: 0.85,
      roughness: 0.18,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      emissive: 0x3b0764,
      emissiveIntensity: 0.45,
    });
    const cyanCrystalMat = new THREE.MeshPhysicalMaterial({
      color: 0x22d3ee,
      metalness: 0.15,
      roughness: 0.08,
      clearcoat: 1.0,
      transmission: isSoftwareGl ? 0 : 0.72,
      transparent: true,
      opacity: isSoftwareGl ? 0.55 : 0.95,
      ior: 1.55,
      thickness: 1.1,
      emissive: 0x0891b2,
      emissiveIntensity: 0.5,
    });

    // Part 1: Outer octagonal bezel
    const octRing = new THREE.Mesh(createExtrudedOctagonRing(), titaniumMat);
    emblemCore.add(octRing);

    // Part 2 & 3: Interlocking X bars
    const barGeo = createXtinsBarGeometry(2.65, 0.34, 0.18);
    const barA = new THREE.Mesh(barGeo, violetChromeMat);
    barA.rotation.z = Math.PI / 4;
    barA.position.z = 0.04;
    emblemCore.add(barA);

    const barB = new THREE.Mesh(barGeo.clone(), violetChromeMat);
    barB.rotation.z = -Math.PI / 4;
    barB.position.z = -0.04;
    emblemCore.add(barB);

    // Part 4: Central crystalline core
    const coreCrystal = new THREE.Mesh(new THREE.OctahedronGeometry(0.46, 0), cyanCrystalMat);
    coreCrystal.position.z = 0.22;
    emblemCore.add(coreCrystal);

    // Part 5-7: Three tilted orbital rings
    const orbitalRings: THREE.Mesh[] = [];
    const ringConfigs = [
      { radius: 2.55, tube: 0.024, color: 0x22d3ee, rx: 1.18, ry: 0.35 },
      { radius: 2.95, tube: 0.018, color: 0x8b5cf6, rx: -0.92, ry: 0.65 },
      { radius: 3.38, tube: 0.014, color: 0x64748b, rx: 0.42, ry: -1.1 },
    ];
    for (const cfg of ringConfigs) {
      const ringMat = new THREE.MeshStandardMaterial({
        color: cfg.color,
        metalness: 0.8,
        roughness: 0.24,
        emissive: cfg.color,
        emissiveIntensity: cfg.color === 0x64748b ? 0.1 : 0.45,
      });
      const ring = new THREE.Mesh(new THREE.TorusGeometry(cfg.radius, cfg.tube, 12, 84), ringMat);
      ring.rotation.set(cfg.rx, cfg.ry, 0);
      emblemAnchor.add(ring);
      orbitalRings.push(ring);
    }

    // Part 8-10: Floating holographic HUD glass panels
    const maxAniso = renderer.capabilities.getMaxAnisotropy();
    const hudSpecs = [
      { label: 'Privacy Dashboard', accent: '#22d3ee', pos: [-2.75, 1.45, -1.1], rotY: 0.35 },
      { label: 'Tab Groups · Incognito', accent: '#8b5cf6', pos: [2.55, -1.55, -0.8], rotY: -0.35 },
      { label: 'AUROUS · AETHER', accent: '#38bdf8', pos: [-2.15, -1.75, -1.4], rotY: 0.25 },
    ];
    const hudPanels: THREE.Mesh[] = [];
    for (const spec of hudSpecs) {
      const tex = createGlassPanelTexture(spec.label, spec.accent);
      tex.anisotropy = maxAniso;
      const mat = new THREE.MeshPhysicalMaterial({
        map: tex,
        transparent: true,
        opacity: 0.72,
        roughness: 0.18,
        metalness: 0.1,
        clearcoat: 0.9,
        side: THREE.DoubleSide,
        depthWrite: false,
      });
      const panel = new THREE.Mesh(new THREE.PlaneGeometry(1.55, 0.96), mat);
      panel.position.set(spec.pos[0], spec.pos[1], spec.pos[2]);
      panel.rotation.y = spec.rotY;
      emblemAnchor.add(panel);
      hudPanels.push(panel);
    }

    // Instanced starfield
    const starCount = mobile ? 180 : 420;
    const starGeo = new THREE.OctahedronGeometry(0.032, 0);
    const starMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const stars = new THREE.InstancedMesh(starGeo, starMat, starCount);
    const dummy = new THREE.Object3D();
    const starColor = new THREE.Color();
    const palette = [0xe2e8f0, 0xa78bfa, 0x22d3ee, 0x94a3b8];

    for (let i = 0; i < starCount; i++) {
      const spreadX = (Math.random() - 0.5) * 34;
      const spreadY = (Math.random() - 0.5) * 20;
      const spreadZ = -2 - Math.random() * 26;
      dummy.position.set(spreadX, spreadY, spreadZ);
      const scale = 0.5 + Math.random() * 1.4;
      dummy.scale.setScalar(scale);
      dummy.updateMatrix();
      stars.setMatrixAt(i, dummy.matrix);
      starColor.setHex(palette[i % palette.length]);
      stars.setColorAt(i, starColor);
    }
    stars.instanceMatrix.needsUpdate = true;
    if (stars.instanceColor) stars.instanceColor.needsUpdate = true;
    stars.computeBoundingSphere();
    scene.add(stars);

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    // Pointer parallax state
    const pointer = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const onPointerMove = (ev: PointerEvent) => {
      if (reducedMotion) return;
      const rect = container.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      pointer.targetX = ((ev.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.targetY = -(((ev.clientY - rect.top) / rect.height) * 2 - 1);
    };
    window.addEventListener('pointermove', onPointerMove, { passive: true });

    // Visibility / IntersectionObserver to pause off-screen rendering
    let isVisible = true;
    const observer = new IntersectionObserver(
      (entries) => {
        isVisible = entries[0]?.isIntersecting ?? true;
      },
      { threshold: 0.02 },
    );
    observer.observe(container);

    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    const onContextLost = (e: Event) => {
      e.preventDefault();
      setWebglFailed(true);
    };
    renderer.domElement.addEventListener('webglcontextlost', onContextLost);

    let disposed = false;
    let rafId = 0;
    const timers: number[] = [];
    const registerTimer = (id: number) => timers.push(id);
    const clock = new THREE.Clock();

    const renderStaticFrame = () => {
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
    };

    if (reducedMotion) {
      renderStaticFrame();
    } else {
      const tick = () => {
        if (disposed) return;
        const delta = Math.min(clock.getDelta(), 0.05);
        const elapsed = clock.getElapsedTime();

        if (isVisible && !document.hidden) {
          pointer.x = THREE.MathUtils.damp(pointer.x, pointer.targetX, 4.5, delta);
          pointer.y = THREE.MathUtils.damp(pointer.y, pointer.targetY, 4.5, delta);

          emblemCore.rotation.y = elapsed * 0.22 + pointer.x * 0.28;
          emblemCore.rotation.x = Math.sin(elapsed * 0.45) * 0.08 - pointer.y * 0.16;
          coreCrystal.rotation.y = -elapsed * 0.6;
          coreCrystal.rotation.x = elapsed * 0.35;

          orbitalRings[0].rotation.z += delta * 0.26;
          orbitalRings[1].rotation.z -= delta * 0.19;
          orbitalRings[2].rotation.y += delta * 0.14;

          for (let i = 0; i < hudPanels.length; i++) {
            hudPanels[i].position.y += Math.sin(elapsed * 1.1 + i * 2.1) * 0.0008;
          }

          stars.rotation.y = elapsed * 0.012 + pointer.x * 0.03;
          stars.rotation.x = pointer.y * 0.02;

          _targetVec.set(pointer.x * 0.45, 0.25 + pointer.y * 0.25, mobile ? 11.5 : 9.4);
          camera.position.lerp(_targetVec, 1 - Math.exp(-3.5 * delta));
          camera.lookAt(mobile ? 0 : 0.7, 0, 0);

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
    }

    return () => {
      disposed = true;
      cancelAnimationFrame(rafId);
      timers.forEach((t) => clearTimeout(t));
      observer.disconnect();
      window.removeEventListener('resize', onResize);
      window.removeEventListener('pointermove', onPointerMove);
      renderer.domElement.removeEventListener('webglcontextlost', onContextLost);
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
      <div ref={mountRef} className="absolute inset-0" aria-hidden="true" />
      {webglFailed && (
        <div
          className="absolute inset-0 bg-[radial-gradient(circle_at_70%_40%,rgba(139,92,246,0.22),transparent_55%),radial-gradient(circle_at_30%_70%,rgba(34,211,238,0.12),transparent_50%)]"
          aria-hidden="true"
        />
      )}
    </div>
  );
}
