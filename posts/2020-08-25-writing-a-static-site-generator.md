---
title: "DIY Life: Making a static site compiler"
date: 2020-08-25
categories:
 - programming
 - DIY
links:
 "A perspective I appriciate": https://motherfuckingwebsite.com/
---

I used to use Jekyll. I didn't choose Jekyll, Jekyll just happened to be the software available
with support from github pages, which is where I host my website. I have some gripes about Jekyll,
I won't enumerate them, but they are the same gripes I have about a lot of general purpose software.
This is just what using software is like. That said, it's nice when software sucks in some way and rather
than being frustrated about it you can do a little this and that and make it better, good even.

I also use Windows 10, there are many things I don't like about Windows 10, things I would change.
But I'm not gonna make my own operating system, ain't gonna happen. I'm not even gonna do the laborious
work of maintaining the 10 million config files required to have my ideal Linux desktop with i3 and fancy keyboard bindings,
and ranger and all the things. Because after you factor in the time spent configuring all the tools, I won't save that much time.
Windows is good enough, and most of the time good enough is good enough. Likewise with Firefox; do I wish that Firefox had native vim bindings? Yes.
Am I going to extend it or otherwise hack it to add them? No. Vimvixen is good enough.
But operating systems and web browsers are complex software applications, and there are a lot of good reasons not go altering them willy nilly.
Something, something... [Chesterton's fence](https://en.wikipedia.org/wiki/Wikipedia:Chesterton%27s_fence).

However, Jekyll doesn't do anything complicated (at least not for me, maybe it **can** do complex things but it's not obvious).
Compiling a list of files written in markdown and running a template engine on a handful of other files
to produce a static website isn't complex. And more over, I frequently find myself wishing I could do such and such a thing with Jekyll and end up
combing google and Jekyll docs looking for the right liquid incantations to do so. But I know how to program a computer to munge some files and I'm
halfway decent with python. So why don't I just do it myself?

Well I did. The result is a purpose built custom site compiler that I highly recommend you DO NOT COPY. (Because you can do better yourself, or 
rather; you can do better FOR yourself).

[Here](https://github.com/owenstranathan/static-markdown-site-compiler) is the result. It depends on Jinja2 and Markdown, I prefer not to use pip packages if I can help it but whatever, I ain't writing [another](https://github.com/owenstranathan/bash-templater)[^1] template
engine.
I only tested it on windows. Because again I just don't have time for Linux anymore.

The site compiler is what built this website. And I can honestly say that at the time of writing I feel that it was worth the 1 - 2 hours it took me to trial and error my way to the current product.
If I need something I can add it, but most of the time I don't because I know it's more work than it's worth (which was never clear before I knew every detail of the system).
The only Jekyll features I miss are `--watch` (which watches the files in the project for changes and recompiles the site when you change something) and `--serve` (which servers the site from a local dev server).
I can totally implement them because python has built in http dev server, and I don't need anything too fancy for watching the files, but it's a nontrivial task that I don't have time for right now. Maybe soon.

The end.

[^1]: Technically I didn't author bash-templater. But if you diff my fork from the parent you'll see that I've made enough changes that I feel justified in saying that I've "written" a bash template engine.
