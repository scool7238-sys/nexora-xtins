import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import {
  afterDraw,
  detectSoftwareWebGL,
  disposeObject3D,
  isWebGLAvailable,
  prefersReducedMotion,
} from '../utils/webgl';

export type StorageLayerKey =
  | 'sessions'
  | 'bookmarks-history'
  | 'downloads'
  | 'privacy-settings'
  | 'adblock-settings';

interface EncryptedStorageSceneProps {
  activeStream: StorageLayerKey | null;
  focusBoundary: 'nexora' | 'webview2';
}

const STREAM_INDEX: Record<StorageLayerKey, number> = {
  sessions: 0,
  'bookmarks-history': 1,
  downloads: 2,
  'privacy-settings': 3,
  'adblock-settings': 4,
};

const STREAM_COLORS = [0x22d3ee, 0x8b5cf6, 0x38bdf8, 0xa78bfa, 0x6366f1];

const _pt = new THREE.Vector3();
const _dummy = new THREE.Object3D();
const _color = new THREE.Color();

export function EncryptedStorageScene({
  activeStream,
  focusBoundary,
}: EncryptedStorageSceneProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const activeStreamRef = useRef<StorageLayerKey | null>(activeStream);
  const boundaryRef = useRef<'nexora' | 'webview2'>(focusBoundary);
  const [webglFailed, setWebglFailed] = useState(false);

  useEffect(() => {
    activeStreamRef.current = activeStream;
  }, [activeStream]);

  useEffect(() => {
    boundaryRef.current = focusBoundary;
  }, [focusBoundary]);

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
    renderer.toneMappingExposure = 1.1;
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

    const camera = new THREE.PerspectiveCamera(42, w / h, 0.1, 80);
    camera.position.set(0, 0.55, 7.6);

    scene.add(new THREE.HemisphereLight(0xdbeafe, 0x090b16, 0.85));
    const key = new THREE.DirectionalLight(0xffffff, 2.0);
    key.position.set(4, 6, 7);
    scene.add(key);

    const violetLight = new THREE.PointLight(0x8b5cf6, 15, 22, 1.5);
    violetLight.position.set(1.5, 1.5, 2.5);
    scene.add(violetLight);

    const cyanLight = new THREE.PointLight(0x22d3ee, 12, 20, 1.5);
    cyanLight.position.set(-3, -1, 3);
    scene.add(cyanLight);

    // 1. Central Protected Storage Core (NEXORA-owned persistent data)
    const vaultGroup = new THREE.Group();
    vaultGroup.position.set(1.35, -0.15, 0);
    scene.add(vaultGroup);

    // Inner AES-256-GCM crystalline core
    const aesCore = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.88, 0),
      new THREE.MeshPhysicalMaterial({
        color: 0x6d28d9,
        metalness: 0.35,
        roughness: 0.14,
        clearcoat: 1.0,
        emissive: 0x4c1d95,
        emissiveIntensity: 0.65,
      }),
    );
    vaultGroup.add(aesCore);

    const aesCage = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.18, 0),
      new THREE.MeshStandardMaterial({
        color: 0x22d3ee,
        wireframe: true,
        transparent: true,
        opacity: 0.45,
        emissive: 0x0891b2,
        emissiveIntensity: 0.4,
      }),
    );
    vaultGroup.add(aesCage);

    // Outer Windows DPAPI key-protection ring
    const dpapiRing = new THREE.Mesh(
      new THREE.TorusGeometry(1.52, 0.065, 16, 64),
      new THREE.MeshStandardMaterial({
        color: 0x334155,
        metalness: 0.92,
        roughness: 0.2,
      }),
    );
    dpapiRing.rotation.x = Math.PI / 3;
    vaultGroup.add(dpapiRing);

    const dpapiInnerRing = new THREE.Mesh(
      new THREE.TorusGeometry(1.34, 0.025, 12, 64),
      new THREE.MeshStandardMaterial({
        color: 0x22d3ee,
        emissive: 0x22d3ee,
        emissiveIntensity: 0.65,
        metalness: 0.5,
        roughness: 0.2,
      }),
    );
    dpapiInnerRing.rotation.x = -Math.PI / 4;
    vaultGroup.add(dpapiInnerRing);

    // 2. Separate WebView2 / Website Storage Boundary Plane (far left/back, visually isolated)
    const webviewBoundary = new THREE.Group();
    webviewBoundary.position.set(-2.75, 0.45, -1.6);
    scene.add(webviewBoundary);

    const boundaryMat = new THREE.MeshPhysicalMaterial({
      color: 0x475569,
      roughness: 0.35,
      metalness: 0.15,
      transparent: true,
      opacity: 0.32,
      side: THREE.DoubleSide,
    });
    const boundaryPlate = new THREE.Mesh(new THREE.BoxGeometry(1.9, 2.5, 0.08), boundaryMat);
    webviewBoundary.add(boundaryPlate);

    const boundaryGrid = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.BoxGeometry(1.92, 2.52, 0.1)),
      new THREE.LineBasicMaterial({ color: 0x94a3b8, transparent: true, opacity: 0.65 }),
    );
    webviewBoundary.add(boundaryGrid);

    // 3. Five NEXORA-owned data conduits flowing into the DPAPI / AES-256-GCM vault
    const curves: THREE.CatmullRomCurve3[] = [];
    const tubeMeshes: THREE.Mesh[] = [];

    for (let i = 0; i < 5; i++) {
      const yStart = 1.45 - i * 0.72;
      const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-3.3, yStart, 0.65),
        new THREE.Vector3(-1.35, yStart * 0.65, 0.95),
        new THREE.Vector3(0.15, yStart * 0.25, 0.45),
        new THREE.Vector3(1.35, -0.15, 0),
      ]);
      curves.push(curve);

      const tubeGeo = new THREE.TubeGeometry(curve, 36, 0.022, 8, false);
      const tubeMat = new THREE.MeshStandardMaterial({
        color: STREAM_COLORS[i],
        emissive: STREAM_COLORS[i],
        emissiveIntensity: 0.35,
        transparent: true,
        opacity: 0.65,
        roughness: 0.3,
      });
      const tube = new THREE.Mesh(tubeGeo, tubeMat);
      scene.add(tube);
      tubeMeshes.push(tube);
    }

    // Instanced data packets along the 5 conduits (4 packets per conduit = 20 instances)
    const packetsPerStream = 4;
    const totalPackets = 5 * packetsPerStream;
    const packetGeo = new THREE.OctahedronGeometry(0.085, 0);
    const packetMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.2,
      metalness: 0.5,
      emissive: 0x22d3ee,
      emissiveIntensity: 0.65,
    });
    const packetInstances = new THREE.InstancedMesh(packetGeo, packetMat, totalPackets);
    for (let i = 0; i < totalPackets; i++) {
      const streamIdx = Math.floor(i / packetsPerStream);
      _color.setHex(STREAM_COLORS[streamIdx]);
      packetInstances.setColorAt(i, _color);
    }
    if (packetInstances.instanceColor) packetInstances.instanceColor.needsUpdate = true;
    packetInstances.frustumCulled = false;
    scene.add(packetInstances);

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
    renderer.domElement.addEventListener('webglcontextlost', onContextLost);

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
        const selectedIdx = activeStreamRef.current ? STREAM_INDEX[activeStreamRef.current] : -1;
        const focusWebView = boundaryRef.current === 'webview2';

        // Rotate vault & DPAPI rings
        if (!reducedMotion) {
          aesCore.rotation.y += delta * 0.45;
          aesCore.rotation.x += delta * 0.2;
          aesCage.rotation.y -= delta * 0.25;
          dpapiRing.rotation.z += delta * 0.32;
          dpapiInnerRing.rotation.y -= delta * 0.42;
        }

        // Highlight selected stream conduit
        for (let s = 0; s < 5; s++) {
          const mat = tubeMeshes[s].material as THREE.MeshStandardMaterial;
          const isHighlighted = selectedIdx === -1 || selectedIdx === s;
          mat.opacity = focusWebView ? 0.22 : isHighlighted ? 0.92 : 0.22;
          mat.emissiveIntensity = selectedIdx === s ? 0.95 : 0.35;
        }

        // Update instanced packets along conduits
        for (let i = 0; i < totalPackets; i++) {
          const streamIdx = Math.floor(i / packetsPerStream);
          const offset = (i % packetsPerStream) / packetsPerStream;
          const t = reducedMotion ? offset : (elapsed * 0.28 + offset) % 1;
          curves[streamIdx].getPointAt(t, _pt);
          _dummy.position.copy(_pt);
          const isActive = selectedIdx === -1 || selectedIdx === streamIdx;
          const baseScale = focusWebView ? 0.45 : isActive ? 1.1 : 0.45;
          _dummy.scale.setScalar(baseScale * (1 - t * 0.35));
          _dummy.rotation.y = elapsed * 1.5 + i;
          _dummy.updateMatrix();
          packetInstances.setMatrixAt(i, _dummy.matrix);
        }
        packetInstances.instanceMatrix.needsUpdate = true;

        // Emphasize WebView2 boundary when selected
        boundaryMat.opacity = focusWebView ? 0.62 : 0.26;
        const targetCamX = focusWebView ? -1.1 : 0.0;
        const targetCamZ = focusWebView ? 7.9 : 7.4;
        camera.position.x = THREE.MathUtils.damp(camera.position.x, targetCamX, 4.5, delta);
        camera.position.z = THREE.MathUtils.damp(camera.position.z, targetCamZ, 4.5, delta);
        camera.lookAt(focusWebView ? -0.9 : 0.15, 0, -0.2);

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
        aria-label="3D visualization of AES-256-GCM and Windows DPAPI protected local storage"
      />
      {webglFailed && (
        <div className="absolute inset-0 flex items-center justify-center rounded-2xl border border-slate-700/60 bg-[#0b1020] p-6 text-center">
          <div>
            <p className="font-display text-lg font-semibold text-white">
              AES-256-GCM + Windows DPAPI Storage Architecture
            </p>
            <p className="mt-1 text-sm text-slate-400">
              NEXORA-owned persistent data enters the protected storage layer, separated from WebView2 website storage.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
