---
title:  "How to deploy a Jekyll website in Azure blob storage hosted by Azure static website using a VSTS CD pipeline"
# subtitle: "Design Pattern"
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

In this article we will create a continuous deployment (CD) pipeline using Visual Studio Team Services (VSTS) to deploy a Jekyll website to Azure.

We will use Azure Blob Storage to store the files in the cloud, a CDN to deliver those files using a custom domain that support HTTPS (for free), and the `Static Website` option of Azure Storage to configure a default page (index.html) and an error page (404 Not Found).

In my humble opinion, Azure Storage is a great, cost effective, cloud storage offering from Microsoft (and no they dont pay me to say that). For example, the images of this very blog are delivered using a CDN and stored in Blob Storage on Azure.<!--more-->

Here is a diagram that explains the whole idea:

![How to deploy a Jekyll website in Azure blob storage hosted by Azure static website using a VSTS CD pipeline diagram](//cdn.forevolve.com/blog/images/2018/VSTS-jekyll-git-vsts-azure-flow.png)

> At the day of the writing, the `Static Website` option is in `Preview`.

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

In this article, I will assume that reader knows:

- Git basics like clone, commit and push.
- How to use a terminal or the [VS Code](https://code.visualstudio.com/download) integrated terminal.
- Have an Azure account (trial or not) or be willing to create one.
- ...

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

## Step 4: Create Azure resources

Lets recap: we have a Jekyll website saved in Git, in VSTS, with a automated build that starts automatically each time someone pushes code to the `master` branch.

From there we need to deploy our website in the cloud!
But before that, we need to create those resources and to do so, we will use the Azure portal.

_If you dont have an Azure account, you can start a free trial there: [https://azure.microsoft.com/en-us/free/](https://azure.microsoft.com/en-us/free/)._

So let's head to [https://portal.azure.com/](https://portal.azure.com/).

### 4.1 Create a resource group

Resource groups are a good way to keep your resources organized. I named mine `JekyllOnAzure`.

![Create a new resource group](//cdn.forevolve.com/blog/images/2018/Azure-new-resource-group.png)

### 4.2 Create Storage Account

We need a blob storage to store our files in the cloud, so from our resource group:

- Click `Create resource`.
- Search for `storage`
- Select `Storage account - blob, file, table, queue`
- Click `Create`

![New Storage account - blob, file, table, queue](//cdn.forevolve.com/blog/images/2018/Azure-new-storage-account-blob-file-table-queue.png)

In the `Create storage account` blade, make sure you:

- Select `StorageV2 (general purpose v2)`
- Choose an adequate replication strategy for your website (I will choose `LRS` for this demo since I dont need redondancy; it is only a demo after all).
- Choose the right performance option (standard should be fine for most website).
- Choose your previously created resource group

You can also enable `Secure transfer required` if you want to force HTTPS (this can be changed later). I recommend that you activate that at some point.

![New Storage account - blob, file, table, queue](//cdn.forevolve.com/blog/images/2018/Azure-new-storage-account-blob-file-table-queue-options.png)

Once Azure completes the creation of your Storage account, navigate to your new resource.

### 4.3 Setup Storage Account

From your storage account:

1.  Click on `Static website (preview)`
1.  Click `Enable`
1.  Enter `index.html` as the `Index document name`
1.  Enter `404.html` as the `Error document path` (the file is created by `Jekyll new`)
1.  Click `Save`

![Enable Azure Storage static website](//cdn.forevolve.com/blog/images/2018/Azure-storage-enable-static-website.png)

_Note that, as of this writing, not all regions supports the `static website (preview)` option._

At this point, Azure created a `$web` container in the Storage Account and we will deploy our files in there.

### Testing the setup

Using [Azure Storage Explorer](https://azure.microsoft.com/en-ca/features/storage-explorer/) or the `Storage Explorer (preview)` blade, in the `$web` blob container, we will upload an `index.html` file to test this out.

Here is the code of the `index.html` page I uploaded:

```html
<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Test page</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
</head>

<body>
    <h1>WOOT!</h1>
    <p>It is working...</p>
</body>

</html>
```

Navigate to your `Primary endpoint` (you can find this in the `Static website (preview)` blade) and voilà, I see my test page:

![Azure static website test page with Edge](//cdn.forevolve.com/blog/images/2018/Azure-static-website-test-page-edge.png)

## Step 5: The VSTS Release Pipeline

Now that we have a Blob Storage container setup for static website delivery, we need to deploy our Jekyll website there.

---

If you want to deploy your site manually, you can always use the VS Code [Azure Storage](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurestorage) extension that add the `Deploy to static website` option to the file explorer's context menu.

![VS Code - Azure Storage Extensions - Deploy to static website](//cdn.forevolve.com/blog/images/2018/VSCode-deploy-to-static-website.png)

---

<figure style="float:right">
    <img src="//cdn.forevolve.com/blog/images/2018/VSTS-preview-features.png" alt="VSTS turn on and off preview features">
    <figcaption>You can turn on an off VSTS preview features from your user menu.</figcaption>
</figure>

However, since we prefer the DevOps way of automating things, we will head back to VSTS to create a `Release` definition to deploy our previously created `Build` instead.

_Once again, I activated the Release preview so your UI may differ a little, What can I say? I like new stuff!_

### 5.1 Create a Release definition

From VSTS:

1.  Click on `Release`
1.  Click on `Create release definition`
    ![Create a new VSTS release definition](//cdn.forevolve.com/blog/images/2018/VSTS-release-create-new.png)
1.  Select `Empty pipeline`
    ![Select an empty VSTS release pipeline](//cdn.forevolve.com/blog/images/2018/VSTS-release-empty-pipeline.png)

### 5.2 Add artifacts

From your empty release definition, choose the artifacts from the build definition created earlier (mine is named `JekyllOnAzure-CI`), then click `Add`.

![Add artifacts to a VSTS release definition](//cdn.forevolve.com/blog/images/2018/VSTS-release-add-artifacts-buttons.png)

![Choose build artifacts for a VSTS release definition](//cdn.forevolve.com/blog/images/2018/VSTS-release-choose-build-artifacts.png)

### 5.3 Configure the deployment

We want to achieve 2 things here:

1.  Delete old files (from Blob storage)
1.  Upload new files (from build artifacts to blob storage)

Click on the `1 phase, 0 task` link, under `Environement 1` (or click the `Tasks` tab) to open the tasks panel.

![Open the VSTS release definition tasks](//cdn.forevolve.com/blog/images/2018/VSTS-release-open-tasks.png)

As you can see, this pane in very similar to build definitions.
To achieve our goal:

1.  Click the `+` icon
1.  Search for `cli`
1.  Add 2 `Azure CLI` tasks

![Add Azure CLI tasks to a VSTS release definition](//cdn.forevolve.com/blog/images/2018/VSTS-release-add-task-azure-cli.png)

#### Link an Azure subscription

When you click on first Azure CLI task, you should see that many settings are required.
The first one is `Azure Subscription`.
You can create that setting at the project level by following the `Manage` link.
This is what we will do.

> Why? This allows you to "name a reusable connection to Azure"; which feels more explicit to me.

![Manage Azure Subscription from an Azure CLI task](//cdn.forevolve.com/blog/images/2018/VSTS-release-azure-cli-manage-sub.png)

From the `Service endpoints` page :

1.  Add a `New Service Endpoint`
1.  Select `Azure Resource Manager`
    ![Add an Azure Resource Manager endpoint from VSTS](//cdn.forevolve.com/blog/images/2018/VSTS-add-azure-resource-manager-endpoint.png)
1.  Write a name for that connection (I choose `Jekyll on Azure resource group`)
1.  Choose your subscription
1.  Choose your resource group
1.  Click `OK`

#### Configure Task 1: Delete old files

Our first task is to clean up old files.
To do this, select the first Azure CLI task.

![Delete Azure Blob files from VSTS release definition using Azure CLI](//cdn.forevolve.com/blog/images/2018/VSTS-release-azure-cli-delete-blob-files.png)

- Display name: `Delete old files`
- Azure subscription: `Jekyll on Azure resource group` (choose the one you just created)
- Script location: `Inline Scripts`
- Inline Script: `az storage blob delete-batch --source $(containerName) --account-name $(storageAccount) --account-key $(storageKey) --output table`
- Working Directory: select the artifact name. Mine is `$(System.DefaultWorkingDirectory)/_JekyllOnAzure-CI`. Do not select the `_site` subdirectory.

> As you may have noticed, I used variables in the script. We will set those later.

#### Configure Task 2: Upload new files

Now that we cleaned old files, we want to upload our artifacts.
Select the second Azure CLI task and do the same thing.

![Upload build artifacts to Azure blob storage from VSTS release definition using Azure CLI](//cdn.forevolve.com/blog/images/2018/VSTS-release-azure-cli-upload-artifacts-to-blob-storage.png)

- Display name: `Upload new files`
- Azure subscription: `Jekyll on Azure resource group` (choose the one you just created)
- Script location: `Inline Scripts`
- Inline Script:
  ```
  az storage blob upload-batch --source _site --destination $(containerName) --account-name $(storageAccount) --account-key $(storageKey) --output table --no-progress
  ```
- Working Directory: select the artifact name. Mine is `$(System.DefaultWorkingDirectory)/_JekyllOnAzure-CI`. Do not select the `_site` subdirectory.

> Once again, as you may have noticed, I used variables in the script. We will set those later.

### Give a name to the release definition

It is alway good to give relevant names to the stuff you create, this way you will know what it does when you come back two years later.

I will call mine `Deploy to Azure Blob Storage`.

![Change VSTS release definition name](//cdn.forevolve.com/blog/images/2018/VSTS-change-release-definition-name.png)

### Set the variables

OK, one last thing to do before trying this out.
Navigate to the `Variables` tab and add the following variables:

- Set the `containerName` value to `$web`
- Set the `storageAccount` value to the name of your storage account. Mine was `jekyllonazure`.
- Set the `storageKey` value to one of the Azure Storage Access keys (see below). Then protect this value by clicking the `lock` icon.

![Lock the VSTS variable secret values](//cdn.forevolve.com/blog/images/2018/VSTS-lock-variable-values.png)

> How does this work? The value of the `containerName` variable will replace `$(containerName)` in the Azure CLI scripts.
> So it will execute that command: `az storage blob upload-batch --source _site --destination $web [...]`
>
> You can use variables extensively in VSTS.

#### Find Azure Storage Keys

From your Azure Storage Account, navigate to `Access keys` then copy one of the two keys.
![Locate azure storage keys](//cdn.forevolve.com/blog/images/2018/Azure-storage-keys.png)

> Note: I regenerated both keys so dont try them they will not work.

### Save and test the deployment

Now that everything is complete, lets try this out!

1.  Save the release definition
    ![Save VSTS release definition](//cdn.forevolve.com/blog/images/2018/VSTS-save-release-definition.png)
2.  Create a Release
    ![Create a VSTS release](//cdn.forevolve.com/blog/images/2018/VSTS-create-a-release.png)
3.  Leave all the defaults and click `Create`
4.  Follow the release link
    ![Follow the release link](//cdn.forevolve.com/blog/images/2018/VSTS-follow-release-link.png)
5.  You can click on the `In progress` element to navigate to the release details (to see the progress).
    ![See VSTS release details](//cdn.forevolve.com/blog/images/2018/VSTS-release-details.png)
6.  Wait for the deployment to complete.
    ![VSTS release is completed successfully from the pipeline tab](//cdn.forevolve.com/blog/images/2018/VSTS-release-completed-pipeline.png)
    OR
    ![VSTS release is completed successfully from the logs tab](//cdn.forevolve.com/blog/images/2018/VSTS-release-completed.png)
7.  Navigate back to your primary endpoint (mine was `https://jekyllonazure.z9.web.core.windows.net/`) to test the Jekyll release.

And once more: voilà!

![Azure static website](//cdn.forevolve.com/blog/images/2018/Azure-static-website-jekyll-page-edge.png)

### Configure Continuous Deployment

At this point, we have a continuous integration build and the deployment works; let's configure the release to be deployed automatically after a sucessful build.

To do this, lets start by going back to our release definition then:

1.  Click the artifacts lightning icon
1.  Enable the `Continuous deployment trigger`
1.  Click the `Add` button (to add a branch to react to)
1.  Select the `master` branch (our only branch)
1.  Save the release definition

![VSTS release trigger](//cdn.forevolve.com/blog/images/2018/VSTS-release-trigger.png)

### Testing the Continuous Deployment pipeline

To test the continuous deployment pipeline, make a change in your Jekyll project, commit and push it to VSTS.

> Personally, I added `**EDITED**` at the bottom of te `about.md` page.

Your project should be rebuilt then redeployed.

To see this happen:

1.  Go to the `Builds` page after your pushed your changes.
    ![VSTS build in progress](//cdn.forevolve.com/blog/images/2018/VSTS-build-in-progress.png)
2.  Once the build is completed, go to the `Releases` page and there you should see an in-progress release. *There can be a delay between the end of a build and the beginning of a release. You may need to be patient here.*
    ![VSTS release in progress](//cdn.forevolve.com/blog/images/2018/VSTS-release-in-progress.png)

> Another option is to go grab a drink or something to eat and come back later.

## Step 6: Configuring a CDN

This is the last part, the part where a website goes from "no body will remember the URI" to "this is a real website with a real URI".

## ...

Microsoft showcased a way to host static websites with Azure Blob Storage during Build 2018 and, as of today, it is in preview in some datacenters.
We will combine that offering with the power of Azure CDN, VSTS and Git to create a free hosting for our static Jekyll website similar to GitHub Pages.
