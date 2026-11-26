<!-- Kit early access box, end of the Contact page on phones (on wide screens the right card has it).
     Kit form 10245678 ("Caretta kit early access"), same as _templates/sidebar-card.html; _static/signup.js sends it. -->
<div class="fsr-mobile-only">
<div class="signup signup--small">
  <p class="signup__title">Get the Caretta kit first</p>
  <p class="signup__lead">The real robot kit is coming. Join early access and hear first when it ships.</p>
  <form class="signup__form" action="https://app.kit.com/forms/10245678/subscriptions" method="post">
    <input type="email" name="email_address" placeholder="you@example.com" aria-label="Email address" autocomplete="email" required>
    <button type="submit">Notify me</button>
  </form>
  <p class="signup__done" hidden data-success="You're on the list. Check your inbox to confirm." data-error="That email doesn't look right. Try again?"></p>
</div>
</div>
