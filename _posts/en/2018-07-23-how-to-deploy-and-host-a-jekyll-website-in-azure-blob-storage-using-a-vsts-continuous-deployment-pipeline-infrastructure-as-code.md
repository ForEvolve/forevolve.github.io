---
title:  "How to deploy and host a Jekyll website in Azure blob storage using a VSTS continuous deployment pipeline"
subtitle: "Infrastructure as code"
date:     2018-07-23 00:00:04 -0500
post-img: "//cdn.forevolve.com/blog/images/articles-header/2018-07-00-jekyll-vsts-azure-v3.jpg"
unsplash-credit: Photo by Jilbert Ebrahimi on Unsplash
lang: en
categories: en/articles
tags: 
- Azure
- VSTS
- DevOps
- Jekyll
- FromCodeToCloud
# proficiency-level: Novice
technology-relative-level:
- { name: VSTS, level: Beginners }
- { name: DevOps, level: Beginners }
---

I've got a good idea from a reader, and I decided to move forward with it: Infrastructure as code.

In this "article" (if I can name it that), I give you the VSTS pipeline code that you can import into your VSTS instance to recreate the pipeline without reading the whole thing (in case you don't want to).

The cool thing about the "infrastructure as code" mindset is the fact that you can manage your infrastructure code as if it was any other code. So you can use Git, VS Code or any other coding tool that you like. It can also facilitate collaboration, and it does facilitate reusability. Deploying an environment become as easy as running the code!

Azure also support the deployment of infrastructure as code. You can create Azure resources using ARM templates. Unfortunately, at the time of this writing, Azure does not support "Static Website (preview)" in the ARM, so I can't give you that code.<!--more-->

{% include jekyll-vsts-azure/toc.md currentIndex=5 %}

## The VSTS pipeline

This is the first version of the pipeline, before we connect the CDN to it:

```
TODO
```

## The VSTS pipeline (including the CDN)

This is the second version of the pipeline, after we connected the CDN to it:

```
TODO
```

## The end

Enjoy these little pieces of code and happy coding!
