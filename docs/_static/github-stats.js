// Fills in the GitHub box in the top bar (latest release, stars, forks).
// Results are kept for an hour so the GitHub API isn't called on every page.
document.addEventListener("DOMContentLoaded", function () {
  // The box is in the top bar and again in the mobile menu
  const boxes = document.querySelectorAll(".rln-gh");
  if (!boxes.length) return;
  const repo = boxes[0].dataset.repo;
  const key = "rln-gh:" + repo;
  const short = (n) => (n >= 1000 ? (n / 1000).toFixed(n >= 10000 ? 0 : 1).replace(/\.0$/, "") + "k" : String(n));

  function show(facts) {
    for (const [name, value] of Object.entries(facts)) {
      if (value === undefined || value === null) continue;
      for (const el of document.querySelectorAll(`.rln-gh [data-fact="${name}"]`)) {
        el.querySelector("b").textContent = value;
        el.hidden = false;
      }
    }
  }

  const saved = JSON.parse(sessionStorage.getItem(key) || "null");
  // "owner/repo" -> repo box, a bare name -> organization box
  if (!repo.includes("/")) {
    for (const name of ["stars", "forks"])
      for (const el of document.querySelectorAll(`.rln-gh [data-fact="${name}"]`)) el.hidden = true;
    if (saved && Date.now() - saved.time < 3600 * 1000) return show(saved.facts);
    fetch("https://api.github.com/orgs/" + repo)
      .then((r) => (r.ok ? r.json() : null))
      .then((org) => {
        if (!org) return;
        const facts = { repos: short(org.public_repos) + " repos" };
        sessionStorage.setItem(key, JSON.stringify({ time: Date.now(), facts }));
        show(facts);
      })
      .catch(() => {});
    return;
  }

  if (saved && Date.now() - saved.time < 3600 * 1000) return show(saved.facts);
  const api = "https://api.github.com/repos/" + repo;
  Promise.all([
    fetch(api).then((r) => (r.ok ? r.json() : null)),
    fetch(api + "/releases/latest").then((r) => (r.ok ? r.json() : null)),
  ])
    .then(([info, release]) => {
      if (!info) return;  // repo not found yet: the box still shows the name
      const facts = {
        version: release ? release.tag_name : null,
        stars: short(info.stargazers_count),
        forks: short(info.forks_count),
      };
      sessionStorage.setItem(key, JSON.stringify({ time: Date.now(), facts }));
      show(facts);
    })
    .catch(() => {});
});
