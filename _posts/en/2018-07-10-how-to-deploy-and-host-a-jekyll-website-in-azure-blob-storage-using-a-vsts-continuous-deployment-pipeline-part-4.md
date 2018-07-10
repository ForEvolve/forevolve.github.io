---
title:  "How to deploy and host a Jekyll website in Azure blob storage using a VSTS continuous deployment pipeline"
subtitle: "Part 3: The VSTS Release"
date:     2018-07-10 00:00:04 -0500
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

Now that we have a Blob Storage container set up for static website delivery, we need to deploy our Jekyll website there.<!--more-->

---

If you want to deploy your website manually, you can always use the Visual Studio Code [Azure Storage](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurestorage) extension that adds the `Deploy to static website` option to the file explorer's context menu (follow the marketplace instructions to enable this preview feature).

![VS Code - Azure Storage Extensions - Deploy to static website](//cdn.forevolve.com/blog/images/2018/VSCode-deploy-to-static-website.png)

---

<figure style="float:right; margin-left: 15px;">
    <img src="//cdn.forevolve.com/blog/images/2018/VSTS-preview-features.png" alt="VSTS turn on and off preview features">
    <figcaption>You can turn on an off VSTS preview features from your user menu.</figcaption>
</figure>

Since we prefer the DevOps way of automating things, let's instead head back to VSTS to create a `Release` definition to deploy our previously created `Build`.

_Once again, I activated the VSTS Release UI preview so your UI may differ a little, What can I say? I like new stuff!_

<br style="clear:right;" />

{% include jekyll-vsts-azure/toc.md currentIndex=3 %}

## Create a Release definition

In VSTS, a `Release` is used to deploy builds.
You can do a lot more than that, but that's it base role.

To create one, in VSTS:

1.  Click on `Release`
1.  Click on `Create release definition`
    ![Create a new VSTS release definition](//cdn.forevolve.com/blog/images/2018/VSTS-release-create-new.png)
1.  Select `Empty pipeline`
    ![Select an empty VSTS release pipeline](//cdn.forevolve.com/blog/images/2018/VSTS-release-empty-pipeline.png)

## Add artifacts

From your empty release definition, choose the artifacts from the build definition created earlier (mine is named `JekyllOnAzure-CI`), then click `Add`.

![Add artifacts to a VSTS release definition](//cdn.forevolve.com/blog/images/2018/VSTS-release-add-artifacts-buttons.png)

![Choose build artifacts for a VSTS release definition](//cdn.forevolve.com/blog/images/2018/VSTS-release-choose-build-artifacts.png)

## Configure the deployment

We want to achieve 2 things here:

1.  Delete old files (from blob storage)
1.  Upload new files (from build artifacts to blob storage)

Click on the `1 phase, 0 task` link, under `Environment 1` (or click the `Tasks` tab) to open the tasks panel.

![Open the VSTS release definition tasks](//cdn.forevolve.com/blog/images/2018/VSTS-release-open-tasks.png)

As you can see, this pane in very similar to build definitions.
To achieve our goal:

1.  Click the `+` icon
1.  Search for `cli`
1.  Add 2 `Azure CLI` tasks

![Add Azure CLI tasks to a VSTS release definition](//cdn.forevolve.com/blog/images/2018/VSTS-release-add-task-azure-cli.png)

### Link an Azure subscription

When you click on the first Azure CLI task, you should see that many settings are required.
The first one is `Azure Subscription`.

In VSTS, you can create a preset for that setting at the project level by following the `Manage` link, which is the solution I chose.

> Why? It allows you to "name a reusable connection to Azure"; which feels more explicit to me, especially when you have access to multiple Azure subscriptions.

![Manage Azure Subscription from an Azure CLI task](//cdn.forevolve.com/blog/images/2018/VSTS-release-azure-cli-manage-sub.png)

From the `Service endpoints` page :

1.  Add a `New Service Endpoint`
1.  Select `Azure Resource Manager`
    ![Add an Azure Resource Manager endpoint from VSTS](//cdn.forevolve.com/blog/images/2018/VSTS-add-azure-resource-manager-endpoint.png)
1.  Write a name for that connection (I chose `Jekyll on Azure resource group`)
1.  Choose your subscription
1.  Choose your resource group
1.  Click `OK`

### Configure Task 1: Delete old files

Our first task is to clean up old files.
To do this, select the first Azure CLI task.

![Delete Azure Blob files from VSTS release definition using Azure CLI](//cdn.forevolve.com/blog/images/2018/VSTS-release-azure-cli-delete-blob-files.png)

- Display name: `Delete old files`
- Azure subscription: `Jekyll on Azure resource group` (choose the one you just created)
- Script location: `Inline Scripts`
- Inline Script: `az storage blob delete-batch --source $(containerName) --account-name $(storageAccount) --account-key $(storageKey) --output table`
- Working Directory: select the artifact name. Mine is `$(System.DefaultWorkingDirectory)/_JekyllOnAzure-CI`.
  <br><small><strong>Do not</strong> select the `_site` subdirectory.</small>

> As you may have noticed, I used `$(...)` variables in the script. We will set those later.

### Configure Task 2: Upload new files

Now that we cleaned the old files, let's upload our artifacts.

Select the second Azure CLI task and do the same thing.

![Upload build artifacts to Azure blob storage from VSTS release definition using Azure CLI](//cdn.forevolve.com/blog/images/2018/VSTS-release-azure-cli-upload-artifacts-to-blob-storage.png)

- Display name: `Upload new files`
- Azure subscription: `Jekyll on Azure resource group` (choose the one you just created)
- Script location: `Inline Scripts`
- Inline Script:
  ```
  az storage blob upload-batch --source _site --destination $(containerName) --account-name $(storageAccount) --account-key $(storageKey) --output table --no-progress
  ```
- Working Directory: select the artifact name. Mine is `$(System.DefaultWorkingDirectory)/_JekyllOnAzure-CI`.
  <br><small><strong>Do not</strong> select the `_site` subdirectory.</small>

> Once again, as you may have noticed, I used variables in the script. We will set those later.

## Give a name to the release definition

It is important to give accurate names to the stuff you create, this way you can remember what it does when you come back two years later.

> I called mine `Deploy to Azure Blob Storage`.

![Change VSTS release definition name](//cdn.forevolve.com/blog/images/2018/VSTS-change-release-definition-name.png)

## Set the variables

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

### Find Azure Storage Keys

From your Azure Storage Account, navigate to `Access keys` then copy one of the two keys.
![Locate azure storage keys](//cdn.forevolve.com/blog/images/2018/Azure-storage-keys.png)

> Note: I regenerated both keys so don't waste your time trying them, they don't work anymore.

## Save and test the deployment

Now that everything is complete, let's try this out!

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
    OR (if you are in the details view)
    ![VSTS release is completed successfully from the logs tab](//cdn.forevolve.com/blog/images/2018/VSTS-release-completed.png)
7.  Navigate back to your primary endpoint (mine was `https://jekyllonazure.z9.web.core.windows.net/`) to test the Jekyll release.

And once more: voilà!

![Azure static website](//cdn.forevolve.com/blog/images/2018/Azure-static-website-jekyll-page-edge.png)

## Configure Continuous Deployment

At this point, we have a continuous integration build and the deployment works; let's configure the release to be deployed automatically after a successful build.

To accomplish this, let's start by going back to our release definition then:

1.  Click the artifacts lightning icon
1.  Enable the `Continuous deployment trigger`
1.  Click the `Add` button (to add a branch to react to)
1.  Select the `master` branch (our only branch)
1.  Save the release definition

![VSTS release trigger](//cdn.forevolve.com/blog/images/2018/VSTS-release-trigger.png)

> The filters are not required.
> However, I believe it is a good idea to limit the deployment to production to one or more explicitly defined branch(es).
> This could avoid unexpected behaviors and unplanned deployment of unstable releases to production.

## Testing the Continuous Deployment pipeline

To test the continuous deployment pipeline, make a change in your Jekyll project, commit and push it to VSTS.

> Personally, I added `**EDITED**` at the bottom of the `about.md` page.

Your project should be rebuilt then redeployed.

To see this happen:

1.  Go to the `Builds` page after your pushed your changes.
    ![VSTS build in progress](//cdn.forevolve.com/blog/images/2018/VSTS-build-in-progress.png)
2.  Once the build is completed, go to the `Releases` page, and there you should see an in-progress release. *Please note that there can be a delay between the end of a build and the beginning of a release. You may need to be patient here.*
    ![VSTS release in progress](//cdn.forevolve.com/blog/images/2018/VSTS-release-in-progress.png)

> Another option is to grab a drink or something to eat and come back later (or work on something else for a few minutes).

## A note about deleting files.

> This delivery pipeline is very basic, if we'd want, instead of deleting all files before uploading the new ones, we could begin by uploading the new files to then delete unwanted files from the destination (if any).
> We could also only upload new files and leave the old unused one there (depending on your website's content of course).
>
> Nevertheless, in the end, once the CDN is connected to the site, deleting all blobs should not shut down the website, the CDN should have them pre-loaded and use its own file cache to serves them to your visitors.
>
> If for some reason a downtime does occur or if you don't want to take that risk, I see the following few possible solutions.
> <small>A possible cause for this would be if you update your site more frequently than the time it takes the CDN to pre-load the site's assets. A.K.A. the time it takes for all of your resources to be viewed by a user is longer than the time you push your updates.</small>
>
> 1.  Disable (or remove) the `Delete old files` task (or code yourself a `synchronization/diff` task and feel free to share it with me :smile:).
>     <small>Since you should add files more often and not delete files that often, disabling this task could even speed up your delivery pipeline.</small>
> 1.  Add an `az cdn endpoint load` task before the `Delete old files` task.
>     <small>This would pre-load the whole website before the deletion of files.</small>
> 1.  Update the pipeline so it can "choose" if it needs to delete files or not.
>     <small>This could be based on branches, releases, a manual trigger, manual approval, or some other requirements.</small>
>
> See `{{ site.data.jekyll-vsts-azure-nav[4].title }}` for more info about the CDN task.

---

{% include jekyll-vsts-azure/next.md nextIndex=4 %}
