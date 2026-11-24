<!-- Email signup box. The form posts straight to Kit (form 10164332 on field-stack-robotics.kit.com),
     which sends the confirmation email (double opt-in). Styles: .signup in _static/custom.css;
     _static/signup.js shows the thank-you message in place. Keep id="signup": the sidebar card links to #signup. -->
<div class="signup" id="signup">
  <p class="signup__title">Follow the build</p>
  <p class="signup__lead">Building Caretta in public. Every two weeks, I'll send you what worked and what didn't.</p>
  <form class="signup__form" action="https://app.kit.com/forms/10164332/subscriptions" method="post">
    <input type="email" name="email_address" placeholder="you@example.com" aria-label="Email address" autocomplete="email" required>
    <button type="submit">Subscribe</button>
  </form>
  <p class="signup__done" hidden data-success="Almost there. Check your inbox to confirm." data-error="That email doesn't look right. Try again?"></p>
  <p class="signup__note">Unsubscribe anytime · <a href="https://kit.com/features/forms?utm_campaign=poweredby&amp;utm_medium=referral&amp;utm_source=dynamic" target="_blank" rel="nofollow noopener">Built with Kit</a></p>
</div>
