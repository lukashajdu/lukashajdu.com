---
title: "Mastering PHP arrays: Array sorting"
date: "2019-03-04T13:15:00Z"
tags: ["php", "array"]
categories: ["Development"]
---

Sorting is an operation that arranges data in a specified way. PHP has several 
functions that deal with sorting arrays. Let's examine these functions.<!--more--> 

Good overview of sorting functions can be found in PHP manual: [Sorting Arrays](http://php.net/manual/en/array.sorting.php).
All sorting functions act directly on an array variable itself because the variable
is passed to sort function by reference, as opposed to returning a new sorted array.
Because only variables can be passed by reference, you will get **Fatal error** 
when you try to pass array directly as a function argument.

Sort functions return **true** on success or **false** and warning message
when parameter type differs from array.

```
$array = [14, 1, 22, 8, 7];
$return = sort($array);
var_dump($return); // bool(true)

$string = 'bar';
$return = sort($string);
Warning: sort() expects parameter 1 to be array, string given in php shell code on line 1
var_dump($return); // bool(false)
```

If two array members are evaluated as equal then the order is undefined.
It's unknown which number 1 will be at `$array[0]` or `$array[1]`:

```
$array = [3, 1, 2, 1];
sort($array);
```

Most PHP sorting functions uses implementation of [Quicksort](http://en.wikipedia.org/wiki/Quicksort).


# Sorting single arrays

The simplest of sorting functions is [sort](http://php.net/manual/en/function.sort.php),
which sorts an array by its values from lowest to highest and doesn't maintain the key association.

Modified sort functions offer also sorting by key ([ksort](http://php.net/manual/en/function.ksort.php)),
key-value association ([asort](http://php.net/manual/en/function.asort.php)),
reverse sorting ([rsort](http://php.net/manual/en/function.rsort.php)), user-defined comparison
function ([usort](http://php.net/manual/en/function.usort.php)) and different variations of these functions.
([arsort](http://php.net/manual/en/function.arsort.php), [krsort](http://php.net/manual/en/function.krsort.php),
[uksort](http://php.net/manual/en/function.uksort.php), [ursort](http://php.net/manual/en/function.ursort.php)).
There's no reverse sorting version of user-defined sorting functions because reverse sorting can be performed by
updating comparison rules.

Be careful when sorting arrays with mixed types of values because the sort function
can produce unpredictable results. This also applies to sort functions with sort flag different
to **SORT_REGULAR**, which is default sort flag for most sorting functions.

Example array with various types of scalar values:

```
$array = [
    true,
    false,
    'Hello',
    'hi',
    50,
    0.25,
    '4',
    'hello',
    '045',
    '03',
    'ABC',
    "\x41", // hexadecimal ASCII code for letter 'A'
    0x17,   // hexadecimal representation of number 23
    020,    // octal representation of number 16
];
```

Output of the `sort($array)` function for various sort flags will be:

![Different sort flags for sort function](/img/mastering-php-arrays/various-sort-flags-output.jpg "Output for various sort flags")

As you can see sorted array differs for each sort flag. Comparison of sorted keys and values
is case sensitive by default. For case-insensitive comparison, **SORT_FLAG_CASE** combination
with **SORT_STRING** or **SORT_NATURAL** can be used.

```
$oranges = ['Orange1', 'orange3', 'orange1','Orange4'];

sort($oranges, SORT_STRING);
var_dump($oranges);

sort($oranges, SORT_STRING | SORT_FLAG_CASE);
var_dump($oranges);
```

This will output:

![Sorting with flag case](/img/mastering-php-arrays/sorting-with-flag-case.jpg "Sorting with flag case")

For natural ordering the [natsort](http://php.net/manual/en/function.natsort.php) function
and for the case-insensitive version the [natcasesort](http://php.net/manual/en/function.natcasesort.php)
function can be used. These functions are shortcuts for sort function with **SORT_FLAG_CASE**
for case-sensitive version and **SORT_FLAG_CASE | SORT_FLAG_CASE** for case insensitive version.
Natural ordering is using [Natural Order String Comparison](http://sourcefrog.net/projects/natsort/)
which is more human-friendly then a byte-by-byte comparison of sort function.

## Other sorting options

Sort functions, with user-defined comparison function, give you an option to create
a custom comparison function. User-defined comparison function sort family accept
[callback functions](http://php.net/manual/en/language.types.callable.php) as a parameter.
Callback functions can be simple functions, but also object methods, including static class
methods and [anonymous functions](http://php.net/manual/en/functions.anonymous.php).

Sort function expects integer as a return value and all returning non-integer values
are cast to an integer. 

For example:

- `0.9999`/`false`/`null`/`"Hello"` becomes `0`
- `1.3`/`true`/`"1"` becomes `1`

This behaviour is called type juggling and you can read more about it
in PHP Manual: [Type Juggling](http://php.net/manual/en/language.types.type-juggling.php)

Expected compare function return values:

* `$first_compared_value == $second_compared_value` => integer equal to zero; 0
* `$first_compared_value < $second_compared_value` => integer less then zero; e.g -1
* `$first_compared_value > $second_compared_value` => integer greater than zero; e.g 1

**Example:** Interpolation of sort function with **SORT_STRING** sort flag using
anonymous function/closure.

```
$array = ['Hello', 'Ahoy','Hi', 'hello'];

usort($array, function($a, $b) {
    return strcmp($a, $b);
});

var_dump($array);
```

The output of this script will be:

![User sorting - SORT_STRING interpolation](/img/mastering-php-arrays/usort-strings.jpg "User sorting - SORT_STRING interpolation")

It is possible to create a comparison function like this, because [strcmp()](http://php.net/manual/en/function.strcmp.php)
function returns values as an [usort()](http://php.net/manual/en/function.usort.php)
expectation defined earlier (< 0 if str1 is less than str2; > 0 if str1 is greater than str2, and 0 if they are equal).


**Example:** Sort by occurrence of character 'o':

```
$array = ['Hello World', 'Ahoy','Hi'];

function occurrenceOfO($a, $b)
{
    $a_o_count = substr_count($a, 'o');
    $b_o_count = substr_count($b, 'o');

    if ($a_o_count === $b_o_count) {
        return 0;
    }

    return $a_o_count >= $b_o_count;
}

usort($array, 'occurrenceOfO');
var_dump($array);
```

This outputs the following:

![User sorting - Occurrence of  letter o](/img/mastering-php-arrays/usort-o-occurrence.jpg "User sorting - Occurrence of  letter o")

As you can see the [usort](http://php.net/manual/en/function.usort.php) function gives you
an option to create complex sorting functions. Note that this function doesn't maintain
key-value association and assigns new keys to elements. If you want to maintain association
use [uasort](http://php.net/manual/en/function.uasort.php) function instead.

PHP 7 introduced [three-way comparison operator](https://wiki.php.net/rfc/combined-comparison-operator) (`<=>`),
also known as the “spaceship operator”, which has similar behaviour
to the [strcmp()](http://php.net/manual/en/function.strcmp.php) function. 
This makes easier to write callbacks for comparison functions and return correct values
expected by this function.

Example of spaceship operator behaviour:
```
echo 1 <=> 1; // 0
echo 1 <=> 2; // -1
echo 2 <=> 1; // 1
```


# Sorting multi-arrays

For sorting multiple or multi-dimensional arrays
the [array_multisort](http://php.net/manual/en/function.array-multisort.php)
function can be used. This function works more like database style sorting - 'ORDER BY'
multiple columns statement in SQL query, rather than a sort function which excepts
multiple arrays and sorts these arrays independently.

```
$magazine[] = ['year' => 2015, 'month' => 1, 'issue' => 1];
$magazine[] = ['year' => 2014, 'month' => 12, 'issue' => 4];
$magazine[] = ['year' => 2015, 'month' => 2, 'issue' => 2];
$magazine[] = ['year' => 2015, 'month' => 3, 'issue' => 3];
$magazine[] = ['year' => 2015, 'month' => 1, 'issue' => 2];

var_dump($magazine);
array_multisort($magazine);
var_dump($magazine);
```

The output of this script will be:

![Multi-array sorting](/img/mastering-php-arrays/multi-array-sorting.jpg "Multi-array sorting")

As you can see from outputted data, the array was sorted by year at first place, then by month and an issue number at last place.


# Array shuffling

For randomizing the order of elements in an array the [shuffle](http://php.net/manual/en/function.shuffle.php)
function can be used. This function doesn't preserve key-value association
and PHP doesn't provide a built-in function for this.

The output of this script will differ on each call:

```
$numbers = [1, 2, 3, 4, 5];
shuffle($numbers);
var_dump($numbers);
```
