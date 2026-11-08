// Left sidebar: every section starts open. Sections you close stay closed while
// you move between pages, and open again on your next visit.
(function () {
  "use strict";
  var KEY = "rln-closed-sections";

  function load() {
    try { return JSON.parse(sessionStorage.getItem(KEY)) || []; } catch (e) { return []; }
  }
  function save(closed) {
    try { sessionStorage.setItem(KEY, JSON.stringify(closed)); } catch (e) { /* storage blocked: sections just start open */ }
  }

  function init() {
    var closed = load();
    document.querySelectorAll("nav.bd-links li.toctree-l1.has-children").forEach(function (item) {
      var link = item.querySelector(":scope > a");
      var details = item.querySelector(":scope > details");
      if (!link || !details) return;
      var id = link.pathname;
      // The section of the page you are reading always stays open.
      if (closed.indexOf(id) !== -1 && !item.classList.contains("current")) details.open = false;
      details.addEventListener("toggle", function () {
        var now = load().filter(function (x) { return x !== id; });
        if (!details.open) now.push(id);
        save(now);
      });
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
