---
layout: post
date: 2020-01-16
categories: [game-programming]
---

#### [Just show me the code buddy](#code)

Lately I've been getting kind of tired of [this](https://github.com/wabisoft/waves-unity) 2D game I've been working on [^1].
I don't know what the problem is, but everytime I sit down to work on it I just feel like I don't know what to do.
I'm starting to worry that there just isn't enough of a game there for me to keep working on it.  
This became really evident yesterday when after close to a week of not working on the game I finally had time
to sit down and dedicate some hours to it, and I just wasn't interested. Maybe I just need to take a break from that game for a little while.  

This is a bummer, but yesterday I still wanted to do some kind of work though, and I obvious want to make videogames.
So instead I decided to try prototyping out a little game idea I had for a game in 3D.  
Long story short, the prototype hasn't gotten very far. But I'm really excited about the idea. So let's talk about what I've done so far.


### `UnityEngine.Input` [^2]

The very first thing I wanted to do for my prototype was have a "character" (for now just a capsule with a blocky nose thing to indicate it's direction)
that can run around the world and do character things presumably. As well as a camera, rigged in such a way that it follows the player around.
I wanted to be able to control both the character and the camera with a game controller(a la Super Mario Odyssey), viz. with the left joystick
controlling the movement of the character and the right joystick controlling the movement of the camera.

To start off towards this goal I did what any self respecting amateur would do and I just plugged in my controller to my PC and hoped that
it might magically just work (I mean what am I using a commercial engine for if not to avoid lots of tedious work). Alas that was a silly idea, that
I knew would not work.
So next I read [this unity documentation about "Convential Game Input"](https://docs.unity3d.com/Manual/ConventionalGameInput.html).
Therein they describe the basic set up for detecting input through unity. The way it works is that unity under the hood interfaces with the
OS to detected input events from connected game pads, keyboards, and mice. It then abstracts these system level events into "virtual" 
input events in the form of a virtual axis. (Buttons are and keys are just axes that go from 0 to 1, if an "Alt Negative Button" is configured
then that button puts the axis from 0 to -1.)
The long and short of it is you need to configure your axes to name 1 of 20 "joystick buttons", 1 of 28 axes or any of the keys found on
a keyboard or mouse buttons.
You can also set other properties of these inputs like `gravity`, `sensitivity`, `dead`(threshhold for detection), `snap` and `inversion`.
The specifics of these properties are in a handy little chart [here](https://docs.unity3d.com/Manual/ConventionalGameInput.html)



# Code

There are 4 primary source files of interest in this system of capturing input.

**InputMap.cs**
```cs

{% include_relative code/InputController/InputMap.cs %}

```

**InputController.cs**
```cs

{% include_relative code/InputController/InputController.cs %}

```

**InputConfiguration.cs**
```cs

{% include_relative code/InputController/InputConfiguration.cs %}

```

**InputListener.cs**
```cs

{% include_relative code/InputController/InputListener.cs %}

```

___

[^1]: Probably because I've been working on it forever, through many iterations which can be found [here(V1: No Abstractions Just Bad Code)](https://github.com/owenstranathan/waves), [here(V2: Data-Oriented? Sounds Good, Let's Make Everything That)](https://github.com/wabisoft/waves), and sort of for a tiny second [here(V3: No Game Just Abstractions)](https://github.com/wabisoft/ecs) 
[^2]: While I was fact checking some stuff to write this post, I learned about a new unity package the ["Input System"](https://docs.unity3d.com/Packages/com.unity.inputsystem@1.0/manual/index.html) that is supposed to serve as a replacement for the "old" style `UnityEngine.Input` class... I did not know about this before I wrote all this code... (learning!)
