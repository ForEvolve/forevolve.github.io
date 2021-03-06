---
title: 'Design Patterns: Asp.Net Core Web API, services, and repositories'
subtitle: 'Part 9: the NinjaMappingService and the Façade pattern'
date: 2017-09-11 00:00:00 -0500
post-img: '//cdn.forevolve.com/blog/images/articles-header/2017-07-00-asp-net-core-design-patterns.png'
lang: en
categories: en/articles
tags:
    - Design Patterns
    - Asp.Net Core
    - C#
    - Unit Test
    - XUnit
    - Façade Pattern
proficiency-level: Intermediate
---

In the previous article, we explored Azure Table Storage briefly, and we created the `NinjaEntity` class.
Doing so opened up a new concern: mapping `Ninja` to `NinjaEntity`.

Before going further, to keep the external dependencies low, in this article, we will create a mapping system.
This will also allow us to explore an additional design pattern: the Façade. <!--more-->

---

> **Tools**
>
> In a real life project, to speed up development, I would recommend the use of a library like
> [AutoMapper](http://automapper.org/).
> AutoMapper is a great tool that allows copying one object into another (and much more).

---

[Skip the shared part](#ninjamappingservice)

{% include design-patterns-web-api-service-and-repository/series.md %}

## NinjaMappingService

Before going further, we will create an `INinjaMappingService` interface that will become our "ninja mapping hub."

The `INinjaMappingService` responsibility is to offer a centralized and convenient way to convert `Ninja` to `NinjaEntity` and vice versa.
We will also need to convert `IEnumerable<NinjaEntity>` to `IEnumerable<Ninja>` (for the `ReadAll*()` methods).

In its current state, our Ninja App does not need to convert `IEnumerable<Ninja>` to `IEnumerable<NinjaEntity>` so we will omit that functionality to keep our project clean of useless code.
If the need of such operation ever arises, we will add it then, and only then.

> I could have added those methods directly in the `NinjaRepository` class, but remember SOLID and it single responsibility principle (SRP): **A class should have only one reason to change**.

```csharp
namespace ForEvolve.Blog.Samples.NinjaApi.Services
{
    public interface INinjaMappingService
    {
        Ninja Map(NinjaEntity entity);
        NinjaEntity Map(Ninja ninja);
        IEnumerable<Ninja> Map(IEnumerable<NinjaEntity> entity);
    }
}
```

While thinking about it, a little more, I want to use `Ninja Map(NinjaEntity entity);` in `IEnumerable<Ninja> Map(IEnumerable<NinjaEntity> entity);`.
This could be a little harder to test than expected, which leads me to a more fine-grained design.

We will keep the `INinjaMappingService`, but it will simply become a **Façade**.

---

<aside>
    <section class="with-amazon-content">
        <figure class="blog-content">
            <header>Façade Pattern</header>
            <blockquote>The role of the Façade pattern is to provide different high-level views of subsystems whose details are hidden from users. In general, the operations that might be desirable from a user's perspective could be made up of different selections of parts of the subsystems.</blockquote>
            <figcaption>
                Excerpted from <cite>C# 3.0 Design Patterns: Use the Power of C# 3.0 to Solve Real-World Problems</cite> by Judith Bishop, published by O'Reilly Media.
                Two chapters are available online at <a href="https://msdn.microsoft.com/en-us/library/orm-9780596527730-01-04.aspx#Anchor_0">msdn.microsoft.com</a>.
            </figcaption>
        </figure>
        <aside class="amazon-content">
            <iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="//ws-na.amazon-adsystem.com/widgets/q?ServiceVersion=20070822&OneJS=1&Operation=GetAdHtml&MarketPlace=US&source=ac&ref=tf_til&ad_type=product_link&tracking_id=forevolve0b-20&marketplace=amazon&amp;region=US&placement=059652773X&asins=059652773X&linkId=dccb52fe1568f137f6956103450bd87e&show_border=false&link_opens_in_new_window=true&price_color=404040&title_color=007f00&bg_color=ffffff"></iframe>
        </aside>
    </section>
    <footer>
        This is a great design patterns book. I highly recommend it.
    </footer>
</aside>

---

### Mapping subsystem

Behind our Façade hides the mapping subsystem.
I created a little visual representation of the design.

Beware, the schema looks complicated, but it is pretty simple.
The hard part was to represent the concept in a single diagram.

I used colors to identify elements.

-   `Ninja Map(NinjaEntity entity);` reference color is blue.
-   `NinjaEntity Map(Ninja ninja);` reference color is green.
-   `IEnumerable<Ninja> Map(IEnumerable<NinjaEntity> entity);` reference color is yellow.

Let's take a look:

[![Ninja Mapper diagram](//cdn.forevolve.com/blog/images/2017/ninja-mapper-diagram.gif)](//cdn.forevolve.com/blog/images/2017/ninja-mapper-diagram.gif)

The first large red interface is a generic mapping interface with only one method defined: the `Map` method.

```csharp
namespace ForEvolve.Blog.Samples.NinjaApi.Mappers
{
    public interface IMapper<TSource, TDestination>
    {
        TDestination Map(TSource entity);
    }
}
```

In the second "row" there are six interfaces. Those interfaces do not exist in code; they are simply defining the generic types of `IMapper<TSource, TDestination>`.
Even more, the first three are the same as the last three; I only needed more space to make the diagram clearer.

> :thought_balloon: I would have needed a 3D diagram to make this clearer...

#### The left side

We will create three classes, each one with a single mapping responsibility (implementing `IMapper<TSource, TDestination>`).

-   `NinjaEntityToNinjaMapper` will implement `IMapper<NinjaEntity, Ninja>`
-   `NinjaToNinjaEntityMapper` will implement `IMapper<Ninja, NinjaEntity>`
-   `NinjaEntityEnumerableToNinjaMapper` will implement `IMapper<IEnumerable<NinjaEntity>, IEnumerable<Ninja>>`

> This is a very flexible design where each mapper is independent.

##### NinjaToNinjaEntityMapper

`NinjaToNinjaEntityMapper` implement `IMapper<Ninja, NinjaEntity>`.
Its role is to convert `Ninja` to `NinjaEntity`.

**The test:**

```csharp
namespace ForEvolve.Blog.Samples.NinjaApi.Mappers
{
    public class NinjaToNinjaEntityMapperTest
    {
        protected NinjaToNinjaEntityMapper MapperUnderTest { get; }

        public NinjaToNinjaEntityMapperTest()
        {
            MapperUnderTest = new NinjaToNinjaEntityMapper();
        }

        public class Map : NinjaToNinjaEntityMapperTest
        {
            [Fact]
            public void Should_return_a_well_formatted_entity()
            {
                // Arrange
                var ninja = new Ninja
                {
                    Key = "Some key",
                    Name = "Some name",
                    Level = 45,
                    Clan = new Clan { Name = "Super clan" }
                };

                // Act
                var result = MapperUnderTest.Map(ninja);

                // Assert
                Assert.Equal("Some key", result.RowKey);
                Assert.Equal("Some name", result.Name);
                Assert.Equal(45, result.Level);
                Assert.Equal("Super clan", result.PartitionKey);
            }
        }
    }
}
```

**The implementation:**

```csharp
namespace ForEvolve.Blog.Samples.NinjaApi.Mappers
{
    public class NinjaToNinjaEntityMapper : IMapper<Ninja, NinjaEntity>
    {
        public NinjaEntity Map(Ninja ninja)
        {
            var entity = new NinjaEntity
            {
                PartitionKey = ninja.Clan.Name,
                RowKey = ninja.Key,
                Name = ninja.Name,
                Level = ninja.Level
            };
            return entity;
        }
    }
}
```

##### NinjaEntityToNinjaMapper

`NinjaEntityToNinjaMapper` implement `IMapper<NinjaEntity, Ninja>`.
Its role is to convert `Ninja` to `NinjaEntity`.

**The test:**

```csharp
namespace ForEvolve.Blog.Samples.NinjaApi.Mappers
{
    public class NinjaEntityToNinjaMapperTest
    {
        protected NinjaEntityToNinjaMapper MapperUnderTest { get; }

        public NinjaEntityToNinjaMapperTest()
        {
            MapperUnderTest = new NinjaEntityToNinjaMapper();
        }

        public class Map : NinjaEntityToNinjaMapperTest
        {
            [Fact]
            public void Should_return_a_well_formatted_ninja()
            {
                // Arrange
                var entity = new NinjaEntity
                {
                    Level = 10,
                    Name = "Some fake name",
                    PartitionKey = "Some clan name",
                    RowKey = "Some ninja key"
                };

                // Act
                var result = MapperUnderTest.Map(entity);

                // Assert
                Assert.Equal(10, result.Level);
                Assert.Equal("Some fake name", result.Name);
                Assert.NotNull(result.Clan);
                Assert.Equal("Some clan name", result.Clan.Name);
                Assert.Equal("Some ninja key", result.Key);
            }
        }
    }
}
```

**The implementation:**

```csharp
namespace ForEvolve.Blog.Samples.NinjaApi.Mappers
{
    public class NinjaEntityToNinjaMapper : IMapper<NinjaEntity, Ninja>
    {
        public Ninja Map(NinjaEntity entity)
        {
            var ninja = new Ninja
            {
                Key = entity.RowKey,
                Clan = new Clan { Name = entity.PartitionKey },
                Level = entity.Level,
                Name = entity.Name
            };
            return ninja;
        }
    }
}
```

##### NinjaEntityEnumerableToNinjaMapper

`NinjaEntityEnumerableToNinjaMapper` implement `IMapper<IEnumerable<NinjaEntity>, IEnumerable<Ninja>>`.
Its role is to convert `Ninja` to `NinjaEntity`.

**The test:**

```csharp
namespace ForEvolve.Blog.Samples.NinjaApi.Mappers
{
    public class NinjaEntityEnumerableToNinjaMapperTest
    {
        protected NinjaEntityEnumerableToNinjaMapper MapperUnderTest { get; }
        protected Mock<IMapper<NinjaEntity, Ninja>> NinjaEntityToNinjaMapperMock { get; }

        public NinjaEntityEnumerableToNinjaMapperTest()
        {
            NinjaEntityToNinjaMapperMock = new Mock<IMapper<NinjaEntity, Ninja>>();
            MapperUnderTest = new NinjaEntityEnumerableToNinjaMapper(NinjaEntityToNinjaMapperMock.Object);
        }

        public class Map : NinjaEntityEnumerableToNinjaMapperTest
        {
            [Fact]
            public void Should_delegate_mapping_to_the_sinlge_entity_mapper()
            {
                // Arrange
                var ninja1 = new NinjaEntity();
                var ninja2 = new NinjaEntity();
                var ninjaEntities = new List<NinjaEntity> { ninja1, ninja2 };

                NinjaEntityToNinjaMapperMock
                    .Setup(x => x.Map(It.IsAny<NinjaEntity>()))
                    .Returns(new Ninja())
                    .Verifiable();

                // Act
                var result = MapperUnderTest.Map(ninjaEntities);

                // Assert
                NinjaEntityToNinjaMapperMock.Verify(x => x.Map(ninja1), Times.Once);
                NinjaEntityToNinjaMapperMock.Verify(x => x.Map(ninja2), Times.Once);
            }
        }
    }
}
```

**The implementation:**

```csharp
namespace ForEvolve.Blog.Samples.NinjaApi.Mappers
{
    public class NinjaEntityEnumerableToNinjaMapper : IMapper<IEnumerable<NinjaEntity>, IEnumerable<Ninja>>
    {
        private readonly IMapper<NinjaEntity, Ninja> _ninjaEntityToNinjaMapper;

        public NinjaEntityEnumerableToNinjaMapper(IMapper<NinjaEntity, Ninja> ninjaEntityToNinjaMapper)
        {
            _ninjaEntityToNinjaMapper = ninjaEntityToNinjaMapper ?? throw new ArgumentNullException(nameof(ninjaEntityToNinjaMapper));
        }

        public IEnumerable<Ninja> Map(IEnumerable<NinjaEntity> entities)
        {
            var count = entities.Count();
            var all = new Ninja[count];
            for (int i = 0; i < count; i++)
            {
                var entity = entities.ElementAt(i);
                var ninja = _ninjaEntityToNinjaMapper.Map(entity);
                all[i] = ninja;
            }
            return all;
        }
    }
}
```

#### The right side

As you can maybe deduce from `IMapper<TSource, TDestination>` and the `INinjaMappingService` definition (and the diagram), `INinjaMappingService` can simply inherit from `IMapper<TSource, TDestination>` with three different generic pairs.

The updated `INinjaMappingService` interface now looks like this:

```csharp
namespace ForEvolve.Blog.Samples.NinjaApi.Services
{
    public interface INinjaMappingService : IMapper<Ninja, NinjaEntity>, IMapper<NinjaEntity, Ninja>, IMapper<IEnumerable<NinjaEntity>, IEnumerable<Ninja>>
    {
    }
}
```

The tricky part of the diagram was to illustrate the `NinjaMappingService` class relations.

In words: `NinjaMappingService` implement `INinjaMappingService` and indirectly uses the three mappers.
This makes `NinjaMappingService` coupled only with the `IMapper` interface, which keeps our application loosely coupled.

The full description goes as follow:

-   `NinjaMappingService` implement `INinjaMappingService`.
-   `NinjaMappingService` use an `IMapper<NinjaEntity, Ninja>`. The runtime implementation will be `NinjaEntityToNinjaMapper`.
-   `NinjaMappingService` use an `IMapper<Ninja, NinjaEntity>`. The runtime implementation will be `NinjaToNinjaEntityMapper`.
-   `NinjaMappingService` use a `IMapper<IEnumerable<NinjaEntity>, IEnumerable<Ninja>>`. The runtime implementation will be `NinjaEntityEnumerableToNinjaMapper`.

This is the `Façade` I was talking about earlier. It gives access to the ninja mapping subsystem in a convenient and centralized way.
We could hide the individual mappers, we could create a mapping assembly, we could create a mapper factory, or we could have simply used `AutoMapper` :wink:.

The full `NinjaMappingService` looks like this:

```csharp
namespace ForEvolve.Blog.Samples.NinjaApi.Services
{
    public class NinjaMappingService : INinjaMappingService
    {
        private readonly IMapper<Ninja, NinjaEntity> _ninjaToNinjaEntityMapper;
        private readonly IMapper<NinjaEntity, Ninja> _ninjaEntityToNinjaMapper;
        private readonly IMapper<IEnumerable<NinjaEntity>, IEnumerable<Ninja>> _ninjaEntityEnumerableToNinjaMapper;

        public NinjaMappingService(
            IMapper<Ninja, NinjaEntity> ninjaToNinjaEntityMapper,
            IMapper<NinjaEntity, Ninja> ninjaEntityToNinjaMapper,
            IMapper<IEnumerable<NinjaEntity>, IEnumerable<Ninja>> ninjaEntityEnumerableToNinjaMapper
        )
        {
            _ninjaToNinjaEntityMapper = ninjaToNinjaEntityMapper ?? throw new ArgumentNullException(nameof(ninjaToNinjaEntityMapper));
            _ninjaEntityToNinjaMapper = ninjaEntityToNinjaMapper ?? throw new ArgumentNullException(nameof(ninjaEntityToNinjaMapper));
            _ninjaEntityEnumerableToNinjaMapper = ninjaEntityEnumerableToNinjaMapper ?? throw new ArgumentNullException(nameof(ninjaEntityEnumerableToNinjaMapper));
        }

        public NinjaEntity Map(Ninja entity)
        {
            return _ninjaToNinjaEntityMapper.Map(entity);
        }

        public Ninja Map(NinjaEntity entity)
        {
            return _ninjaEntityToNinjaMapper.Map(entity);
        }

        public IEnumerable<Ninja> Map(IEnumerable<NinjaEntity> entities)
        {
            return _ninjaEntityEnumerableToNinjaMapper.Map(entities);
        }
    }
}
```

Once again, pretty simple code: easy to read, test and reuse.

##### NinjaMappingService unit tests

The `NinjaMappingServiceTest` class code looks like:

```csharp
namespace ForEvolve.Blog.Samples.NinjaApi.Services
{
    public class NinjaMappingServiceTest
    {
        protected NinjaMappingService ServiceUnderTest { get; }
        protected Mock<IMapper<Ninja, NinjaEntity>> NinjaToNinjaEntityMapperMock { get; }
        protected Mock<IMapper<NinjaEntity, Ninja>> NinjaEntityToNinjaMapperMock { get; }
        protected Mock<IMapper<IEnumerable<NinjaEntity>, IEnumerable<Ninja>>> NinjaEntityEnumerableToNinjaMapperMock { get; }

        public NinjaMappingServiceTest()
        {
            NinjaToNinjaEntityMapperMock = new Mock<IMapper<Ninja, NinjaEntity>>();
            NinjaEntityToNinjaMapperMock = new Mock<IMapper<NinjaEntity, Ninja>>();
            NinjaEntityEnumerableToNinjaMapperMock = new Mock<IMapper<IEnumerable<NinjaEntity>, IEnumerable<Ninja>>>();
            ServiceUnderTest = new NinjaMappingService(
                NinjaToNinjaEntityMapperMock.Object,
                NinjaEntityToNinjaMapperMock.Object,
                NinjaEntityEnumerableToNinjaMapperMock.Object
            );
        }

        [Fact]
        public void Map_Ninja_to_NinjaEntity_should_delegate_to_NinjaToNinjaEntityMapper()
        {
            // Arrange
            var ninja = new Ninja();
            var expectedEntity = new NinjaEntity();
            NinjaToNinjaEntityMapperMock
                .Setup(x => x.Map(ninja))
                .Returns(expectedEntity);

            // Act
            var result = ServiceUnderTest.Map(ninja);

            // Assert
            Assert.Same(expectedEntity, result);
        }

        [Fact]
        public void Map_NinjaEntity_to_Ninja_should_delegate_to_NinjaEntityToNinjaMapper()
        {
            // Arrange
            var ninjaEntity = new NinjaEntity();
            var expectedNinja = new Ninja();
            NinjaEntityToNinjaMapperMock
                .Setup(x => x.Map(ninjaEntity))
                .Returns(expectedNinja);

            // Act
            var result = ServiceUnderTest.Map(ninjaEntity);

            // Assert
            Assert.Same(expectedNinja, result);
        }

        [Fact]
        public void Map_NinjaEntityEnumerable_to_NinjaEnumerable_should_delegate_to_NinjaEntityEnumerableToNinjaMapper()
        {
            // Arrange
            var ninjaEntities = new List<NinjaEntity>();
            var expectedNinja = new List<Ninja>();
            NinjaEntityEnumerableToNinjaMapperMock
                .Setup(x => x.Map(ninjaEntities))
                .Returns(expectedNinja);

            // Act
            var result = ServiceUnderTest.Map(ninjaEntities);

            // Assert
            Assert.Same(expectedNinja, result);
        }
    }
}
```

Once again, due to the subsystem design, our tests are more than simple!
Note that I am not testing the mapping here but the Façade.
Each mapper has also been tested individually.

_Feel free to post any questions that you may have in the comments._

## Refactoring NinjaEntityEnumerableToNinjaMapper

If we take a look at `NinjaEntityEnumerableToNinjaMapper`, we could easily create a more generalized implementation that would support any collection.

I will first rename `NinjaEntityEnumerableToNinjaMapper` to `EnumerableMapper`, which makes more sense.

Here is the code, I will explain it after:

```csharp
namespace ForEvolve.Blog.Samples.NinjaApi.Mappers
{
    public class EnumerableMapper<TSource, TDestination> : IMapper<IEnumerable<TSource>, IEnumerable<TDestination>>
    {
        private readonly IMapper<TSource, TDestination> _singleMapper;

        public EnumerableMapper(IMapper<TSource, TDestination> singleMapper)
        {
            _singleMapper = singleMapper ?? throw new ArgumentNullException(nameof(singleMapper));
        }

        public IEnumerable<TDestination> Map(IEnumerable<TSource> source)
        {
            var count = source.Count();
            var destination = new TDestination[count];
            for (int i = 0; i < count; i++)
            {
                var currentSource = source.ElementAt(i);
                var currentDestination = _singleMapper.Map(currentSource);
                destination[i] = currentDestination;
            }
            return destination;
        }
    }
}
```

What did I do:

1. I added two generic parameters: `TSource` and `TDestination`.
1. Changed `IMapper<NinjaEntity, Ninja>` to `IMapper<TSource, TDestination>`, which is now aligned with the class' generic parameters.
1. I also renamed variables to align their name with the new more generic aspect of the class.

Now, as long as a single entity mapper exist, we can map a collection, neat right?

As a proof of that, in the `NinjaEntityEnumerableToNinjaMapperTest`, the only thing that was updated is the class name:

![NinjaEntityEnumerableToNinjaMapperTest refactoring diff](//cdn.forevolve.com/blog/images/2017/vs-NinjaEntityEnumerableToNinjaMapperTest-refactoring-diff.png)

**After hitting the "Run all" button, all tests are still passing!**

That said, I will rename `NinjaEntityEnumerableToNinjaMapperTest` to `EnumerableMapperTest` and move stuff around a little to keep our test suite healthy.

```csharp
namespace ForEvolve.Blog.Samples.NinjaApi.Mappers
{
    public class EnumerableMapperTest
    {
        public class Map : EnumerableMapperTest
        {
            public class NinjaEntity2Ninja : Map
            {
                protected EnumerableMapper<NinjaEntity, Ninja> MapperUnderTest { get; }
                protected Mock<IMapper<NinjaEntity, Ninja>> NinjaEntityToNinjaMapperMock { get; }

                public NinjaEntity2Ninja()
                {
                    NinjaEntityToNinjaMapperMock = new Mock<IMapper<NinjaEntity, Ninja>>();
                    MapperUnderTest = new EnumerableMapper<NinjaEntity, Ninja>(NinjaEntityToNinjaMapperMock.Object);
                }

                [Fact]
                public void Should_delegate_mapping_to_the_single_entity_mapper()
                {
                    // Arrange
                    var ninja1 = new NinjaEntity();
                    var ninja2 = new NinjaEntity();
                    var ninjaEntities = new List<NinjaEntity> { ninja1, ninja2 };

                    NinjaEntityToNinjaMapperMock
                        .Setup(x => x.Map(It.IsAny<NinjaEntity>()))
                        .Returns(new Ninja())
                        .Verifiable();

                    // Act
                    var result = MapperUnderTest.Map(ninjaEntities);

                    // Assert
                    NinjaEntityToNinjaMapperMock.Verify(x => x.Map(ninja1), Times.Once);
                    NinjaEntityToNinjaMapperMock.Verify(x => x.Map(ninja2), Times.Once);
                }
            }
        }
    }
}
```

With this refactoring, the test name is more meaningful of its intent: `EnumerableMapperTest+Map+NinjaEntity2Ninja.Should_delegate_mapping_to_the_single_entity_mapper`.

To test more types combo, we could extract a generic representation of the test to reuse the code.
I will leave you to it because, for now, we do not need other collection mappers.

## The end of this article

### What have we covered in this article?

In this article:

1. We created the Ninja mapping subsystem that we will use in the `NinjaRepository`.
1. We explored the Façade design pattern.
1. We also used our test suite to refactor our subsystem, introducing a more flexible than its predecessor `EnumerableMapper`.
1. We also ensured that our test suite stays healthy by keeping it up to date.

### What's next?

In the next article:

1. We will finally implement the `NinjaRepository`.
1. We will use Azure Table Storage to store our ninja's data.
1. I will also introduce my in-development ForEvolve Framework that will help us access our data.

{% include design-patterns-web-api-service-and-repository/footer.md %}
