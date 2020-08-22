---
title: "Beginner's Mind: Relearning Vim"
layout: post
date: 2020-04-11
categories:
 - programming
 - shoshin
links:
 "Shoshin(Beginner's Mind)": https://en.wikipedia.org/wiki/Shoshin
---

[Get to the point](#the-point)

# Vim is great

I use Vim every single day. It's my daily driver text editor, and I definitely have Vim "in my fingers".
So much do I prefer the ergonomic interface of Vim that I even built a custom keyboard to allow me to remap
things like arrow keys and page down to the corresponding Vim keys and (sort of) use Vim everywhere.

That said. I don't actually know that much about Vim. Obviously I know enough to be productive and to
prefer Vim over all other editors, but occasionally I will be doing a repetitive edit operation over
and over and think to myself, there must be something in Vim to make this faster and easier.
So I'll saunter on over to my browser and open up google and type "How to do X in Vim" and then read
a bunch of blogs and SO articles and eventually come out knowing something more about how to use Vim.
This has served me well and has helped me to cement the *most useful* features of Vim into my muscle memory.
The problem with this approach is that a lot of things are super super useful in Vim, but their use cases are not frequent,
and maybe even not obvious. This makes for a certain subset of Vim commands and features that I have to constantly
relearn and lookup in order to use effectively, and a larger subset of commands and features that I don't even know about but perhaps maybe I should.


# Vimtutor

If you've ever tried to learn Vim before, or thought about learning Vim before, you've probably been told to use Vimtutor[^1].
If you're like me you opened Vimtutor, did the first couple of exercises, got impatient and either quit, or like me just used Vim anyway
and looked up everything you wanted to know when you wanted to know it. I like my way. It's a trial by fire and it's
how I do most things. I think it helped to get Vim in my fingers more quickly because I was using Vim immediately in a real world editing
context and I learned the commands and the features because I had to or else suffer productivity losses.
One of the short comings of my "throw away the instructions and just get busy" style is that I only learn about the things I think
I want to be able to do, which leaves an opening for things I would want to do if I knew about them, to slip and leave me inefficiently
working in ignorance.

So to rectify this I decided to spend this Saturday reading 2 documents.
The first obviously is Vimtutor, and the second is Learn Vimscript the Hardway, by Steve Losh.
When reading vimtutor I was shocked at the number of simple commands I had either overlooked or
neglected to become proficient with. I'm very excited to learn these things and hopefully experience a
boost in productivity and efficiency as a result. But the short comings of reading only as a form of learning have not
changed. And so in an attempt to try and improve my retention I've decided to write down all the things I didn't already know
that I've learned from vimtutor today.

# The Point

#### Stuff I Learned From Vimtutor, that I Didn't Know Before

1.  Undo all the changes on a line with `U`. (Vimtutor 2.7)
2.	Type  `rx`  to replace the character at the cursor with  `x`. (Vimtutor 3.2)
3.	To change until the end of a word, type  `ce`. (Vimtutor 3.3)
4.	The change operator is used with the same motions as delete i.e. `c$`, `c2w`, etc. (Vimtutor 3.4)
5.	Type `CTRL-G` to show your location in the file and the file status.
    Type  `G`  to move to a line in the file.	(Vimtutor 4.1)[^2]
6.	Type  `%`  to find a matching ),], or }. (Vimtutor 4.3)
7.	Type  `:%s/old/new/gc`	to find every occurrence in the whole file, with a prompt whether to substitute or not. (Vimtutor 4.4)
8.	To save part of the file, type  `v  motion  :w FILENAME` (Vimtutor 5.3)
9.	To insert the contents of a file, type  `:r FILENAME` (this can also insert output from external commands i.e. `:r !ls`) (Vimtutor 5.4)
10.	Type  `a`  to insert text AFTER the cursor. (Vimtutor 6.2) [^3]
11.	Type a capital  `R`  to replace more than one character. (Vimtutor 6.3) [^4]
12. Type `:set ic` to ignore case in search. Use `/search\c` to ignore case for just that search. (Vimtutor 6.5)


If you look at the Vimtutor lesson numbers you can pretty much see where I gave up the last time I used Vimtutor, it was in lesson 2.
I learned something from each lesson after that, so even for me a fairly well seasoned Vim user, I learned a lot from Vimtutor, this is probably
more to do with the fact that I've not spent a lot of time sitting down and just learning things about vim. It's a big beautiful tool, and there
is a lot to learn. If you've never done the Vimtutor, I highly recommend that you do.

---

[^1]: For those who don't know, Vimtutor is a script that is included in *most* Vim installs. It launches Vim on a copy of a file the text of which teaches you the basics of using vim. It's a pretty great thing, but it's definitely boring.
[^2]: Usually I use `:#` to jump to line `#`, using `G` is pretty much the same as far as speed and ergonomics.
[^3]: I knew I could use `A` to jump to the end of line in insert mode, but didn't know about `a`.
[^4]: This is replace mode. I knew about this, but I haven't internalized it.
