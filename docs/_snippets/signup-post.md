<!-- Small email box at the end of every blog post (added in conf.py). Same Kit form as signup.md;
     _static/signup.js handles both. -->
<div class="signup signup--small" id="signup">
  <p class="signup__lead">Enjoyed this? I share what worked and what didn't, every two weeks.</p>
  <form class="signup__form" action="https://app.kit.com/forms/10164332/subscriptions" method="post">
    <input type="email" name="email_address" placeholder="you@example.com" aria-label="Email address" autocomplete="email" required>
    <button type="submit">Subscribe</button>
  </form>
  <p class="signup__done" hidden data-success="Almost there. Check your inbox to confirm." data-error="That email doesn't look right. Try again?"></p>
  <p class="signup__note">Unsubscribe anytime · <a href="https://kit.com/features/forms?utm_campaign=poweredby&amp;utm_medium=referral&amp;utm_source=dynamic" target="_blank" rel="nofollow noopener">Built with Kit</a></p>
</div>
