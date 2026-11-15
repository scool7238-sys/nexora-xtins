import * as THREE from 'three';
import { PRODUCT_SCREENSHOTS } from '../config/siteConfig';

export type BrowserThemeMode = 'aurous' | 'aether';
export type BrowserScreenKey = 'aurousHome' | 'aetherHome' | 'privacyDashboard' | 'downloadsPanel';

export interface BrowserModelParts {
  root: THREE.Group;
  chassisGroup: THREE.Group;
  viewportScreen: THREE.Mesh;
  viewportMat: THREE.MeshBasicMaterial;
  frameMat: THREE.MeshStandardMaterial;
  backPlateMat: THREE.MeshStandardMaterial;
  accentRimMat: THREE.MeshStandardMaterial;
  focusBracket: THREE.Group;
  setTheme: (mode: BrowserThemeMode) => void;
  setScreen: (key: BrowserScreenKey) => void;
  disposeTextures: () => void;
}

function createInitialPlaceholderTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 960;
  canvas.height = 505;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const grad = ctx.createLinearGradient(0, 0, 960, 505);
    grad.addColorStop(0, '#070916');
    grad.addColorStop(1, '#0e1328');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 960, 505);

    ctx.fillStyle = '#f8fafc';
    ctx.font = '700 32px "Outfit", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('NEXORA XTINS', 480, 245);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '500 15px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('Loading product preview...', 480, 278);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function createRoundedFrameGeometry(w: number, h: number, r: number, depth: number): THREE.BufferGeometry {
  const shape = new THREE.Shape();
  const hw = w / 2;
  const hh = h / 2;
  shape.moveTo(-hw + r, -hh);
  shape.lineTo(hw - r, -hh);
  shape.quadraticCurveTo(hw, -hh, hw, -hh + r);
  shape.lineTo(hw, hh - r);
  shape.quadraticCurveTo(hw, hh, hw - r, hh);
  shape.lineTo(-hw + r, hh);
  shape.quadraticCurveTo(-hw, hh, -hw, hh - r);
  shape.lineTo(-hw, -hh + r);
  shape.quadraticCurveTo(-hw, -hh, -hw + r, -hh);

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

export function buildBrowserModel(
  maxAnisotropy: number,
  isSoftwareGl: boolean,
): BrowserModelParts {
  const root = new THREE.Group();
  const chassisGroup = new THREE.Group();
  root.add(chassisGroup);

  const frameMat = new THREE.MeshStandardMaterial({
    color: 0x0f1426,
    metalness: 0.86,
    roughness: 0.24,
  });

  const backPlateMat = new THREE.MeshPhysicalMaterial({
    color: 0x0a0e1d,
    metalness: 0.35,
    roughness: 0.2,
    clearcoat: 0.85,
    transparent: true,
    opacity: isSoftwareGl ? 0.9 : 0.82,
  });

  const accentRimMat = new THREE.MeshStandardMaterial({
    color: 0x8b5cf6,
    metalness: 0.55,
    roughness: 0.22,
    emissive: 0x6d28d9,
    emissiveIntensity: 0.55,
  });

  // 1. Primary 16:9-widescreen machined Windows chassis (6.36 x 3.44 housing for 6.08 x 3.20 screen)
  const chassisMesh = new THREE.Mesh(
    createRoundedFrameGeometry(6.32, 3.44, 0.14, 0.11),
    frameMat,
  );
  chassisGroup.add(chassisMesh);

  // 2. Depth backing halo plate offset behind main chassis
  const backPlate = new THREE.Mesh(
    createRoundedFrameGeometry(6.58, 3.68, 0.18, 0.04),
    backPlateMat,
  );
  backPlate.position.set(0, 0, -0.16);
  chassisGroup.add(backPlate);

  // 3. Subtle luminous edge rails matching AUROUS / AETHER identity
  const topRail = new THREE.Mesh(new THREE.BoxGeometry(5.9, 0.022, 0.14), accentRimMat);
  topRail.position.set(0, 1.72, 0.01);
  chassisGroup.add(topRail);

  const bottomRail = new THREE.Mesh(new THREE.BoxGeometry(5.9, 0.018, 0.14), accentRimMat);
  bottomRail.position.set(0, -1.72, 0.01);
  chassisGroup.add(bottomRail);

  // 4. Real Product Screenshot Viewport Plane (1.90:1 ratio matching full Windows desktop capture)
  const fallbackTex = createInitialPlaceholderTexture();
  fallbackTex.anisotropy = maxAnisotropy;

  // Use MeshBasicMaterial for the screenshot plane so colors, typography, and dark UI contrast
  // match the real NEXORA XTINS screenshots 1:1 without specular washout or lighting glare.
  const viewportMat = new THREE.MeshBasicMaterial({
    map: fallbackTex,
    toneMapped: false,
  });

  const viewportScreen = new THREE.Mesh(new THREE.PlaneGeometry(6.08, 3.2), viewportMat);
  viewportScreen.position.set(0, 0, 0.095);
  chassisGroup.add(viewportScreen);

  // 5. Optional subtle perimeter focus bracket (stays outside/on border, never obscures UI)
  const focusBracket = new THREE.Group();
  const bracketGeo = new THREE.EdgesGeometry(new THREE.BoxGeometry(6.14, 3.26, 0.02));
  const bracketMat = new THREE.LineBasicMaterial({
    color: 0x22d3ee,
    transparent: true,
    opacity: 0.45,
  });
  const bracketLines = new THREE.LineSegments(bracketGeo, bracketMat);
  bracketLines.position.set(0, 0, 0.105);
  focusBracket.add(bracketLines);
  chassisGroup.add(focusBracket);

  // Load real screenshot textures asynchronously
  const loader = new THREE.TextureLoader();
  const textureCache: Partial<Record<BrowserScreenKey, THREE.Texture>> = {};
  let currentKey: BrowserScreenKey = 'aurousHome';

  const loadKey = (key: BrowserScreenKey, url: string) => {
    loader.load(
      url,
      (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.anisotropy = maxAnisotropy;
        tex.minFilter = THREE.LinearMipmapLinearFilter;
        tex.magFilter = THREE.LinearFilter;
        tex.generateMipmaps = true;
        tex.needsUpdate = true;
        textureCache[key] = tex;
        if (currentKey === key) {
          viewportMat.map = tex;
          viewportMat.needsUpdate = true;
        }
      },
      undefined,
      () => {
        // Keep fallback texture silently if image fails to load
      },
    );
  };

  loadKey('aurousHome', PRODUCT_SCREENSHOTS.aurousHome);
  loadKey('aetherHome', PRODUCT_SCREENSHOTS.aetherHome);
  loadKey('privacyDashboard', PRODUCT_SCREENSHOTS.privacyDashboard);
  loadKey('downloadsPanel', PRODUCT_SCREENSHOTS.downloadsPanel);

  const setScreen = (key: BrowserScreenKey) => {
    currentKey = key;
    const loaded = textureCache[key];
    if (loaded) {
      viewportMat.map = loaded;
      viewportMat.needsUpdate = true;
    }
  };

  const setTheme = (mode: BrowserThemeMode) => {
    const isAurous = mode === 'aurous';
    frameMat.color.setHex(isAurous ? 0x0f1426 : 0x1a233a);
    accentRimMat.color.setHex(isAurous ? 0x8b5cf6 : 0x38bdf8);
    accentRimMat.emissive.setHex(isAurous ? 0x6d28d9 : 0x0284c7);
    bracketMat.color.setHex(isAurous ? 0x22d3ee : 0x7dd3fc);
  };

  const disposeTextures = () => {
    fallbackTex.dispose();
    Object.values(textureCache).forEach((tex) => tex?.dispose());
  };

  return {
    root,
    chassisGroup,
    viewportScreen,
    viewportMat,
    frameMat,
    backPlateMat,
    accentRimMat,
    focusBracket,
    setTheme,
    setScreen,
    disposeTextures,
  };
}
