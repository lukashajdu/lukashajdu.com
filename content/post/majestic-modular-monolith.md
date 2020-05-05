---
title: "Majestic Modular Monoliths"
date: "2020-05-05T12:01:00Z"
tags: ["Notes", "Monolith", "Refactoring"]
categories: ["Development"]
---

The microservice architecture is trendy over the last few years. However, there are more
and more cases when companies are moving from microservices back to monoliths.<!--more-->

I came to the [Majestic modular monolith] talk by Axel Fontaine from watching
the [Deconstructing the Monolith] talk at Shopify. The talk gives an excellent overview of choices
when it comes to refactoring with rational reasons why microservices are not always the best solution. 

These are my notes from the presentation.

{{< toc >}}
# Table of contents
<!-- TOC -->
- [Reducing cognitive load](#reducing-cognitive-load)
- [Architecture styles](#architecture-styles)
    - [What can they offer?](#what-can-they-offer)
    - [Modular monolith](#modular-monolith)
    - [Layered architecture](#layered-architecture)
- [Domain-Driven Design (DDD)](#domain-driven-design-ddd)
    - [Acyclic dependencies](#acyclic-dependencies)
    - [Module boundaries and structure](#module-boundaries-and-structure)
- [Code isolation](#code-isolation)
- [Relational databases](#relational-databases)
    - [Modular application database structure](#modular-application-database-structure)
    - [Data isolation](#data-isolation)
- [Scaling](#scaling)
    - [Scaling asymmetrically](#scaling-asymmetrically)
- [Conclusions](#conclusions)
<!-- /TOC -->
{{</ toc >}}

# Reducing cognitive load

Code starts in our head and ends up running on a physical device. The code size is not
a problem for machine or compiler because the machine doesn’t have issues with processing more classes.
The real bottleneck is on our side.

We are reading code and trying to understand it 95% of our time. Because of this,
we should optimise our code for reading. The optimisation can be done in multiple ways such as
adding structure to our code, raising the abstraction level or reducing the cognitive load (better understanding).

![Abstraction layers](/img/majestic-modular-monolith/abstraction-layers.svg "Abstraction layers")

Some of the tools for reducing cognitive load and increasing the abstraction level are methods, classes,
packages, modules and applications.

Architecture is an interaction and relationship between these.

# Architecture styles

There are two popular architecture styles for the last few years —monolith with
a very negative view and microservices with a very positive view, mainly because of the tech giants.

![Majestic monolith](/img/majestic-modular-monolith/monolith.png "Majestic monolith")

However, we should rectify and use more objective terms to name these architectural styles.
We should think about the styles in terms of deployment. A monolith would be an integrated system
and microservices a distributed system.

![Integrated vs distributed system](/img/majestic-modular-monolith/integrated-distributed-system.svg "Integrated vs distributed system")

## What can they offer?

We can’t treat a monolith and microservices as black & white because there are advantages
and disadvantages in both of them.

{{< table "table table-striped" >}}
| Monolith | Microservice |
|-----------------------------------|----------------------------------------------------------------|
| One artefact | Many individual services |
| Entanglement risk | Focus on clear small units |
| Simple method calls | Unreliable network calls |
| All parts always up and available | Service discovery + internal load balancing + circuit breakers |
| Easy interface refactoring | Difficult to refactor |
| Application scales as a unit | Services scale individually |
| One database | Polyglot persistence |
| Transactions | Eventual consistency |
| One platform | Platform choice |
| Forced dependency convergence | Works with compatible versions |
| Limited team parallelisation | Easy team parallelisation |
{{</ table >}}

Monoliths can be useful at the lower end in small organisations with simple apps. On the other side,
microservices are essential at the higher end in large organisations with a strong division of labour
and complex applications.

## Modular monolith

The modular monolith combines the advantages of both architectural styles. It provides simplicity in terms
of deployment and physical architecture of the monolith, and logical architecture of microservices.

![Modular monolith](/img/majestic-modular-monolith/modular-monolith-in-between.svg "Modular monolith")

## Layered architecture

Monoliths often have a bad reputation and are criticised for their structure, but this is not actually true.
Most monoliths have some kind of structure.

![Monolith perception](/img/majestic-modular-monolith/monolith-percaption.png "Monolith perception")

This structure may not be perfect, and it can be slightly leaky, but it is usually recognisable.
We can often see controllers, services, repositories and perhaps model layers. This layered architecture
is pervasive and is very common. It is part of many scaffolding tools and frameworks.

Our software might contain different large functional areas such as customer, invoice and payment.
In theory, they might look like this:

![Domains structure in theory](/img/majestic-modular-monolith/theoretical-domain-structure.svg "Domains structure in theory")

However, things and requirements we start to implement become less clear over time. The structure starts
being more complicated as the application grows. We begin to use a little bit of this
in one service with a little bit of that in another service, and we end up with broken boundaries
between our functional areas.

![Domains structure in reality](/img/majestic-modular-monolith/real-domain-structure.svg "Domains structure in reality")

To tackle this kind of problems we can use Domain-Driven Design.

# Domain-Driven Design (DDD)

DDD was introduced in 2004 by Eric Evans in his book Domain-Driven Design, and it will help us dividing
our application into logical pieces, modules. DDD brings us ideas like aggregates and aggregate roots.
The aggregate brings cohesive functionality in our application that fits together and has
a low coupling to the outside world. The aggregate root is an entity which serves as
an entry point to the aggregate.

![Domain design](/img/majestic-modular-monolith/domain-design.svg "Domain design")

## Acyclic dependencies

When it comes to modules, at some point, we will need to have some interaction between them.
This interaction brings us dependencies. We should be aware of which direction data between modules flows.
We want to have dependencies with no cycles between modules which will form an acyclic graph. In this graph,
an unstable concept depends on a stable concept.

![Acyclic dependencies](/img/majestic-modular-monolith/acyclic-dependencies.svg "Acyclic dependencies")

## Module boundaries and structure

When it comes to module boundaries within our application, we should look for highly cohesive blocks
of functionality. We aim for low coupling to the other modules. Highly cohesive blocks with low coupling
could be done by exposing only a small, well-defined API to the rest of the application outside
the module revolved around the aggregate root. All the other entities and implementations
should be private to the module and not visible anywhere else to reduce the cognitive load.

Interaction between modules should only depend on the API of other modules, not the implementation.
In this situation, one API can depend on another API or implementation can depend on another API,
but implementations can’t directly depend on each other.

![Module boundaries](/img/majestic-modular-monolith/module-boundaries.svg "Module boundaries")

# Code isolation

We have a spectrum of possibilities at our disposal to isolate code in reality. These are possibilities in Java:

**Separate packages**: the simplest option is to have one module, one JAR, and we use a separate package
to represent our modules. All the functionality is built together as a part of the same application.
This approach works well for tiny systems.

**Maven module**: we start looking at modules at the build tool level. We begin to have a JAR per module,
enforced acyclic dependency graph at the build tool level and class by isolation enforced
by the build tool as well. All the modules are still using the same repository.

**Separate repositories**: the next step up is to move code into separate repositories, version it separately
and then we integrate it at the end like a library in your app.

**External service**: we can pull the functionality out of the main application and move the code
into separate services that we can deploy separately.

![Code isolation](/img/majestic-modular-monolith/monolith-microservice-options.svg "Code isolation")

The spectrum of choices for the integrated system or monolith is broad as you can see in the image above.
Once we’ve exhausted all the options for monoliths, we move to the microservice side. The idea is always
to start with the most straightforward approach which could work in our context, and once we reach
the limit, we should go to the next one.

With a relatively small change, we can gain a whole bunch of compelling functionality for the monolith.
We have restricted compile classpath, enforcement of the acyclic graph at a build tool level. We can partially
rebuild the project, and it’s easy to see the forest through the trees by looking at auto-generated diagrams from IDEs.

One of the big problems that this doesn’t solve is transitive dependencies to conflicting versions
of the same library (JAR Hell).

![JAR Hell](/img/majestic-modular-monolith/jar-hell.svg "JAR Hell")

<p class="no-bottom-margin">
There are several solutions to tackle this problem:
</p>

- limiting dependencies will reduce the probability of conflicts
- preferring libraries with zero transitive dependencies will make the dependency graph much easier to understand
  and much more predictable over time.
- enforcing dependency convergence by build tools will ensure we have the same version
  of used 3rd party libraries across all modules
- final possibility if none of the previous options work is to copy and paste all the code
  of the conflicting library under our namespace

# Relational databases

Code usually isn’t useful without persisting data somewhere. Relational databases are still dominant
on the market these days. They provide us with valuable features out of the box, such as referential
integrity and atomic transactions.

## Modular application database structure 

With our modular application, we want to follow certain rules.

**Database object per module**: we need to ensure that each module only accesses its tables or database objects.

![Modular monolith database mapping](/img/majestic-modular-monolith/modular-monolith-db-mapping.svg "Modular monolith database mapping")

**No shared tables between modules**: if we take a closer look at the database on the image above we can see
that for every module that we have on the top, we have an equivalent set of database objects
on the bottom and every module is only accessing its collection. There is no sharing of tables
or objects between modules.

**No cross-module joins**: we don’t want joins between modules because we want to keep our options open
for the spectrum of code isolation. We want to have joins only between tables of the same module.
Once we get to a point where the integrated system isn’t enough for a module, we want to be able
to pull it out into an independent service. It will be difficult to achieve if we would have joins
on the database level. Joins should be handled by the APIs.

**Referential integrity**: we can still maintain referential integrity and transactions because if we want
to separate a module later, we could just remove the foreign key relationship and then move
that part of the data in its separate persistence entity away from the rest of the database.
Until we need to do that we can still reap all the benefits.

If we follow the rules above, our architecture will look more like this:

![Modular monolith database](/img/majestic-modular-monolith/modular-monolith-db.svg "Modular monolith database")

We have our modules represented by APIs, and their private implementations are accessing their closed subset
of the data in the database.

## Data isolation

In terms of data isolation between modules, we have again, a spectrum of choices.

**Separate tables**: the simplest option is to use the same database technology with the same database
and the same schema. Every module has its own set of tables in this option. However, this option gets
more complicated with the increasing size of the database. It’s easy to accidentally create joins between tables
belonging to different modules.

**Separate schema**: another step up is to use a database schema which provides namespacing. It allows
to group together a bunch of database objects logically.

**Separate database**: following option is to move some of the schemas along with modules into their
separate databases. We keep the same database technology to have just one set of expertise we need
to manage in-house on the operations side.

**Other persistence**: if our current technology to underpin the persistence of our modules isn’t appropriate
for what we need, and we need to move to a vastly different type of persistence, the last step is to move out.

![Database isolation](/img/majestic-modular-monolith/database-isolation-options.svg "Database isolation")

If we are using relational data at some point, we will need to manage the structure of our schemas to be able
to evolve it over time with our application. It’s highly recommended to use a tool for that instead
of doing it manually.

# Scaling

Scaling is a big topic when it comes to microservices. The spectrum of choices we have before we exhaust
the possibility of being able to scale up is vast. Mainly because we are not limited to one instance,
but if we need to scale up our modular monolith beyond the size of that, we can also have multiple of those instances.

![EC2 scaling](/img/majestic-modular-monolith/scaling.svg "EC2 scaling")

## Scaling asymmetrically

Sometimes we don’t want to scale individual modules at the same rate. We might have certain parts
of our application that may demand more capacity than others. There is again a spectrum of possibilities
on how to deal with this.

**Executor service**: assign different capacity to different modules with varying services of executor.
If we have available virtual CPUs, then we can assign a higher number of threads to the module that requires
more processing power and fewer threads to the module on the other end.

**RDBMS queue**: in case we require asynchronous communication between modules, the often-overlooked solution
is to use our relational database as a queue. We can use a simple `id: payload` structure for creating
our queue table. To consume queue messages we can, with PostgreSQL for example, issue a `DELETE` statement against
the queue to remove an item from that queue. We select one item from the top of the queue, and we lock it for updates.
If another consumer already locked the item, we have the `SKIP LOCKED` option. The `SKIP LOCKED` option says
to a consumer not to wait for this item to be released and skip on the next one. In practice, if the message from
the queue is successfully processed, we commit the transaction, and the item is atomically removed from
the queue with the delete statement. In case of an exception, we rollback the transaction,
and the message ends back in the queue.

**Dedicated queue**: if we reach capacity levels of your database, we can look at moving to a dedicated
queuing system where we can deal with a very high capacity (if that’s a concern).

![Database scaling](/img/majestic-modular-monolith/database-scaling.svg "Database scaling")

# Conclusions

Breaking up a monolith into microservices is a hot topic over the last few years. However, it's often not necessary. 
In many cases, it is only a good excuse to move on something more trendy. Microservices can bring us many benefits, 
but if the organisation has no solid clean architecture foundations, then this can end up in a distributed monolith 
which brings the worse from both architectural styles.

The modular monolith is for most companies the best, pragmatic approach combining the simplicity of monoliths with 
the structure and focus of microservices.

[majestic modular monolith]: https://youtu.be/BOvxJaklcr0
[deconstructing the monolith]: https://youtu.be/ISYKx8sa53g
