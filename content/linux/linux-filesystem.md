---
title: "Linux Filesystem"
date: "2019-09-02T14:41:00Z"
tags: ["Filesystem"]
categories: ["Linux 101"]
---

To maintain Linux filesystem it's important to know where the files are located.
For this reason, Linux provides tools to help with this. One of these tools 
is standardised filesystem.<!--more-->

Linux consists of one big filesystem tree and draws heavily on Unix.
Inconsistency between various Linux distributions created a need for introducing 
standards which would unify structure. Unified filesystem makes it easier
for program developers and system administrator to work with the system.

The first of these standards was Filesystem Standard (FSSTND)
but because of its limitation it was replaced with the new [Filesystem
Hierarchy Standard (FHS)](https://refspecs.linuxfoundation.org/FHS_3.0/fhs-3.0.pdf)

The FHS is recommended structure but it's not always followed by all distributions
(e.g. experimenting). Additional directories in root folder do not violate FHS
but it does violate to have components in directories other than in standard.

The FHS makes an important distinction between shareable files and unshareable files and
attempts to fit each important directory into one cell.

<img src="/img/linux-101/01-fsh-directories.png" alt="FSH directory distinction" style="height:150px;">

## Root (/)

The root partition must __contain files and utilities to boot the system__, restore the system
from backup and recover/repair system.

All other directories branch from the root directory. It's often on specially dedicated partition
and no application or package should create subdirectories in the folder according to FHS.
Critical directories like `/etc` and `/sbin` must reside on the same partition.

## /boot

The directory __contains files needed to boot a system__. These files are static and unshareable.
The essential files are:

* __vmlinoz__ - compressed kernel
* __initramfs__ - initial RAM filesystem (mounted before root filesystem)

Higher-level startup and configuration files reside in `/etc`. The `/boot` directory
can contain multiple kernel versions. The choice between these kernels is made by GRUB
at boot time.

Other files besides the essential ones are:

* __config__ - kernel compilation configuration file
* __System.map__ - kernel symbol table (useful for debugging)

![/boot directory](/img/linux-101/01-boot-directory.png)

## /bin

The directory __contains critical executable programs__ needed by sysadmins or users,
such as `ls`, `cp` and `mount`. The `/bin` directory contains static files
and is rarely shared.

The programs are available before the filesystem is mounted and can be used indirectly
by other scripts. Nonessential binaries are placed in `/usr/bin`. 

## /dev

The directory __contains special device files__ (_device nodes_; pseudo-files),
which are essential for the system to function properly. Need for this location
is because Linux treats most hardware devices as if they were files.

It contains a large number of files that function as hardware interfaces.

![/dev directory](/img/linux-101/01-dev-directory.png)

## /etc

The directory contains unshareable and static __system-wide configuration files__
and some startup scripts. There should not be executable binaries in this directory.

Linux distributions often add configuration files here. For example, some _systemd_
configuration files (if the distribution uses it) are stored in `/etc/systemd`.
It also contains skeleton for creating home directories in `/etc/skel`
and _System V_ initialisation scripts in `/etc/init.d`.

## /home

The directory contains __users' data__, and it's shareable and variable. 
User directories are conventionally placed under `/home`, as in `/home/lukas`, etc.

All personal configurations and executables are placed in this directory hierarchy.
The `/home` directory often resides on its partition and it can be usually 
anywhere on a corporate network (NFS server), and then mounted automatically upon use.

The _root_ user makes an exception in the structure as it is always found under `/root`
directory.

## /lib and /lib64

The directory contains __program libraries__ necessary to execute binaries in `/bin` and `/sbin`.
Libraries consist of code that's shared across many programs and stored in separate files
to save disk space.

These libraries are important for booting the system and executing commands
in the root filesystem. The `/lib/modules` subdirectory contains kernel
modules (drivers).

Systems supporting both 32-bit and 64-bit binaries must keep both kinds
of libraries on the system. That's why there are separate directories
for 32-bit (`/lib`) and 64-bit (`/lib64`) libraries on some systems.

## /media

The directory is used as a __mounting point for removable media__ such
as CDs, USB drives, etc. It's an optional part of the FHS.

Modern distributions use `/media` subdirectories to mount the removable
filesystems dynamically upon insertion. The __udev__ automatically creates
subdirectories with names defined in __udev__ configurations and once
the media is removed, the created subdirectory disappears.

## /mnt

The directory is used to __temporarily mount a filesystem__ when needed by sysadmin.
Network filesystems (_NFS_, _Samba_, _CIFS_, etc.) are a common use case.

Older distributions used the `/mnt` directory to mount removable media similar
to the `/media` directory.

## /opt

The directory is intended for __ready-made software packages__ that don't ship with
the system (unbundled packages) and that wish to keep their files in one isolated place,
rather than scatter over the system in other directories. It can contain commercial
word processors, games, etc.

This makes easier to install and uninstall software and determine the nature
of each file within the package.

## /proc

The directory is a mount point for a pseudo-filesystem. This special directory
__holds all the details about the Linux system__, including its kernel, processes,
and configuration parameters. It's created dynamically by Linux.

The entries in `/proc` are usually zero-length files (when viewed) neither binary nor text
but they can contain a large amount of information.

![/proc directory](/img/linux-101/01-proc-directory.png)

## /sys

The directory is a mount point for the _sysfs pseudo-filesystem_. The `/sys`
directory is not empty only if the system is running. It's used
to __gather information about the system__.

## /root

This directory is a __root user home directory__. The root account's home directory 
may be determined by the developer or local preference, but this is the
recommended default location. 

## /sbin

The directory contains __additional binaries__ to those in the `/bin` directory.
These binaries are essential for booting, restoring, recovering and repairing
system and must be able to mount other filesystems.

![/sbin directory](/img/linux-101/01-sbin-directory.png)

## /srv

The directory contains __site-specific data__ which is served by this system
for protocols such as _ftp_, _rsync_, _www_, etc.

The `/srv` directory should always exist on FHS compliant systems
and should be used as the default location for such data (but it's not
used too much).

## /tmp

The directory is used to __store temporary files__ and can be accessed
by any user or application.

Some distributions remove the contents of `/tmp` by every reboot (Ubuntu),
some run periodic jobs (RHEL 6) and some use it as a temporary mounting 
point for a virtual filesystem which is removed upon system reboot (Fedora).

## /usr

The directory is the second major section of the filesystem, is shareable
and contains read-only data. It's used for
__files which are not needed for system booting__.

```
/usr/
├── bin         # Most user commands; non-essential binaries and scripts
├── games       # Games and education binaries (optional)
├── include     # Header files used to compile application; used by C programs
├── lib         # Libraries
├── local       # Local hierarchy; third level hierarchy
├── sbin        # Non-vital system binaries;
├── share       # Read-only architecture-independent data
└── src         # Source code for Linux kernel (optional)
```

## /var

The directory contains __variable data files__ which can change during system operations.
This includes spool directories and files, administrative and logging data,
and transient and temporary files.

It's a good idea to mount `/var` as a separate filesystem. If the directory gets filled
up (e.g. logging data), it should not lock up the system. If the directory can't be
on a separate partition, it's preferable to have it on the `/usr` partition rather
than the `/root` partition.

```
/var
├── backups
├── cache               # Application cache data
├── crash               # System crash dump (optional)
├── lib                 # Variable state information
├── local               # Variable data for /usr/local
├── lock -> /run/lock   # Lock files
├── log                 # Log files and directories
├── mail                # User mailboxes (optional)
├── opt                 # Variable data for /opt
├── run -> /run         # Data relevant to running processes
├── spool               # Application spool data
├── tmp                 # Temporary files  
└── www                 # Root for website hierarchies (optional)
```

## /run

The directory contains __run-time variable data__. The purpose is to store
files that contain runtime information. The directory is proposed by FHS,
but it's not formally accepted by distributions.

![/run directory](/img/linux-101/01-run-directory.png)
