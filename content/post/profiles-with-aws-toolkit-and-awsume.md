---
title: "Profiles with AWSume and AWS Toolkit"
date: "2020-07-06T18:01:00Z"
tags: ["AWS"]
categories: ["Development"]
---

To be able to access our AWS resources with AWS Toolkit, we need to configure your credentials.
Configuring credentials can be, however, a problem when we use tools like AWSume.<!--more-->

Luckily, [AWSume] command accepts an optional argument `--output-profile` (`-o`). 
This command creates a profile with credentials in `~/.aws/credentials`.

```bash
$ awsume my-user -a -o aws-explorer-my-user
$ cat ~/.aws/credentials
...
[aws-explorer-my-user]
manager = awsume
aws_access_key_id = ...
aws_secret_access_key = ...
aws_session_token = ...
region = eu-west-2
autoawsume = true
expiration = 2020-07-06 20:36:25
source_expiration = 2020-07-06 21:29:43
awsumepy_command = my-user -a -o aws-explorer-my-user
```

The argument `-a` will make sure the credentials are auto-refreshed. The newly created profile can be 
then selected from the list of credential profiles like any other existing profile.

[AWSume]: https://awsu.me/general/usage.html
