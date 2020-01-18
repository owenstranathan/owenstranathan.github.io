---
layout: post
date: 2020-01-16
categories: [game-programming]
---


### Backstory

[just get to the code bud.](#succinct-description-of-goals).



I'm 26 years old. That places me firmly in the console only generation. What that means is that I started gaming well after the proliferation and success of game consoles.  
My fist console was the Super Nintendo and then a PlayStation, and then a Nintendo GameCube and an Xbox, then an Xbox 360, Wii, PlayStation 3 and most recently a Switch and PlayStation 4.  
It wasn't until after the Wii/Xbox 360/PlayStation 3 generation of consoles that I built my first gaming PC when I was about 17 years old (way back in 2010).  
So what does all this have to do with anything? My history with consoles separates me (and others like me) from the people that have played PC games their whole lives,  
in that I am most comfortable playing video games using a game controller.  

This has been a persistent problem for me with prototyping games. When you're prototyping games you want to move as quickly as possible,  
just implementing the bare minimum to actualize an idea to see if it's worth exploring more.  
However in my experience the unity input system does not make it easy to configure controllers quickly and efficiently.  
This makes it hard for me while I'm prototyping because I think about games with controller input in mind, and I actually have to make extra mental effort to think about how to sensibly  
map controls to mouse and keyboard input. This is a problem because if my prototype feels weird because the control scheme is comfortable or intuitive (mouse and keyboard)  
then its distracting me from the good parts of the idea that I want to explore further.  
So to fix this I decided to take a moderately deep dive into the unity input system and I've worked out a fairly simple yet powerful input management scheme.


### Succinct Description of Goals:

1. I want gamepad input in my unity prototype.
2. I want it to be easily and sensibly configurable (which by default in Unity it is not).
3. I want to be able to swap what kind of controller(PlayStation 4, Xbox 360, Switch Pro, etc.) I'm using with very little fuss and reconfiguration.
4. If possible I would like it to be possible for my behaviors plug into an input event system to allow them to detect input without lot's of `if(Input.GetButtonDown(....))` type code all over the place.

So without further ado, let's get started. But first the code.

# Code

There are 4 primary source files and 1 `.asset` file of interest in this system of capturing input.

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

**InputManager.asset**
```yaml

{% include_relative code/InputController/InputManager.asset %}

```

### `UnityEngine.Input` [^1]

First let's talk about the unity input system as it exists today. [unity documentation about "Convential Game Input"](https://docs.unity3d.com/Manual/ConventionalGameInput.html).

The way it works is that unity under the hood interfaces with the
OS to detected input events from connected game pads, keyboards, and mice. It then abstracts these system level events into "virtual" 
input events in the form of a virtual axis. (Buttons are and keys are just axes that go from 0 to 1, if an "Alt Negative Button" is configured
then that button puts the axis from 0 to -1.)
The long and short of it is you need to configure your axes to name 1 of 20 "joystick buttons", 1 of 28 axes or any of the keys found on
a keyboard or mouse buttons.
You can also set other properties of these inputs like `gravity`, `sensitivity`, `dead`(threshhold for detection), `snap` and `inversion`.
The specifics of these properties are in a handy little chart [here](https://docs.unity3d.com/Manual/ConventionalGameInput.html)



___

[^2]: While I was fact checking some stuff to write this post, I learned about a new unity package the ["Input System"](https://docs.unity3d.com/Packages/com.unity.inputsystem@1.0/manual/index.html) that is supposed to serve as a replacement for the "old" style `UnityEngine.Input` class... I did not know about this before I wrote all this code... (learning!)
