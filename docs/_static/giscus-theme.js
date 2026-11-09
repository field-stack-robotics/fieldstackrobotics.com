// Keeps the giscus comment box (_templates/giscus.html) in the same light/dark mode as the site.
(function () {
  "use strict";
  function sendTheme() {
    var frame = document.querySelector("iframe.giscus-frame");
    if (!frame || !frame.contentWindow) return;
    var theme = document.documentElement.dataset.theme === "dark" ? "dark" : "light";
    frame.contentWindow.postMessage({ giscus: { setConfig: { theme: theme } } }, "https://giscus.app");
  }
  new MutationObserver(sendTheme).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
})();
