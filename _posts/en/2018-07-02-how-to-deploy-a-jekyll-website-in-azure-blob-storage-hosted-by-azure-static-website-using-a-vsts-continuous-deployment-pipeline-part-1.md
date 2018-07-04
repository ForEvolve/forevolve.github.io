---
title:  "How to deploy a Jekyll website in Azure blob storage hosted by Azure static website using a VSTS continuous deployment pipeline"
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
---

In this article series we will create a continuous deployment (CD) pipeline using Visual Studio Team Services (VSTS) to deploy a Jekyll website to Microsoft Azure.

We will use Azure Blob Storage to store the files in the cloud, a Content Delivery Network (CDN) to deliver those files using a custom domain over HTTPS (for free). We will also use the `Static Website` option of Azure Storage to configure a default page (index.html) and an error page (404 Not Found).

In my humble opinion, Azure Storage is a great, cost effective, cloud storage offering from Microsoft (and no they dont pay me to say that). For example, the images of this very blog are delivered using a CDN and stored in Blob Storage on Azure.

Here is a diagram that explains the whole idea:<!--more-->

![How to deploy a Jekyll website in Azure blob storage hosted by Azure static website using a VSTS CD pipeline diagram](//cdn.forevolve.com/blog/images/2018/VSTS-jekyll-git-vsts-azure-flow.png)

> At the day of the writing, the `Static Website` option is in `Preview`.

Initially, I planed a single article but it became very long very quickly, so I decided to split it into smaller chapters.
For example, when I decided to split the article, I had 55 screenshots; only that made the page ultra long.

{% include jekyll-vsts-azure/toc.md %}

## Difference with GitHub Pages (pros and cons)

For those who dont know, GitHub has an offering that is called [GitHub Pages](https://pages.github.com/).
GitHub Pages allows a GitHub user to deploy a Jekyll website from a git repository.
Then GitHub build and deploy the Jekyll static website automatically for you.

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
- To be fair, at some point it **may cost some money**; if you get a lot of trafic, use a lot of storage or use too much VSTS build time. As of today:
  - You have **240 minutes per month of free VSTS build time**. You also have 5 free users with unlimited private Git repositories. See [Visual Studio Team Services pricing](https://azure.microsoft.com/en-us/pricing/details/visual-studio-team-services/) for more information.
  - General Purpose v2 (Blob storage) cost **US $0.0208 per GB**, per month, plus the transfer cost which is also ridiculously low. See [Block Blob pricing](https://azure.microsoft.com/en-us/pricing/details/storage/blobs/) for more information.
  - The CDN cost is also super low, starting at **US $0.087 per GB**, per month. See [Content Delivery Network pricing](https://azure.microsoft.com/en-us/pricing/details/cdn/) for more information.

All that being said, at the end of this article, you should endup with a serverless, geodistributed website fueled by a continuous delivery pipeline costing from as low as **free**. That is prety awsome in my opinion!

## Prerequisite

In this article series, I will assume that readers knows:

- Git basics like clone, commit and push.
- How to use a terminal or the [VS Code](https://code.visualstudio.com/download) integrated terminal.
- Have an Azure account (trial or not) or be willing to create one.
- How to follow installation procedure not covered in the current article series.

If I missed something feel free to leave a comment!

## ...

Microsoft showcased a way to host static websites with Azure Blob Storage during Build 2018 and, as of today, it is in preview in some datacenters.
We will combine that offering with the power of Azure CDN, VSTS and Git to create a free hosting for our static Jekyll website similar to GitHub Pages.
