# PID speed control

*Tutorial · 12 min read · ESP32, 12 V DC motor, encoder*

How I got both wheels to hit their target speed without overshoot, and the graphs that prove it.

<!-- Demo video or GIF goes here, e.g.
![Before and after](../_static/pid-demo.gif) -->

## Overview

- A speed controller with feedforward and anti-windup
- A repeatable step-response test
- A live plot of target vs measured speed

## The idea

PID reacts after an error appears. Feedforward predicts the voltage a speed needs.
Feedforward does most of the work, PID cleans up the rest.

## Step 1: The control loop

```cpp
float ff  = kS * sign(target) + kV * target;
float err = target - measured;
integral  = clamp(integral + err * dt, -iMax, iMax);
float pwm = ff + kP * err + kI * integral;
```

`clamp` on the integral is the anti-windup. Without it the motor overshoots
every time it leaves saturation.

## Results

| Metric             | Before | After  |
|--------------------|--------|--------|
| Overshoot          | [X] %  | [Y] %  |
| Settling time      | [X] ms | [Y] ms |
| Steady-state error | [X] %  | [Y] %  |

## Troubleshooting

### The loop jittered when Wi-Fi was busy

Moving the web server to the other core fixed it.

### Low speeds stuttered

Static friction. The `kS` term solved it.

```{include} ../_snippets/signup.md
```
