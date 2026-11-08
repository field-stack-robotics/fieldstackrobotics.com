# Wheel odometry

What wheels measure well, what they don't, and how to split the work with the IMU.

## The basic idea

To know where it is, a robot keeps answering two questions:

1. **How far did I move forward?** This is the forward speed, `vx`.
2. **How much did I turn?** This is the turn rate, `vyaw`.

Two sensors can answer both questions: the **wheel encoders** and the **IMU** (more exactly, the gyro inside it).
But each one is good at one question and bad at the other.

## Why wheels are bad at turning

Wheel odometry works out turning with a simple rule: *if the right wheel turned this much more than the left, the robot turned this much.*
That rule is only true if **the wheels never slip**.

Now take a skid-steer robot: four wheels, no steering, turning like a tank.
To turn, its wheels **have to slide sideways** across the ground. There is no other way for it to turn. So:

- The wheels say "we turned 90°", but the robot may have turned only 60°.
- The gap changes with the ground: one value on asphalt, another on grass, something else again in mud.

If you take the heading from the wheels, the robot keeps thinking it faces the wrong way.
And a small heading error grows into a large sideways error as the robot keeps driving.

<!-- Diagram: keep it free of blank lines, or Markdown breaks it apart -->
<figure class="rln-diagram">
<svg viewBox="0 0 640 290" role="img" aria-label="Top view. Left: the robot turns; the wheels report 90 degrees but the robot really turned 60 degrees. Right: after driving 10 metres with that 30 degree mistake, the robot is about 5 metres away from where the wheels think it is.">
  <defs>
    <marker id="rln-arrow-wheel" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="rln-diagram__fill--wheel"/></marker>
    <marker id="rln-arrow-real" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="rln-diagram__fill--real"/></marker>
    <marker id="rln-arrow-muted" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="rln-diagram__fill--muted"/></marker>
  </defs>
  <text x="20" y="24" class="rln-diagram__title">1. The turn</text>
  <line x1="120" y1="200" x2="250" y2="200" class="rln-diagram__start" marker-end="url(#rln-arrow-muted)"/>
  <text x="250" y="240" class="rln-diagram__note" text-anchor="end">heading before the turn</text>
  <path d="M168,200 A48,48 0 0 0 120,152" class="rln-diagram__arc rln-diagram__line--wheel"/>
  <path d="M154,200 A34,34 0 0 0 137,170.6" class="rln-diagram__arc rln-diagram__line--real"/>
  <line x1="120" y1="200" x2="120" y2="72" class="rln-diagram__line--wheel rln-diagram__dashed" marker-end="url(#rln-arrow-wheel)"/>
  <line x1="120" y1="200" x2="183" y2="91" class="rln-diagram__line--real" marker-end="url(#rln-arrow-real)"/>
  <rect x="104" y="184" width="32" height="32" rx="5" class="rln-diagram__robot" transform="rotate(-60 120 200)"/>
  <text x="110" y="70" class="rln-diagram__label" text-anchor="end">Wheels say 90°</text>
  <text x="192" y="96" class="rln-diagram__label">Really 60°</text>
  <line x1="320" y1="14" x2="320" y2="276" class="rln-diagram__divider"/>
  <text x="340" y="24" class="rln-diagram__title">2. After 10 m of driving</text>
  <line x1="430" y1="255" x2="430" y2="58" class="rln-diagram__line--wheel rln-diagram__dashed"/>
  <line x1="430" y1="255" x2="528.5" y2="84.4" class="rln-diagram__line--real"/>
  <line x1="436" y1="56.6" x2="524" y2="80.2" class="rln-diagram__gap" marker-start="url(#rln-arrow-muted)" marker-end="url(#rln-arrow-muted)"/>
  <circle cx="430" cy="255" r="6" class="rln-diagram__robot"/>
  <circle cx="430" cy="55" r="6" class="rln-diagram__fill--wheel"/>
  <circle cx="530" cy="81.8" r="6" class="rln-diagram__fill--real"/>
  <text x="420" y="59" class="rln-diagram__label" text-anchor="end">Wheels think</text>
  <text x="420" y="76" class="rln-diagram__label" text-anchor="end">it is here</text>
  <text x="542" y="80" class="rln-diagram__label">It is</text>
  <text x="542" y="97" class="rln-diagram__label">really here</text>
  <text x="488" y="52" class="rln-diagram__value" text-anchor="middle">≈ 5 m</text>
  <text x="442" y="262" class="rln-diagram__note">start</text>
</svg>
<figcaption>Top view. One 30° mistake at the turn puts the robot about 5 m away from where it thinks it is after 10 m.</figcaption>
</figure>

Not every robot slips like this. Differential and car-like robots barely slip, while mecanum and tracked robots slip even more.
See [Wheel odometry by drive type](wheel-odometry-by-drive-type.md) for all seven drive types compared.

## Why the gyro is good at turning

The gyro doesn't look at the wheels at all. It **measures how fast the robot's body rotates**, directly.
Slippery ground or sliding wheels make no difference: if the robot really turned 60°, the gyro says 60°.

## Why the IMU is bad at moving forward

An IMU can't measure forward speed. It only measures **acceleration**.
To get speed you have to integrate that acceleration over time, and even a tiny error in it keeps adding up. Within a few seconds the speed estimate is useless.

There is a second problem: at constant speed the acceleration is zero.
To the IMU, driving at a steady speed looks almost the same as standing still.

Wheels, on the other hand, measure forward distance well.
Driving straight, the wheels slip very little.

## The answer: split the work

|                | Forward speed (`vx`)         | Turn rate (`vyaw`)      |
|----------------|------------------------------|-------------------------|
| **Wheels**     | ✅ Good                      | ❌ Bad, because of slip |
| **IMU (gyro)** | ❌ Bad, errors build up fast | ✅ Good                 |

Ask each question to the sensor that is good at it:

- `vx` from the **wheels**
- `vyaw` from the **gyro**

In a `robot_localization` config this looks like:

```yaml
odom0: /wheel/odom
odom0_config: [false, false, false,   # x, y, z
               false, false, false,   # roll, pitch, yaw
               true,  true,  false,   # vx, vy, vz   (vy = 0, no sideways motion)
               false, false, false,   # vroll, vpitch, vyaw   <- not from wheels
               false, false, false]   # ax, ay, az

imu0: /imu/data
imu0_config: [false, false, false,    # x, y, z
              false, false, false,    # roll, pitch, yaw
              false, false, false,    # vx, vy, vz
              false, false, true,     # vroll, vpitch, vyaw   <- from the IMU
              false, false, false]    # ax, ay, az
```

:::{note}
**An everyday comparison.** Picture someone walking with their eyes closed.
By counting steps they know quite well how far they walked: that's the wheels.
But guessing how much they turned from their steps is hard.
Their inner ear feels turning very well: that's the gyro.
Using both, they get lost much less.
:::

## One catch: gyro bias

A gyro has a small **bias** that slowly drifts over time.
Over seconds and minutes it is still far better than the wheels for turning.
The chart below shows the difference on a 10-minute drive with a 90° turn every 40 seconds.

<div class="rln-chart" data-rln-heading-chart>
  <p class="rln-chart__title">Heading error over a 10-minute drive</p>
  <p class="rln-chart__caption">Simulated example, not a recording. Real logs from the robot are coming.</p>
</div>

The wheel error jumps at every turn, because every turn slips, and it never goes back down.
The gyro error only creeps up slowly.
But after hours of driving the gyro drifts too.
That is where outside references like GPS with RTK and LiDAR come in. See [LiDAR odometry with ICP](lidar-odometry.md).

```{toctree}
:hidden:

wheel-odometry-by-drive-type
```

```{include} ../_snippets/signup.md
```
