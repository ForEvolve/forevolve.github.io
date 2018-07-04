---
title:  "How to deploy and host a Jekyll website in Azure blob storage using a VSTS continuous deployment pipeline"
subtitle: "Introduction"
date:     2018-07-02 00:00:00 -0500
post-img: "//cdn.forevolve.com/blog/images/articles-header/2018-07-00-jekyll-vsts-azure-v3.jpg"
unsplash-credit: Photo by Jilbert Ebrahimi on Unsplash
lang: en
categories: en/articles
tags: 
- Azure
- VSTS
- DevOps
- Jekyll
# proficiency-level: Novice
technology-relative-level:
- { name: Azure, level: Beginners }
- { name: VSTS, level: Beginners }
- { name: DevOps, level: Beginners }
- { name: Jekyll, level: Intermediate }
- { name: Git, level: Intermediate }
---

In this article series, we will create a continuous deployment (CD) pipeline using Visual Studio Team Services (VSTS) to deploy a Jekyll website to Microsoft Azure.

We will use Azure Blob Storage to store and host the files in the cloud, a Content Delivery Network (CDN) to deliver those files using a custom domain (with free HTTPS support). From Blob Storage, we will use the `Static Website` blade to configure a default page (index.html) and an error page (404 Not Found).

> In my humble opinion, Azure Storage is a great, cost-effective, cloud storage offering from Microsoft (and no they don't pay me to say that). For example, the images of this very blog are delivered using a CDN and stored in Blob Storage on Azure. Moreover, as a developer, I way prefer my experience working with Azure, Jekyll and GitHub Pages than my experience with WordPress.

Initially, I planned a single article, and once again it became very long very quickly, so I decided to split it into smaller chapters to make it easier to read.
For example, when I decided to split the article, I had 55 screenshots; only that made the page ultra long.
However, don't fear, there are some shorter parts (and lots of images).

The articles focus on the DevOps part of the equation and how to implement the pipeline, not really on Jekyll itself.

Here is a diagram that explains the whole idea:<!--more-->

![How to deploy a Jekyll website in Azure blob storage hosted by Azure static website using a VSTS CD pipeline diagram](//cdn.forevolve.com/blog/images/2018/VSTS-jekyll-git-vsts-azure-flow.png)

- The top red part describes a user requesting a page and the CDN delivering it.
- The bottom blue part describes the Continuous Deployment pipeline; basically, what we will build in this article series.

> At the day of the writing, the `Static Website` option is in `Preview`.

{% include jekyll-vsts-azure/toc.md currentIndex=0 %}

## Difference with GitHub Pages (pros and cons)

For those who don't know, GitHub has an offering that is called [GitHub Pages](https://pages.github.com/).
GitHub Pages allows a GitHub user to deploy a Jekyll website from a git repository.
Then GitHub builds, deploys and hosts the Jekyll static website automatically for you.

In this article, we will recreate that exact pipeline, but we will use different tools to do so.

Here are the pros and cons (if you find other pros and cons feel free to leave them in a comment):

**Pros:**

- **No limitation on Gems** or custom Ruby plugins, you can code whatever you want!
- **Custom domains with HTTPS** support (for free).
- You can use a **private Git repository** (also possible for free).

**Cons:**

- Compared to GitHub Pages, you need to **setup the CD pipeline**.
- The **build and release time is slower** since the Agent must install everything everytime you start a new build.
  - That setup time is not needed on GitHub; they probably reuse pre-built agents.
  - This is the downside of flexibility.
- To be fair, at some point it **may cost some money**; if you get a lot of traffic, use a lot of storage or use too much VSTS build time. As of today:
  - You have **240 minutes per month of free VSTS build time**. You also have 5 free users with unlimited private Git repositories. See [Visual Studio Team Services pricing](https://azure.microsoft.com/en-us/pricing/details/visual-studio-team-services/) for more information.
  - General Purpose v2 (Blob storage) cost **US $0.0208 per GB**, per month, plus the transfer cost which is also ridiculously low. See [Block Blob pricing](https://azure.microsoft.com/en-us/pricing/details/storage/blobs/) for more information.
  - The CDN cost is also super low, starting at **US $0.087 per GB**, per month. See [Content Delivery Network pricing](https://azure.microsoft.com/en-us/pricing/details/cdn/) for more information.

That said, at the end of this article, you should end up with a serverless, geo-distributed website, fueled by a continuous delivery pipeline costing you from as low as **free**. Which is pretty wonderful in my opinion!

## Prerequisites

In this article series, I will assume that readers know:

- Git basics like `clone`, `commit` and `push`.
- How to use a terminal or the [VS Code](https://code.visualstudio.com/download) integrated terminal.
- Have an Azure account (trial or not) or be willing to create one.
- How to follow installation procedure not covered in the current article series.

If I missed something, feel free to leave a comment!

{% include jekyll-vsts-azure/next.md nextIndex=1 continueText="Now that you know the big picture, it is time to move to the first step: " %}

<!-- ## ...

Microsoft showcased a way to host static websites with Azure Blob Storage during Build 2018 and, as of today, it is in preview in some datacenters.
We will combine that offering with the power of Azure CDN, VSTS and Git to create a free hosting for our static Jekyll website similar to GitHub Pages. -->
