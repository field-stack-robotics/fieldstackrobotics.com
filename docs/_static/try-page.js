// Try page: a Copy button on every command block. Loaded only by try.md.
document.querySelectorAll(".highlight-bash .highlight").forEach((box) => {
  const pre = box.querySelector("pre");
  const b = document.createElement("button");
  b.type = "button";
  b.className = "fsr-copy";
  b.textContent = "Copy";
  b.addEventListener("click", () => navigator.clipboard.writeText(pre.innerText.trim()).then(() => {
    b.textContent = "Copied";
    setTimeout(() => { b.textContent = "Copy"; }, 1500);
  }));
  box.appendChild(b);
});
