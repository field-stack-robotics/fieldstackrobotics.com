// Left sidebar: every section starts open. Sections you close stay closed while
// you move between pages, and open again on your next visit.
(function () {
  "use strict";
  var KEY = "rln-closed-sections";
  var PHONE = window.matchMedia("(max-width: 959.98px)").matches;   // same width where the theme turns the sidebar into a menu

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
      // On phones the menu would be very long with every section open: start with only
      // the section you are reading open. (Not saved, so desktop stays as it was.)
      var auto = false;
      if (PHONE && details.open && !item.classList.contains("current")) { auto = true; details.open = false; }
      details.addEventListener("toggle", function () {
        if (auto) { auto = false; return; }   // that was the phone auto-close above, not the reader
        var now = load().filter(function (x) { return x !== id; });
        if (!details.open) now.push(id);
        save(now);
      });
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
