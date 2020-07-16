---
title: "Friendly pull requests"
date: "2020-07-16T17:01:00Z"
tags: ["Code review"]
categories: ["Development"]
---

Code review is the [principal defect removing method]. Tacky code reviews can significantly increase
the cost of the software. Hence, it's vital to create a foundation for the reviewer.<!--more-->

A short time ago, I was reviewing a very long pull request (40 files, 1k+ LOC). 
Code changes for entirely new functionality. I lost my focus after reviewing half of the files,
but the determination kept me going until I finished with the review.

A half-hour later, I have asked my colleague to review my even longer PR. (80 files
and better not to talk about the LOC). Wrong decisions at the beginning of the project, 
months of postponing, new functionality integration and the character of the changes made
it not possible to merge it in smaller parts (it's always good to have excuses). 
I could imagine the thoughts of my colleague (🤦😫😭). I wasn't exactly proud of my PR, but it happened. 

![Pull request](/img/pull-request.png "Pull request")

If this were a one-time thing, it would not be such a great deal, but we have this kind of PRs frequently. 
No wonder no one wants to review them. Here is the problem with this kind of PRs. 
Even if the PR is reviewed, a chance that some defects are overlooked is very high. 
Overlooked defects can cause problems in the future, and it's harder and much more expensive 
to fix these problems once they are in production. 

# Be nice to your colleagues

We should understand why code reviews are so important at this point. 
There are some things we can do to make our code easier to review and decrease the chance of overlooking defects.

Here is a list of things you should consider before you create a pull request:

* Did you review your pull request before anyone else?
    * Are all tests passing?
    * Is your styling clear?
    * Do new files have newline feed?
* Did you commit only changes you wanted?
    * No dead code, useless code comments, debug functions?
    * No accidentally removed code?
* Are your changes quick to review?
    * Is it likely to take less than 10 minutes to do the review?

Your pull request will be certainly more pleasant to review.

## Large code changes

What if you are working on a much bigger functionality which could break the existing system
if not delivered as a whole unit? If you can't deliver the functionality incrementally,
which is always a better solution, there are paths you can take. 

You can create a feature "mother" branch to use as a base branch for the new functionality.
The branch should be kept up to date with the master branch. It's important to use git rebase
rather than merge commits. Rebasing will save you headaches with merge hells. Just make sure
not to commit to this branch directly. 

Once we have our new base branch. We are good to fork from this branch 
and merge our PRs to this branch. Smaller PRs will make it easier to review,
the base branch will be up to date with the production code, and we should be confident 
to merge the new functionality changes.

[principal defect removing method]: /post/the-real-cost-of-the-software/
