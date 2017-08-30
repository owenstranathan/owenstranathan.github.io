---
layout: post
title:  "Building a MediaPlayer for Android I"
date: 2017-08-30 12:00:00 -0400
categories: technology
---


In this post I will give a brief overview of my experience working with Android Studio
and the android API to build a basic media player that suits my needs.

# Introduction and Motivation

You might be wondering: "Why the hell would a person want to build a media player
when there are so many media player apps on the google play store?" The simple
answer is, two reasons:

1. None of those apps do exactly what I want.
2. Making your own tools when the need arises gives you such a feeling of satisfaction that you just can't get from throwing down money for someone else's work.

I made this app because I didn't feel there were any good options for a media player
on the app store. Every media player out there tries to do too much and ends up doing a bunch of things poorly.

My needs are simple, I need a media player that enables me to riffle through my
SD card's file system and find my music exactly where I put it.
Most apps don't do this, they use android's "recommended" practice
of using content resolvers to access a model of the audio/visual files on the system and then
present them categorized by various meta data classifiers. That's fine and works well in
many instances, however much of my music does not have reliable meta data attached to it (for
various reasons, most notably that most of it is "pirated").

And so I must either find a way to edit the meta data for each file of my
roughly 24 GB worth of music, or make a media player with a
file-explorer style UI that gives me access to the tree-like file structure I already
have my files arranged in.

I opted for the second one, although the search-ability proffered by
the use of meta-data as a means of building a tag-based file system is almost enough of a boon,
that I'm seriously considering extending the app to offer the ability to edit file meta-data
and then switch back and forth between a tagging/meta-data based UI and the current file system UI.

In any case the app is basic and it works for my needs, and it taught me a lot about Android which is
pretty easy to be honest. After I write this blog post, I'm considering doing a re-write because everything is always cleaner if you re-write it.

So without further adieu lets talk about first times and working with Android studio.

# Android Virgin

Ahhh virginity...

As with anything the first experience with a new technology can make or break the
way you feel about it for a long time. If you have a terrible time, because there are no
good tutorials or because the documentation sucks or because you are just having a shit day that
day, it can ruin it for you for the rest of your life.

Luckily this was not the case for me and Android - at least not entirely. From the
first Android and I got along well (with the minor exception that the mac installer
was horrendously slow and I nearly gave up after it stalled 2 hours in). But this
agreeable relationship wasn't always so, I had a brief brush with Android back in college,
back when I was certain that all I needed to know to be a rich and famous tech mogul
was how to write an app and my intrinsic genius would take care of the rest (if only TT).

That encounter ended with me frustrated and app-less (this was due in large part to
my own inexperience and naiveté), needless to say it soured me to mobile development for
awhile.

But I recovered and here I stand the proud creator of an exceedingly decent, albeit
simple, music playing android app.

The basic process for getting up and running with android is simple:

1. Download the android studio installer from their [website](https://developer.android.com/studio/index.html)
2. Run the installer and just pick the default configuration, because lets be honest, you don't know what you're doing... and that's ok.
3. Start an empty project.
4. Code.
5. Realize you don't know what you're doing
6. Play with your cat for a few hours to procrastinate
7. Come back to your computer and google "How to make sick android appz".
8. Reminisce about the 90s and how cool it was to add 'z' to the end of a word.
9. Remember that you were just a little kid and the 90s and that everything was cool.
10. Miss being a kid.
11. Remember that, being a kid actually sucked and adulthood is way better because, if you want you can order a pizza right now and no one can stop you. No. One.
12. Get serious and follow a tutorial until 5 is no longer true .... (never)...

I found Derek Banas' Android tutorial to be a really concise starting point.
[check...](https://www.youtube.com/playlist?list=PLGLfVvz_LVvSPjWpLPFEfOCbezi6vATIh)
[it...](http://www.newthinktank.com/category/web-design/android-development-tutorial/)
[out](/images/noodle128.png)

That last one was just for fun...

So that gets us going with Android. Sick city. [At the bottom of the post](#links) are a few more links that
will be useful and as always just freakin' google it man ;)

# What the shit am I even trying to make here

Good question man. Lets talk about the design, what we want and examples of what
we don't want.

Like I said previously I wanted to build a very simple Music app that just exposes
the file system on my SD card and lets me root around in there and arbitrarily play files
(playable files). That sounds easy enough. My UI is simple and it works for me, if you choose
to make a music player of your own (you totally should, it's dead simple and you learn things
which is always fun) you may want to change certain UI aspects, you may even change the
entire premise of the app. Fuck it! Do what makes you happy dawg! [Here](https://github.com/owenstranathan/NobleShitMusic) is the code hack
away young Skywalker.

That said we need like a picture, I work better with pictures of things...

What's this I have a picture? Sweet.

![Layout](/images/2017/08/22/app_layout.png)

So that's the layout design. You want a list of files in the current directory,
a bit of text at the top to show you where you are in the file system, and a bit of
text at the bottom to tell you what's currently playing. And obviously at some point
some player controls to control music playback. Easy! (shhhh. It's way harder than that)

What we don't want is like google play, which imho really sucks. We don't want a
needlessly complicated system of categorization that makes it harder to get to the
music we know is there. And also we don't want to turn into a money grubbing "music-as-a-service"
evil empire.

This is what I started with and from here I just started working, so let's talk about what I did.

# Layout

I won't go into it in depth but in android you have 2 basic integral parts, this is
definitely an over simplification but it works for now. You have the layout (that thing we just
drew a picture of) which is the actual drawable appearance of your UI. And you have
the actual Java class that constitutes the code running on a device building, running and
managing that UI.

So a good place to start when writing an application is to make the thing you know you need.
(Actually it would probably be best to start with a perfect abstraction and building everything
up from first principles. But you can't do that right away because, again, you have no fucking clue what you're doing!)

So I need a layout, let's learn how that works.

In Android Studio there are 2 ways to edit an application's layout.

The first is to use the weird/difficult to understand GUI editor that comes with Android Studio
(which is a weird because it's a GUI for editing GUIs) or just edit the xml file that is edited by the GUI
using the preview renderer for reference as you hopelessly mash the keyboard hoping that each
change to the code is the one that moves that fucking button down 2 millimeters, god damn it!

I opt for the later and just spend all my time staring at a text editor because I'm a robot
and that works for me. You on the other hand might want to learn about the GUI, whatever
floats your boat man, I'm not here to judge.

In any case you need to learn about about the way Android uses xml to define
a concise language for describing visual layouts for applications. I'll talk about
it briefly but it's really very simple and with a little practice and a lot of googling
you should be pretty capable, fairly quickly.

As in other mobile development APIs (basically I'm talking about IOS here) and indeed
most GUI APIs, there are a set of standard GUI elements that you just get for
free. They are - by convention - called widgets and they can be anything from **TextViews**,
to **EditableTextViews**, to **Buttons**, to **ListViews**, to **CheckBoxes**, to **Menus** and
**Menu-items**.

Now I wanna stop right here for a second and talk to those of you in the audience that,
like myself, have the fucked up masochistic need for everything to have a good reason
for not just existing but also a justification for existing they way that it exists.
I'm talking to those of you who search wikipedia to find out why the Python language
is named after a snake and wind up confused, a few hours later, on a 10 year old
forum reading about dynamic type systems.

You know who you are...

If you're gonna get through this you gotta control
yourself, you need to just accept some things about the API and not try to learn everything
there is to know about each new thing you encounter. Capiche?

Ok back to bid-nis. So you get these widgets for free from the API, that's the point
of an API it elevates your work flow and thinking up a level of abstraction. So the layout is
composed of these widgets and you express your desire to used a widget in a layout
through xml.

Lets just look at an example that corresponds to the picture we made.

{% highlight xml %}

<LinearLayout
    xmlns:android="http://schemas.android.com/apk/res/android"
    android:orientation="vertical"
    android:layout_width="match_parent"
    android:layout_height="match_parent">
    android:orientation="vertical">

        <TextView
            android:id="@+id/DirectoryTextView"
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:text="Directory path"/>

        <ListView
            android:layout_width="match_parent"
            android:layout_height="match_parent"
            android:layout_weight="1"
            android:id="@+id/DirectoryListView">
        </ListView>


        <TextView
            android:id="@+id/CurrentSongTextView"
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:text="Currently playing"/>

</LinearLayout>


{% endhighlight %}

So without going in depth into what the different xml-tag attributes are/do, this
just says:

Give me a **LinearLayout** - which means that all the widgets within are
positioned Linearly (i.e. one after the other), the other kind of layout is a **RelativeLayout**
which means all the widgets within are positioned relative to one another.

Inside my **LinearLayout** put:

1. A **TextView** - A widget for displaying text
2. A **ListView** - A widget for making and displaying lists of other widgets (typically **TextViews**)
3. Another **TextView**

That's it. If you write this up in a new blank Android Studio project you will get
a preview that looks identical (barring ***color differences*** - ***which can be changed in the colors.xml file in the res/values directory***) to the picture I've drawn above (I didn't actually draw that...
it's a screen shot of my Android Studio preview window)

So that takes care of the layout stuff. It's super easy and if you don't know something
it's as easy as looking up syntax and convention.

# Coming up next...

This post has become too long. (Probably a result of my garrulous narrative style of writing).
So I'm breaking it into parts.

Programming? In the next part I'll talk about how to write the java class that will drive the UI
of our MediaPlayer.

[Click here for part 2](/posts/2017-08-30-Building-a-MediaPlayer-for-Android-II)









# Links
* [Derek Banas - Android Development Tutorial](https://www.youtube.com/playlist?list=PLGLfVvz_LVvSPjWpLPFEfOCbezi6vATIh)
* [Android API Documentation](https://developer.android.com/index.html)
* [Stack Overflow](https://stackoverflow.com/documentation/android/topics)
* [Google](https://google.com)
