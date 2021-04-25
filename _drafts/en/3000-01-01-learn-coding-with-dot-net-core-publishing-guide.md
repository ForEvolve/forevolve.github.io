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
    - Set the `blogLink` variable
1. Deploy to **dev.to** by following the [instructions below](#dev)
    - Set the `devLink` variable
1. Deploy to **Medium** by following the [instructions below](#medium)
    - Set the `mediumLink` variable
1. Plan **Social Media** posts by following the [instructions below](#social-media)

# Variables

<!-- TODO: SET THESE -->

{% assign index = 8 %}
{% assign nextIndex = index | plus: 1 %}
{% assign installmentNumber = index | plus: 1 %}
{% assign subSeriesFirstPart = 9 %}

{% assign installment = "eighth" %}
{% assign rawBlogLink = "https://www.forevolve.com/en/articles/2021/04/18/learn-coding-with-dot-net-core-part-8/" %}
{% assign blogLink = "https://link.forevolve.com/25ee" %}
{% assign devLink = "https://dev.to/carlhugom/escaping-characters-in-c-strings-3p2d" %}
{% assign mediumLink = "TODO" %}

<!-- END SET THESE -->

{% assign current = site.data.learn-coding-with-dot-net-core[index] %}
{% assign next = site.data.learn-coding-with-dot-net-core[nextIndex] %}

{% assign currentTitle = current.title %}
{% assign nextTitle = next.title %}
{% assign nextDate = next.expectedReleaseDate %}
{% assign twitterProfileUri = "https://twitter.com/CarlHugoM" %}

-   **Original link:** {{rawBlogLink}}
-   **Minified link:** {{blogLink}}
-   **Dev.to:** {{devLink}}
-   **Medium:** {{mediumLink}}
-   **Current title:** {{ currentTitle }}
-   **Next title:** {{ nextTitle }}
-   **Next date:** {{ nextDate }}
-   **Installment:** {{ installment }}
-   **Twitter profile Uri:** {{ twitterProfileUri }}
-   **SubSeries FirstPart:** {{ subSeriesFirstPart }}{% unless subSeriesFirstPart %}Not part of a series.{% endunless %}

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

-   **Title:** {{currentTitle}}
-   **Tags:** dotnet, csharp, beginners
-   **Original post:** {{rawBlogLink}}

### intro-series.md

```markdown
This article is part of a **learn programming** series where you need **no prior knowledge of programming**.
If you want to **learn how to program** and want to learn it **using .NET/C#**, this is the right place.
I suggest reading the whole series in order, starting with [Creating your first .NET/C# program](https://dev.to/carlhugom/creating-your-first-net-c-program-1poj), but that's not mandatory.
```

{% if subSeriesFirstPart %}

### sub-series.md

> Don't copy `{::options parse_block_html="true" /}{::options parse_block_html="false" /}`

```markdown
{% include learn-coding-with-dot-net-core/sub-series.md firstPart=subSeriesFirstPart urlPrefix=site.remoteUrl pageTitle=currentTitle %}
```

{% endif %}

### Exercise text

```markdown
Unfortunately, I was not able to recreate the exercise on this platform, so please look at the exercise on the original post [on my blog]({{ rawBlogLink }}#exercise). I'm sorry for the inconvenience.
```

### Replace next.md and ToC

```markdown
## Next step

It is now time to move to the next article: **{{ nextTitle }}** which is coming soon. Stay tuned by following me on dev.to, [Twitter]({{ twitterProfileUri }}), or other places you can find me.
You can look at [my blog contact page](https://www.forevolve.com/contact/) for more info.
```

## Medium

-   **Import URL:** {{rawBlogLink}}
-   **Subtitle:** A beginner guide to programming with .NET 5 and C#
-   **Tags:** dotnet, csharp, beginner, programming

### Exercise text

Unfortunately, I was not able to recreate the exercise on this platform, so please look at the exercise on the original post [on my blog]({{ rawBlogLink }}#exercise). I'm sorry for the inconvenience.

### Replace `Next step` content

It is now time to move to the next article: **{{ nextTitle }}** which is coming soon. Stay tuned by following me on Medium, [Twitter]({{ twitterProfileUri }}), or other places you can find me.
You can look at [my blog contact page](https://www.forevolve.com/contact/) for more info.

# Social Media

Log to Buffer and plan some posts...

## Twitter

### Blog

**Schedule on:** Monday

You want to learn to program? You want to learn C#? You know someone that wants to learn that? Here is the {{ installment }} article of my #LearnProgramming series. No prior knowledge of programming is required. #csharp #dotnet #dotnetcore #dotnet5

{{ blogLink }}

#### v2

The {{ installment }} article of my #LearnProgramming series is out; no prior knowledge of programming is required. #csharp #dotnet #dotnetcore #dotnet5

{{ blogLink }}

### Next article

**Schedule on:** Wednesday

The next installment of my #LearnProgramming series—{{ nextTitle }}—is planned for {{ nextDate }}; stay tuned!

### Dev

**Schedule on:** Thursday

Did you know that the {{ installment }} article of my #LearnProgramming series—{{ currentTitle }}—was also out on @ThePracticalDev? No prior knowledge of programming is required. #csharp #dotnet #dotnetcore #dotnet5

{{ devLink }}

#### v2

The {{ installment }} article of my #LearnProgramming series is out on @ThePracticalDev; no prior knowledge of programming is required. #csharp #dotnet #dotnetcore #dotnet5

{{ devLink }}

### Medium

**Schedule on:** Next week (Tuesday)

Did you know that the {{ installment }} article of my #LearnProgramming series—{{ currentTitle }}—was also available on @Medium? No prior knowledge of programming is required. #csharp #dotnet #dotnetcore #dotnet5

{{ mediumLink }}

#### v2

The {{ installment }} article of my #LearnProgramming series is out on @Medium; no prior knowledge of programming is required. #csharp #dotnet #dotnetcore #dotnet5

{{ mediumLink }}

## Linked In

**Schedule on:** Monday

You want to learn to program? You want to learn C#? You are already an expert but know someone that wants to learn it?

The {{ installment }} article of my #LearnProgramming series—{{ currentTitle }}—is now out on my blog. No prior knowledge of programming is required. It is also be published on both Dev and Medium if you prefer those platforms.

The next installment—{{ nextTitle }}—is planned for {{ nextDate }}; stay tuned!

#csharp #dotnet #dotnetcore #dotnet5

{{ blogLink }}
