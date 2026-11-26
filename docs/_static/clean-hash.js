// No "#section" in the address bar: links to a section still scroll there, but the address
// stays fieldstackrobotics.com/try. Links from other pages (/try#meet-caretta) scroll first,
// then the "#..." is taken off.
(function () {
  function clean() {
    if (location.hash) history.replaceState(history.state, "", location.pathname + location.search);
  }
  window.addEventListener("load", function () {
    var target = location.hash && document.getElementById(decodeURIComponent(location.hash.slice(1)));
    if (target) target.scrollIntoView();   // the page may have grown while loading: go to the section again
    clean();
  });
  document.addEventListener("click", function (event) {
    var link = event.target.closest("a[href]");
    if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (link.origin !== location.origin || link.pathname !== location.pathname || !link.hash && !link.getAttribute("href").endsWith("#")) return;
    var id = decodeURIComponent(link.hash.slice(1));
    var target = id ? document.getElementById(id) : null;
    if (id && !target) return;
    event.preventDefault();
    if (target) target.scrollIntoView({ behavior: "smooth" });
    else window.scrollTo({ top: 0, behavior: "smooth" });
    clean();
  });
})();
