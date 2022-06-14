---
title: 'Introduction to Boolean algebra and logical operators'
subtitle: 'A beginner guide to programming with .NET 6 and C#'
date: 2022-06-30 00:00:00 -0500
post-img: '//cdn.forevolve.com/blog/images/articles-header/2021-learn-coding-with-dot-net-core.png'
unsplash-credit: Photo by Jefferson Santos on Unsplash
lang: en
categories: en/articles
tags:
    - .NET 6
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

In this article, I introduce you to **Boolean algebra**, a branch of algebra that evaluates the value of a condition to `true` or `false`.
This is a **fundamental part of programming** that you can't escape, and you will use this until the end of your programmer career and maybe even beyond that point.

The article is not focusing on mathematical applications and representations but on programming.
The objective is to give you the knowledge you need for the next article of the series.

{% include learn-coding-with-dot-net-core-6/intro-series.md %}
{% include learn-coding-with-dot-net-core-6/sub-series.md firstPart=9 %}<!--more-->

## Boolean type

In C#, `bool` is the type that represents a boolean value.
A `bool` can have a value of `true` or `false`.
A `bool` is the memory representation of a bit.
A bit is a base 2 digit that is either `0` or `1`.
The value `0` means `false`, and the value `1` means `true`.

> **Want to know more?** The mathematic that we learn at school is base-10; a.k.a., there are 10 numbers: 0 to 9.
> On the other hand, computers use base-2, or a binary numeral system, that includes only two numbers: 0 and 1.
> Chances are, this is not something that you need to know right away, but I recommend learning this concept one day.
> Knowing base-2 (binary), base-8 (octal), and base-16 (hexadecimal) can only help you (yes, there are more than just base-2 and base-10).

The following code shows the two possibilities, written in C#:

```csharp
// Using var
var thisIsTrue = true;
var thisIsFalse = false;

// Using the type name
bool thisIsAlsoTrue = true;
bool thisIsAlsoFalse = false;
```

Now that we covered how to declare a variable of type `bool`, let's look at the basic operations of Boolean algebra.

## Basic operations

There are three basic operations in boolean algebra:

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

The `NOT` operator is a unary prefix operator and is different from `AND` and `OR`, which are binary operators.
It prefixes a boolean value and inverts it.
In C# (and many other languages), the `NOT` symbol is `!`.

> **More info:** C# 8.0 introduced the `!` as a suffix operator, a.k.a. the null-forgiving operator, which is a totally different thing.

The following table lists the two possible use of the negation operator and their outcome:

| Expression (C#) | English     | Result  |
| --------------- | ----------- | ------- |
| `!true`         | NOT `true`  | `false` |
| `!false`        | NOT `false` | `true`  |

The following code uses the preceding grid to explore the possibilities using C#, outputting the values in the console:

```csharp
var value1 = true;
var value2 = false;
var value3 = !value1; // false
var value4 = !value2; // true
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
This is the main takeaway here: the NOT operator, in `!variable`, flips the original value of `variable`.

> **One last bit**: as an analogy, you could see a boolean as a light switch and the negation as the action of flipping the switch on/off.
> For example, when you flip the light-switch from _off_ (`false`) to _on_ (`true`); **on** is the equivalent of **not off** (`!false`) while **off** is the equivalent of **not on** (`!true`).

Next, let's jump into the AND logical operator.

### Conditional logical operator AND

In C#, the conditional logical `AND` operator is represented by `&&`.

> **Important:** It is essential to double the symbol, otherwise `&` (single) is a binary operator (acting on bits), and it is different.

The `&&` operator is a binary operator that acts on two operands, like `result = operand1 && operand2`.

Here is an example of using the `&&` operator:

```csharp
var leftOperand = true;
var rightOperand = true;
var result = leftOperand && rightOperand; // true
Console.WriteLine($"Result: {result}");
```

The preceding code outputs `Result: True` to the console.
Now that you may be wondering why `true && true` returns `true`, let's have a look at the logical table of the `AND` operator:

| Left    | Right   | C#               | English             | Result  |
| ------- | ------- | ---------------- | ------------------- | ------- |
| `true`  | `true`  | `true && true`   | `true` AND `true`   | `true`  |
| `true`  | `false` | `true && false`  | `true` AND `false`  | `false` |
| `false` | `true`  | `false && true`  | `false` AND `true`  | `false` |
| `false` | `false` | `false && false` | `false` AND `false` | `false` |

As you may have noticed from the preceding table, all combinations result in `false` except when both operands are `true`; that's how the AND operator works.
Let's update the preceding code to cover the `true && false` scenario:

```csharp
var leftOperand = true;
var rightOperand = false;
var result = leftOperand && rightOperand; // false
Console.WriteLine($"Result: {result}");
```

This updated code outputs `Result: False` to the console, precisely like the table predicted.

Ok, we are not done yet.
Next, we look at the `OR` operator, which has a similar syntax but a different logical outcome.

### Conditional logical operator OR

In C#, the conditional logical `OR` operator is represented by `||`.

> **Important:** It is essential to double the symbol, otherwise `|` (single) is a binary operator (acting on bits), and it is different.

The `||` operator, same as the `&&` operator, is a binary operator that acts on two operands, like `result = operand1 || operand2`.

Here is a C# example of using the `||` operator:

```csharp
var leftOperand = true;
var rightOperand = true;
var result = leftOperand || rightOperand; // true
Console.WriteLine($"Result: {result}");
```

The preceding code outputs `Result: True` to the console.
Like the AND operator, the OR operator also has a logical table that comes with it.
Let's have a look:

<!-- prettier-ignore-start -->

| Left    | Right   | C#                       | English            | Result  |
| ------- | ------- | ------------------------ | ------------------ | ------ |
| `true`  | `true`  | `true || true`           | `true` OR `true`   |`true`  |
| `true`  | `false` | `true || false`          | `true` OR `false`  |`true`  |
| `false` | `true`  | `false || true`          | `false` OR `true`  |`true`  |
| `false` | `false` | `false || false`         | `false` OR `false` |`false` |

<!-- prettier-ignore-end -->

An interesting observation is how the `||` operator returns `true` whenever there is at least one operand that is equal to `true`.
In other words, the `||` operator returns `false` only when there is no `true` (when both operands are `false`).
In code, the only way to have a result of `false` would be the following code:

```csharp
var result = false || false; // false
Console.WriteLine($"Result: {result}");
```

The preceding code outputs `Result: False` to the console.

Now that we covered the basic operators, it is time to look at the _logical exclusive `OR` operator_, which is closer to the spoken `OR` than the logical `OR` that we just learned about.

## Logical exclusive OR operator (XOR)

In spoken languages, we usually use `OR` as an _exclusive OR_.
For example, when we say, « do you prefer blue or green? » we expect a response about one of the two but not both.
That type of OR is called the exclusive `OR`, also known as `XOR`.
In C#, the XOR operator is `^`.

> **Advanced information:** the `XOR` operator is a compound operator, or shortcut if you which.
> We can compose the equivalent of the `XOR` operator using basic operators like `NOT`, `AND`, and `OR`.
> In C#, the `XOR` operator can be expressed as one of the following expressions: `(left || right) && (!left && !right)` or `(left && !right) || (!left && right)`.
> In the preceding two code snippets, the parenthesis change the priority of the operations.
> The parenthesis play the same concept than in the following elementary mathematic equations `(1 + 2) * 3 = 3 * 3 = 9` but `1 + 2 * 3 = 1 + 6 = 7`.

Let's start by exploring the `XOR` logic table:

| Left    | Right   | C#              | English            | Result  |
| ------- | ------- | --------------- | ------------------ | ------- |
| `true`  | `true`  | `true ^ true`   | `true` OR `true`   | `false` |
| `true`  | `false` | `true ^ false`  | `true` OR `false`  | `true`  |
| `false` | `true`  | `false ^ true`  | `false` OR `true`  | `true`  |
| `false` | `false` | `false ^ false` | `false` OR `false` | `false` |

As you may have noticed, the `XOR` logic table is the same as the `OR` table, but the result is `false` when both operands are `true` (first row).
This is what differentiates OR and XOR: the result is `true` if one operand is `true` but not both.

In code, XOR looks like this:

```csharp
var leftOperand = true;
var rightOperand = false;
var result = leftOperand ^ rightOperand; // true
Console.WriteLine($"Result: {result}");
```

When executing the preceding code, we get `Result: True` as the console output because **one of the operands is true but not both**.

> **Note:** based on my personal experiences, this operator is not used very often.
> Nevertheless, I think it is worth knowing of its existence, for those few times.

Next, that's your turn to practice what we just covered.

## Exercise

The exercise will focus on the logic part and not on the code part.
We will use this knowledge in the next installment, where we will learn to write conditional code based on boolean logic.
For now, try to answer the following questions without consulting the logic tables.

What is the result of:

1. `true && true`
1. `true || true`
1. `!true && true`
1. `true || !true`
1. `true ^ true`

Once you are done, compare your results with the answers below:

<!-- prettier-ignore-start -->

{%- capture solutionContent -%}1. `true`
1. `true`
1. `false`
1. `true`
1. `false`
{%- endcapture -%}
{%- assign solutionContent = solutionContent | markdownify -%}
{%- include spoiler.html title="Answers" content=solutionContent -%}

<!-- prettier-ignore-end -->

Good job! You completed another small chapter of your programming journey.

## Conclusion

In this article, we explored the three basic operations of Boolean algebra: `AND`, `OR`, and `NOT`.
Each of them has a _logical table_ that lists the expected output based on the inputs.
For example, AND returns `true` only when both operands are `true`, while OR returns `false` only when both operands are `false`.

Then we looked at the compound operator XOR (exclusive OR).
That operator helps simplify certain scenarios where you want a result of `true` when only one of the two operands is `true` but not both.

This is very important and will be used in subsequent articles to learn to use boolean algebra to write conditional logic.
We will also explore more complex scenarios and some laws to help you simplify your conditional logic.
This was a theoretical article that we will practice in the next one of the series.

All in all, Boolean algebra is one of the bases of programming that you can't escape.
Please leave a comment below if you have questions or comments.

{%- include learn-coding-with-dot-net-core-6/next.md nextIndex=10 -%}

### Table of content

{%- include learn-coding-with-dot-net-core-6/toc.md currentIndex=9 -%}
