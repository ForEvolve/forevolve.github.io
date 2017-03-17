---
title: "How to trick the EDM model builder to allow recursive ComplexTypes"
date:  2016-09-06 -0500
post-img: "//cdn.forevolve.com/blog/images/articles-header/2016-08-17-how-to-create-an-odata-reporting-service-in-asp-net-4-5.png"
lang: en
categories: en/articles
redirect_from: "/articles/2016/09/06/how-to-trick-the-edm-model-builder-to-allow-recursive-complextypes/"
---

Before starting, this article is built on top of [How to create an OData reporting service in ASP.NET 4.5]({{ site.baseurl }}/en/articles/2016/08/17/how-to-create-an-odata-reporting-service-in-asp-net-4-5/) but you can easily adapt it to any of your project. The code is in the same git repository as the previous article, in the `branch` [recursive-complex-type](https://github.com/Carl-Hugo/ODataService/tree/recursive-complex-type), on GitHub.

<ol class="forevolve-toc"><li><a href="#the-problem" data-forevolve-level="2">The problem </a><ol><li><a href="#the-model" data-forevolve-level="3">The model </a></li><li><a href="#the-configuration" data-forevolve-level="3">The configuration </a></li><li><a href="#the-failure" data-forevolve-level="3">The failure </a></li></ol></li><li><a href="#some-added-realism" data-forevolve-level="2">Some added realism </a><ol><li><a href="#the-new-application" data-forevolve-level="3">The new application </a></li><li><a href="#the-new-and-updated-classes" data-forevolve-level="3">The new and updated classes </a></li></ol></li><li><a href="#the-solution" data-forevolve-level="2">The solution </a><ol><li><a href="#the-models" data-forevolve-level="3">The models </a></li><li><a href="#yeah-it-worked" data-forevolve-level="3">Yeah, it worked! </a></li></ol></li><li><a href="#conclusion" data-forevolve-level="2">Conclusion </a></li></ol>

<!--more-->

## The problem
We are trying to solve the following use case (at this stage, code will fail at runtime).

*The commit title is **Use case: the problem.**, if you want to try the failing code.*

### The model
The failing model look like this:
<script src="http://gist-it.appspot.com/https://github.com/Carl-Hugo/ODataService/blob/550fb5fed18a55c6bbcdc8a44fc37a3b98ed22a1/ODataService/Models/MyODataModel.cs"></script>
<script src="http://gist-it.appspot.com/https://github.com/Carl-Hugo/ODataService/blob/550fb5fed18a55c6bbcdc8a44fc37a3b98ed22a1/ODataService/Models/MyComplexType.cs"></script>

#### The `Children`
Have you noticed the property `public ICollection<MyComplexType> Children { get; set; }` in the class `MyComplexType` ?

Well this, the EDM model builder does not like, and since it is not uncommon to have such a data structure, let's trick that evil model builder into allowing it ;)

### The configuration
The configuration look like this (in `WebApiConfig.cs`) - nothing fancy here: 
```CSharp
builder.ComplexType<MyComplexType>();
```

### The failure
This is what happen when you run the code:
<img src="http://www.forevolve.com/wp-content/uploads/2016/09/recursive-complex-type-error.png" alt="recursive-complex-type-error" />

## Some added realism 
Before going further, i added a layer of realism to the projet. I avoided to include external libraries like a DI container or AutoMapper to focus on the demo code instead of one specific technology.

### The new application
The execution now flow like this:
<img src="http://www.forevolve.com/wp-content/uploads/2016/09/OData-ComplexType-SmartArt3.png" alt="OData-ComplexType-SmartArt3" />

When you call the controller, it use a service that use a repository. The repository return the database-model to the service that convert it to its transferable-types to finally return it to the controller.

#### The simulation
Basically, i simulated a more real-life-like application where we have database entities and `DTO`'s (data transfer objects).

> You can compare a `DTO` to a `view model`, but instead of being sent to a `view` and displayed as HTML (in case of the Web), it is serialized in JSON<sup>1</sup> and sent to the client that way.
>
> <small><sup>1</sup> Note that the DTO's serialization does not have to be in JSON, it could be XML or any other way you'd like. `DTO`s are a concept and they are not bound to any implementation or technologies, beside the object-oriented programming paradigm.</small>

### The new and updated classes
Lets take a look at the new stuff and let the code talk by itself :)

*If you are not interested in the project infrastructure, you can jump right to: [The solution](#the-solution).*

#### `MyDatabaseEntityRepository`
<script src="http://gist-it.appspot.com/https://github.com/Carl-Hugo/ODataService/blob/c21bef326265f14be5e8d97dc9a6be6fff89362a/ODataService/Repositories/MyDatabaseEntityRepository.cs"></script>

#### `MyODataModelService`
<script src="http://gist-it.appspot.com/https://github.com/Carl-Hugo/ODataService/blob/c21bef326265f14be5e8d97dc9a6be6fff89362a/ODataService/Services/MyODataModelService.cs"></script>

#### `MyODataModelMapper`
<script src="http://gist-it.appspot.com/https://github.com/Carl-Hugo/ODataService/blob/c21bef326265f14be5e8d97dc9a6be6fff89362a/ODataService/Services/MyODataModelMapper.cs"></script>

#### `MyODataModelController`
<script src="http://gist-it.appspot.com/https://github.com/Carl-Hugo/ODataService/blob/c21bef326265f14be5e8d97dc9a6be6fff89362a/ODataService/Controllers/MyODataModelController.cs"></script>

## The solution
If we run the code, we still have a problem... It's a more real-life-like problem, but it's still a problem...

Now that we know what the problem is, lets trick the EDM model builder to believe that there are no such thing as *a recursive loop of complex types* in our model. To do that we will create two different ComplexType class that are identical. The only difference is that `class1` will be composed of a `class2` collection and `class2` will be composed of a `class1` collection. 

This will break the cycle:
<img src="http://www.forevolve.com/wp-content/uploads/2016/09/OData-ComplexType-SmartArt4.png" alt="OData-ComplexType-SmartArt4" />

### The models
Lets take a look at more code (this one you might not want to skip tho)...

#### The data model
The data model `MyDatabaseComplexType.Children` property reference itself. No big deal here, the static repository has no problem storing that kind of data. 

In a real database scenario we could add an `id` property to the `MyDatabaseComplexType` class. That said, for some reasons, we might not want to transfer that `id` to the client - that's basically the problem that inspired this article.

<script src="http://gist-it.appspot.com/https://github.com/Carl-Hugo/ODataService/blob/c21bef326265f14be5e8d97dc9a6be6fff89362a/ODataService/Models/MyDatabaseEntity.cs"></script>
<script src="http://gist-it.appspot.com/https://github.com/Carl-Hugo/ODataService/blob/c21bef326265f14be5e8d97dc9a6be6fff89362a/ODataService/Models/MyDatabaseComplexType.cs"></script>

#### The problematic transfer model
The transfer model contain the same *recursive loop of complex types* since it is a copy of the data model (for now).
<script src="http://gist-it.appspot.com/https://github.com/Carl-Hugo/ODataService/blob/c21bef326265f14be5e8d97dc9a6be6fff89362a/ODataService/Models/MyODataModel.cs"></script>
<script src="http://gist-it.appspot.com/https://github.com/Carl-Hugo/ODataService/blob/c21bef326265f14be5e8d97dc9a6be6fff89362a/ODataService/Models/MyDatabaseComplexType.cs"></script>

#### The updated transfer model
By using the little technique displayed in the previous graph, we will create what I call a "two-level-circular-dependency" (i don't know if that term exists but it sounds good). 

By updating the transfer model to the following, the EDM model builder will never notice and the circular dependency will be "broken" (look for `MyComplexType1` and `MyComplexType2`):
<script src="http://gist-it.appspot.com/https://github.com/Carl-Hugo/ODataService/blob/recursive-complex-type/ODataService/Models/MyODataModel.cs"></script>
<script src="http://gist-it.appspot.com/https://github.com/Carl-Hugo/ODataService/blob/recursive-complex-type/ODataService/Models/MyComplexType.cs"></script>

I also updated `MyODataModelMapper` to handle the changes to the transfer model as follows (this is basic mapping code, it is not that important):
<script src="http://gist-it.appspot.com/https://github.com/Carl-Hugo/ODataService/blob/recursive-complex-type/ODataService/Services/MyODataModelMapper.cs"></script>

### Yeah, it worked!
In a browser, a GET request to `http://localhost:1079/odata/MyODataModel` will result in:
<img src="http://www.forevolve.com/wp-content/uploads/2016/09/OData-json-1.png" alt="OData-json-1" />

## Conclusion
With a bit of imagination and some programming experience, it was easy to trick the EDM model builder. 

To break the cycle we converted the following "circular dependency" to a "two-level-circular-dependency", as follows:
<img src="http://www.forevolve.com/wp-content/uploads/2016/09/OData-ComplexType-SmartArt2.png" alt="OData-ComplexType-SmartArt2" />

I hope you enjoyed, happy coding!