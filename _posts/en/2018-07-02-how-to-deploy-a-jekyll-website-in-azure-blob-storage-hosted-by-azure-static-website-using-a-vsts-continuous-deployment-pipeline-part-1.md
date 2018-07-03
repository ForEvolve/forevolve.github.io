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

{{ "How to deploy a Jekyll website in Azure blob storage hosted by Azure static website using a VSTS continuous deployment pipeline" | slugify }}

In this article we will create a continuous deployment (CD) pipeline using Visual Studio Team Services (VSTS) to deploy a Jekyll website to Azure.

We will use Azure Blob Storage to store the files in the cloud, a CDN to deliver those files using a custom domain that support HTTPS (for free), and the `Static Website` option of Azure Storage to configure a default page (index.html) and an error page (404 Not Found).

In my humble opinion, Azure Storage is a great, cost effective, cloud storage offering from Microsoft (and no they dont pay me to say that). For example, the images of this very blog are delivered using a CDN and stored in Blob Storage on Azure.<!--more-->

Here is a diagram that explains the whole idea:

![How to deploy a Jekyll website in Azure blob storage hosted by Azure static website using a VSTS CD pipeline diagram](//cdn.forevolve.com/blog/images/2018/VSTS-jekyll-git-vsts-azure-flow.png)

> At the day of the writing, the `Static Website` option is in `Preview`.

{% include jekyll-vsts-azure/toc.md %}

## Difference with GitHub Pages (pros/cons)

For those who dont know, GitHub has an offering that is called GitHub Pages. That allows you to deploy a Jekyll website from a git repository. GitHub build and deploy the Jekyll static website automatically for you. In this article, we will recreate that exact pipeline, but we will use different tools to do so.

Here are the pros and cons that I noticed while building this up:

**Pros:**

- **No limitation on Gems** (custom Ruby plugins are also possible), since we will create a custom VSTS build pipeline.
- **Custom domains with HTTPS** support (for free).
- You can use a **private Git repository** (also for free).

**Cons:**

- Compared to GitHub Pages, you need to **setup the CD pipeline** in VSTS.
- The **build and release time is slower** since the VSTS Agent must install everything everytime.
  - That setup time is not needed on GitHub; they probably reuse already configured "agents".
  - This is the downside of flexibility.
- To be fair, at some point it **may cost some money**; if you get a lot of trafic, use a lot of storage or use too much VSTS build time. As of today:
  - You have 240 minutes per month of free VSTS build time. You also have 5 free users with unlimited private Git repositories. See [Visual Studio Team Services pricing](https://azure.microsoft.com/en-us/pricing/details/visual-studio-team-services/) for more information.
  - General Purpose v2 (Blob storage) cost US $0.0208 per GB, per month, plus the transfer cost which is also ridiculously low. See [Block Blob pricing](https://azure.microsoft.com/en-us/pricing/details/storage/blobs/) for more information.
  - The CDN cost is also super low, starting at US $0.087 per GB, per month. See [Content Delivery Network pricing](https://azure.microsoft.com/en-us/pricing/details/cdn/) for more information.

All that being said, at the end of this article, you will endup with a serverless, geodistributed website fueled by a continuous delivery pipeline from 0.00$ to a few cents per month. That is prety awsome in my opinion!

## Prerequisite

In this article, I will assume that readers knows:

- Git basics like clone, commit and push.
- How to use a terminal or the [VS Code](https://code.visualstudio.com/download) integrated terminal.
- Have an Azure account (trial or not) or be willing to create one.
- ...

## ...

Microsoft showcased a way to host static websites with Azure Blob Storage during Build 2018 and, as of today, it is in preview in some datacenters.
We will combine that offering with the power of Azure CDN, VSTS and Git to create a free hosting for our static Jekyll website similar to GitHub Pages.
