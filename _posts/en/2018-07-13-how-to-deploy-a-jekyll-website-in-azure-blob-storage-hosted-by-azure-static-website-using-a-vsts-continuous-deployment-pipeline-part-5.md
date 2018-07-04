---
title:  "How to deploy a Jekyll website in Azure blob storage hosted by Azure static website using a VSTS continuous deployment pipeline"
subtitle: "Step 4: Create Azure resources"
date:     2018-07-13 00:00:00 -0500
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
