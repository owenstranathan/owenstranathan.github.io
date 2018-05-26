---
layout: post
title:  "Bender the Deployer: A Robot Rises"
date: 2018-05-16 12:00:00 -0400
categories: technology
---

### Quick Recap

In the last post I rambled for a while about something or another, and finally after many digressions
gave a high level overview of the structure of our little CD application named Bender.

I'll write it out again for easy reference:

1. A worker application running on the kubernetes cluster
2. A slack bot to act as the UI for that application
3. A git repository for that cluster to use to get and version pod configurations

2 and 3 are trivial.

Slack has it's special way it wants it's bots to act and all we have to
do is write http endpoints for slack to POST at. 

Your git repo can exist how ever you like it to, all you have to do is come up with a system for 
organizing it and be consistent. The hard part will be getting your kubernetes application to 
use it.

Which leads me to the only real work to be done.

# Bender

Bender is what we're calling our kubernetes application, so I don't have to keep typing the words 
"kubernetes application". Also I might interchangeably use k8s, kubernetes, and kubernoodles. The
first is the accepted abbreivation, the second is the legit name, and the third is one of the small
ways I keep myself entertained.

If you recall in part 1 I suggested that you write Bender in Go. You should still do that. But 
I wrote Bender in Python. I like Python, so just deal with it. All the code I show you in this blog 
should be easily translatable to Go or anyother language, so I don't think it will be a problem.

Lets take a second and very quickly think about what we want this little guy to actually do anyway.
I like lists, so let's make a list.

Bender should:

1. Accept a webhook from our CI service when a new build is available.
2. Ask a human over slack if they want this build to be pinned (deployed)
3. Get the latest version of the k8s config for the app from our git repo
4. Change the requisite values in the appropriate config
5. apply those changes to the cluster by talking to the kubernetes API
6. try to determine if the changes updated successfully (more on this later)
7. commit the changes to git and push to remote on success OR reset changes on failure
8. tell a human what happened

Bender has his work cut out for him.

Let's just do this all in order then.

## Flask is cool

When I first wrote Bender I used Django. There were a couple reasons for this.
The main reason however was that I had used Django before, and felt comfortable 
writing simple Django apps, and I hadn't really used Flask. This was a bad reason to 
choose Django. Django is a high quality framework, but it's pretty heavy weight in 
comparison to Flask. I've used Flask a lot since I finished Bender and if I could do it
again I would use Flask. For the purposes of this blog I'm going to use Flask, because I 
just like it so much more than Django now and because we don't really need a great big heavy
duty web-framework like Django to do what we need to do on this project.

**Caveat**: One thing I do like about Django, is the build in Admin site. It makes getting in
and playing with the data in the DB much easier. That said I don't think this project warrants 
a full on Relational Database. We're gonna use REDIS. Fun Fact: I hated REDIS when I first came 
to appfigures because it was so foreign to me, I think I still hate it, but I've got a bit of
REDIS stockholm syndrome now. Another good reason for us to use REDIS is because we are going to 
be using Celery which requires a message broker like REDIS or RabbitMPQ (I've never used rabbit
but as I mentioned before I like redis a lot) and since we will already be provisioning a REDIS
instance we may as well use **it** rather than bloating our application with a big fat RDMS (Relational
database management system) like postgres or mysql.

So to start lets get some basic project start up boilerplate out of the way

We need a couple of things to begin:

1. a flask app which will reside in `app.py`
2. blueprints (flask for sub-apps) for slack and our CI service to talk to in `blueprints/slack.py` &
`blueprints/ci.py` respectively
3. Some models to represent a few key data models: 
    * `environment` - correlates to a kubernetes *context*
    * `project` - correlates to the project (application) that is deployed
    * `build` - is the container that lives on docker-hub or whatever container registry that our CI 
    builds, and it is what gets **pinned** (deployed) to the kubernetes cluster

I always use [Pipenv](http://pipenv.org/) it is excelent software, you should too.

Begin by making a directory for your project wherever.

`mkdir bender-the-deployer & cd bender-the-deployer`  
I use python3.5+ when I can. You can get away with using 2.7 but I think it's time we all moved on
as a programming community.  
`pipenv --python /path/to/python3`  
or you can just do  
`pipenv --three`  
what that does is create a new virtual environment for your project using python3 and creates a Pipfile
which is the new replacement for requriements.txt (it does some cool things besides just track your
dependencies, head to pipenv's website to read more on that)

Once you've done that go ahead and install some of the deps we know we'll need right up front  
`pipenv install flask rom slackclient`

this will add these packages to your Pipfile and create a Pipfile.lock (you should add both of these
to source control)

#### What are those packages?

* [flask](http://flask.pocoo.org/) - the bestest python web framework in the land
* [rom](https://josiahcarlson.github.io/rom/rom.html#documentation) - ORM like functionality for Redis
* [slackclient](https://slackapi.github.io/python-slackclient/) - Slack SDK for Python

Cool.

You should lay things out they way you like, but I'll show you what my project structure looks like in
case you want to know.

```
bender-the-deployer
├── Pipfile
├── Pipfile.lock
└── bender
    ├── __init__.py
    ├── app.py
    ├── blueprints
    │   ├── __init__.py
    │   ├── ci.py
    │   └── slack.py
    ├── helpers.py
    └── models.py
```

As we progress there are a few big things we'll need to add but that will come with time.
For the most part this is the basic structure for the web-app portion of our project.

All the work of talking to kubernetes and managing a git repository will come later (it's also
the most difficult task we have to do and as such we'll save it for later and get the easy stuff
out of the way first)

