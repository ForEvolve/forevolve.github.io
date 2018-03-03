---
title:  "Operation result"
subtitle: "Design Patterns"
date:     2018-02-01 00:00:00 -0500
post-img: "//cdn.forevolve.com/blog/images/articles-header/2018-01-00-exceptions.png"
unsplash-credit: Photo by Jilbert Ebrahimi on Unsplash
lang: en
categories: en/articles
tags: 
- C#
- Design Patterns
- Asp.Net Core
proficiency-level: Intermediate
---

This article will focus on the "Operation Result" design pattern, as I call it. 
Why do I said "as I call it"? 
Because it doesn’t seem to have an official name yet; and as you will see, this name fits well. 
You can see this technique used in multiple SDK. 
It is also very easy to implement and powerful enough to be worth mentionning.

> What's a design pattern?
>
> A design pattern is simply a way to solve a problem or to implement a solution.

## Role
The role of the "Operation Result" design pattern is to return a complex result from an operation, allowing the consumer to:<!--more-->

1. Access the result of an operation (in case there is one).
2. Access the success indicator of an operation.
3. Access the cause of the failure in case the operation was not successful.

This could go even further, like returning the severity of the failure or adding any other relevant information for the specific use-case.

## Illustration
Imagine any system in which you want to display user-friendly error messages, achieve some small speed gain or even handle failure easily. The "Operation Result" design pattern can help you achieve these goals.

## Design
It is easy to rely on throwing Exceptions when an operation fail, however, the "Operation Result" is an alternate way of communicating success or failure between components. 

To be used effectively, a method must return a complex object containing the elements presented above (in the Role section). Moreover, as a rule of thumb, a method returning an "operation result" should never throw any exception. This way, consumers don’t have to handle anything else than the operation result itself.

### Diagrams
Here are some UML diagrams representing the pattern (some code will follow).

#### Operation Result pattern class diagram
![Operation Result pattern class diagram](/img/operation-result-design-pattern-1.png)

#### Operation Result pattern sequence diagram
![Operation Result pattern sequence diagram](/img/operation-result-design-pattern-2.png)

#### Operation Result pattern "handle the result" flow diagram
![Operation Result pattern "handle the result" flow diagram](/img/operation-result-design-pattern-3.png)

### Definition of the diagrams' classes
Before jumping into the code, lets peek into the "actors" of the previous diagrams.

#### Caller
Some class calling the Callee's `Execute` method.

#### Callee
The class containing the `Execute` method that return an `ExecuteOperationResult`.

#### ExecuteOperationResult
The complex result.
As a convention, I like to name the class `[Operation/Method name]OperationResult`.

#### SomeValue
The operation's expected value.

#### SomeError
The error representation. This could be a `string`, an `Exception` or a custom error object.

## Advantages and disadvantages
Here are some advantages and disadvantages.

### Advantages 
- It is more explicit than throwing an Exception. Why? Because it is part of the returned value (the method "signature-ish").
- It is faster. Why? because returning an object is faster than throwing an Exception.

### Disadvantages
- It is more complex to use than exceptions. Why? Because it must be "manually propagated up the call stack" (AKA returned by the callee and handled by the caller).
- There is at least one more class to create: the "operation result" class. Why? Do I really need to answer this?
    > I am not sure this is really a disadvantage, but that's pretty much the only few drawbacks that I was able to think of...

## Implementation: the Ninja Wars API
I will continue to follow my 2017 mood: the ninjas! 
For this article, I will create a microservice (or tiny API if you prefer) using ASP.NET Core 2.
The first endpoint will allow consumers to read the list of relationships of a specicific ninja clan.
I will not go too far into enginerring since I want the focus to be on the "operation result" pattern.

The relationship status of a clan is represented by the `WarStatus` class and will be as simple as:

``` csharp
public class WarStatus
{
	[JsonProperty("targetClanId")]
	public string TargetClanId { get; set; }

	[JsonProperty("isAtWar")]
	public bool IsAtWar { get; set; }
}
```

The endpoint will answers to the following URI pattern: `api/clans/{clanId}/warstatus`.
To handle the request, we will use the ASP.NET Core 2 router, as follow:

> Don't forget to add the router to the `IServiceCollection` in the `ConfigureServices` method as follow: `services.AddRouting();`.

``` csharp
public void Configure(IApplicationBuilder app, IHostingEnvironment env)
{
	app.UseRouter(builder =>
	{
		var clanService = new ClanWarService();
		builder.MapGet("api/clans/{clanId}/warstatus", async (request, response, data) =>
		{
			// Read param
			var clanId = data.Values["clanId"].ToString();

			// Execute operation
			var result = clanService.ReadAllWarStatusOf(clanId);

			// Handle the result
			string jsonResponse;
			if (result.IsSuccessful)
			{
				jsonResponse = JsonConvert.SerializeObject(result.Value);
			}
			else
			{
				jsonResponse = JsonConvert.SerializeObject(new { error = result.Error });
			}
			await response.WriteAsync(jsonResponse);
		});
	});
}
```

As you can see, the result of `clanService.ReadAllWarStatusOf(clanId);` is elegant and clear. 
Even if you dont know the implementation details of the `ClanWarService` class, you should have a pretty good idea of the outcome; which is (one of) the point of all of this.

OK; now that we got the *caller* point of view, let analyse the *callee*.

For the result itself, I decided to take the easiest path and define the `Error` as a simple `string`.
The `IsSuccessful` property's implementation is also very simple following this logic: "the operation is successful as long as there is no error (message)."
There could be a value or not, an error or not, or any combination of these.

``` csharp
public class ReadWarStatusOperationResult
{
	[JsonProperty("successful")]
	public bool IsSuccessful => string.IsNullOrWhiteSpace(Error);

	[JsonProperty("value", DefaultValueHandling = DefaultValueHandling.Ignore)]
	public WarStatus[] Value { get; set; }

	[JsonProperty("error", DefaultValueHandling = DefaultValueHandling.Ignore)]
	public string Error { get; set; }
}
```

Now that we saw the code, as you may have noticed, the operation result class has the 3 elements described in the "Role" section:

1. Access the result of an operation: `Value`
2. Access the success indicator of an operation: `IsSuccessful`
3. Access the cause of the failure in case the operation was not successful: `Error`

The `Error` property could be a complex object or even a collection of complex error objects.

---

To keep things simple, the `ClanWarService` implementation has two static use cases:

1. It return a valid `ReadWarStatusOperationResult` object when the consumer ask for the clan `clanId == "c810e13c-1083-4f39-aebc-e150c82dc770"`.
1. It return an invalid `ReadWarStatusOperationResult` object when the consumer ask for any other clans.

``` csharp
public class ClanWarService
{
	public ReadWarStatusOperationResult ReadAllWarStatusOf(string clanId)
	{
		if (clanId == "c810e13c-1083-4f39-aebc-e150c82dc770")
		{
			return new ReadWarStatusOperationResult
			{
				Value = new WarStatus[]
				{
					new WarStatus
					{
						TargetClanId = "6155d646-98c9-492e-a17d-335b1b69898e",
						IsAtWar = true
					},
					new WarStatus
					{
						TargetClanId = "f43d6384-4419-4e41-b561-9f96e0620779",
						IsAtWar = true
					},
					new WarStatus
					{
						TargetClanId = "84712492-1b0a-40b7-b1cd-20661fc6b6b6",
						IsAtWar = true
					},
					new WarStatus
					{
						TargetClanId = "16446317-3CCE-431E-AEBE-8A5511312594",
						IsAtWar = false
					},
					new WarStatus
					{
						TargetClanId = "8C0AE03F-202D-4352-BD59-2F794779F3E9",
						IsAtWar = false
					},
				}
			};
		}
		else
		{
			return new ReadWarStatusOperationResult
			{
				Error = $"Clan {clanId} not found"
			};
		}
	}
}
```

After reading the code, you may have noticed that the `ReadAllWarStatusOf` method of the `ClanWarService` class always return a `ReadWarStatusOperationResult` no matter if the result is a success or a failure. In the case of a more complexe scenario, we could have wrapped the code in a `try/catch` block to handle possible errors.

## Implementation: the Ninja War API - Part 2: update the war status
In the previous implementation, we returned a `Value` about the WarStatus. 
Returning a `Value` is not mandatory, we could only want to return the success indicator and the error (in case there is an error).

To showcase this, let's create a `SetWarStatus` method that set the `WarStatus.IsAtWar` to the specified value.

> It is important to note that the result will not be reflected when calling the `ReadAllWarStatusOf` method. 
> In a real scenario you would have a data source of some sort.
> This is out if the scope of the current article.
> If you find it harder to follow this way, feel free to leave me a comment and I will create another code sample.

First of all, what do we want?

1. A success indicator
1. An error message if the operation was not successful

These 2 points are reflected in the `SetWarStatusOperationResult` class:

```csharp
public class SetWarStatusOperationResult
{
	[JsonProperty("successful")]
	public bool IsSuccessful => string.IsNullOrWhiteSpace(Error);

	[JsonProperty("error", DefaultValueHandling = DefaultValueHandling.Ignore)]
	public string Error { get; set; }
}
```

The `SetWarStatus` method will return an empty `SetWarStatusOperationResult` instance or one with an error message if not successful:

```csharp
public SetWarStatusOperationResult SetWarStatus(string clanId, string targetClanId, bool isAtWar)
{
	if (clanId == "378E8982-5E90-4379-8926-32FEA62B4B4C" && targetClanId == "002A8E50-E39B-4AC6-9411-2F02AAE6C845")
	{
		return new SetWarStatusOperationResult();
	}

	return new SetWarStatusOperationResult
	{
		Error = $"The clan {clanId} or the target clan {targetClanId} was not found"
	};
}
```

As you can notice, the concept is the same, but we dont need to return any value. 
You can see this as a method "returning" `void` or an error message/object.

To close the circle, we need to call the `SetWarStatus` method somewhere.
That somewhere will be another API endpoint, but this time we will `PATCH` the URI.
The request body will need to be a JSON `WarStatus` object.

```csharp
builder.MapVerb("PATCH", "api/clans/{clanId}/warstatus", async (request, response, data) =>
{
	// Read param
	var clanId = data.Values["clanId"].ToString();

	// Deserialize the JSON body
	using (StreamReader reader = new StreamReader(request.Body, Encoding.UTF8))
	{
		var jsonText = await reader.ReadToEndAsync();
		var warStatus = JsonConvert.DeserializeObject<WarStatus>(jsonText);

		// Execute operation
		var result = clanService.SetWarStatus(clanId, warStatus.TargetClanId, warStatus.IsAtWar);

		// Handle the result
		if (result.IsSuccessful)
		{
			return;
		}
		response.StatusCode = StatusCodes.Status404NotFound;
		var jsonResponse = JsonConvert.SerializeObject(new { error = result.Error });
		await response.WriteAsync(jsonResponse);
	}
});
```

If we take a look at that last code block, the endpoint return an empty `200 OK` response when the operation is successful and a `404 NotFound` with an error message if an error occured.

> OK, here the response is tightly coupled with the `ClanWarService` implementation, but your focus should be around the "operation result", not the operation itself.


TODO: show a "classic way" of doing this (with return Value + exception)