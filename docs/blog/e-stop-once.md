# Why twist_mux missed my e-stop

<p class="fsr-post-meta">25 November 2026 · ROS 2 · twist_mux</p>

Caretta has a software emergency stop. You publish `true` on `/e_stop`, and every velocity
command is blocked. I tried it four times in the simulation, and one time the robot kept moving.

## The setup

[twist_mux](https://github.com/ros-teleop/twist_mux) sits between the velocity commands and the wheels.
It picks the command with the highest priority, and it has a lock:

```yaml
locks:
  e_stop:
    topic   : e_stop
    timeout : 0.0
    priority: 255
```

When `true` arrives on the topic, the lock closes. It stays closed until `false` arrives.

This was the command in our README:

```bash
ros2 topic pub --once /e_stop std_msgs/msg/Bool "data: true"
```

## The test

I ran only `twist_mux`, without Gazebo. A small script kept sending a velocity command,
ran the e-stop command, and checked whether `twist_mux` still let the velocity through.

On an idle computer, `--once` worked 25 times out of 25. Then I loaded every CPU core and ran it again:

| Command for `true` | Velocity was not blocked |
|---|---|
| `--once` | **7 of 20** |
| `--times 5 --rate 10` | 1 of 20 |
| `--rate 10`, until Ctrl+C | **0 of 20** |

A real robot also has a busy computer: SLAM, Nav2 and a camera all run at the same time.

## Why it happens

`twist_mux` listens to `/e_stop` with **best effort** reliability. If a message gets lost, nobody sends it again.
`--once` sends a single message and exits, so there is no second chance.

This explanation fits the numbers: more messages, fewer failures. I did not trace every lost message, though.

## The fix

Keep sending until the robot stops, then press **Ctrl+C**:

```bash
ros2 topic pub --rate 10 /e_stop std_msgs/msg/Bool "data: true"
```

The lock stays closed after Ctrl+C. In the test it stayed closed 20 times out of 20.

Release it with ten messages. This also worked 20 times out of 20:

```bash
ros2 topic pub --times 10 --rate 10 /e_stop std_msgs/msg/Bool "data: false"
```

## What I learned

- **Test safety commands under load.** On an idle computer, everything looked fine.
- **One message is not a guarantee.** For a stop command, keep sending.
- **This does not replace a physical button.** Under load, the command took about 3 seconds to work.
  Starting `ros2 topic pub` is slow, and a real emergency can't wait.

Want to try it yourself? Start the simulation in [Try Caretta](../try.md) and send the command while you drive.
