---
title: 'Boolean algebra laws'
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

This article explores multiple Boolean algebra laws in a programmer-oriented way, leaving the mathematic notation aside.
Those laws can be beneficial when working with boolean logic to simplify complex conditions.
This article is very light in explanation and exposes the laws using C#.
Don't worry, I'm not recycling myself as a math teacher.

{% include learn-coding-with-dot-net-core-6/intro-series.md %}
{% include learn-coding-with-dot-net-core-6/sub-series.md firstPart=9 %}<!--more-->

Let's explore Boolean algebra laws in alphabetical order.
Some are very simple, while some may seem more complex, but all are very useful tools.

In the examples, the variables (`A`, `B`, `C`) are all booleans, like this:

```csharp
bool A, B, C;
```

## Absorption Law

The absorption law goes as follow:

-   `A && (A || B)` always equals `A`
-   `A || A && B` always equals `A`

## Annulment Law

The annulment law goes as follow:

-   `A && false` is always `false`
-   `A || true` is always `true`

## Associative Law

The associative law says that no matter the order or priority of the OR comparisons, the result will always be the same.
The following conditions yield the same result:

-   `A || (B || C)`
-   `(A || B) || C`
-   `(A || C) || B`
-   `A || B || C`

## Complement Law

The complement law goes as follow:

-   `A && !A` is always `false`
-   `A || !A` is always `true`

## Commutative Law

The commutative law goes as follow:

-   `A && B` is the same as `B && A`
-   `A || B` is the same as `B || A`

## Consensus Law

The consensus law goes as follow:

1.  `(A || B) && (!A || C) && (B || C)` is equivalent to `(A || B) && (!A || C)`
2.  `A && B || A && C || B && C` is equivalent to `A && B || A && C`

These two might be harder to grasp, so here's my take at a quick explanation:

1. In the first two comparisons of `(A || B) && (!A || C) && (B || C)`, `A` and `!A` are almost cancelling themselves, leaving the outcome of the comparison to `B` and `C`. Based on that fact, no matter the values, the last comparison `&& (B || C)` becomes useless (already evaluated).
2. The second one is similar. In the first two comparisons of `A && B || A && C || B && C`, we test `B` and `C`, making the last comparison void `|| B && C`.

> **Word of advice:** it is not mandatory to remember the consensus law, so feel free to skip this one if you think it's too complicated for today.
> You can always come back to it later.

## De Morgan's laws

This one is very interesting and can be handy from time to time.
In plain English, De Morgan's laws are:

-   The `negation` of a `disjunction` is the `conjunction` of the `negations`.
-   The `negation` of a `conjunction` is the `disjunction` of the `negations`.

> Logical `conjunction` means AND (`&&`), and the logical `disjunction` means OR (`||`).
> Unless you are into mathematics, you don't have to remember that.

Now to the part that interests us, in C#, De Morgan's laws are:

-   `!(A || B)` is equivalent to `!A && !B`
-   `!(A && B)` is equivalent to `!A || !B`

## Distributive Law

The distributive law goes as follow:

-   `A && B || A && C` is equivalent to `A && (B || C)`
-   `(A || B) && (A || C)` is equivalent to `A || B && C`

## Double negation law

The double negation law says that two negations negate themselves.
In C# this looks like:

-   `!!A` is equivalent to `A`

## Identity Law

The identity law goes as follow:

-   `A && true` always equals `A`
-   `A || false` always equals `A`

## Idempotent Law

The idempotent law goes as follow:

-   `A && A` always equals `A`
-   `A || A` always equals `A`

## Redundancy Law

The redundancy law goes as follow:

-   `(A || B) && (A || !B)` always equals `A`
-   `A && B || A && !B` always equals `A`
-   `(A || !B) && B` is equivalent to `A && B`
-   `A && !B || B` is equivalent to `A || B`

## Conclusion

In this article, we explored a bunch of Boolean algebra laws from a C# programmer perspective.
You can find information on them, including mathematic proofs, online or in books if you are into maths.
Personally, I prefer the plain C# version, so that's why I translated them to this here.
Even if some of those laws might seem a bit too complicated to remember, don't be discouraged; even the simplest ones are helpful: start there.

Programming is like playing LEGO<sup>&reg;</sup> blocks: we can combine all of those laws, which are logic patterns.
For example, `!(!A || !B)` looks complicated, but after applying De Morgan's law, it becomes equivalent to `!(!(A && B))`.
By removing the useless parenthesis we end up having `!!(A && B)`, which exposes a double negation.
Applying the double negation law leads to `A && B`.
That simplified version of the original condition looks way simpler, doesn't it?

Learning the basics is helpful in the long run.
If you have a good memory, feel free to memorize all of this as a starting point.
If you don't, don't worry, learn them one by one.
The idea is to simplify your code, so it reaches a more maintainable state.
With a bit of time, you will most likely know and apply many (if not all) of them without thinking about it.
Just start with the simplest ones, bookmark the article, and learn the others later.
Understanding rules, laws, and concepts should get you further than just remembering them; but that takes more time.

> Fun fact: I've run many interviews in 2021, and one of my favorite technical questions is based on complicated conditions that can be simplified using some of those laws.
> And no, I'm not looking for candidates that know the name of the laws, just if they can resolve a complex if-statement and how.

Please leave your questions or comments below or drop me a Tweet.

{%- include learn-coding-with-dot-net-core-6/next.md nextIndex=13 -%}

### Table of content

{%- include learn-coding-with-dot-net-core-6/toc.md currentIndex=12 -%}
