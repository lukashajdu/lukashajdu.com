---
title: "Examining uname"
date: "2020-02-02T11:31:00Z"
tags: ["uname"]
categories: ["Linux 101"]
type: lab
---

uname is a Unix program to print some of the basics about
the kernel and system. The most common option to run
the program is `-a` which prints all available information.

This is an example output with a short description:

![/proc directory](/img/linux-101/labs/03-uname.svg)

| Parameter             | Option | Description                                                 |
|-----------------------|--------|-------------------------------------------------------------|
| Kernel name           | -s     | Displays kernel name, which is Linux on a Linux system      |
| Node name             | -n     | Network hostname                                            |
| Kernel release        | -r     | The actual kernel version number                            |
| Kernel version        | -v     | Kernel build date and time (not an actual version)          |
| Machine hardware name | -m     | Most often a CPU code (i686, x86_64, ...)                   |
| Processor type        | -p     | Information about the CPU; returns unknown in many systems  |
| Hardware platform     | -i     | Hardware platform information; usually returns unknown      |
| Operating system      | -o     | OS name; GNU/Linux for a Linux system                       |
