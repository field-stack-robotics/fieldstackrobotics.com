# Caretta

<!-- Robots page: Caretta only for now. The card is plain HTML so it can carry the
     illustration; the 3D viewer under it is _static/caretta-viewer/. -->

<div class="rb-hero">
  <p class="rb-hero__eyebrow">Field Stack Robotics</p>
  <p class="rb-hero__lead">Caretta is our first robot: a small, open source
  indoor robot that runs ROS 2.</p>
</div>

<div class="rb-grid rb-grid--focus">
<article class="rb-card rb-card--now rb-card--wide">
  <div class="rb-art">
    <svg viewBox="0 0 240 150" role="img" aria-label="Caretta, a two-deck indoor robot with a LiDAR on top">
      <path class="rb-scan" d="M78 44 Q120 14 162 44"/><path class="rb-scan" d="M92 50 Q120 30 148 50"/>
      <line class="rb-floor" x1="30" y1="128" x2="210" y2="128"/>
      <rect class="rb-dark" x="102" y="52" width="36" height="12" rx="3"/>
      <rect class="rb-accent" x="108" y="42" width="24" height="12" rx="4"/>
      <rect class="rb-body" x="56" y="64" width="128" height="10" rx="3"/>
      <line class="rb-line" x1="66" y1="74" x2="66" y2="98"/><line class="rb-line" x1="174" y1="74" x2="174" y2="98"/>
      <rect class="rb-panel" x="80" y="80" width="26" height="18" rx="2"/>
      <rect class="rb-board" x="124" y="80" width="38" height="18" rx="2"/><rect class="rb-chip" x="130" y="86" width="9" height="6"/><rect class="rb-accent" x="144" y="87" width="12" height="3"/>
      <rect class="rb-body" x="56" y="98" width="128" height="10" rx="3"/>
      <circle class="rb-wheel" cx="86" cy="110" r="18"/><circle class="rb-hub" cx="86" cy="110" r="5"/>
      <rect class="rb-panel" x="162" y="108" width="10" height="12"/><circle class="rb-dark" cx="167" cy="123" r="6"/>
    </svg>
  </div>
  <div class="rb-card__main">
    <header class="rb-card__top"><span class="rb-badge rb-badge--now"><span class="rb-pulse"></span>Building now</span></header>
    <p class="rb-card__model">Indoor robot</p>
    <h3 class="rb-card__name">Caretta</h3>
    <p class="rb-card__lead">A solder-free kit you can build and learn on.</p>
    <p class="rb-card__for">For students, researchers and teaching labs</p>
  </div>
  <div class="rb-card__side">
    <ul class="rb-specs">
      <li>Differential drive, 2 wheels and a caster</li>
      <li>Field Stack main board with IMU</li>
      <li>2D LiDAR, Raspberry Pi 5 (optional)</li>
      <li>Add-on: warehouse and fleet pack</li>
    </ul>
    <a class="rb-card__cta" href="../try">Try Caretta now →</a>
  </div>
</article>
<!-- 3D model of Caretta, built from the robot's URDF (tools/make_caretta_glb.py).
     The viewer is _static/caretta-viewer/caretta-viewer.js; it only loads on this page. -->
<div class="rln-viewer rb-viewer" data-caretta-viewer>
  <noscript><p>The 3D view of Caretta needs JavaScript.</p></noscript>
</div>
</div>
<script type="module" src="../_static/caretta-viewer/caretta-viewer.js"></script>

(waitlist)=
## Get notified

```{include} ../_snippets/signup.md
```
