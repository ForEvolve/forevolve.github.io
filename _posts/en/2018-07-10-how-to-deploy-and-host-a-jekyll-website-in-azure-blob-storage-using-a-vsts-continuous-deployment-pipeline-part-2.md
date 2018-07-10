---
title:  "How to deploy and host a Jekyll website in Azure blob storage using a VSTS continuous deployment pipeline"
subtitle: "Part 1: The VSTS Build Pipeline"
date:     2018-07-10 00:00:01 -0500
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
- { name: Azure, level: Beginners }
- { name: VSTS, level: Beginners }
- { name: DevOps, level: Beginners }
- { name: Jekyll, level: Intermediate }
- { name: Git, level: Intermediate }
---

Now the fun begins, we have a website to deploy, a VSTS project and a Git repository.
It is time to start that continuous deployment pipeline we want to build!<!--more-->

{% include jekyll-vsts-azure/toc.md currentIndex=1 %}

The first thing that we need is to create a `Build definition`.

![Create a new VSTS build definition](//cdn.forevolve.com/blog/images/2018/VSTS-new-build-definition.png)

Then select a source: choose your VSTS Git repository.

![Select your repository](//cdn.forevolve.com/blog/images/2018/VSTS-create-build-1-source.png)

Then start with an `Empty process`.

![Choose a template](//cdn.forevolve.com/blog/images/2018/VSTS-create-build-2-empty-process.png)

From there we need to add a few tasks. Each task are executed in order during the build (or release) process.

To add a task click the `+` button, next to the phase.

![Add task](//cdn.forevolve.com/blog/images/2018/VSTS-create-build-3-add-task.png)

## Add build tasks

Since we know what we want to do, we can add all build tasks then we can configure them later one by one. This will save us some time. Productivity is always important!

### Add Task 1: Ruby

Since we need Ruby, let's start by adding that.

> An excellent way to find what you are looking for is to use the search box.

![Add a Ruby version build task](//cdn.forevolve.com/blog/images/2018/VSTS-create-build-4-task-ruby.png)

### Add Task 2, 3 and 4: Command Line

We need to execute 3 commands:

1.  Install Jekyll and bundler
1.  Install Gems
1.  Build the Jekyll website

As you may have noticed, we are replaying the steps that we did to install Jekyll and to build the website locally. But instead of `serve`, we will `build` it.

> We could use only one "Command Line" task here, but I prefer to split the commands in three tasks instead; I find it clearer this way (you will see).

Back to business: click 3 times on the "Add" button to add 3 `Command Line` task.

![Add three command line build task](//cdn.forevolve.com/blog/images/2018/VSTS-create-build-5-task-command-line.png)

### Add Task 5: Copy Files

Next, we want to copy the Jekyll output to the staging directory.
To do so, use the `Copy Files` task.

![Add a Copy Files build task](//cdn.forevolve.com/blog/images/2018/VSTS-create-build-6-task-copy-files.png)

### Add Task 6: Publish Build Artifacts

Finally, we want to publish the artifact that we copied with the previous task; to do so, add a `Publish Build Artifacts` task.

![Add a Publish Build Artifacts build task](//cdn.forevolve.com/blog/images/2018/VSTS-create-build-7-publish-build-artifacts.png)

## Configure build tasks

Now that the pipeline is initialized, we can configure it task by task; but, before going further, make sure that your build pipeline looks like this:

![Unconfigured Build pipeline](//cdn.forevolve.com/blog/images/2018/VSTS-create-build-8-all-tasks.png)

### Configure Task 1: Ruby

You can leave the Ruby task as is, no need to change anything.

### Configure Task 2: Install Jekyll and bundler

I believe it is essential to give a relevant name to your tasks, so you and others know what they do by reading their name.

![Configure Task 2: Install Jekyll and bundler](//cdn.forevolve.com/blog/images/2018/VSTS-configure-task-2.png)

- Display name: `Install Jekyll and bundler`
- Script: `gem install jekyll bundler`

### Configure Task 3: Install Gems

![Configure Task 3: Install Gems](//cdn.forevolve.com/blog/images/2018/VSTS-configure-task-3.png)

- Display name: `Install Gems`
- Script: `bundle install`

### Configure Task 4: Build the Jekyll website

![Configure Task 4: Build the Jekyll website](//cdn.forevolve.com/blog/images/2018/VSTS-configure-task-4.png)

- Display name: `Build`
- Script: `bundle exec jekyll build`

### Configure Task 5: Copy Files

For this one, we want the `_site` directory (where Jekyll generate the static website) to be copied to the `$(build.artifactstagingdirectory)`.

> We will use that directory in the next task to publish the files. Those files will then be accessible from the "build artifacts".

![Configure Task 5: Copy Files](//cdn.forevolve.com/blog/images/2018/VSTS-configure-task-5.png)

- Display name: `Copy "_site" to staging directory`
- Source Folder: `_site`
- Target Folder: `$(build.artifactstagingdirectory)`

### Configure Task 6: Publish Build Artifacts

Finally, we want to publish the website as an artifact (that we will use later; during the release). To be more concise, let's name the artifact `_site` instead of `drop`.

![Configure Task 6: Publish Build Artifacts](//cdn.forevolve.com/blog/images/2018/VSTS-configure-task-6.png)

- Artifact name: `_site`

By looking at the build definition (from the above screenshot), it is easy to know what each task do, only by reading their name.
This was my exact point when I talked about naming your tasks right.

## Save and run the build

At this point, our build definition is completed. So let's save and run it to make sure it is indeed working as expected.

> I believe that it is essential to quickly test every building block of what you are developing (could be a program, a CD pipeline or something else; it doesn't matter).
> If you wait too long before testing, you will first need to find what part is generating the problem before diagnosing and fixing it!
> You better limit the area you want to test to a minimum.

![Save and queue VSTS build](//cdn.forevolve.com/blog/images/2018/VSTS-save-and-queue-build.png)

Then keep the default values and hit `Save & queue`.

![Save and queue VSTS build](//cdn.forevolve.com/blog/images/2018/VSTS-save-and-queue-build-2.png)

Once the UI update, click on the build number, this will redirect you to the build details view.

![VSTS build started](//cdn.forevolve.com/blog/images/2018/VSTS-follow-build-link.png)

Form there, you should see the build start.

![VSTS build started](//cdn.forevolve.com/blog/images/2018/VSTS-build-started.gif)

And the build succeeded!

![VSTS build succeeded](//cdn.forevolve.com/blog/images/2018/VSTS-build-succeeded.png)

> As you can probably imagine from this last screenshot, splitting one bigger script into multiple smaller tasks (and giving them proper names) can help you diagnostic build problems and help follow the build progression.

From this page, you should be able to download the build artifacts, if you want to make sure the artifacts published are what we expect them to be.

![Download VSTS build artifacts](//cdn.forevolve.com/blog/images/2018/VSTS-download-build-artifacts.png)

## Configure Continuous Integration

Now that we know that our build works, the last piece is to set the build to trigger automatically every time someone pushes code to `master`.

> You can also set policies that force users to create branches and pull requests and all that good stuff, but for this article, let's keep it simple.

To edit to the build definition click the `Edit pipeline` button.

![Click edit pipeline](//cdn.forevolve.com/blog/images/2018/VSTS-build-edit-pipeline.png)

Then navigate to the `Triggers` tab and check `Enable continuous integration`.

![Enable continuous integration](//cdn.forevolve.com/blog/images/2018/VSTS-build-enable-continuous-integration.png)

Save the build definition, and voilà, each `push` will now queue a new build!

> You can push some changes if you want to try it out!

{% include jekyll-vsts-azure/next.md nextIndex=2 %}
