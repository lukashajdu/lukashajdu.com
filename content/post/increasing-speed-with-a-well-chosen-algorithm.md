---
title: "Increasing speed with a well-chosen algorithm"
date: "2020-07-31T10:31:00Z"
tags: ["algorithm", "optimisation"]
categories: ["Development"]
---

How can a simple buffer increase an algorithm performance?
<!--more-->

Initially used to model rabbit population, the Fibonacci sequence is no doubt computer 
science's favourite sequence. It's formed of a sequence of Fibonacci numbers. Fibonacci numbers
are a widespread introduction to recursion, and their exponential mathematical properties make
them a great adept at showing the difference between efficient and inefficient algorithm.

![Rabbits](/img/increasing-speed-with-a-well-chosen-algorithm/fib-rabbits.svg#75percent "Rabbits")

In the Fibonacci sequence, each number is the sum of the two preceding ones: 0, 1, 1, 2, 3, 5, 8, 13, ...

Fibonacci numbers, F(n) are generated with this simple rule:

- F(n) = 0, if n = 0
- F(n) = 1, if n = 1
- F(n) = F(n - 1) + F(n - 2), if n > 1

# An exponential algorithm

The rules above will look rewritten in a programming language like this:

```php
<?php 

function fibNaive($n)
{
    if ($n <= 1) {
        return $n;
    }

    return fibNaive($n - 1) + fibNaive($n - 2);
}
```
If you run `fibNaive(30)`, you will see that this function already runs in a noticeable time.
Let's examine why is it so slow. The image below shows recursive calls for `fibNaive(5)`
and the same coloured circles represent duplicate computations. 

![fibNaive(5)](/img/increasing-speed-with-a-well-chosen-algorithm/fib5.jpeg#75percent "fibNaive(5)")

As you can see, even for such a small Fibonacci number, the duplication is very high, and it grows exponentially.
Running time for `fibNaive(n)` is proportional to 2^(0.694n) ≈ (1.6)^n, so it takes **1.6x** longer
to compute F(n+1) than F(n) ([Algorithms06]). How can we improve the exponential running time of our function?

# A linear algorithm

As you can see in the previous image, our naïve solution contains duplicate computations.
If we store the values of F(0), F(1), ..., F(n-1) as soon as they become know we will remove the duplication.

```php
<?php 

function fib($n)
{
    if ($n <= 1) {
        return $n;
    }

    $sequence= [0, 1];

    for ($index = 2; $index <= $n; $index++) {
        $sequence[$index] = $sequence[$index-1] + $sequence[$index-2];
    }

    return $sequence[$n];
}
```

Thanks to storing intermediate results, the internal for loop in this solution it executed n-1 time,
instead of the exponential time. This is a massive breakthrough in running time.

# Running times

This chart shows how big is the difference in execution times between the two algorithms.

![Execution time](/img/increasing-speed-with-a-well-chosen-algorithm/execution-time.png#75percent "Execution time")

# Conclusions

The chart above can answer the question from the beginning of this article. It's nice to see how
a small code update can radically increase the speed of the program. 

You might have a question if we can decrease the running time even more, and yes, we can.
It's possible to decrease it to logarithmic time with the help of matrices, but that's for another time.

Next time you write those nested loops, and your code runs very slow, try to think about running times.
There might be a simple solution.

# References

- [Algorithms06] Algorithms. Sanjoy Dasgupta. McGraw-Hill Higher Education, 2006. ISBN: 9780077388492
