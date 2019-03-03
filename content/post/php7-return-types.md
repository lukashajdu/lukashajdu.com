---
title: "PHP 7 return type hinting: class name vs self"
date: "2019-03-03T12:01:00Z"
tags: ["php"]
categories: ["Development"]
---

The return type declarations require functions to return certain data type at call time.
It clarifies expected usage of code and helps IDEs with autocomplete functionality without
need of [PhpDoc](https://phpdoc.org/) comments.<!--more-->

As of version 7, PHP added support for [return type declaration](https://secure.php.net/manual/en/functions.returning-values.php#functions.returning-values.type-declaration)
and as of version 7.1 [void return type](https://secure.php.net/manual/en/migration71.new-features.php#migration71.new-features.void-functions)
and [nullable return values](https://secure.php.net/manual/en/migration71.new-features.php#migration71.new-features.nullable-types).

Let's create an imaginary car factory class `CarFactory` to play with the
return type hinting.

When using [fluent interface](https://en.wikipedia.org/wiki/Fluent_interface) for a method chaining,
you might be using class name in a return type hint similar to this:

```
public function addEngine(EngineInterface $engine): CarFactory
{
    $this->engine = $engine;

    return $this;
}
```

You might save some typing using `self` keyword, which refers to the class
in which it is called, instead of a class name. The method declaration might
look similar to this:

``` 
public function addWheel(WheelInterface $wheel): self
{
    $this->wheels[] = $wheel;

    return $this;
}
``` 

The question is. Can we save some typing at interface and trait declarations?

Let's create the `CarFactoryInterface` and let's declare a method to add a car body:

```
public function addBody(BodyInterface $body): CarFactory;
```

The declaration defines a return type `CarFactory` for the method.

Now we might add an engine to the body and use the `self` keyword instead:

```
public function addEngine(EngineInterface $engine): self;
```

If we try to make a car now:

```
$carFactory = new \Lh\CarFactory();
$carFactory
    ->addBody(new \Lh\SportBody())
    ->addEngine(new \Lh\V8Engine())
;
```

We will get a PHP Fatal error:
```
 PHP Fatal error:  Declaration of Lh\CarFactory::addEngine(Lh\EngineInterface $engine): Lh\CarFactory must be compatible with Lh\CarFactoryInterface::addEngine(Lh\EngineInterface $engine)
```

This is because the `self` keyword refers to the `CarFactoryInterface` instead
of the `CarFactoryInterface`. 

Are we going to get the same result if we use `self` in a trait?

Let's create a door adding functionality to our `CarFactory` class and create
a trait for this:

``` 
trait DoorTrait
{
    /** @var DoorInterface[] */
    private $doors;

    public function addDoor(DoorInterface $door): self
    {
        $this->doors[] = $door;

        return $this;
    }
}

// ---

class CarFactory implements CarFactoryInterface
{
    use DoorTrait;
    
    ...
}
```

We can update the car manufacturing process and run our script:

```
$carFactory = new \Lh\CarFactory();
$carFactory
    ->addBody(new \Lh\SportBody())
    ->addEngine(new \Lh\V8Engine())
    ->addDoor(new \Lh\SportDoor())
;
```

We will find that no errors occur this time. This is because the traits are
essentially language assisted copy and paste, which happens at the code execution.
The `self` keyword thus refers to the `CarFactory` where it is `use`d instead of
the `DoorTrait` itself. 

This can be useful if we use traits to reuse some functionality with fluent interface
and various return types.

How to use declare methods in an interface if we want to use the `self`
as our return type hint then?

We might declare methods with a concrete return type hint or don't declare
a type hint and override the declaration in a class which implements the interface:

```
interface CarFactoryInterface
{
    public function addEngine(EngineInterface $engine): CarFactory;
    
    public function addDoor(DoorInterface $door);
    
    ...
}
```

The whole code example can by found [here](https://github.com/lukashajdu/lh-blog-codes/tree/master/php7-function-return-types)
