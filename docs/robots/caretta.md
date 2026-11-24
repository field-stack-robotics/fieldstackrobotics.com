# Caretta: Indoor Robot

<div class="rb-badge rb-badge--now rb-badge--inline"><span class="rb-pulse"></span>Building now</div>

Caretta is the first Field Stack robot, named after the loggerhead sea turtles
that nest on the beaches of Antalya, where it is built. It's the one every post on this site is written on.
A solder-free kit: you bolt it together, flash it, and follow the blog series
step by step on exactly the same hardware.

<!-- Replace with a real photo when the prototype is ready:
![Caretta prototype](../_static/caretta.jpg) -->

## What's in the kit

| Part                          | Role                                          |
|-------------------------------|-----------------------------------------------|
| Field Stack main board        | Motor control loop, encoders, safety watchdog |
| IMU on the main board         | Heading and yaw rate                          |
| 2 × DC motors with encoders   | Differential drive and wheel speed feedback   |
| Caster wheel                  | Third contact point                           |
| Current and voltage sensing   | Battery level, stall and slip detection       |
| 2D LiDAR                      | Mapping and localization                      |
| Raspberry Pi 5 (optional)     | ROS 2, Nav2, logging                          |

An add-on **warehouse and fleet pack** is planned for running several robots
in the same indoor space.

## Who it's for

Students, researchers and teaching labs who want a robot that works the same
way in the lab as it does on paper, without first spending a semester on
wiring and firmware.

## Built in public

Caretta is being designed and tested right now. Every step lands on this site:

- [Reading encoders](../motors/encoder-basics.md)
- [PID speed control](../motors/pid-speed-control.md)
- [Stall and slip detection](../motors/stall-detection.md)

Firmware, schematics and test data are on
[GitHub](https://github.com/field-stack-robotics/caretta).

## Get notified

Want to know when the kit is ready to order? {ref}`Join the list <waitlist>`.
