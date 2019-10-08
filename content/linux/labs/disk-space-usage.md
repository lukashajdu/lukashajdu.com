---
title: "Disk space usage"
date: "2019-10-08T15:31:00Z"
tags: ["Disk usage"]
categories: ["Linux 101"]
type: lab
---

A filespace can be estimated with the disk utility program - __[du]__.

The disk utility is recursive for directories by default. To show the amount of space used only for the first level
use the option `--max-depth=1`. The option `--max-depth=0` is the same as `--summarize` and it will 
display only a total space used.

Show disk usage: 

```bash
lukash@ubuntu:/$ sudo du --max-depth=1 / | sort -k 2
du: cannot access '/proc/22736/task/22736/fd/4': No such file or directory
du: cannot access '/proc/22736/task/22736/fdinfo/4': No such file or directory
du: cannot access '/proc/22736/fd/3': No such file or directory
du: cannot access '/proc/22736/fdinfo/3': No such file or directory
5780099	/       # total space used
15244	/bin
144372	/boot
4	/cdrom
0	/dev        # pseudo-file
7064	/etc
432	/home
847160	/lib
4	/lib64
16	/lost+found
4	/media
4	/mnt
16	/opt
0	/proc       # pseudo-file
16	/root
1008	/run
15596	/sbin
519611	/snap
4	/srv
0	/sys        # pseudo-file
40	/tmp
1866408	/usr
763600	/var
```

The `du` command displays space usage on all file systems. To skip directories on different file systems than
the root partition use the option `-x`. This will ignore directories like `/dev`, `/proc`, `/run`, and `/sys`.
To display sizes in human-readable formats use the option `-h`.

```
lukash@ubuntu:/$ sudo du --max-depth=1 -xh / | sort -k 2
5.1G	/
15M	/bin
141M	/boot
4.0K	/cdrom
6.9M	/etc
432K	/home
828M	/lib
4.0K	/lib64
16K	/lost+found
4.0K	/media
4.0K	/mnt
16K	/opt
16K	/root
16M	/sbin
16K	/snap
4.0K	/srv
40K	/tmp
1.8G	/usr
746M	/var

lukash@ubuntu:/$ sudo du --summarize -xh
5.1G	.
```

The whole command can be examined on the [explainshell.com].


[du]: http://manpages.ubuntu.com/manpages/precise/en/man1/du.1.html
[explainshell.com]: https://explainshell.com/explain?cmd=sudo+du+--max-depth%3D1+-xh+%2F+%7C+sort+-k+2
