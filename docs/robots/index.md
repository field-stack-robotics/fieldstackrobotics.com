# Robots

<!-- Product roadmap page. The cards below are plain HTML so they can carry the
     illustrations and the blur. To reveal a model, remove "rb-veil--2/3" from its
     art wrapper and "rb-specs--locked" from its spec list. -->

<div class="rb-hero">
  <p class="rb-hero__eyebrow">Field Stack Robotics</p>
  <p class="rb-hero__lead">Four robots, one stack. Each model adds exactly one new
  challenge on top of the software and electronics of the one before it.
  All open source, all ROS 2.</p>
</div>

<div class="rb-grid rb-grid--focus">
<article class="rb-card rb-card--now">
  <header class="rb-card__top"><span class="rb-card__num">01</span><span class="rb-badge rb-badge--now"><span class="rb-pulse"></span>Building now</span></header>
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
  <p class="rb-card__model">Model 1 · Indoor robot</p>
  <h3 class="rb-card__name">Caretta</h3>
  <p class="rb-card__lead">A solder-free first kit that matches the blog series one to one.</p>
  <ul class="rb-specs">
    <li>Differential drive, 2 wheels and a caster</li>
    <li>Field Stack main board with IMU</li>
    <li>2D LiDAR, Raspberry Pi 5 (optional)</li>
    <li>Add-on: warehouse and fleet pack</li>
  </ul>
  <p class="rb-card__for">For students, researchers and teaching labs</p>
  <span class="rb-card__cta rb-card__cta--soon">Details coming soon</span>
</article>
<!-- 3D model of Caretta, built from the robot's URDF (tools/make_caretta_glb.py).
     The viewer is _static/caretta-viewer/caretta-viewer.js; it only loads on this page. -->
<div class="rln-viewer rb-viewer" data-caretta-viewer>
  <noscript><p>The 3D view of Caretta needs JavaScript.</p></noscript>
</div>
</div>
<script type="module" src="../_static/caretta-viewer/caretta-viewer.js"></script>

## One stack, four robots

Nothing is thrown away between models. The motor control, odometry, EKF and
navigation you build on Caretta come with you to the rover, the tracked robot
and the boat. Each new model only adds the part that is actually new: GPS and
weatherproofing, then tracks and rough ground, then water.

That is also why the blog and the robots follow the same order. Every post on
this site runs on Caretta first.

(waitlist)=
## Get notified

```{include} ../_snippets/signup.md
```

```{toctree}
:hidden:

caretta
```
