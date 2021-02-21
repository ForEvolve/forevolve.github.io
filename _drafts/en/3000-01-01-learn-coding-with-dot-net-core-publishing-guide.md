---
title: 'Publish guide: A beginner guide to programming with .NET 5 and C#'
date: 3000-01-01 00:00:00 -0500
lang: en
categories: en/articles
---

## Variables

{% assign index = 2 %}
{% assign nextIndex = 3 %}

{% assign current = site.data.learn-coding-with-dot-net-core[index] %}
{% assign next = site.data.learn-coding-with-dot-net-core[nextIndex] %}

<!-- TODO: SET THESE -->

{% assign installment = "third" %}
{% assign blogLink = "[BLOG LINK]" %}
{% assign devLink = "[DEV LINK]" %}
{% assign mediumLink = "[MEDIUM LINK]" %}

{% assign currentTitle = current.title %}
{% assign nextTitle = next.title %}
{% assign nextDate = next.expectedReleaseDate %}

-   **Original link (link.forevolve.com):** {{blogLink}}
-   **Dev.to:** {{devLink}}
-   **Medium:** {{mediumLink}}
-   **Current title:** {{ currentTitle }}
-   **Next title:** {{ nextTitle }}
-   **Next date:** {{ nextDate }}
-   **Installment:** {{ installment }}

## Twitter

### Blog

**Schedule on:** Monday

You want to learn to program? You want to learn C#? You know someone that wants to learn that? Here is the {{ installment }} article of my #LearnProgramming series. No prior knowledge of programming is required. #csharp #dotnet #dotnetcore #dotnet5

{{ blogLink }}

### Next article

**Schedule on:** Wednesday

The next installment of my #LearnProgramming series—{{ nextTitle }}—is planned for {{ nextDate }}; stay tuned!

### Dev

**Schedule on:** Thursday

Did you know that the {{ installment }} article of my #LearnProgramming series—{{ currentTitle }}—was also out on @ThePracticalDev? No prior knowledge of programming is required. #csharp #dotnet #dotnetcore #dotnet5

{{ devLink }}

### Medium

**Schedule on:** Next week (Tuesday)

Did you know that the {{ installment }} article of my #LearnProgramming series—{{ currentTitle }}—was also available on @Medium? No prior knowledge of programming is required. #csharp #dotnet #dotnetcore #dotnet5

{{ mediumLink }}

## Linked In

**Schedule on:** Monday

You want to learn to program? You want to learn C#? You are already an expert but know someone that wants to learn it?

The {{ installment }} article of my #LearnProgramming series—{{ currentTitle }}—is now out on my blog. No prior knowledge of programming is required. It will also be published on both Dev and Medium if you prefer those platforms.

The next installment—{{ nextTitle }}—is planned for {{ nextDate }}; stay tuned!

#csharp #dotnet #dotnetcore #dotnet5

{{ blogLink }}
