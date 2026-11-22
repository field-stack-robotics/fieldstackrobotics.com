// Open links to other sites in a new tab. Links inside this site stay in the same tab.
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("a[href]").forEach((a) => {
    if (!/^https?:$/.test(a.protocol) || a.hostname === location.hostname) return;
    a.target = "_blank";
    a.rel = "noopener";
  });
});
