---
title: "Using Xdebug with Postman"
date: "2020-06-09T15:01:00Z"
tags: ["Xdebug", "php"]
categories: ["Development"]
---

Xdebug is using cookies to keep track of a debug session when started through a browser. However,
Postman is an API client and doesn't necessarily use cookies. How can we initiate 
a debug session in such a case?
<!--more-->

# Start a debug session in Postman

The debug session is initiated with the `XDEBUG_SESSION=idekey` cookie in a browser, but there
are other ways to start a [browser session] as well. Appending `XDEBUG_SESSION_START=idekey` to 
an URL has the same effect. Using this particular URL parameter makes Xdebug emit a cookie with
the `XDEBUG_SESSION` name set to the value of the `XDEBUG_SESSION_START` parameter value. 

An example URL to start a debug session in Phpstorm will look like this:

`https://api.example.com/users?XDEBUG_SESSION_START=PHPSTORM`

The cookie expiry is one hour by default, so the subsequent request doesn't need to contain the `XDEBUG_SESSION_START`
parameter anymore.

# Stop a debug session in Postman

To stop the existing debug session append `XDEBUG_SESSION_STOP=idekey` to an URL.

An example URL to stop a debug session in Phpstorm will look like this:

`https://api.example.com/users?XDEBUG_SESSION_STOP=PHPSTORM`

The same method can be used to start and stop debug session from a command line using, for example, `curl` request.

[browser session]: https://xdebug.org/docs/remote#browser_session
