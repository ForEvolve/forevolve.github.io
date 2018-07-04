---
title:  "How to deploy a Jekyll website in Azure blob storage hosted by Azure static website using a VSTS continuous deployment pipeline"
subtitle: "Step 3: The VSTS Build Pipeline"
date:     2018-07-12 00:00:00 -0500
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

{% include jekyll-vsts-azure/toc.md currentIndex=4 %}

## Step 3: The VSTS Build Pipeline

Now that we have some Git repository containing Jekyll code, we need to create a `Build definition`.

![Create a new VSTS build definition](//cdn.forevolve.com/blog/images/2018/VSTS-new-build-definition.png)

Then select a source: your VSTS Git repository.

![Select your repository](//cdn.forevolve.com/blog/images/2018/VSTS-create-build-1-source.png)

Then start with an `Empty process`.

![Choose a template](//cdn.forevolve.com/blog/images/2018/VSTS-create-build-2-empty-process.png)

Then from there we will add a few tasks. To add a task click the `+` button, next to the phase.

![Add task](//cdn.forevolve.com/blog/images/2018/VSTS-create-build-3-add-task.png)

### Add build tasks

Since we know exactly what we want to do, we will add all build tasks then we will configure them later once by one. This will save us some time. Productivity is always important!

#### Add Task 1: Ruby

Since we need Ruby, lets start by adding that. A good way to find what you are looking for is to use the search box.

![Add a Ruby version build task](//cdn.forevolve.com/blog/images/2018/VSTS-create-build-4-task-ruby.png)

#### Add Task 2, 3 and 4: Command Line

We need to execute 3 commands here:

1.  Install Jekyll and bundler
1.  Install Gems
1.  Build the Jekyll website

> We could use only one "Command Line" task here, but I prefer to split the commands in three specific task instead; I find it clearer this way (you will see).

Back to business: click 3 times on the "Add" button to add 3 `Command Line` task.

![Add three command line build task](//cdn.forevolve.com/blog/images/2018/VSTS-create-build-5-task-command-line.png)

#### Add Task 5: Copy Files

Next we want to copy the Jekyll output to the staging directory.
To do so, we will use the `Copy Files` task.

![Add a Copy Files build task](//cdn.forevolve.com/blog/images/2018/VSTS-create-build-6-task-copy-files.png)

#### Add Task 6: Publish Build Artifacts

Finally, we want to puslish the artifact that we copied with the previous task; to do so, we want to add a `Publish Build Artifacts` task.

![Add a Publish Build Artifacts build task](//cdn.forevolve.com/blog/images/2018/VSTS-create-build-7-publish-build-artifacts.png)

### Configure build tasks

Before going further, make sure that uour build pipeline looks like this:

![Unconfigured Build pipeline](//cdn.forevolve.com/blog/images/2018/VSTS-create-build-8-all-tasks.png)

Now that the pipeline is set, we will configure it task by task.

#### Configure Task 1: Ruby

You can leave the Ruby task as is, no need to change anything.

#### Configure Task 2: Install Jekyll and bundler

Like for code, I believe that it is important to give a relevant name to your tasks.

![Configure Task 2: Install Jekyll and bundler](//cdn.forevolve.com/blog/images/2018/VSTS-configure-task-2.png)

- Display name: `Install Jekyll and bundler`
- Script: `gem install jekyll bundler`

#### Configure Task 3: Install Gems

![Configure Task 3: Install Gems](//cdn.forevolve.com/blog/images/2018/VSTS-configure-task-3.png)

- Display name: `Install Gems`
- Script: `bundle install`

#### Configure Task 4: Build the Jekyll website

![Configure Task 4: Build the Jekyll website](//cdn.forevolve.com/blog/images/2018/VSTS-configure-task-4.png)

- Display name: `Build`
- Script: `bundle exec jekyll build`

#### Configure Task 5: Copy Files

For this one, we want the `_site` directory (where Jekyll generate the static website) to be copied to the `$(build.artifactstagingdirectory)` (where we will get them to publish them with the next task).

![Configure Task 5: Copy Files](//cdn.forevolve.com/blog/images/2018/VSTS-configure-task-5.png)

- Display name: `Copy "_site" to staging directory`
- Source Folder: `_site`
- Target Folder: `$(build.artifactstagingdirectory)`

#### Configure Task 6: Publish Build Artifacts

Finally, we want to publish the website as an artifact (that we will use later). To be more consice, lets name the artifact `_site` instead of `drop`.

![Configure Task 6: Publish Build Artifacts](//cdn.forevolve.com/blog/images/2018/VSTS-configure-task-6.png)

- Artifact name: `_site`

### Save and run the build

At this point, everything is set, so let save and run the build just to make sure.

![Save and queue VSTS build](//cdn.forevolve.com/blog/images/2018/VSTS-save-and-queue-build.png)

Then keep the default values.

![Save and queue VSTS build](//cdn.forevolve.com/blog/images/2018/VSTS-save-and-queue-build-2.png)

Once the UI update, click on the build number and you should see the build start.

![VSTS build started](//cdn.forevolve.com/blog/images/2018/VSTS-build-started.gif)

And the build succeeded!

![VSTS build succeeded](//cdn.forevolve.com/blog/images/2018/VSTS-build-succeeded.png)

From there you should be able to download the build artifacts.

![Download VSTS build artifacts](//cdn.forevolve.com/blog/images/2018/VSTS-download-build-artifacts.png)

### Configure Continuous Integration

No that we know that our build work, the last piece is to set the build to trigger automatically everytime that someone pushes code to `master`.
You can also set some policies that forces users to create branches and pull requests and all that good stuff, but for this article, I will keep it simple.

Lets go back to our build definition by clicking the `Edit pipeline` button.

![Click edit pipeline](//cdn.forevolve.com/blog/images/2018/VSTS-build-edit-pipeline.png)

Then go to `Triggers` to check `Enable continuous integration`.

![Enable continuous integration](//cdn.forevolve.com/blog/images/2018/VSTS-build-enable-continuous-integration.png)

Save the build definition.

{% include jekyll-vsts-azure/next.md nextIndex=4 %}
