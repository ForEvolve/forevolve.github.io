---
title:  "How to deploy and host a Jekyll website in Azure blob storage using a VSTS continuous deployment pipeline"
subtitle: "Part 2: Create Azure Blob Storage, and configure static website"
date:     2018-07-10 00:00:02 -0500
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
- { name: Jekyll, level: Familiar }
- { name: Git, level: Familiar }
---

Lets recap: we have a Jekyll website saved in VSTS/Git, with a build that starts automatically each time someone pushes code to the `master` branch.

From there we need to deploy our website in the cloud!
However before automating that, we need to create some resources in Azure.
To do so, let's use the [Azure portal](https://portal.azure.com/).<!--more-->

> The Azure Portal is easy to use, and I am not even sure if the other tools support the `Static website (preview)` option yet.

_If you don't have an Azure account, you can start a free trial here: [https://azure.microsoft.com/en-us/free/](https://azure.microsoft.com/en-us/free/)._

_This article is very brief and was extracted on its own only to remove some clutter from `{{ site.data.jekyll-vsts-azure-nav[3].title }}`._

{% include jekyll-vsts-azure/toc.md currentIndex=2 %}

## Create a resource group

Resource groups are an excellent way to keep your resources organized. I named mine `JekyllOnAzure`.

![Create a new resource group](//cdn.forevolve.com/blog/images/2018/Azure-new-resource-group.png)

> You can also create the resource group at the same time as the Storage Account if you prefer.

## Create a Storage Account

We will use the blob storage account to store our files in the cloud (the build artifact: `_site`).
The storage account will also serve as the website host (or "server" if you prefer).

From the resource group (or somewhere else in the Azure portal):

- Click `Create resource`.
- Search for `storage`
- Select `Storage account - blob, file, table, queue`
- Click `Create`

![New Storage account - blob, file, table, queue](//cdn.forevolve.com/blog/images/2018/Azure-new-storage-account-blob-file-table-queue.png)

In the `Create storage account` blade, make sure you:

- Select `StorageV2 (general purpose v2)`
- Choose an adequate replication strategy for your website (I chose `LRS` for this demo since I don't need redundancy).
- Choose the right performance option (`Standard` should be fine for most website).
- Choose your previously created resource group or create a new one

You can also enable `Secure transfer required` if you want to force HTTPS (this can be changed later). I recommend that you activate this option at some point.

![New Storage account - blob, file, table, queue](//cdn.forevolve.com/blog/images/2018/Azure-new-storage-account-blob-file-table-queue-options.png)

Once Azure completes the creation of the Storage account: navigate to the new resource blade.

## Configure the Storage Account

From the storage account you just created:

1.  Click on `Static website (preview)`
1.  Click `Enable`
1.  Enter `index.html` as the `Index document name`
1.  Enter `404.html` as the `Error document path`. _The `404.html` file is created by `Jekyll new`, if your 404 page is not that one, set your own custom one's path here instead._
1.  Click `Save`

![Enable Azure Storage static website](//cdn.forevolve.com/blog/images/2018/Azure-storage-enable-static-website.png)

> Note that, as of this writing, not all regions support the `static website (preview)` option. I used `Canada (central)`.

At this point, Azure should have created a `$web` container in the Storage Account.
That's where your website files should be uploaded.

## Testing the setup

Using `Azure Storage Explorer` or the `Storage Explorer (preview)` blade, in the `$web` blob container, let's upload an `index.html` file to test this out.

> [Azure Storage Explorer](https://azure.microsoft.com/en-ca/features/storage-explorer/) is a helpful tool that I recommend you to install if you plan on using Azure Storage.
>
> There is also a **Visual Studio Code** plugin, for you VSCode enthusiasts out there, named: [Azure Storage](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurestorage) that does more or less the same thing from inside VS Code.

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

Once the file is uploaded, navigate to your `Primary endpoint` (you can find the URI in the `Static website (preview)` blade), and voilà, you should see your test page:

![Azure static website test page with Edge](//cdn.forevolve.com/blog/images/2018/Azure-static-website-test-page-edge.png)

{% include jekyll-vsts-azure/next.md nextIndex=3 %}
