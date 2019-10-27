---
title: "Controlling processes with ulimit"
date: "2019-10-27T22:20:00Z"
tags: ["Processes"]
categories: ["Linux 101"]
type: lab
---

Certain resources in Unix systems can be limited to ensure that the most important processes have enough resources.
  
The **[ulimit]** is a build-in bash command that can limit the use of system-wide resources. The `ulimit -a` lists
all current resource limits.

![/proc directory](/img/linux-101/labs/02-ulimit-a.png)

The command response _unlimited_ means that the current user can consume all the resources the current 
system supports.

Limits:

- **soft**: 
    - the value that the kernel enforces for the corresponding resource
    - the value in the range from 0 to hard limit
    - changes can be made by both unprivileged and privileged process
- **hard**: 
    - acts as a ceiling for the soft limit
    - changes can be only made by a privileged process

The changes made with `ulimit` only affect the current shell. To make permanent changes 
the `/etc/security/limits.conf` needs to be modified.

**Examples:**

Keys for individual resources are displayed in an orange rectangle on the image above.

Show limits for open files:

```bash
# Hard limits
lukash@ubuntu:~$ ulimit -H -n
1048576
#Soft limits
lukash@ubuntu:~$ ulimit -S -n
1024
```

Change soft limits for open files:

```bash
lukash@ubuntu:~$ ulimit -S -n 2048
lukash@ubuntu:~$ ulimit -S -n
2048
```

Values are in 1024-byte increments, except for `-t`, which is in seconds, `-p`, which is in units of 512-byte blocks, 
and `-n` and `-u`, which are unscaled values.


[ulimit]: https://ss64.com/bash/ulimit.html
