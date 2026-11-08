# Wheel odometry by drive type

Seven ways to drive a wheeled robot, and how far you can trust the wheels on each.

Not every robot slips like the skid-steer in [Wheel odometry](wheel-odometry.md).
How far you can trust wheel odometry comes down to one question:
**do the wheels have to slip for the robot to move or turn?**

Here are the seven main drive types for wheeled ground robots, from most to least trustworthy.

## 1. Differential drive

*Home robots, robot vacuums, TurtleBot.*

Two driven wheels turn independently, with a free caster wheel at the front or back.
The robot turns by running the two wheels at different speeds, so nothing has to slip.

- **Forward:** ✅ reliable
- **Turning:** ✅ reliable, once calibrated
- **Weak spots:** crossing onto carpet, and the small jolt when the caster swings around.

## 2. Ackermann (car-like)

*Self-driving cars, farm vehicles, large field robots.*

The front wheels steer and the rear wheels push.
The wheels are set up to roll through a turn, so they slip very little.

- **Forward:** ✅ reliable, from the rear wheel encoders
- **Turning:** ✅ good, if the steering angle is measured accurately
- **Weak spots:** it can't turn in place, and slip grows at high speed or on slippery ground.

## 3. Swerve

*FRC robots, some industrial AGVs.*

Every wheel has its own drive motor and its own steering motor.
Each wheel can always point the way the robot is moving, so slip stays low.

- **Forward and sideways:** ✅ good
- **Turning:** ✅ good
- **Weak spots:** only as good as the measured module angles, and it is complex and expensive.

## 4. Omni wheels

*Some education and competition robots.*

Small free rollers sit around the edge of each wheel, so the robot can move in any direction.

- **Forward, sideways, turning:** 🟡 fair
- **Weak spots:** the rollers slide sideways by design. Part of that sliding is normal motion, but how much depends on the floor.

## 5. Mecanum wheels

*Warehouse robots, some AGVs, competition robots.*

The rollers sit at 45°, so the robot can slide sideways.

- **Forward:** 🟡 fair
- **Sideways:** ❌ poor
- **Turning:** 🟡 fair
- **Weak spots:** very sensitive to the floor. On carpet or dusty floors the rollers slip, and sideways moves drift badly.

## 6. Skid-steer

*Field robots like the Clearpath Husky.*

Four wheels, no steering, turning like a tank.
To turn, the wheels have to scrub sideways across the ground.

- **Forward:** 🟡 fair to good
- **Turning:** ❌ poor
- **In short:** fine when driving straight, don't trust it in turns.

## 7. Tracked

*Field, mining, search-and-rescue and military robots.*

Skid-steer taken to the extreme. The long contact patch means turning is all slip.

- **Forward:** 🟡 fair, good in good conditions
- **Turning:** ❌ very poor
- **In short:** it tells you whether the robot is moving, forward or back, and roughly how fast. Take the turn rate from the IMU.

## Summary

| Drive type   | Forward | Sideways | Turning | Overall trust |
|--------------|:-------:|:--------:|:-------:|:-------------:|
| Differential | ✅      | —        | ✅      | ⭐⭐⭐⭐⭐    |
| Ackermann    | ✅      | —        | ✅      | ⭐⭐⭐⭐⭐    |
| Swerve       | ✅      | ✅       | ✅      | ⭐⭐⭐⭐      |
| Omni         | 🟡      | 🟡       | 🟡      | ⭐⭐⭐        |
| Mecanum      | 🟡      | ❌       | 🟡      | ⭐⭐          |
| Skid-steer   | 🟡      | —        | ❌      | ⭐⭐          |
| Tracked      | 🟡      | —        | ❌      | ⭐            |

— means the robot can't move that way, so its sideways speed is taken as 0.

:::{note}
**The rule:** the less a design needs to slip, the more you can trust its wheel odometry.
On differential and Ackermann robots, slip is a fault.
On mecanum, skid-steer and tracked robots, slip is part of how they move.
:::

```{include} ../_snippets/signup.md
```
