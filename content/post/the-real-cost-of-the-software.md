---
title: "The real cost of the software"
date: "2020-07-10T20:01:00Z"
tags: ["code reviews"]
categories: ["Development"]
---

Many technical people have a misconception of the real cost of the software. We often overlook 
a critical variable in the software cost equation - the cost of fixing defects.<!--more-->

> "The time and money spent finding and fixing product defects is generally more than it would cost 
to build the product properly in the first place" [1]

![Software cost](/img/the-real-cost-of-the-software/software-cost.svg "Software cost")

Software development life cycle (SDLC) consists of multiple steps. These steps can vary
in various organisations. Let's imagine our SDLC as a spiral. The further from the source code
the defect is found and fixed, the more expensive this fix is. 

![SDLC](/img/the-real-cost-of-the-software/sdlc.svg "Software Development Life Cycle")

# The cost of finding and fixing defects

> "The average cost of finding and fixing a defect increases about 10 times with every step
of the development process" [2] 

We can examine this statement through the steps in our SDLC.

{{< title-icon "50px" "👨‍💻">}}

## Development

Software defects are easiest to find and fix at this step. Writing error-free code is possible
but requires high discipline from engineers. Great way to reduce the defect rate is to write
unit tests. It's important to test cover scenarios of the desired functionality. Test coverage
will give us the confidence to deliver software according to specification and will ensure that
our delivered functionality will not break with new code changes. It's a good practice to run
automated tests for changed code parts at this step or run all automated tests if the test suite
is not too time-consuming. All code quality checks should pass, as well. It's much faster to localise
and fix all the broken tests and validation errors at this step.


{{< title-icon "50px" "🤖">}}
## Automated testing 

If we run tests as mentioned in the previous step, tests at this step should pass without any problems.
We can have failing tests if the introduced changes are part of a large codebase and we didn't run
the whole test suite or time-consuming tests. Code defects at this step should be quite easy
to find and fix. Once the defects are fixed, it's good to verify changes by running failing tests.
Otherwise, we can end up jumping between this step and the previous step back and forth,
which can be time-consuming. 

{{< title-icon "50px" "🔎">}}
## Code review

A code review is a great way to find defects quickly. It can also help to find a wrong code design,
security issues, coding standard violations, etc. I believe the code review is as helpful
for the code author as for the reviewer. I like doing code reviews because they keep me up to date with
the functionality we develop across different teams even if I'm not the part of that team.
It's also a great way to learn something new.

Most software defects result from simple oversights, and they are easiest to find right after
the code was produced. It is because our memory is still fresh, we most likely remember what was intended,
and we probably know how to fix the problems. 

Doing a personal code review before anyone else can decrease the error rate notably.
Defects discovered before the reviewer will also reduce the time between development and deployment.
Sometimes I'm surprised at doing code reviews how many times developers commit dead code, commented out code,
useless code comments used at development, debugging functions or removed existing functionality
to simplify debugging. Code reviews should focus on more important things than defects caused by our laziness.

Code reviews are the last step in our SDLC where we can discover defects which might not be possible
to discover in subsequent steps and can cause harm in the future. Thus they are essential.
There are many things which can go wrong (incorrect libraries, wrong algorithms,
missing environment variables, missing framework-specific configurations, etc.). Defects like this
can sit in our codebase like small ticking bombs waiting to detonate at the worse possible time.

Doing code reviews has its cost as they are time-consuming. If there are defects discovered
at the code review, we need to start again at the step one of our SDLC. Once we fix discovered defects,
we need to go sequentially through our cycle, and the code reviewer needs to review our changes once again.
If there are other defects discovered, the cycle can repeat again and again. 

{{< title-icon "50px" "✅">}}
## Testing 

Testing is time-consuming, and if testers find issues with our code, we need to go through the cycle again.
I believe you understand the statements about increasing cost of finding and fixing a defect by this point.

{{< title-icon "50px" "🚀">}}
## Deployment

Defects discovered in production code can be hard to find and replicate. They might happen sporadically
under certain conditions. They might happen because the program state is unexpected. The more moving parts
the system has, the more likely we can experience defects. Once the production defects are found and fixed,
the changed code needs to pass our SDLC again. It's essential to test cover the failing scenario
to prevent errors happening again.

# The principal defect removing method

Personal commitment to quality is the most important single factor in program quality. 
The importance of personal code reviews in the previous section is evident. 
We can consider code review as the principal defect removing method. Because of this,
it's essential to create pull requests which are easy to review. The chance of finding defects
is much higher in such pull requests.

# Summary
The cost of the software can be significantly reduced by writing quality software and identifying
and fixing defects at the initial steps of SDLC. The principal defect removing methods is code review.

# References

- [1] Watts S. Humphrey. Introduction to the Personal Software Process.
Addison-Wesley Professional, 1997. ISBN: 0201548097
- [2] Watts S. Humphrey. Managing Technical People: Innovation, Teamwork, and the Software Process.
Addison-Wesley, 1997. ISBN: 0201545977
