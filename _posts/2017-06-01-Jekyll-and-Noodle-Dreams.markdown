---
layout: post
title:  "Jekyll and Noodle Dreams"
date:   2017-06-01 12:00:00 -0400
categories:
---
# Hello
Hello and welcome. You have found my blog. This is good news
because this blog is just seconds old as I write and if the date you see near the top
is close to the day you're existing in then you're here early (congratulations!).

I don't have much to say in this first post, I just want to put something up today
so that the place isn't so empty. Since this is the first post of this blog,
and I built this blog using [***Jekyll***](https://jekyllrb.com),
I'll use this opportunity to talk a little
about what that experience was like.

[TL;DR](#so-whats-this-all-about-really)

# What is Jekyll?

Glad you asked... Read [this](https://jekyllrb.com/docs/home/).

Now read this:

"Jekyll is a simple, blog-aware, static site generator."

Ok? So what's that mean?

## Simple

Now I'm no expert, but I think I've been around the block enough to say I'm reasonably
adept at figuring out how to use a new piece of software. This is especially true
when that software is super well documented (I'm not just talking about *quantity* of documentation
I also really mean, with strong emphasis ***quality***).

This is the case with Jekyll. If you can't figure out how to get things going by browsing
the [docs](https://jekyllrb.com/docs/quickstart/) on their site then you can definitely figure
it out after a quick google search(or whatever search engine you use...freak).
There are tons and tons of well made tutorials out there, and further more Jekyll is
a fairly simple to use piece of software to begin with.

### What make's it so simple?

Jekyll is simple because Jekyll doesn't actually do anything with your site. It just takes
in some Markdown files and template html files, takes a quick peak at a YAML
configuration document and builds a static website comprised of html, css and whatever else
you may have thrown in there (pdf, png, etc.)

## Blog Aware

Jekyll is blog aware, in that it was designed for the creation of blog websites.
It is designed to maintain blogs by watching for new posts and creating pages for
posts when they appear.

# My thoughts

I won't go into a tutorial on how to use Jekyll to build a blog site, there are plenty
of other blogs that already do a good job of that. What I will do is highlight some
of the things I like about Jekyll so far, some of things I don't like and some of the
Pitfalls I encountered in my first Jekyll use experience.


### Likes

I have a bit of a "bias"(read "unnatural confusingly sexual love") for a little
language called Python, you might have heard of it. If I can I use Python for something
I do. I admit that it's not the best language for all situations, but its super amazing
and I like it ok? OK.

That said, I don't need to tell you that when I want to write a web app, I fire up
the old terminal and spin up some Django. The reason I'm telling you all this, other
than the fact that I'm all alone and just need some one to talk to, is I've had
my first exposure to a Liquid. Liquid is... well I'll let Liquid tell you what it is.
[Liquid](https://shopify.github.io/liquid/). Suffice it to say it's a template language.
And lets just say that I think it's pretty amazing. I like it almost as much as Django's
template language (almost...). Which brings me to the first think I like about Jekyll.

One of the things I like the most about Jekyll is that you can pretty much use
templates anywhere you like all over your website. Want a template in your Markdown?
Go for it! What it in your html layouts? Uhhh that's what they're meant for....
What about in your sass? Well maybe not... I couldn't use templates in sass for a very specific
use case, but from what I read in [this](https://github.com/jekyll/jekyll/issues/2573) issue,
you can in fact render sass with liquid just nothing that is rendered can go in your layouts.
I might be wrong though, probably I am, I'm usually always wrong about something (this
might be that thing).

I'm starting to feel less interested in this blog post. I'm gonna hurry up now.
Other things I like about Jekyll in no specific order:

* Use of Markdown (Markdown is awesome)
* Simplicity (it really is super easy)
* Has made me interested enough in Ruby to learn it (so that's a cool thing)
* Runs natively on GitHub pages (that's really the whole reason I even used it
in the first place. and let's be honest,that's probably why you're looking of
information on Jekyll)

Ok moving on to dislikes.

### Dislikes

I really only have one complaint so far and that is that Jekyll creates a sort
of messy and flat project file structure. Jekyll requires that all your page files
be in the base directory of your project, and all the posts are just kinda crammed
in the _posts directory which makes everything sorta flat and cluster-fucky,
which is not necessarily a bad thing I just think it's ugly as sin.

### Pitfalls

So I got a simple site up and running in like 30 mins (which honestly is too long,
I think there's something wrong with me, like a learning disability or something).
But then I started to get into some heavy personalization stuff and that's where
the learning curve started to asymptote. (This probably wont happen for you, you'll
likely have a much smoother learning curve. Like I said above I'm just retarded or something)

![Learing curves](/images/2017/06/01/learning_curves.png)

As you can see there is an intersection there where we're almost equals but I quickly
spiral off into adult day care, while you calmly get your work done with little trouble.

As I was saying, after I got into matters of personlization I hit a few Pitfalls.
I'll just tell what you should do off the bat to avoid problems.

Find your theme's files by typing this into the command line

{% highlight shell %}
bundle show <theme name>
{% endhighlight %}

where \<theme name\> is the name of the theme you're using. (*Minima* is the default
and it's what I'm using now.)

Copy all the stuff (mainly just the *_includes*, *_layouts*, and *_sass* directories) and
place it lovingly in your local project directory.

The reason you should do this is because you're going to need to override stuff in your theme.
And rather than making your own overrider files it's just easier to copy the themes
original files and then make changes in your local copy.

Don't worry if you don't copy everything, anything you don't copy will be included from the
theme's files, so you really only need to take what you intend to override.

The only other thing you should definitely do is, learn to make use of the ***_config.yml***.
Any information that you'll be repeating a lot throughout the site (like your name, or a logo picture)
you should bind a reference to that information in your _config.yml file.

For example

{% highlight YAML %}
author: Owen Stranathan
favicon: /images/icons/noodls.png
favorite_food: noodles

{% endhighlight %}

This kind of important information will be used a lot and you can use it later by
grabbing it with Liquid (that awesome templating language I talked about earlier).

Like this

{% highlight html %}

<img src="{{ "{{ site.favicon " }}}}">
<p>My name is {{ "{{ site.author " }}}} and my favorite food is {{ "{{ site.favorite_food " }}}} </p>

{% endhighlight %}

and that would look like this.

<img src="{{site.favicon32}}">
<p>My name is {{site.author}} and my favorite food is noodles</p>

# So what's this all about really?

This whole blog post was really about me telling you that my favorite food is noodles.
My favicon's name is L'il Fella and he's a bowl of noodles. And that's all.

Thanks for reading :) See you next time!
