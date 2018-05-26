---
layout: post
title:  "Bender the Deployer: Origins"
date: 2018-05-16 12:00:00 -0400
categories: technology
---

This blog is a trilogy. **Origins**, **A Robot Rises**,
**Let's All Get Drunk and Forget the Whole Thing**

# Some background

When I first started at appfigures, I was untested, inexperienced and very anxious to
prove myself. One of the very first tasks I was given was to take an existing
slack app/experiement, which deployed projects to a kubernetes cluster, and make it
actually work. I knew nothing about slack, Flask, kubernetes and, just about everything.

I'm going to tell you about how I jumped in head first, made decisions which had
lasting effects with limited knowledge or experience to back them up, and slowly
achieved my goal. I want to talk about two things:  
1. How I made a CI/CD pipeline with no prior experience or knowledge of what CI or CD or even
Micro-Service Architecture was or meant
2. How I have, in the last 6 months had to learn quickly the life cycle and flow of professional
software development, how I'm still learning, how that makes me nervous and excited and how the
mentorship, patience and understanding of my bosses and co-workers made this possible, pleasent,
and an extremely valuable learning experience.

#### Hey Owen, here's a thing called kubernetes. Make it so.

When I started my job at appfigures I had virtually no experience. I was a year out from
college and had only had one other job in software (a job that I left within 2 months).
I had been working as a cook to pay the bills and was well out of practice with programming.
So it was somewhat overwhelming for me at the start because, if I hadn't
encountered something at school, I didn't know about it.
And in the begining, things I didn't know constituted just about everything I needed to know.

So when I began, the head of engineering said to me something along the lines of:

  *So we have all these node projects, and they are all deployed
  in different places and in different ways, and we want them to
  all move over to continuous deployment on this thing called
  kubernetes.
  You should probably start by reading about what kubernetes is*

So I did just that. Unfortunately learning about kubernetes is predicated
on understanding what containers are and how containers work, and why any
of that is important. So many hours googleing and reading later, I came out with a decent
comprehension of what kubernetes is, what containers are and why any
of it matters. And as a bonus I also got a nice little introduction
to the idea of micro-service architecture.

#### Kubernetes & Containers TL;DR

In the old days (and often still) web services were deployed on machines with
a single OS that ran the applications.
Later, to squeeze more work out of one machine; virtual machines or VMs were
employed so that one machine could do the work of many.
Now days the virtualization happens at the OS level and one machine runs multple
virtual operating system instances called "Containers" which is responsible for
running one application. The most popular Container virtualizer is called Docker.
When many machines are running many conatiners this is called a *Container Cluster*
As you can no doubt imagine, managing multiple machines that all have many containers
running on them can be cumbersome. This is where *Container Orchestration*
comes into play. *Kubernetes* is a very popular container orchestration framework
developed originally by Google and open sourced for the common good.

## Formalities

Before I go much further I want to formally state the problem, and
describe what we want to have. 

### Problem

Kubernetes sets up and runs containers on a cluster using a declarative set of
configuration in the form of YAML files. What container is running in a specific configuration
is specified by a single value in the configuration. The `image` tag maps to a container
image sitting in a container registry somewhere. The common case is that when a new release
or version is available of the same application the only change made is to the number of the image
tag. (i.e. `bender-app:1` vs `bender-app:2`)  
It's annoying to need to find the configuration document and change a single byte then run
`kubectl apply ...` everytime a new version needs to go into production. (Not to mention
manually doing this is a bad way or doing Continuous Delivery, and it would be very cumbersome
unless you pay an intern to sit at a terminal 24/7 and do this. Mechanical Turk anyone?)

**Disclaimer**: I should also mention that the solutions I found later and mention below do exactly
what we want but lack a small feature (as far as I know) and that is the ability to "bless"
a build before it lands in production.

### What we want

We want to be able to have all commits to source control start builds and 
send those builds to our container registry. Our CI service that we employ does this exactly
and there is no change needed in this regard. So we only need a more custom CD step, that is
we just want one intermediary step in the middle where a human/developer is consulted
before a container is deployed. We call this process **pinning**.

We want that step to be a slack bot that **asks** if a build should
be deployed and replace the old build (**pinned**).

If we mess up and pin a build that breaks something we want to be able to tell the
bot to unpin just as easily.

Slack bots are cool and easy to make, and slack has some cool prebuilt UI features like buttons
and junk.

## Where to start

Now that I knew what I was trying to do and I knew a little bit about the
technologies involved, it was time for me to get my toes wet and
look at some code.

What I inherited was a Flask app that was written in what was described to me as:
"Literally a day" and I was encouraged to change anything and everything.

My first instinct was "This must exist already so let's not reinvent the wheel."
So I did some researching and I looked around. The problem was I still wasn't totally
sure what I wanted or needed, looking for something and not knowing what it is in advance
is no easy task.

I found only one thing that seemed like a reasonable pre-existing solution to our problem.
That thing was Helm. Helm is a sort of package manager for kubernetes (like apt or yum).
That's pretty cool and it makes bootstrapping applications to a kubernetes cluster dead simple.
That said it's not really condusive to automation and CD, it works better as a user cli tool.
I'm sure there are ways one could use Helm as a CD tool but when I was deciding how to move
forward with our CD on kubernetes at appfigures, both I and the head of engineering felt that
using Helm would have been more cumbersome than we wanted. So I decided that I would make
my own purpose built kubernetes CD application, which is what we're talking about in this
here blog post.


**Another disclaimer**: At the time that I was working on Bender there wasn't a good existing pre made solution available
to me. This has changed and there are now at least a couple, if not more. I'll leave a list and
you can check them out if you're interested. (You should be interested building your own is a
non-trivial task)

1. [GitKube](https://gitkube.sh/)
2. [Keel](https://keel.sh/v1/guide/) *I don't know why but all things kubernetes are nautically themed*


## Get on with it!

Ok, ok so by now you're probably tired of my rambling and wondering just how exactly I made
Bender. Well fine I'll get on with it.

Bender has a few components.

1. A kubernetes application service that does the deploying on the cluster.
2. A slack bot that talks to the application on the kubernetes cluster.
3. A git repoistory on which all kubernetes yaml files live and are versioned

That's it. So let's dive in a little.


## The Kubernetes application

All the CD applications I mentioned above (Helm, GitKube and Keel) all have one requirement
in common. They all have a application container (pod in kuber-ese) that runs on the cluster to manage
updating the approriate kubernetes resources.

This is not totally necessary but it's definately the easiest solution. Allow me to explain with a 
long winded description of how kubernetes works.

Kubernetes is actually just an API specification and a few applications that run in containers
implementing that API spec. The kubernetes API can speak HTTP and likes to get its information
in the form of JSON. In fact the YAML configuration files get translated into JSON before client
tools like `kubectl` sends them to the kubernetes API server running on the cluster.

Every kubernetes cluster has a pod (container) running the kubernetes
API server that will do all the behind the scenes work and accept declarations of cluster state.

That said the kubernetes API is kind of dense and hard to use as a human, but APIs aren't ment
for people they are ment for robots, and tools like `kubectl` and the various kubernetes client
libraries for languages like Go and Python all make use of the kubernetes API to talk to the
the server on a kubernetes cluster.

Kubernetes is a production grade conatiner orchestrator, one of the reasons it's production grade
is because it has a pretty good authentication process. As a result applications talking to kubernetes
from outside the cluster must undergo a much more rigorous authentication process than applications 
inside the cluster. Therefore it makes good sense to have a middle man application on the cluster that 
does all the work of talking to kubernetes about creating, updating and destroying pods (containers) on
the cluster as a part of your CD pipeline. (Also, since the code has to run somewhere why not just
have it run on the cluster? Makes sense right?)

## A Slack Bot

So we know we need a guy inside to relay information to kubernetes. Cool. What else do we need.

If we have to get and post to and from our application on the cluster to communitcate with it, then we aren't in much better shape than we were without it. We need a UI of some sort.

I don't know about you but my javascript is not up to snuff, and a static web page won't cut it.
Rather than drag our friends on the Frontend team into this mess (they have much more important things
to do) let's just use slack.

What's slack you ask? [Slack](https://slack.com) is a team messaging application widely used by
programming teams around the world. It also has a really usable API that allows you to write
bots for things. It's pretty great and you should check it out.

**Hey look another disclaimer**: I'm not baised toward slack, if anything the opposite is true.
It just so happend that my team at appfigures was using slack when I came on board. There are other 
messaging services similar to slack that I encourage you to check out before you make a decision (if 
you haven't already). They all have APIs that let you write bots and are therefore totally viable 
options for our use case. They are in no specific order:

* [Zulip](https://zulipchat.com/) - I like the idea of Zulip and would like to give it a real go 
someday. Also it's an OSS project, which I respect a lot. And to top it off it's implemented in Python
which I like.

* [Discord](https://discordapp.com/) - Discord is targeted more at the gamming community, but I use it 
regularly to coordinate with my brother on our programming projects and I find it to be very similar to
Slack. It emphasizes it's VoIP capabilities much more than Slack and Zulip and markets itself as a 
replacement for Skype and TeamSpeak.


## A Git Repository

One of the more cumbersome aspects of kubernetes is all the g\*\* d\*\*\*\*\* configuration files.

When you have a bunch of text sitting around in files that periodically changes in a meaningful way, 
it makes good sense to keep it under revision control (source control/version control/whatever you 
want to call it) and kubernetes configuration files fit the bill for this exactly, so that's exactly 
what we will do with them.

**(I think you see the pattern here) Disclaimer**:
At appfigures we use github (who doesn't still) but if you use bitbucket
or some other versino control software (VSC) repository platform that uses git then it's the same.
If however you use svn or some other VSC I wish you fair weather in finding/learning about a 
client library for interacting with your VSC. (God knows it was hard enough with git, and git is great!)

## Time to write some code?

No, not yet.

There are some pretty non-trivial things we need to do here. And so we should take a moment to 
consider once more whether we really want to write this all ourselves or if we want to use one
of the pre-fab solutions listed above. I am not very smart and opted for the former. I'll give
you a second to make the right choice here and stop reading this article and click on one of 
the links above.

...

Still here huh? I get it, you want to live and die by your own strengths. I admire that, 
I have a bit of that going on myself. It's not really condusive to a highly productive career
in programming though. But hey here we are just two peas in a pod about to run ourselves over
some searing hot learning curve coals in the name of self-reliance. Let's do it!

I wrote Bender in Python. There were 2 reasons for this decision.

1. I both know and like Python
2. There is a kubernetes client package for python.

I would highly recommend that you choose a language that is both easy to deploy as a containerized
web app, and has a kubernetes client library. Lucky for you I found a link with a
[list of kubernetes client libraries](https://github.com/kubernetes-client)

Another thing you should look for in your language is the ability to interact with git through
a library. Python has [pygit2](http://www.pygit2.org/) which is a python wrapper around the 
C library [libgit2](https://libgit2.github.com/).

At the time of this writting there are currently bindings for libgit2 in the following languages:
* Ruby
* Python
* C#/.NET
* Objective-C
* Lua
* Perl
* ParrotVM (whatever that is)
* Nodejs
* C++ Qt
* Go
* PHP
* Erlang
* Chicken-Scheme (wtf? who names these things)
* GObject (I think this is a GNOME thing?)
* D (real original name there bud)

There is definately some overlap there. So pick one and stick to it (you should pick Go. The whole
kubernetes community uses Go and so there is a lot of reference material to go on)

If you're not using git, then I'm so sorry but I can't offer advice. God speed on your quest brave soul.

If you've chosen your weapon and are absolutely certain you want to do this move on to part 2: 
[A Robot Rises]({% post_url 2018-05-16-bender-the-deployer-a-robot-rises %})

