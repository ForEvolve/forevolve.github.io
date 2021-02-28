---
title: 'Publish guide: A beginner guide to programming with .NET 5 and C#'
excerpt: Nothing here, really...
date: 3000-01-01 00:00:00 -0500
lang: en
categories: en/articles
---

# TODO List

1. Set the variables below but the links
1. Deploy blog post
    - Make sure article is in the `article` directory (from `draft`)
    - Make sure the page is enabled in the ToC (`learn-coding-with-dot-net-core.json`)
1. Set the `rawBlogLink` variable
1. Minify the URL (Firebase) by following the [instructions below](#minify-link)
1. Set the `blogLink` variable
1. Deploy to **dev.to** by following the [instructions below](#dev)
1. Deploy to **Medium** by following the [instructions below](#medium)
1. Plan **Social Media** posts by following the [instructions below](#social-media)

# Variables

<!-- TODO: SET THESE -->

{% assign index = 2 %}
{% assign nextIndex = index | plus: 1 %}
{% assign installmentNumber = index | plus: 1 %}

{% assign installment = "third" %}
{% assign rawBlogLink = "https://www.forevolve.com/en/articles/2021/02/28/learn-coding-with-dot-net-core-part-3/" %}
{% assign blogLink = "https://link.forevolve.com/GMQ7" %}
{% assign devLink = "https://dev.to/carlhugom/introduction-to-c-constants-4gid" %}
{% assign mediumLink = "https://carlhugom.medium.com/introduction-to-c-constants-c14498ce0fd5" %}

<!-- END SET THESE -->

{% assign current = site.data.learn-coding-with-dot-net-core[index] %}
{% assign next = site.data.learn-coding-with-dot-net-core[nextIndex] %}

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

# Minify link

| Option                   | Value                                                                                         |
| ------------------------ | --------------------------------------------------------------------------------------------- |
| Deep link URL            | {{rawBlogLink}}                                                                               |
| Dynamic Link name        | Learn Programming Part {{ installmentNumber }}                                                |
| Preview title (st)       | {{ currentTitle }} \| A beginner guide to programming with .NET 5 and C#                      |
| Preview image URL (si)   | https://cdn.forevolve.com/blog/images/articles-header/2021-learn-coding-with-dot-net-core.png |
| Preview description (sd) | To be done manually...                                                                        |

# Platform changes

## Dev

**Tags:** dotnet, csharp, beginners

### intro-series.md

```markdown
This article is part of a **learn programming** series where you need **no prior knowledge of programming**.
If you want to **learn how to program** and want to learn it **using .NET/C#**, this is the right place.
I suggest reading the whole series in order, starting with [Creating your first .NET/C# program](https://dev.to/carlhugom/creating-your-first-net-c-program-1poj), but that's not mandatory.
```

### Exercise text

```markdown
Unfortunately, I was not able to recreate the exercise on this platform, so please look at the exercise on the original post [on my blog]({{ rawBlogLink }}#exercise). I'm sorry for the inconvenience.
```

### Replace next.md and ToC

```markdown
## Next step

It is now time to move to the next article: **{{ nextTitle }}** which is coming soon. Stay tuned by following me on dev.to, Twitter, or other places you can find me.
You can look at [my blog contact page](https://www.forevolve.com/contact/) for more info.
```

## Medium

**Tags:** dotnet, csharp, beginner, programming

### Exercise text

```markdown
Unfortunately, I was not able to recreate the exercise on this platform, so please look at the exercise on the original post [on my blog]({{ rawBlogLink }}#exercise). I'm sorry for the inconvenience.
```

### Replace `Next step` content

```markdown
It is now time to move to the next article: **{{ nextTitle }}** which is coming soon. Stay tuned by following me on Medium, Twitter, or other places you can find me.
You can look at [my blog contact page](https://www.forevolve.com/contact/) for more info.
```

# Social Media

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
