// 3D viewer for Caretta on the Robots page: <div data-caretta-viewer></div>.
// The model (caretta.glb) is built from the robot's URDF by tools/make_caretta_glb.py.
// three.js (MIT, see LICENSE-three.txt) is served from this folder, no CDN.
// To change the look, see "3D viewer" in custom.css.
import * as THREE from "./three.module.min.js";
import { OrbitControls } from "./OrbitControls.js";
import { GLTFLoader } from "./GLTFLoader.js";
import { toCreasedNormals } from "./BufferGeometryUtils.js";

const MODEL_URL = new URL("caretta.glb", import.meta.url).href;
const TARGET = new THREE.Vector3(-0.041, 0.07, 0);   // middle of the robot (glTF: y up)
const DISTANCE = 0.56;                               // camera distance in metres
const EXPLODE_GAP = 0.04;                            // how far each plate moves up
const TWEEN_MS = 700;

// Camera directions in robot terms: azimuth from the front (x) toward the left (y), elevation up.
const VIEWS = {
  reset: { label: "Reset view", az: 35, el: 24 },
};
const TOGGLES = [
  { key: "explode", label: "Explode", on: false },
  { key: "spin", label: "Auto-rotate", on: true },
];

function viewDirection(az, el) {
  const a = THREE.MathUtils.degToRad(az), e = THREE.MathUtils.degToRad(el);
  // robot (x fwd, y left, z up) -> glTF (x, z, -y)
  return new THREE.Vector3(Math.cos(e) * Math.cos(a), Math.sin(e), -Math.cos(e) * Math.sin(a));
}

function ease(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }

function button(label, pressed) {
  const b = document.createElement("button");
  b.type = "button";
  b.className = "rln-viewer__btn";
  b.textContent = label;
  if (pressed !== undefined) b.setAttribute("aria-pressed", String(pressed));
  return b;
}

function build(root) {
  root.innerHTML = "";
  const stage = document.createElement("div");
  stage.className = "rln-viewer__stage";
  const status = document.createElement("p");
  status.className = "rln-viewer__status";
  status.textContent = "Loading 3D model…";
  stage.appendChild(status);

  const bar = document.createElement("div");
  bar.className = "rln-viewer__bar";
  const toggles = document.createElement("div");
  toggles.className = "rln-viewer__group";
  toggles.setAttribute("aria-label", "Show and hide parts");
  const views = document.createElement("div");
  views.className = "rln-viewer__group";
  views.setAttribute("aria-label", "Camera views");
  bar.append(toggles, views);

  const caption = document.createElement("p");
  caption.className = "rln-viewer__caption";
  caption.textContent = "Caretta, the same model the simulator uses. Drag to rotate, "
    + "click and scroll (or pinch) to zoom, right-drag to pan.";

  root.append(stage, bar, caption);
  return { stage, status, toggles, views };
}

function start(root) {
  const ui = build(root);
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  } catch (err) {
    ui.status.textContent = "3D view needs WebGL, which this browser has turned off.";
    return;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  ui.stage.prepend(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, 1, 0.01, 20);
  camera.position.copy(TARGET).addScaledVector(viewDirection(VIEWS.reset.az, VIEWS.reset.el), DISTANCE);

  scene.add(new THREE.HemisphereLight(0xffffff, 0x8a9696, 1.7));
  const key = new THREE.DirectionalLight(0xffffff, 1.6);
  key.position.set(0.6, 1.2, 0.5);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xffffff, 0.6);
  rim.position.set(-0.8, 0.4, -0.6);
  scene.add(rim);

  const grid = new THREE.GridHelper(1.2, 24);
  grid.position.y = -0.0005;
  scene.add(grid);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.target.copy(TARGET);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.minDistance = 0.2;
  controls.maxDistance = 2.0;
  controls.autoRotateSpeed = 1.2;
  controls.enableZoom = false;   // so the page still scrolls; turned on after a click on the model
  controls.update();

  const canvas = renderer.domElement;
  canvas.addEventListener("pointerdown", () => { controls.enableZoom = true; });
  canvas.addEventListener("pointerleave", () => { controls.enableZoom = false; });

  // Theme: grid lines follow the site's light/dark colors
  function applyTheme() {
    const css = getComputedStyle(document.documentElement);
    const major = css.getPropertyValue("--pst-color-text-muted").trim() || "#888888";
    const minor = css.getPropertyValue("--pst-color-border").trim() || "#cccccc";
    const mats = Array.isArray(grid.material) ? grid.material : [grid.material];
    mats.forEach((m) => { m.transparent = true; m.opacity = 0.55; });
    const colors = grid.geometry.attributes.color;
    const cMajor = new THREE.Color(major), cMinor = new THREE.Color(minor);
    for (let i = 0; i < colors.count; i++) {
      const x = grid.geometry.attributes.position.getX(i), z = grid.geometry.attributes.position.getZ(i);
      const c = Math.abs(x) < 1e-6 || Math.abs(z) < 1e-6 ? cMajor : cMinor;
      colors.setXYZ(i, c.r, c.g, c.b);
    }
    colors.needsUpdate = true;
    requestRender();
  }
  new MutationObserver(applyTheme).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

  // Size follows the box it sits in
  function resize() {
    const w = ui.stage.clientWidth, h = ui.stage.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    requestRender();
  }
  new ResizeObserver(resize).observe(ui.stage);

  // State
  const layers = [[], [], []];          // nodes per plate level
  const groups = {};                     // group name -> nodes
  let explode = 0, explodeFrom = 0, explodeTo = 0, explodeT0 = 0;
  let camFrom = null, camTo = null, camT0 = 0;
  let visible = false, needsRender = true, running = false;

  function requestRender() {
    needsRender = true;
    if (!running && visible) { running = true; requestAnimationFrame(frame); }
  }

  function frame(now) {
    if (camTo) {
      const t = Math.min(1, (now - camT0) / TWEEN_MS);
      camera.position.lerpVectors(camFrom, camTo, ease(t));
      if (t === 1) camTo = null;
    }
    if (explode !== explodeTo) {
      const t = Math.min(1, (now - explodeT0) / TWEEN_MS);
      const before = explode;
      explode = explodeFrom + (explodeTo - explodeFrom) * ease(t);
      if (t === 1) explode = explodeTo;
      // the camera rises with the middle plate, so the whole stack stays in view
      const lift = (explode - before) * EXPLODE_GAP;
      controls.target.y += lift;
      camera.position.y += lift;
      if (camTo) camTo.y += lift;
      layers.forEach((nodes, level) => nodes.forEach((n) => { n.position.y = n.userData.baseY + level * EXPLODE_GAP * explode; }));
    }
    const moving = controls.update() || camTo || explode !== explodeTo || controls.autoRotate;
    if (needsRender || moving) {
      renderer.render(scene, camera);
      needsRender = false;
    }
    if (visible && (moving || needsRender)) requestAnimationFrame(frame);
    else running = false;
  }
  controls.addEventListener("change", requestRender);

  // Buttons
  const toggleButtons = {};
  TOGGLES.forEach((t) => {
    const on = t.key === "spin" ? t.on && !reduceMotion : t.on;
    const b = button(t.label, on);
    toggleButtons[t.key] = b;
    b.addEventListener("click", () => setToggle(t.key, b.getAttribute("aria-pressed") !== "true"));
    ui.toggles.appendChild(b);
  });
  Object.entries(VIEWS).forEach(([name, v]) => {
    const b = button(v.label);
    b.addEventListener("click", () => {
      const target = TARGET.clone();
      target.y += explode * EXPLODE_GAP;   // keep the lift from "Explode"
      camFrom = camera.position.clone();
      camTo = target.clone().addScaledVector(viewDirection(v.az, v.el), camera.position.distanceTo(controls.target));
      controls.target.copy(target);
      camT0 = performance.now();
      setToggle("spin", false);
      requestRender();
    });
    ui.views.appendChild(b);
  });

  function setToggle(keyName, on) {
    toggleButtons[keyName].setAttribute("aria-pressed", String(on));
    if (keyName === "spin") controls.autoRotate = on;
    else if (keyName === "explode") {
      explodeFrom = explode; explodeTo = on ? 1 : 0; explodeT0 = performance.now();
    } else (groups[keyName] || []).forEach((n) => { n.visible = on; });
    requestRender();
  }
  controls.addEventListener("start", () => { if (controls.autoRotate) setToggle("spin", false); });

  // Only draw while on screen; load the model when it comes close
  let loading = false;
  new IntersectionObserver((entries) => {
    visible = entries.some((e) => e.isIntersecting);
    if (visible && !loading) { loading = true; load(); }
    if (visible) requestRender();
  }, { rootMargin: "200px" }).observe(root);

  function load() {
    new GLTFLoader().load(MODEL_URL, (gltf) => {
      const done = new Map();
      gltf.scene.traverse((obj) => {
        if (!obj.isMesh) return;
        if (!done.has(obj.geometry)) done.set(obj.geometry, toCreasedNormals(obj.geometry, THREE.MathUtils.degToRad(30)));
        obj.geometry = done.get(obj.geometry);
        const { layer = 0, group = "" } = obj.userData;
        obj.userData.baseY = obj.position.y;
        layers[layer].push(obj);
        (groups[group] = groups[group] || []).push(obj);
      });
      scene.add(gltf.scene);
      ui.status.remove();
      TOGGLES.forEach((t) => setToggle(t.key, toggleButtons[t.key].getAttribute("aria-pressed") === "true"));
      applyTheme();
      resize();
    }, undefined, () => {
      ui.status.textContent = "The 3D model could not be loaded.";
    });
  }

  applyTheme();
  resize();
}

document.querySelectorAll("[data-caretta-viewer]").forEach(start);
