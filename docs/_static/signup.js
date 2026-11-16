// Email box (_snippets/signup.md): send the form to Kit in the background and show
// "check your inbox" in place. Kit answers with a status:
//   success     -> show the thank-you line
//   quarantined -> Kit wants a quick "are you human" check: go to the page it gives
//   failed      -> say the email looks wrong
// If the request itself fails, the form is sent the normal way (opens Kit's page).
document.addEventListener("submit", async (event) => {
  const form = event.target.closest(".signup__form");
  if (!form) return;
  event.preventDefault();
  const box = form.closest(".signup");
  const message = box.querySelector(".signup__done");
  const button = form.querySelector("button");
  button.disabled = true;
  try {
    const response = await fetch(form.action, { method: "POST", body: new FormData(form), headers: { Accept: "application/json" } });
    const data = await response.json();
    if (data.status === "success") {
      form.hidden = true;
      message.textContent = message.dataset.success;
      message.hidden = false;
    } else if (data.status === "quarantined" && data.url) {
      window.location.href = data.url;
    } else {
      message.textContent = message.dataset.error;
      message.hidden = false;
    }
  } catch (error) {
    form.submit();
  } finally {
    button.disabled = false;
  }
});
