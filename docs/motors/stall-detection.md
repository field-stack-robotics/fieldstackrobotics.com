# Stall and slip detection

*Experiment · 8 min read*

A stalled motor and a slipping wheel look opposite on the current graph,
so the robot can tell them apart.

| Case  | Current | Wheel speed | Action                  |
|-------|---------|-------------|-------------------------|
| Stall | High    | Near zero   | Stop motor, raise fault |
| Slip  | Low     | High        | Trust odometry less     |

```{include} ../_snippets/signup.md
```
