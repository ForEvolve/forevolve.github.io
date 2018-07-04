---
title:  "How to deploy and host a Jekyll website in Azure blob storage using a VSTS continuous deployment pipeline"
subtitle: "Step 2: Setup Git in VSTS"
date:     2018-07-11 00:00:00 -0500
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

{% include jekyll-vsts-azure/toc.md currentIndex=3 %}

## Step 2: Setup Git in VSTS

Now that we have a website to deploy, we will create a VSTS project (and a git repo) to sync our code.

If you dont have a VSTS account, you can create one for free there: [Visual Studio Team Services](https://visualstudio.microsoft.com/team-services/)

<aside>
    <header>Notes about VSTS screenshots</header>
    <p>
        All the VSTS screenshots uses the new UI, if you are still using the old one, the main menu is located at the top of the page instead than at its left.
        All options should be very similar.
    </p>
</aside>

### 2.1 Create a VSTS project

In VSTS, create a new project. I named mine `JekyllOnAzure`.

![Create a VSTS project](//cdn.forevolve.com/blog/images/2018/VSTS-create-project.png)

### 2.2 Push code to VSTS

Once the project is created, we need to push our Jekyll code to VSTS.
In the new UI, after creating the project, you should be redirected to a "project summary" page that contains your repository link.

![Git repository uri from project summary section](//cdn.forevolve.com/blog/images/2018/VSTS-git-repo-uri.png)

If not, that same link is available in the "Code" section of your project.
There is also the git commands to push your repo there; so lets do that.

![Git repository uri from Code section](//cdn.forevolve.com/blog/images/2018/VSTS-git-repo-code.png)

Once pushed, VSTS should contain your code (after a refresh).

![Initial commit pushed to VSTS](//cdn.forevolve.com/blog/images/2018/VSTS-initial-commit-pushed.png)

<aside>
    <header>Having troubles with credentials?</header>
    <figure>
        <blockquote>
            Before pushing your code, set up authentication with
            <a href="https://docs.microsoft.com/en-us/vsts/git/set-up-credential-managers?view=vsts">credential managers</a>
            or
            <a href="https://docs.microsoft.com/en-us/vsts/git/use-ssh-keys-to-authenticate?view=vsts">SSH</a>
            before continuing.
        </blockquote>
        <figcaption>
            See
            <a href="https://docs.microsoft.com/en-us/vsts/git/share-your-code-in-git-cmdline?view=vsts#push-your-code">
                <cite>Get started with Git from the command line</cite> - Push your code
            </a>
        </figcaption>
    </figure>
</aside>

{% include jekyll-vsts-azure/next.md nextIndex=3 %}
