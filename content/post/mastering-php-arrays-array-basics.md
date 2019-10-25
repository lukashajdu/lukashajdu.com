---
title: "Mastering PHP arrays: Array basics"
date: "2019-03-08T09:01:00Z"
tags: ["php", "array"]
categories: ["Development"]
---

An [array](http://php.net/manual/en/language.types.array.php) is one of the most powerful
and flexible data types in PHP.<!--more-->

Arrays are ordered collections of items, called array elements,
and are actually an implementation of ordered maps or more precisely
[hash tables](http://en.wikipedia.org/wiki/Hash_table).

Arrays are flexible in defining keys and values. They are capable of storing
any value, including other arrays, trees and multidimensional arrays. Every value
has its key although it is not defined implicitly by its definition.

# Creating arrays

An array can be created using the [array()](http://php.net/manual/en/function.array.php)
language construct or as of PHP 5.4 short array syntax `[]`. Array elements can
be assigned to variable in multiple ways:

```php
<?php

$array1 = array();
$array2 = [];       // as of PHP 5.4

$array1[] = 11;
$array1[] = 2;
$array1[] = 0;

$array3 = array(11, 2, 0);

$array4 = [
    'a' => 'A',
    20  => 'bar',
    'x' => 'baz',
    55,
    '22' => 2015,
    null => null,
    '012' => 'Hello',
    true => 'World',
    3.14 => 'Phi',
];
```

Variables `$array1` and `$array2` have assigned empty array. Variable `$array2`
has an empty array value assigned by short syntax.

Variable `$array1` is filled with values `11`, `2` and `0` afterwards. These values are appended
to the empty array using assign operator and square bracket syntax: `array[key] = value`. 
Since every member of an array must have a key, a numeric key starting from `0` is assigned
to every element automatically.

An array construct enables to fill the array with values at its creation using 
`index => value` syntax separated by commas. When an index is omitted, the integer
index is automatically generated. The variable `$array3` is created using array
construct parameters and it's identical to the `$array1`.

Variable `$array4` is created using short array syntax and it's filled with mixed key data types.
The last element of the array has a trailing comma. While unusual, it is a valid syntax.
It's a good practice to leave a trailing comma in multiline array definitions.

PHP supports only integer and strings keys. Other data types are cast to these two
based on casting rules.


## Handling array keys

Array keys are unique values and can be either integers or strings. Data type other
then this will be cast to these data types by following casting rules:

{{< table "table table-striped table-borders" >}}
| Data type    | Cast to        | Original value                | Cast value           | Notice                                                                                  |
|--------------|----------------|-------------------------------|------------------------|-----------------------------------------------------------------------------------------|
| [String](http://php.net/manual/en/language.types.string.php)       | [Integer](http://php.net/manual/en/language.types.integer.php)/[String](http://php.net/manual/en/language.types.string.php) | `"3"` / `"03"` | `3` / `"03"` | valid decimal integers will be cast to the integer type, other numbers will not be cast |
| [Float](http://php.net/manual/en/language.types.float.php)        | [Integer](http://php.net/manual/en/language.types.integer.php)        | `3.14`                   | `3`                 | fractional part will be truncated                                                       |
| [Bool](http://php.net/manual/en/language.types.boolean.php)         | [Integer](http://php.net/manual/en/language.types.integer.php)        | `true`                    | `1`                 | the key `true` will actually be stored under `1` and the key `false` under `0`                  |
| [Null](http://php.net/manual/en/language.types.null.php)         | [String](http://php.net/manual/en/language.types.string.php)         | `null`                          | `""`           | key `null` will actually be stored under `""`                                               |
| [Array](http://php.net/manual/en/language.types.array.php)/[Object](http://php.net/manual/en/language.types.object.php) |                |                               |                        | illegal type; will produce `Warning: Illegal offset type ...` error                                                                            |
{{</ table>}}

Note that array keys are case-sensitive but type insensitive and elements with same keys
are overwritten with a later declaration. Arrays are type insensitive because they
are using a special type of hash table called [symtable](http://www.phpinternalsbook.com/hashtables/array_api.html).
Integers and numeric strings in a symtable are considered identical and because
of this value stored in an array as `$array['1']` can be also accessed as `$array[1]`.

Typecasting and overwriting example:

```php
<?php

$array = [
    '0'     => 'apple',
    0       => 'banana',
    false   => 'lemon',
    0.999   => 'orange',
    '1'     => 'melon'
];
```

Finally this array will contain only element with key `0` and value `'orange'` and
element with key `1` and value `'melon'`.

Arrays are limited by implementation of hash tables and its maximum number of elements,
and the [memory_limit](http://php.net/manual/en/ini.core.php#ini.sect.resource-limits).
The maximum number of elements depends on OS architecture. Enumerative arrays
are also limited by the maximum size of an integer.

Let's consider this example:

```php
<?php

// PHP_INT_MAX = 2^63-1 for tested OS
for ($index = -2; $index <= 2; ++$index) {
    $array[PHP_INT_MAX + $index] = $index;
}
```

An array from the example above will look like this:

```bash
Array
(
    [9223372036854775805] => -2
    [9223372036854775806] => -1
    [9223372036854775807] => 0
    [-9223372036854775808] => 2
)
```

After the `PHP_INT_MAX` limit was exceeded, overflow happened and a value with a key
`-9223372036854775808` was overwritten with the later declaration of the value.

## Enumerative vs. Associative arrays

Arrays can roughly be divided into two categories:

- __Enumerative:__ indexed using only numerical indexes
- __Associative:__ indexed using arbitrary indexes

PHP arrays can contain integer and string keys at the same time as PHP does not distinguish
between indexed and associative arrays. This enables to create an enumerative array,
insert associative element to it and PHP will still maintain elements of an enumeration.

Let's see an example:

```php
<?php

$array = [1, 2, 3];
$array['bar'] = 'baz';
$array[] = 4;
```

An array from the example above will look like this:

```bash
Array
(
    [0] => 1
    [1] => 2
    [2] => 3
    [bar] => baz
    [3] => 4
)
```

After an associative element was added, PHP automatically assigned a numeric key
to the next element, which is equal to the greatest existing numeric key plus one.
Note that array keys are indexed from 0 and they don't determine the order of its elements.
PHP is maintaining the array order by its internal pointer.

Because there is no correlation between the array pointer and element keys.
We can insert elements with keys which are not sequential:

```php
<?php

$array[-10] = 'foo';
$array[10] = 4;
$array[8] = 8;
$array[] = 2000;
```

An array from the example above will look like this:

```bash
Array
(
    [-10] => foo
    [10] => 4
    [8] => 8
    [11] => 2000
)
```

PHP automatically assigned a numeric key `11` (`10+1`) to the value `2000`.


# Printing arrays

To debug a script, it is often needed to output variable values. PHP provides
2 functions which are capable to do this:

- [print_r()](http://php.net/manual/en/function.print-r.php): displays information
 in a way that's readable by humans; capable to return the information rather
 than print it (capturing output)
- [var_dump()](http://php.net/manual/en/function.var-dump.php): displays structured
 information that includes its type and value; capable of outputting multiple
 variables at the same time

```php
<?php

$array = [
    'foo' => 'bar',
    100  => 'baz',
];

print_r($array);

$capturedOutput = print_r($array, true);
echo $capturedOutput;

var_dump($array);
```

The example above will output:

```bash
Array
(
    [foo] => bar
    [100] => baz
)

Array
(
    [foo] => bar
    [100] => baz
)

array(2) {
  ["foo"]=>
  string(3) "bar"
  [100]=>
  string(3) "baz"
}
```


## Array reconstruction

PHP also provides [var_export()](http://php.net/manual/en/function.var-export.php),
a function which outputs or returns structured information about the given variable.
The returned value is a valid PHP code and can be used for reconstruction.

```php
<?php

var_export(['Hello', 'World']);
```

The example above will output:

```bash
array (
  0 => 'Hello',
  1 => 'World',
)
```

Note missing trailing semicolon.


# Accessing array elements

Array elements can be accessed using the square bracket syntax: `array[key]`.

```php
<?php

$array['greeting'] = 'Hello';
$array[] = 100;
$array['beverage'] = [
    'alcoholic' => 'Wine',
    'non-alcoholic' => 'Water',
];

print_r($array);
```

This will output:

```bash
Array
(
    [greeting] => Hello
    [0] => 100
    [beverage] => Array
        (
            [alcoholic] => Wine
            [non-alcoholic] => Water
        )

)
```

Now we can access array elements like this:

```php
<?php

var_dump(
    $array['greeting'],
    $array[0],
    $array['beverage']['alcoholic']
);
```

Which will output:

```bash
string(5) "Hello"
int(100)
string(4) "Wine"
```

Array elements can be also accessed using curly braces similar to square brackets.
Both of them do the same thing (e.g. `$array['beverage']['alcoholic']`
and `$array{'beverage'}{'alcoholic'}`). Elements can be accessed even using
mixed syntax (e.g. `$array{'beverage'}['alcoholic']`).

The square bracket syntax is more commonly used.

# Deleting arrays and removing array elements

To remove a key-value pair or delete a whole array use the function
[unset()](http://php.net/manual/en/function.unset.php):

```php
<?php

$fruit = ['banana', 'pear', 'blackberry', 'kiwifruit'];
unset($fruit[0]);
var_dump($fruit);
```

The example above will output:

```bash
array(3) {
  [1]=>
  string(4) "pear"
  [2]=>
  string(10) "blackberry"
  [3]=>
  string(9) "kiwifruit"
}
```

Destroying the whole array:

```php
<?php

unset($fruit);
var_dump($fruit);
```

The example above will output:

```bash
NULL
```

An array can be also removed by overwriting with `null`:

```php
<?php

$vegetable = ['carrot', 'tomato', 'cabbage'];
$vegetable = null;
```

This will have similar effect to the [unset()](http://php.net/manual/en/function.unset.php).


# Determining arrays

Array variables can be determined using [is_array()](http://php.net/manual/en/function.is-array.php) function.
This function finds whether the given variable is an array and returns a boolean value.

```php
<?php

$object = new stdClass;
$array1 = array();
$array2 = array(1);

var_dump(
    is_array($object),
    is_array($array1),
    is_array($array2)
);

```

The above example will output:

```bash
bool(false)
bool(true)
bool(true)
```

## Determining associative and enumerative arrays

Sometimes it's needed to determine whether an array has only numeric keys or is associative.
PHP does not distinguish between indexed and associative arrays and handles both types
in the same way. There is no native function to do this, but there is an 
[elegant solution](http://stackoverflow.com/questions/173400/how-to-check-if-php-array-is-associative-or-sequential/4254008#4254008).

To determine whether an array is associative or not this function can be used:

```php
<?php

function is_assoc($array) {
  return (bool) count(array_filter(array_keys($array), 'is_string'));
}
```

Example usage of the `is_assoc()` function:

```php
<?php

$associativeArray = is_assoc(['color' => 'blue', 'number' => 10]);
$enumerativeArray = is_assoc(['red', 'black', 'yellow']);

var_dump($associativeArray);
var_dump($enumerativeArray);
```

The above code example will output:

```bash
bool(true)
bool(false)
```

The `is_assoc()` function is using an array function which extracts array keys using
the [array_keys()](http://php.net/manual/en/function.array-keys.php) function. The output
is subsequently filtered using the [array_filter()](http://php.net/manual/en/function.array-filter.php)
function with the [is_string()](http://php.net/manual/en/function.is-string.php)
function as a callback. If at least one of array keys contains string, `true` is returned
or `false` is returned otherwise. Count of keys containing string is determined using
the [count()](http://php.net/manual/en/function.count.php) function and subsequently casted
to a boolean value using `(bool)`.

An enumerative array can be determined using negation if this function or creating
a new function similar to this one using a different filter callback function.

# Comparing arrays

Arrays can be compared using equality operator `==` or identity operator `===`:

```php
<?php

$array1 = [1, 2, 3];
$array2 = [2 => 3, 1 => 2, 0 => 1];
$array3 = ['a' => 1, 'b' => 2, 'c' => 3];

var_dump($array1 == $array2);
var_dump($array1 === $array2);
var_dump($array1 == $array3);
```

This will output:

```bash
bool(true)
bool(false)
bool(false)
```

In both comparison types keys and values are compared. The two arrays are equal when
each of them contain the same key-value associations. The identity operator examines
also order of an array elements.

Sometimes it's needed to compare only keys or values. This can be done using same
comparison methods as the above and one of the [array_keys()](http://php.net/manual/en/function.array-keys.php)
or [array_values()](http://php.net/manual/en/function.array-values.php) function:

```php
<?php

$array1 = [1, 2, 3];
$array2 = [2 => 3, 1 => 2, 0 => 1];
$array3 = ['a' => 1, 'b' => 2, 'c' => 3];
$array4 = ['a' => 'black', 'b' => 'red', 'c' => 'green'];

var_dump(array_values($array1) == array_values($array2));
var_dump(array_values($array1) === array_values($array2));
var_dump(array_values($array1) == array_values($array3));
var_dump(array_values($array1) === array_values($array3));
var_dump(array_keys($array3) === array_keys($array4));
```

The above example will output:

```bash
bool(false)
bool(false)
bool(true)
bool(true)
bool(true)
```

Note that the [array_keys()](http://php.net/manual/en/function.array-keys.php)
and the [array_values()](http://php.net/manual/en/function.array-values.php) function
is reindexing original array keys.


# Unravelling and dereferencing arrays

Array elements are often assigned to variables. This can be done using one of accessing methods
individually or using [list()](http://php.net/manual/en/function.list.php) construct shortcut:

```php
<?php

$array = [
    'London',
    '8,416,535',
    '1,572.00',
    'England',
];

list($city, $population, $area, $country) = $array;
var_dump($city, $population, $area, $country);
```

This will output:

```bash
string(6) "London"
string(9) "8,416,535"
string(8) "1,572.00"
string(7) "England"
```

Note that [list()](http://php.net/manual/en/function.list.php) assigns values
starting with the right-most parameter and works only on numerical keys.

Array elements can be omitted using multiple commas:

```php
<?php

list(,,$area1, $country1) = $array;
list($city2,,,$country2) = $array;

var_dump($area1, $country1);
echo '----------' . PHP_EOL;
var_dump($city2, $country2);
```

The above example will output:

```bash
string(8) "1,572.00"
string(7) "England"
----------
string(6) "London"
string(7) "England"
```


As of PHP 5.4, it is possible to access array members directly when an array
is returned by a function. This is known as array dereferencing. As of PHP 5.5,
it is also possible to array dereference an array literal.

```php
<?php

function getCity() {
    return [
        'London',
        '8,416,535',
        '1,572.00',
        'England',
    ];
}

var_dump(getCity()[0]);
var_dump(getCity()[3]);

echo '----------' . PHP_EOL;

var_dump(['a', 'b', 'c', 'd'][rand(0,3)]);

```
The above example will output:

```bash
string(6) "London"
string(7) "England"
----------
string(1) "a"
```


# Further reading

- http://php.net/manual/en/language.types.array.php
- https://nikic.github.io/2012/03/28/Understanding-PHPs-internal-array-implementation.html
- http://en.wikipedia.org/wiki/Hash_table
