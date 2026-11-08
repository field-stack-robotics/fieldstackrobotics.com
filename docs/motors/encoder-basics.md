# Reading encoders

*Tutorial · 8 min read*

Before tuning anything, make sure the speed you measure is the speed the wheel actually turns.

## Check the counts first

Turn the wheel exactly 10 times by hand and compare the pulse count with
CPR × gear ratio × 10. Do it in both directions.

```cpp
volatile long ticks = 0;
void IRAM_ATTR onA() { ticks += digitalRead(PIN_B) ? 1 : -1; }
```

:::{note}
If the two directions disagree, check the B channel wiring before touching any code.
:::

```{include} ../_snippets/signup.md
```
