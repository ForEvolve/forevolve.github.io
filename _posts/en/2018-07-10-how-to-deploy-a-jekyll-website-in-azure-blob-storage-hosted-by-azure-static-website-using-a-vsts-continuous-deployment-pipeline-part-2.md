---
title:  "How to deploy a Jekyll website in Azure blob storage hosted by Azure static website using a VSTS continuous deployment pipeline"
subtitle: "Step 1: Jekyll"
date:     2018-07-10 00:00:00 -0500
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

...<!--more-->

{% include jekyll-vsts-azure/toc.md %}

## Step 1: Jekyll

First of all, you will need to create a [Jekyll](https://jekyllrb.com/) website. This step could be substituated by any static website or sitebuilder. Maybe in the future I will even try to go full [Blazor](https://github.com/aspnet/Blazor) on Azure, who knows!

<aside>
    <header>Setup Ruby and Jekyll using Ubuntu on Windows 10</header>
    <section>
        <p>How to setup Jekyll is not the focus of this article, but here is how I do it:</p>
        <ol>
            <li>On Windows 10, I install Ubuntu (see the Windows Store).</li>
            <li>
                Then I open a bash terminal and follow the official
                <a href="https://jekyllrb.com/docs/installation/#ubuntu">Install on Ubuntu Linux</a>
                instruction from the Jekyll website.
                <i>Non-Microsoft things tend to be easier to install using bash!</i>
            </li>
        </ol>
    </section>
</aside>

Now to create a Jekyll website, you can follow the official [Quick-start guide](https://jekyllrb.com/docs/quickstart/) or simply:

1.  Create directory (I will call mine `JekyllOnAzure`)
1.  Initialize a Git repository
1.  Open a terminal (or open the folder in VS Code and use the integrated terminal) and type `bash` to start a bash session (if your terminal is not already bash)
1.  Type `jekyll new .`
1.  Commit you changes

And voilà! You got yourself a new empty Jekyll website.

From here, you can use another theme, add some plugins, etc.
