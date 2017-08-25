---
title:  "Design Patterns: Asp.Net Core Web API, services, and repositories"
subtitle: "Part 9: the NinjaMappingService"
date:   2017-09-08 00:00:00 -0500
post-img: "//cdn.forevolve.com/blog/images/articles-header/2017-07-00-asp-net-core-design-patterns.png"
lang: en
categories: en/articles
tags: 
- Design Patterns
- Asp.Net Core
- Web API
- C#
- Unit Test
- XUnit
- Façade Pattern
- Repository Pattern
- NoSQL
- Azure
- Azure Table Storage
- ForEvolve Framework
proficiency-level: Intermediate
---

TODO...<!--more-->

[Skip the shared part](#ninjamappingservice)

{% include design-patterns-web-api-service-and-repository/series.md %}

## NinjaMappingService
Before going further, we will create an `INinjaMappingService` interface that will become our "ninja mapping hub."

The `INinjaMappingService` responsibility is to offer a centralized and convenient way to convert `Ninja` to `NinjaEntity` and vice versa.
We will also need to convert `IEnumerable<NinjaEntity>` to `IEnumerable<Ninja>` (for the `ReadAll*()` methods).

In its current state, our Ninja App does not need to convert `IEnumerable<Ninja>` to `IEnumerable<NinjaEntity>` so we will omit that functionality to keep our project clean of useless code.
If the need of such operation ever arises, we will add it then, and only then.

> I could have added those methods directly in the `NinjaRepository` class, but remember SOLID and it single responsibility principle (SRP): **A class should have only one reason to change**.

``` csharp
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
            <iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="//ws-na.amazon-adsystem.com/widgets/q?ServiceVersion=20070822&OneJS=1&Operation=GetAdHtml&MarketPlace=US&source=ac&ref=tf_til&ad_type=product_link&tracking_id=forevolve-20&marketplace=amazon&region=US&placement=059652773X&asins=059652773X&linkId=c1c10bedd9bfd94c53969aefe3e249a0&show_border=false&link_opens_in_new_window=true&price_color=404040&title_color=007f00&bg_color=ffffff"></iframe>
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

- `Ninja Map(NinjaEntity entity);` reference color is blue.
- `NinjaEntity Map(Ninja ninja);` reference color is green.
- `IEnumerable<Ninja> Map(IEnumerable<NinjaEntity> entity);` reference color is yellow.

Let's take a look:

[![Ninja Mapper diagram](//cdn.forevolve.com/blog/images/2017/ninja-mapper-diagram.gif)](//cdn.forevolve.com/blog/images/2017/ninja-mapper-diagram.gif)

The first large red interface is a generic mapping interface with only one method defined: the `Map` method.

``` csharp
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

- `NinjaEntityToNinjaMapper` will implement `IMapper<NinjaEntity, Ninja>`
- `NinjaToNinjaEntityMapper` will implement `IMapper<Ninja, NinjaEntity>`
- `NinjaEntityEnumerableToNinjaMapper` will implement `IMapper<IEnumerable<NinjaEntity>, IEnumerable<Ninja>>`

I will skip the implementation details since it is a little out of scope, but the full implementation and the tests are available at [GitHub](https://github.com/ForEvolve/ForEvolve.Blog.Samples/tree/master/8.%20NinjaApi%20-%20NinjaRepository/src/ForEvolve.Blog.Samples.NinjaApi/Mappers).
I will only keep the implementation of `NinjaMappingService` in the article.

> This is a very flexible design where each mapper is independent.

#### The right side

As you can maybe deduce from `IMapper<TSource, TDestination>` and the `INinjaMappingService` definition (and the diagram), `INinjaMappingService` can simply inherit from `IMapper<TSource, TDestination>` with three different generic pairs.

The updated `INinjaMappingService` interface now looks like this:

``` csharp
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

- `NinjaMappingService` implement `INinjaMappingService`.
- `NinjaMappingService` use an `IMapper<NinjaEntity, Ninja>`. The runtime implementation will be `NinjaEntityToNinjaMapper`.
- `NinjaMappingService` use an `IMapper<Ninja, NinjaEntity>`. The runtime implementation will be `NinjaToNinjaEntityMapper`.
- `NinjaMappingService` use a `IMapper<IEnumerable<NinjaEntity>, IEnumerable<Ninja>>`. The runtime implementation will be `NinjaEntityEnumerableToNinjaMapper`.

This is the `Façade` I was talking about earlier. It gives access to the ninja mapping subsystem in a convenient and centralized way.
We could hide the individual mappers, we could create a mapping assembly, we could create a mapper factory, or we could have simply used `AutoMapper` :wink:.

The full `NinjaMappingService` looks like this:

``` csharp
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

### Unit tests
To keep the article shorter, I omitted the full mapping subsystem implementation and testing.
However, again, all the code is available on GitHub:

- [Mappers tests](https://github.com/ForEvolve/ForEvolve.Blog.Samples/tree/master/8.%20NinjaApi%20-%20NinjaRepository/test/ForEvolve.Blog.Samples.NinjaApi.Tests/Mappers)
- [NinjaMappingServiceTest](https://github.com/ForEvolve/ForEvolve.Blog.Samples/blob/master/8.%20NinjaApi%20-%20NinjaRepository/test/ForEvolve.Blog.Samples.NinjaApi.Tests/Services/NinjaMappingServiceTest.cs)

Also feel free to post any questions that you may have in the comments.

The `NinjaMappingServiceTest` class code looks like:

``` csharp
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
Each mapper has been previously tested individually (see the [source code](https://github.com/ForEvolve/ForEvolve.Blog.Samples/tree/master/8.%20NinjaApi%20-%20NinjaRepository/test/ForEvolve.Blog.Samples.NinjaApi.Tests/Mappers) or more information).

