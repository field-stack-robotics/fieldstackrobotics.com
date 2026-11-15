# Field Stack Robotics

Field Stack Robotics is a build log and tutorial set for taking a small
differential-drive robot from the bench to reliable autonomy in the field.
Every page comes from real hardware: the code, the measurements, and what broke
along the way. The goal is simple: make an autonomous robot work reliably in the real
world, outside the simulator, and write down every step so you can do the same.

<div class="rln-imu" data-rln-imu>
  <p class="rln-imu__caption">A preview of the robot's IMU</p>
</div>

## What is this robot?

A two-wheel kit robot with an ESP32 running the motor control loop, encoders,
a current sensor, a BNO055 IMU, a 2D LiDAR and a Raspberry Pi running ROS 2.

<!-- Replace with a real photo: put robot.jpg in docs/_static/ and use
![The robot](_static/robot.jpg) -->

<a class="rb-strip" href="robots/index.html">
  <span class="rb-strip__head">The robots<span>See the roadmap →</span></span>
  <span class="rb-strip__item rb-strip__item--now"><b>01</b>Indoor Robot<em><span class="rb-pulse"></span>Building now</em></span>
  <span class="rb-strip__item"><b>02</b>Outdoor Rover<em>Next</em></span>
  <span class="rb-strip__item rb-strip__item--hidden"><b>03</b><i>Tracked Robot</i><em>Later</em></span>
  <span class="rb-strip__item rb-strip__item--hidden"><b>04</b><i>Surface Vessel</i><em>Side branch</em></span>
</a>

:::{note}
Pages marked "coming soon" are on [the roadmap](getting-started/roadmap.md)
but not written yet. Subscribe below to get them when they're out.
:::

## Where do I start?

- **New here?** Read [the roadmap](getting-started/roadmap.md) and the
  [hardware overview](getting-started/hardware.md).
- **Working on motor control?** Start with
  [Reading encoders](motors/encoder-basics.md), then
  [PID speed control](motors/pid-speed-control.md).
- **Getting a robot to navigate on its own?** See [Navigation](navigation/index.md).

## More information

::::{grid} 1 1 2 2
:gutter: 3

:::{grid-item-card} Motors and teleop
:link: motors/index
:link-type: doc

Encoders, PID + feedforward, stall and slip detection
:::

:::{grid-item-card} ROS 2
:link: ros2/index
:link-type: doc

micro-ROS, timestamps, TF and rosbags
:::

:::{grid-item-card} Odometry and fusion
:link: odometry/index
:link-type: doc

Wheel, IMU and LiDAR odometry, and my own EKF
:::

:::{grid-item-card} Localization experiments
:link: localization/index
:link-type: doc

UWB, Wi-Fi, BLE, RFID and AprilTag, measured
:::

:::{grid-item-card} SLAM
:link: slam/index
:link-type: doc

2D LiDAR, visual SLAM and mapping very large spaces
:::

:::{grid-item-card} Navigation
:link: navigation/index
:link-type: doc

Nav2, indoor and outdoor with GPS + RTK, and field failures
:::
::::

## Latest posts

| Date     | Post                                                  | Section           |
|----------|-------------------------------------------------------|-------------------|
| Oct 2026 | [Stall and slip detection](motors/stall-detection.md) | Motors and teleop |
| Oct 2026 | [PID speed control](motors/pid-speed-control.md)      | Motors and teleop |
| Oct 2026 | [Reading encoders](motors/encoder-basics.md)          | Motors and teleop |

## Resources

| Resource | Description |
|----------|-------------|
| [GitHub](https://github.com/field-stack-robotics) | Source code, firmware and test data for every post |
| [YouTube](https://www.youtube.com/) | Short videos of each experiment |
| [Nav2 documentation](https://docs.nav2.org/) | The navigation stack this project builds on |
| [ROS 2 documentation](https://docs.ros.org/) | Concepts, tutorials and API reference |

```{include} _snippets/signup.md
```

```{toctree}
:maxdepth: 2
:hidden:

robots/index
getting-started/index
motors/index
ros2/index
odometry/index
localization/index
slam/index
navigation/index
about
```
