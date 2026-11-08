// Animated IMU instruments on the home page: a compass and an artificial horizon.
// The motion is simulated. To change the look, see "IMU widget" in custom.css.
// It plays for a few seconds, eases to a stop so it doesn't distract from reading,
// and moves again while the mouse is over it.
(function () {
  "use strict";
  var SVG_NS = "http://www.w3.org/2000/svg";
  var PX_PER_DEGREE = 2.4;
  var MOTION_SPEED = 0.8;   // 1 = fast, lower = calmer
  var PLAY_MS = 12000;      // how long it plays after the page opens
  var EASE_MS = 2500;       // how long it takes to slow down or speed up

  function el(name, attrs, parent, text) {
    var node = document.createElementNS(SVG_NS, name);
    Object.keys(attrs).forEach(function (key) { node.setAttribute(key, attrs[key]); });
    if (text !== undefined) node.textContent = text;
    if (parent) parent.appendChild(node);
    return node;
  }

  function svg(label) {
    return el("svg", { viewBox: "0 0 200 200", role: "img", "aria-label": label });
  }

  function instrument(root, node, name) {
    var box = document.createElement("div");
    box.className = "rln-imu__instrument";
    box.appendChild(node);
    var readout = document.createElement("div");
    readout.className = "rln-imu__readout";
    var title = document.createElement("span");
    title.textContent = name;
    var value = document.createElement("strong");
    readout.appendChild(title);
    readout.appendChild(value);
    box.appendChild(readout);
    root.appendChild(box);
    return value;
  }

  function buildCompass(root) {
    var s = svg("Compass showing the robot's heading");
    el("circle", { cx: 100, cy: 100, r: 96, class: "rln-imu__dial" }, s);
    for (var deg = 0; deg < 360; deg += 15) {
      var major = deg % 90 === 0;
      var a = (deg * Math.PI) / 180;
      var r1 = major ? 82 : 87;
      el("line", {
        x1: 100 + r1 * Math.sin(a), y1: 100 - r1 * Math.cos(a),
        x2: 100 + 92 * Math.sin(a), y2: 100 - 92 * Math.cos(a),
        class: major ? "rln-imu__tick rln-imu__tick--major" : "rln-imu__tick",
      }, s);
    }
    [[0, 100, 31], [90, 164, 100], [180, 100, 169], [270, 36, 100]].forEach(function (d) {
      el("text", { x: d[1], y: d[2], class: "rln-imu__label" }, s, String(d[0]));
    });
    var robot = el("g", {}, s);
    el("path", { d: "M100 52 L111 72 L89 72 Z", class: "rln-imu__pointer" }, robot);
    el("rect", { x: 81, y: 75, width: 38, height: 46, rx: 11, class: "rln-imu__robot" }, robot);
    el("rect", { x: 71, y: 86, width: 8, height: 25, rx: 3, class: "rln-imu__wheel" }, robot);
    el("rect", { x: 121, y: 86, width: 8, height: 25, rx: 3, class: "rln-imu__wheel" }, robot);
    return { node: s, robot: robot, value: instrument(root, s, "Heading") };
  }

  function buildHorizon(root) {
    var s = svg("Artificial horizon showing the robot's pitch and roll");
    var clip = el("clipPath", { id: "rln-imu-clip" }, el("defs", {}, s));
    el("circle", { cx: 100, cy: 100, r: 96 }, clip);
    var view = el("g", { "clip-path": "url(#rln-imu-clip)" }, s);
    var world = el("g", {}, view);
    el("rect", { x: -200, y: -400, width: 600, height: 500, class: "rln-imu__sky" }, world);
    el("rect", { x: -200, y: 100, width: 600, height: 500, class: "rln-imu__ground" }, world);
    el("line", { x1: -200, y1: 100, x2: 400, y2: 100, class: "rln-imu__ladder rln-imu__ladder--zero" }, world);
    [-30, -20, -10, 10, 20, 30].forEach(function (p) {
      var y = 100 - p * PX_PER_DEGREE;
      var half = p % 20 === 0 ? 26 : 16;
      el("line", { x1: 100 - half, y1: y, x2: 100 + half, y2: y, class: "rln-imu__ladder" }, world);
      if (p % 20 === 0) el("text", { x: 100 + half + 12, y: y, class: "rln-imu__ladder-text" }, world, String(Math.abs(p)));
    });
    el("path", { d: "M62 100 H88 L100 110 L112 100 H138", class: "rln-imu__symbol" }, s);
    el("circle", { cx: 100, cy: 100, r: 96, class: "rln-imu__bezel" }, s);
    return { node: s, world: world, value: instrument(root, s, "Pitch / Roll") };
  }

  // Slow turns, like a robot driving around.
  function sample(ms) {
    var t = (ms / 1000) * MOTION_SPEED;
    return {
      heading: (((150 + 110 * Math.sin(t * 0.17) + 45 * Math.sin(t * 0.41)) % 360) + 360) % 360,
      pitch: 7 * Math.sin(t * 0.5) + 2.5 * Math.sin(t * 1.3),
      roll: 10 * Math.sin(t * 0.37 + 1) + 2.5 * Math.sin(t * 1.1),
    };
  }

  function start(widget) {
    var instruments = document.createElement("div");
    instruments.className = "rln-imu__instruments";
    widget.insertBefore(instruments, widget.firstChild);
    var compass = buildCompass(instruments);
    var horizon = buildHorizon(instruments);
    var lastText = null;

    function draw(ms, forceText) {
      var v = sample(ms);
      compass.robot.setAttribute("transform", "rotate(" + v.heading.toFixed(2) + " 100 100)");
      horizon.world.setAttribute("transform",
        "rotate(" + (-v.roll).toFixed(2) + " 100 100) translate(0 " + (v.pitch * PX_PER_DEGREE).toFixed(2) + ")");
      if (forceText || lastText === null || Math.abs(ms - lastText) > 120) {   // numbers change slowly enough to read
        lastText = ms;
        compass.value.textContent = Math.round(v.heading) + "°";
        horizon.value.textContent = v.pitch.toFixed(1) + "° / " + v.roll.toFixed(1) + "°";
      }
    }

    var motionMs = 8000;   // where in the motion it starts
    draw(motionMs, true);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    var speed = 1, playLeft = PLAY_MS, hovering = false, visible = true;
    var frame = null, lastFrame = null;

    function loop(now) {
      var dt = lastFrame === null ? 0 : Math.min(now - lastFrame, 250);
      lastFrame = now;
      if (!hovering && playLeft > 0) playLeft -= dt;
      var target = hovering || playLeft > 0 ? 1 : 0;
      var step = dt / EASE_MS;
      speed = target > speed ? Math.min(speed + step, target) : Math.max(speed - step, target);
      motionMs += dt * speed;
      var stopped = speed === 0 && target === 0;
      draw(motionMs, stopped);
      frame = visible && !stopped ? requestAnimationFrame(loop) : null;
    }
    function wake() {
      if (frame === null && visible) { lastFrame = null; frame = requestAnimationFrame(loop); }
    }

    wake();
    widget.addEventListener("pointerenter", function () { hovering = true; wake(); });
    widget.addEventListener("pointerleave", function () { hovering = false; playLeft = 0; });
    if ("IntersectionObserver" in window) {   // no work while scrolled out of view
      new IntersectionObserver(function (entries) {
        visible = entries[0].isIntersecting;
        wake();
      }).observe(widget);
    }
  }

  function init() { document.querySelectorAll("[data-rln-imu]").forEach(start); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
