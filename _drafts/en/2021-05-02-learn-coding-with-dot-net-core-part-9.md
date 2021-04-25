---
title: 'Introduction to boolean algebra and logical operators'
subtitle: 'A beginner guide to programming with .NET 5 and C#'
date: 2021-05-02 00:00:00 -0500
post-img: '//cdn.forevolve.com/blog/images/articles-header/2021-learn-coding-with-dot-net-core.png'
unsplash-credit: Photo by Jefferson Santos on Unsplash
lang: en
categories: en/articles
tags:
    - .NET 5
    - .NET Core
    - C#
    - Learn Programming
proficiency-level: Novice
technology-relative-level:
    - { name: .NET, level: Beginners }
    - { name: C#, level: Beginners }
    - {
          name: Computers,
          level: Familiar,
          short-description: You are familiar with computers,
          description: 'You know your way around a computer and is able to install a software, configure your OS, open a terminal, and perform other similar simple tasks.',
      }
---

In this article I will introduce you to the mathematical branch of algebra that evaluates the value of a condition to true or false.
**Boolean algebra** is different from _number-oriented **algebra**_ and has almost no direct relation to it.
What we want is to evaluate if a condition is `true` or `false`.
This is a **fundamental part of programming** that you can't escape and you will use this until the end of your programmer career and maybe even beyond that point.
That said, there are more dreadful part to programming than this :wink:

{% include learn-coding-with-dot-net-core/intro-series.md %}
{% include learn-coding-with-dot-net-core/sub-series.md firstPart=9 %}<!--more-->

## Boolean type

In C#, the `bool` is the type that represents a boolean value.
A `bool` can have a value of `true` or `false`.
A bool is the memory representation of a bit.
A bit is a base 2 digit that is either `0` or `1`.
The value `0` means `false` and the value `1` means `true`.

Following are the two possibilities:

```csharp
var thisIsTrue = true;
var thisIsFalse = false;
```

Next, we look at the basic operations of boolean algebra.

## Basic operations

There are three basic operation in boolean algebra:

<!-- prettier-ignore-start -->

| Name        | Known-as | C#   |
| ----------- | -------- | ---- |
| Conjunction | AND      | `&&` |
| Disjunction | OR       | `||` |
| Negation    | NOT      | `!`  |

<!-- prettier-ignore-end -->

With `AND`, `OR`, and `NOT`, we can create most logical conditions that a program requires to run.
Let's start by exploring the `NOT` logical operator.

### Logical operator NOT

The `NOT` operator is a unary prefix operator and is different from `AND` and `OR` which are binary operators.
It prefixes a boolean value and flips it to the opposite.
In C# (and many other languages), the `NOT` symbol is `!`.

> **More info:** since C# 8.0, the `!` as a suffix represent the null-forgiving operator which is a totally different thing.

Here are the possibilities with their outcome:

| Expression | Result  |
| ---------- | ------- |
| `!true`    | `false` |
| `!false`   | `true`  |

If we translate the preceding grid into a code sample, it would look like this:

```csharp
var value1 = true;
var value2 = false;
var value3 = !value1;
var value4 = !value2;
Console.WriteLine($"value1: {value1}");
Console.WriteLine($"value2: {value2}");
Console.WriteLine($"value3: {value3}");
Console.WriteLine($"value4: {value4}");
```

When running the program, we obtain the following output:

```plaintext
value1: True
value2: False
value3: False
value4: True
```

As we can observe here, the value of the `value3` and `value4` variables are the opposite of their negated source.
This is the main takeaway here: `!variable` flip its value 180°.

> **One last bit**: as an analogy, you could see a boolean as a light-switch and the negation as the action of flipping the switch on/off.
> For example, when you flip the light-switch from _off_ (`false`) to _on_ (`true`); _on_ becomes the equivalent of _not off_ (`!false`).

Next, let's jump into the AND logical operator.

### Conditional logical operator AND

In C#, the Conditional logical `AND` operator is represented by `&&`.

> **Important:** It is important to double the symbol, otherwise `&` (single) is a binary operator (acting on bits) and it is different.

The `&&` operator is a binary operator that act on two operands, like `result = operand1 && operand2`.

Here is an example of using the `&&` operator:

```csharp
var leftOperand = true;
var rightOperand = true;
var result = leftOperand && rightOperand;
Console.WriteLine($"Result: {result}");
```

The preceding code outputs `Result: True` to the console.

Now, let's have a look at the logical table of the `AND` operator:

| Left    | Right   | C#               | Result  |
| ------- | ------- | ---------------- | ------- |
| `true`  | `true`  | `true && true`   | `true`  |
| `true`  | `false` | `true && false`  | `false` |
| `false` | `true`  | `false && true`  | `false` |
| `false` | `false` | `false && false` | `false` |

As you may have notice from the preceding table, all combinations are `false` but if both operands are `true`; that's the AND operator.
Let's update the preceding code to cover the `true && false` scenario:

```csharp
var leftOperand = true;
var rightOperand = false;
var result = leftOperand && rightOperand;
Console.WriteLine($"Result: {result}");
```

This updated code outputs `Result: False` to the console, exactly like the table predicted.

Next, let's have a look at the `OR` operator.

### Conditional logical operator OR

In C#, the Conditional logical `OR` operator is represented by `||`.

> **Important:** It is important to double the symbol, otherwise `|` (single) is a binary operator (acting on bits) and it is different.

The `||` operator, like the `&&` operator, is a binary operator that act on two operands, like `result = operand1 || operand2`.

Here is an example of using the `||` operator:

```csharp
var leftOperand = true;
var rightOperand = true;
var result = leftOperand || rightOperand;
Console.WriteLine($"Result: {result}");
```

The preceding code outputs `Result: True` to the console.

Now, let's have a look at the logical table of the `OR` operator:

<!-- prettier-ignore-start -->

| Left    | Right   | C#                       | Result  |
| ------- | ------- | ------------------------ | ------- |
| `true`  | `true`  | `true || true`           | `true`  |
| `true`  | `false` | `true || false`          | `true`  |
| `false` | `true`  | `false || true`          | `true`  |
| `false` | `false` | `false || false`         | `false` |

<!-- prettier-ignore-end -->

An interesting observation to have here is how the `||` operator returns `true` whenever there is at least one operand that is equal to `true`.
In other words, the `||` operator returns `false` only when there is no `true` (a.k.a. two `false`).

Next, we look at the _logical exclusive `OR` operator_, that is closer to the spoken `OR` than the `OR` operator itself.

## Logical exclusive OR operator

In spoken languages, we often use `OR` as an _exclusive OR_, meaning that we say « do you prefer blue or green? », we mean one of the two but not both.
That type of OR is called the exclusive `OR`, also known as `XOR`.
In C#, the XOR operator is `^`.

> **Advanced information:** the `XOR` operator is a compound operator, or shortcut if you which, known as syntactic sugar.
> We can compose the equivalent of the `XOR` operator using basic operators like `NOT`, `AND` and `OR`.
> In C#, the `XOR` operator can be expressed as one of the following two expressions: `(left || right) && (!left && !right)` or `(left && !right) || (!left && right)`.

Let's start by exploring the `XOR` logic table:

| Left    | Right   | C#              | Result  |
| ------- | ------- | --------------- | ------- |
| `true`  | `true`  | `true ^ true`   | `false` |
| `true`  | `false` | `true ^ false`  | `true`  |
| `false` | `true`  | `false ^ true`  | `true`  |
| `false` | `false` | `false ^ false` | `false` |

As you may have noticed, the `XOR` logic table is the same as the `OR` table, but the result is `false` when both operands are `true` (first row).

In code, it looks like this:

```csharp
var leftOperand = true;
var rightOperand = false;
var result = leftOperand ^ rightOperand;
Console.WriteLine($"Result: {result}");
```

When executing the preceding code, we get `Result: True` as the console output because **one of the operands is true but not both**.

Based on my personal experiences, this operator if not use very often.
Nevertheless, it is very good to know it exists, for those few times.

Next, I'll have you practice what we just covered.

## Exercise

...

## Conclusion

In this article, ...

{%- include learn-coding-with-dot-net-core/next.md nextIndex=10 -%}

### Table of content

{%- include learn-coding-with-dot-net-core/toc.md currentIndex=9 -%}
