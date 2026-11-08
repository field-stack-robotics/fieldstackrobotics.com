// The theme button switches only between light and dark (no "auto" step).
(function () {
  "use strict";
  function setMode(mode) {
    document.documentElement.dataset.mode = mode;
    document.documentElement.dataset.theme = mode;
    try { localStorage.setItem("mode", mode); } catch (e) { /* storage blocked: mode lasts for this page */ }
  }
  // Someone who picked "auto" before gets the theme they are currently seeing
  if (document.documentElement.dataset.mode === "auto") setMode(document.documentElement.dataset.theme || "light");

  // Runs before the theme's own click handler and stops it
  document.addEventListener("click", function (event) {
    if (!event.target.closest(".theme-switch-button")) return;
    event.stopImmediatePropagation();
    setMode(document.documentElement.dataset.theme === "dark" ? "light" : "dark");
  }, true);
})();
