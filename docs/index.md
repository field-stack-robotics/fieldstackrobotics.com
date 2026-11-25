# Field Stack Robotics

Field Stack Robotics is a build log and tutorial set for taking a small
differential-drive robot from the bench to reliable autonomy in the field.
Start in simulation today; the real robot comes next. The goal is simple: make an autonomous robot work reliably in the real
world, outside the simulator, and write down every step so you can do the same.

<div class="rln-imu" data-rln-imu>
  <p class="rln-imu__caption">A preview of the robot's IMU</p>
</div>

## What is this robot?

A two-wheel kit robot with an ESP32 running the motor control loop, encoders,
a current sensor, a BNO055 IMU, a 2D LiDAR and a Raspberry Pi running ROS 2.

<!-- Replace with a real photo: put robot.jpg in docs/_static/ and use
![The robot](_static/robot.jpg) -->

<a class="rb-strip rb-strip--one" href="try.html#meet-caretta">
  <span class="rb-strip__head">Our robot<span>See it in 3D →</span></span>
  <span class="rb-strip__item rb-strip__item--now">Caretta<em><span class="rb-pulse"></span>Building now</em></span>
</a>

## Where do I start?

**Get your first robot running today, right on your computer.** Download Caretta, drive it
through a house and let it draw the map. Then click anywhere and watch it find its own way there.

No hardware needed, just a computer with Ubuntu 22.04.

<p><a class="rln-card__button" href="try.html">Try Caretta now →</a></p>

## Concepts

::::{grid} 1 1 2 2
:gutter: 3

:::{grid-item-card} Motors and teleop
:class-card: sd-card-hover

Encoders and speed control
:::

:::{grid-item-card} ROS 2
:class-card: sd-card-hover

Connecting the robot's parts
:::

:::{grid-item-card} Odometry and fusion
:class-card: sd-card-hover

How far the robot has moved
:::

:::{grid-item-card} Localization experiments
:class-card: sd-card-hover

Where the robot is
:::

:::{grid-item-card} SLAM
:class-card: sd-card-hover

Building a map
:::

:::{grid-item-card} Navigation
:class-card: sd-card-hover

Driving to a goal, indoors and outdoors
:::
::::

## Resources

| Resource | Description |
|----------|-------------|
| [GitHub](https://github.com/field-stack-robotics/caretta) | Caretta's source code |
| [YouTube](https://www.youtube.com/@FieldStackRobotics) | Short videos of each experiment |
| [Discord](https://discord.gg/NCBbzgu32) | Have a question? Come and ask, we answer here |

```{toctree}
:maxdepth: 2
:hidden:

try
Blog <blog/index>
Contact <about>
```
