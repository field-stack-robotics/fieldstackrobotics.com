// Heading error chart on the wheel odometry page: wheels vs gyro over a 10-minute drive.
// "\u00b0" below is the degree sign.
// The data is simulated (see SIM below), not a recording. Colors live in custom.css ("Charts").
(function () {
  "use strict";
  var SVG_NS = "http://www.w3.org/2000/svg";

  // ---- Simulated drive -------------------------------------------------------
  var SIM = {
    minutes: 10,
    stepS: 2,             // one point every 2 s
    turnEveryS: 40,       // the robot makes a 90° turn every 40 s...
    firstTurnS: 20,
    turnS: 4,             // ...and each turn takes 4 s
    wheelErrPerTurn: 8,   // wheels over-report each turn by about 8° (skid-steer slip)
    gyroBiasPerMin: 0.4,  // gyro bias drift, degrees per minute
  };

  function seeded(seed) {  // small repeatable random generator, so the chart is the same on every visit
    return function () { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
  }

  function simulate() {
    var rand = seeded(7), points = [], wheel = 0, turnErr = 0, end = SIM.minutes * 60;
    for (var t = 0; t <= end; t += SIM.stepS) {
      var sinceTurn = (t - SIM.firstTurnS) % SIM.turnEveryS;
      if (t >= SIM.firstTurnS && sinceTurn === 0) turnErr = SIM.wheelErrPerTurn * (0.75 + 0.5 * rand());
      if (t >= SIM.firstTurnS && sinceTurn < SIM.turnS) wheel += turnErr * SIM.stepS / SIM.turnS;
      var gyro = SIM.gyroBiasPerMin * t / 60 + (rand() - 0.5) * 0.3 * Math.min(1, t / 30);
      points.push({ t: t, wheel: wheel, gyro: gyro });
    }
    return points;
  }

  var SERIES = [
    { key: "wheel", name: "Wheels", cls: "rln-chart__line--wheel" },
    { key: "gyro", name: "Gyro", cls: "rln-chart__line--gyro" },
  ];

  // ---- Drawing ----------------------------------------------------------------
  function el(name, attrs, parent, text) {
    var node = document.createElementNS(SVG_NS, name);
    Object.keys(attrs).forEach(function (k) { node.setAttribute(k, attrs[k]); });
    if (text !== undefined) node.textContent = text;
    if (parent) parent.appendChild(node);
    return node;
  }
  function div(cls, parent, text) {
    var node = document.createElement("div");
    node.className = cls;
    if (text !== undefined) node.textContent = text;
    parent.appendChild(node);
    return node;
  }
  function clock(t) { var m = Math.floor(t / 60), s = t % 60; return m + ":" + (s < 10 ? "0" : "") + s; }

  function draw(root) {
    var data = simulate();
    var W = 640, H = 300, M = { top: 16, right: 64, bottom: 38, left: 40 };
    var maxT = data[data.length - 1].t;
    var maxY = Math.ceil(Math.max.apply(null, data.map(function (d) { return d.wheel; })) / 20) * 20;
    var x = function (t) { return M.left + (t / maxT) * (W - M.left - M.right); };
    var y = function (v) { return H - M.bottom - (v / maxY) * (H - M.top - M.bottom); };

    // Legend above the plot
    var legend = div("rln-chart__legend", root);
    SERIES.forEach(function (s) {
      var item = div("rln-chart__legend-item", legend);
      var key = el("svg", { width: 18, height: 8, "aria-hidden": "true" }, null);
      el("line", { x1: 1, y1: 4, x2: 17, y2: 4, class: "rln-chart__line " + s.cls }, key);
      item.appendChild(key);
      item.appendChild(document.createTextNode(s.name));
    });

    var plot = div("rln-chart__plot", root);
    var svg = el("svg", { viewBox: "0 0 " + W + " " + H, role: "img",
      "aria-label": "Simulated heading error over 10 minutes: wheels grow to about " + Math.round(data[data.length - 1].wheel) +
        " degrees in steps at every turn, gyro stays under " + Math.ceil(data[data.length - 1].gyro + 1) + " degrees." }, null);
    plot.appendChild(svg);

    // Grid and axes
    for (var v = 0; v <= maxY; v += 20) {
      el("line", { x1: M.left, x2: W - M.right, y1: y(v), y2: y(v), class: v === 0 ? "rln-chart__axis" : "rln-chart__grid" }, svg);
      el("text", { x: M.left - 8, y: y(v), class: "rln-chart__tick", "text-anchor": "end", "dominant-baseline": "central" }, svg, v + "\u00b0");
    }
    for (var m = 0; m <= SIM.minutes; m += 2) {
      el("text", { x: x(m * 60), y: H - M.bottom + 18, class: "rln-chart__tick", "text-anchor": "middle" }, svg, m + " min");
    }

    // Lines, each with a direct label at its end
    SERIES.forEach(function (s) {
      var d = data.map(function (p, i) { return (i ? "L" : "M") + x(p.t).toFixed(1) + "," + y(p[s.key]).toFixed(1); }).join("");
      el("path", { d: d, class: "rln-chart__line " + s.cls }, svg);
      var last = data[data.length - 1];
      el("text", { x: x(last.t) + 8, y: y(last[s.key]), class: "rln-chart__direct", "dominant-baseline": "central" }, svg, s.name);
    });

    // Hover: crosshair snaps to the nearest point, one tooltip lists both series
    var cross = el("line", { y1: M.top, y2: H - M.bottom, class: "rln-chart__cross", visibility: "hidden" }, svg);
    var dots = SERIES.map(function (s) { return el("circle", { r: 4.5, class: "rln-chart__dot " + s.cls, visibility: "hidden" }, svg); });
    var tip = div("rln-chart__tip", plot);
    tip.hidden = true;
    var hit = el("rect", { x: M.left, y: M.top, width: W - M.left - M.right, height: H - M.top - M.bottom,
      fill: "transparent", tabindex: 0, "aria-label": "Chart area, use arrow keys to move along the time axis" }, svg);
    var current = data.length - 1;

    function show(i) {
      current = Math.max(0, Math.min(data.length - 1, i));
      var p = data[current], px = x(p.t);
      cross.setAttribute("x1", px); cross.setAttribute("x2", px); cross.setAttribute("visibility", "visible");
      SERIES.forEach(function (s, k) {
        dots[k].setAttribute("cx", px); dots[k].setAttribute("cy", y(p[s.key])); dots[k].setAttribute("visibility", "visible");
      });
      tip.replaceChildren();
      div("rln-chart__tip-time", tip, clock(p.t));
      SERIES.forEach(function (s) {
        var row = div("rln-chart__tip-row", tip);
        var key = el("svg", { width: 14, height: 8, "aria-hidden": "true" }, null);
        el("line", { x1: 1, y1: 4, x2: 13, y2: 4, class: "rln-chart__line " + s.cls }, key);
        row.appendChild(key);
        var val = document.createElement("strong");
        val.textContent = p[s.key].toFixed(1) + "\u00b0";
        row.appendChild(val);
        row.appendChild(document.createTextNode(s.name));
      });
      tip.hidden = false;
      var box = plot.getBoundingClientRect(), left = (px / W) * box.width;
      tip.style.left = (left > box.width * 0.6 ? left - tip.offsetWidth - 12 : left + 12) + "px";
    }
    function hide() {
      cross.setAttribute("visibility", "hidden");
      dots.forEach(function (d) { d.setAttribute("visibility", "hidden"); });
      tip.hidden = true;
    }
    hit.addEventListener("pointermove", function (e) {
      var box = svg.getBoundingClientRect();
      var t = ((e.clientX - box.left) / box.width * W - M.left) / (W - M.left - M.right) * maxT;
      show(Math.round(t / SIM.stepS));
    });
    hit.addEventListener("pointerleave", hide);
    hit.addEventListener("focus", function () { show(current); });
    hit.addEventListener("blur", hide);
    hit.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight") { show(current + 5); e.preventDefault(); }
      if (e.key === "ArrowLeft") { show(current - 5); e.preventDefault(); }
    });

    // Table view, one row per minute
    var details = document.createElement("details");
    details.className = "rln-chart__table";
    var summary = document.createElement("summary");
    summary.textContent = "Show as table";
    details.appendChild(summary);
    var table = document.createElement("table");
    var head = table.insertRow();
    ["Time", "Wheels", "Gyro"].forEach(function (h) { var th = document.createElement("th"); th.textContent = h; head.appendChild(th); });
    data.filter(function (p) { return p.t % 60 === 0; }).forEach(function (p) {
      var row = table.insertRow();
      [p.t / 60 + " min", p.wheel.toFixed(1) + "\u00b0", p.gyro.toFixed(1) + "\u00b0"].forEach(function (c) { row.insertCell().textContent = c; });
    });
    details.appendChild(table);
    root.appendChild(details);
  }

  function init() { document.querySelectorAll("[data-rln-heading-chart]").forEach(draw); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
