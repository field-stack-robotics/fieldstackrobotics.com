// Left sidebar: while you scroll a guide, its current step is highlighted.
(function () {
  "use strict";
  function init() {
    var steps = [];
    document.querySelectorAll('nav.bd-links li.toctree-l2 > a[href^="#"]').forEach(function (link) {
      var section = document.getElementById(decodeURIComponent(link.hash.slice(1)));
      if (section) steps.push({ link: link, section: section });
    });
    if (!steps.length) return;   // not on a guide page
    var guide = steps[0].link.closest("li.toctree-l1");
    var queued = false;

    function update() {
      queued = false;
      var line = window.innerHeight * 0.3;   // a step starts when its title reaches the top third of the screen
      var active = null;
      steps.forEach(function (s) { if (s.section.getBoundingClientRect().top <= line) active = s; });
      steps.forEach(function (s) {
        s.link.classList.toggle("current", s === active);
        if (s === active) s.link.setAttribute("aria-current", "step");
        else s.link.removeAttribute("aria-current");
      });
      guide.classList.toggle("fsr-in-step", !!active);
    }
    function queue() { if (!queued) { queued = true; requestAnimationFrame(update); } }

    window.addEventListener("scroll", queue, { passive: true });
    window.addEventListener("resize", queue);
    update();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
