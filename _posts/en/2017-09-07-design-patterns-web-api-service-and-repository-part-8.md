---
title:  "Design Patterns: Asp.Net Core Web API, services, and repositories"
subtitle: "Part 8: Azure table storage and the data model"
date:   2017-09-07 00:00:00 -0500
post-img: "//cdn.forevolve.com/blog/images/articles-header/2017-07-00-asp-net-core-design-patterns.png"
lang: en
categories: en/articles
tags: 
- Design Patterns
- Asp.Net Core
- Web API
- C#
- Repository Pattern
- NoSQL
- Azure
- Azure Table Storage
- ForEvolve Framework
proficiency-level: Intermediate
---

So far, we implemented the clan's feature, using a static in-memory storage.
We also implemented most of the ninja feature, excluding the data-access logic, where we stopped at the `INinjaRepository` level.

In this article I will introduce you to Microsoft Azure Table Storage and we will create our data model.
This article will be brief.<!--more-->

[Skip the shared part](#azure-table-storage)

{% include design-patterns-web-api-service-and-repository/series.md %}

## Azure Table Storage
I will start by quoting Microsoft on this one:

<figure>
    <blockquote>
        Azure Table storage is a service that stores structured NoSQL data in the cloud, providing a key/attribute store with a schemaless design. Because Table storage is schemaless, it is easy to adapt your data as your application evolve. Access to Table storage data is fast and cost-effective for many types of applications and is typically lower in cost than traditional SQL for similar volumes of data.
    </blockquote>
    <figcaption>
        Quoted from 
        <a href="https://docs.microsoft.com/en-us/azure/storage/storage-dotnet-how-to-use-tables">Get started with Azure Table storage using .NET</a>
    </figcaption>
</figure>

In my word, an Azure Table is like a big SQL table with a composite key (`PartitionKey` + `RowKey`), but instead of user-defined columns (a schema), columns are variable, based on the entity you want to store in your table. 
More on that, it is cheap and fast. In my humble opinion, this is a great way to store data.

### The Storage Account
To get started:

1. You will need an Azure subscription (if you do not already have one, it requires a credit card, but MS will give you free credits. I also doubt that our Ninja API will cost you any money, no matter what - Table storage is cheap).
1. You will need to create an Azure Storage in your account

#### Create a subscription
To create a sub, go to [https://azure.microsoft.com](https://azure.microsoft.com) and follow the instructions.
This should be fairly easy.

If you already have one, great!

#### Create Azure Storage 
Once you have an Azure account, create a new Storage Account resource.

Managing your Azure resources is out of the scope of this article, so I will leave you on your own for a little while.

If you are clueless, feel free to start here: [Create a storage account](https://docs.microsoft.com/en-us/azure/storage/storage-create-storage-account#create-a-storage-account)

But basically, you click the green `+` sign, search for `storage`, select `Storage account - blob, file, table, queue` and click `Create`.

![Create Azure Storage Account](//cdn.forevolve.com/blog/images/2017/create-azure-storage.png)

Once this is done, you need to fill in the form presented to you.

---

> **Tip** 
>
> In the form, use the little "information icons" if you are not sure. 
> Microsoft made our life easier there...

---

#### Create an Azure Storage Table
We do not need to create a Table; it will be created automatically later.

## Data Model
As I previously stated: our data source will be an Azure Table Storage.
Indirectly, we will use the Azure SDK through `ForEvolve.Azure`.

---

> Azure Table (SDK) Rule #1
>
> Our entity classes (the objects that we want to store in an Azure Table) must implement `ITableEntity`.

---

That said, we need to create a new class that will represent the persisted `Ninja`'s data.
Let's call the ninja's data representation class `NinjaEntity`.
To make it easy, we will simply inherit from `TableEntity` instead of manually implementing `ITableEntity`.

Here is the `NinjaEntity` class:

``` csharp
namespace ForEvolve.Blog.Samples.NinjaApi.Models
{
    public class NinjaEntity : TableEntity
    {
        public string Name { get; set; }
        public int Level { get; set; }
    }
}
```

Compared to the `Ninja` class, there are a few missing properties, right?

``` csharp
namespace ForEvolve.Blog.Samples.NinjaApi.Models
{
    public class Ninja
    {
        public string Key { get; set; }
        public Clan Clan { get; set; }
        public string Name { get; set; }
        public int Level { get; set; }
    }
}
```

Actually, we are fine, `ITableEntity` has the following two required properties.

``` csharp
public string PartitionKey { get; set; }
public string RowKey { get; set; }
```

From the relational point of view, an Azure Table has a composite primary key, combining `PartitionKey` and `RowKey`.
There is more to it than that, but for this article, it will be enough.
To skip the database modeling part, we will use the clan name as the `PartitionKey` and the ninja key as the `RowKey`.

<aside>
    <header>
        Partitions
    </header>
    <figure>
        <blockquote>
            Partitions are always served from one partition server and each partition server can serve one or more partitions.
        </blockquote>
        <figcaption>
            <cite><a href="https://docs.microsoft.com/en-us/rest/api/storageservices/designing-a-scalable-partitioning-strategy-for-azure-table-storage#uyuyuyuyuy">Designing a Scalable Partitioning Strategy for Azure Table Storage</a></cite>
        </figcaption>
    </figure>
    <footer>
        <p>
            <strong>What does this mean?</strong><br>
            This means that with the current design, all ninja of a single clan will always be served by the same partition server.
            By assuming that a clan is united (fight together), this is a good scaling strategy.
        </p>
        <p>
            More over, we could also be <a href="https://docs.microsoft.com/en-us/rest/api/storageservices/Performing-Entity-Group-Transactions" target="_blank">Performing Entity Group Transactions</a>.
            To perform transactions, all entities must be in the same partition.
        </p>
    </footer>
</aside>

To be able to save our ninja in the Azure Table Storage, we will map `Ninja` objects to `NinjaEntity` objects as follow:

- `Ninja.Clan.Name` to `NinjaEntity.PartitionKey`
- `Ninja.Key` to `NinjaEntity.RowKey`
- `Ninja.Name` to `NinjaEntity.Name`
- `Ninja.Level` to `NinjaEntity.Level`

---

> **Tools**
>
> To keep the external dependencies low, we will code the mapping manually.
> In a real life project I would recommend the use of a library like
> [AutoMapper](http://automapper.org/).
> AutoMapper is a great tool that allows copying one object into another (and much more).

---

## The end of this article
This was a short article, but once again I splitted an article into multiple parts to make it clearer and easier to read.

### What have we covered in this article?
In this article, I introduced Microsoft Azure Table Storage and we created the Ninja's data model based on that knowledge.

### What's next?
In the next article, we will implement a little mapping system to help us map domain entities to data entities and vice versa.

{% include design-patterns-web-api-service-and-repository/footer.md %}
