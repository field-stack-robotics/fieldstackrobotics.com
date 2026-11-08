# The robot and its hardware

A small differential-drive kit, upgraded piece by piece.

<!-- Put a photo in docs/_static/ and show it like this:
![Robot top view](_static/robot-top.jpg) -->

| Part                          | Role                                        |
|-------------------------------|---------------------------------------------|
| ESP32                         | Motor control loop, encoders, safety watchdog |
| 2 × 12 V DC motors + encoders | Drive and wheel speed feedback              |
| Current and voltage sensor    | Battery level, stall and slip detection     |
| BNO055 IMU                    | Heading and yaw rate                        |
| 2D LiDAR                      | Mapping and localization                    |
| Raspberry Pi                  | ROS 2, Nav2, logging                        |
