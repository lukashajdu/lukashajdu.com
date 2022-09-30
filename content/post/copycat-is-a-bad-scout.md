---
title: "Copycat is a bad scout"
date: "2020-07-23T14:01:00Z"
tags: ["Clean code"]
categories: ["Development"]
---

I was recently refactoring some legacy code, and I got to a particular class at one point. 
The class functionality looked familiar with familiar variable names, code structure 
and even typo in a log message, commented code and todo comments. Just the class name was different. 
Obvious code duplication.<!--more-->

Uncle Bob talks about cleaning up code in [The Boy Scout Rule] chapter:

> "I don't think this rule is too much to ask. You don't have to make every module perfect 
before you check it in. You simply have to make it a little bit better than when you checked it out. 
Of course, this means that any code you add to a module must be clean."

The author of the duplicated code clearly didn't make any effort to leave the existing code in 
a cleaner state than he found it. He didn't even make an effort to clean up the code he copied. 
This approach is precisely the way to end up with a legacy code no one wants to work with.

![Copycat](/img/copycat.png#50percent "Copycat")

And being a good scout is so easy nowadays. We have a spectrum of possibilities at our disposal
we can use in no time. I think the reason for not leaving the code in a better state is laziness, 
not the lack of tools.

## What would a good scout do?

Good scout would:

 - use class inheritance as both classes extend the same parent class to avoid extensive duplication
 - remove dead code
 - remove `@todo` comments as they are not valid for last two years
 - fix typos 

It wouldn't take more than 5 minutes to do the changes, but the outcome would be much cleaner. 

[The Boy Scout Rule]: https://www.oreilly.com/library/view/97-things-every/9780596809515/ch08.html
