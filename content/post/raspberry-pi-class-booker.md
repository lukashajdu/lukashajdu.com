---
title: "Book Gymbox classes with Raspberry Pi"
date: "2019-05-28T14:41:00Z"
tags: ["Puppeteer", "Raspberry Pi"]
categories: ["Development"]
---

It’s been a while I was planning to automate class booking process.
I’m usually not around my phone at 7:00 am in order to book my favourite
class for the next day. Finally, I’ve got some time to do it!<!--more-->

After the first attempt with the [TestCafé](https://github.com/DevExpress/testcafe)
and some security issues with a script execution using a cron job, I give it a second try.
This time I decided to use the [Puppeteer](https://github.com/GoogleChrome/puppeteer),
which provides a high-level API to control Chromium instead of web testing framework.

Open your Terminal application: `Application menu > Accessories > Terminal`

![Terminal](/img/raspberry-pi-class-booker/terminal.png "Terminal")

Make sure Node.js is installed on your Raspberry Pi. To verify this you can run
the following command:

```
$ node --version
bash: node: command not found
```

If the command is missing you can install Node.js with the packaging tool:

```
$ sudo apt-get install nodejs
$ node --version
v8.11.1
```

Let's clone the code for actual booking automation and install necessary dependencies:

```
$ git clone https://github.com/lukashajdu/gymbox-class-booker.git
$ cd gymbox-class-booker/
$ npm install
```

The script is going to use existing Chromium installation. To get
the path to executable script run following command:

```
$ which chromium-browser 
/usr/bin/chromium-browser
```

Create a config file, add login details and browser executable path
to the config file:

```
$ cp config.js.dist config.js
$ cat config.js
module.exports = {
    chromiumExecutable: '/usr/bin/chromium-browser',
    username: 'your@email.com',
    password: 'yourPassWord'
};
```

Once you created the config you can run the application:

```
$ node book.js 
Usage: node book.js <CLASS_NAME> <HH:MM> <CLUB_NAME>
```

Find a class you want to book in your class timetable:

![Class timetable](/img/raspberry-pi-class-booker/class-timetable.png "Class timetable")

The class shortcuts are configured in the `selectors.js`. You might need to update
a list of classess or gyms. Once you know your shortcuts you can run the script:

```
$ node book.js thai 19:00 oldStreet
You have been booked into the Muay Thai at 19:00
```

The script logs into your account navigates to the timetable
and tries to find a row in a table which contains requested
class name, time and is bookable. It matches the first occurrence
of such row and it clicks on the “Book” button. Once the class is booked
it goes to the basket and confirms the class.

Let's configure crontab to run scheduled tasks for us.

We can edit crontab with the `crontab -e` command directly or we can simplify 
our life and use [Gnome Schedule](http://gnome-schedule.sourceforge.net/) instead.

![Gnome Schedule](/img/raspberry-pi-class-booker/gnome-schedule.png "Gnome Schedule")

To install the tool run following command:

```
$ sudo apt-get install gnome-schedule
```





Just make sure you cancel unwanted classes you booked while testing the script. 
Otherwise you will get a 7-day restriction from online bookings like me...