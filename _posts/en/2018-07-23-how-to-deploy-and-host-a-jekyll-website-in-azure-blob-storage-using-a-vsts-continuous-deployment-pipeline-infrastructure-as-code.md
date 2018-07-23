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

In this "article" (if I can name it that), I give you the YAML code that you can use to automatically create the build definition by adding a `.vsts-ci.yml` file to your Jekyll website.

The cool thing about the "infrastructure as code" mindset is the fact that you can manage your infrastructure as if it was any other code. So you can use Git, VS Code or any other coding tool you like. It can also facilitate collaboration, and it does facilitate reusability (and in our case: sharing).

Unfortunately, only the build definition can be shared this way right now.
However, Azure does support the deployment of infrastructure as code.
You can create Azure resources using ARM templates.
Sadly, at the time of this writing, Azure does not support "Static Website (preview)" in the ARM, so I can't give you that code.<!--more-->

{% include jekyll-vsts-azure/toc.md currentIndex=5 %}

## The VSTS pipeline

Before going further, please make sure you activated the YAML preview feature.

Feel free to follow that link for more information about [How to use YAML builds](https://docs.microsoft.com/en-us/vsts/pipelines/build/yaml?view=vsts).

### Build definition

{% include jekyll-vsts-azure/yaml-build-definition.md %}

### Release definition

{% assign releaseArticle = site.data.jekyll-vsts-azure-nav[3] %}

You cannot use YAML for releases, and you'd need to apply some manual changes to the exported JSON, so I decided not to include it here. You will have to build the release definition yourself by following the steps described in [{{ releaseArticle.title }}]({{ releaseArticle.url }})

{% include jekyll-vsts-azure/next.md nextIndex=2 continueText="While I hope you enjoyed this little piece of code, now that the build definition is created (and automated), it is time to go back to the original series, to the article: " %}
