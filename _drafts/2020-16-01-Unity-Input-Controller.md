---
layout: post
date: 2020-01-16
categories: [game-programming]
---


### Backstory

[Just get to the code bud.](#succinct-description-of-goals)


I'm 26 years old. That places me firmly in the console only generation. What that means is that I started gaming well after the
proliferation and success of game consoles. My fist console was the Super Nintendo (actually it was my brother Ian's),
followed by a PlayStation(also Ian's), and then a Nintendo GameCube(you guessed it... Ian's) and an Xbox(Ian and I both had one),
then an Xbox 360(Mine!), Wii(Ian's, but was a gift from me), PlayStation 3(Mine!) and most recently a 
Switch and PlayStation 4(Mine, but was a gift from Ian). It wasn't until after the Wii/Xbox 360/PlayStation 3 generation of consoles that 
I built my first gaming PC when I was about 17 years old (way back in 2010).

So what does all this have to do with anything? Well besides illustraiting the growth, friendship and love of a beautiful brotherhood.
My history with consoles separates me (and others like me) from the people that have played PC games their whole lives,
in that I am most comfortable playing video games using a game controller.

This has been a persistent problem for me with prototyping games. When you're prototyping games you want to move as quickly as possible,
just implementing the bare minimum to actualize an idea to see if it's worth exploring more.
However in my experience the unity input system does not make it easy to configure controllers quickly and efficiently.
This makes it hard for me while I'm prototyping because I think about games with controller input in mind,
and I actually have to make extra mental effort to think about how to sensibly
map controls to mouse and keyboard input. This is a problem because if my prototype feels weird because the control scheme **is not**
comfortable or intuitive (mouse and keyboard) then its distracting me from the good parts of the idea that I want focus on and develop.

My most recent encounter with this problem took my on a moderately deep dive into the unity input system.
The result of which has turned out to be a fairly simple yet powerful input management scheme.


### Succinct Description of Goals:

1. I want game controller input in my unity prototype.
2. I want it to be easily and sensibly configurable (which by default in Unity it is not).
3. I want to be able to swap what kind of controller(PlayStation 4, Xbox 360, Switch Pro, etc.) I'm using with very little fuss and reconfiguration.
4. If possible I would like it to be possible for my behaviors plug into an input event system to allow them to detect input without lot's of `if(Input.GetButtonDown(....))` type code all over the place.

So without further ado, let's get started... Haha just kidding, here's the code first.

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

### `UnityEngine.Input` and the InputManager Asset [^1]

First let's talk about the unity input system as it exists today. [Relevant unity documentation about "Conventional Game Input"](https://docs.unity3d.com/Manual/ConventionalGameInput.html).

Super high level, the way that it works is, Unity interfaces with the OS to detect events coming from Input devices.
It translates those system level input events into Unity input values accessible through the `Input` class.
All input at the unity level can be thought of as a "Virtual Axis" what that means is every input can take a value between 1 and -1 with 0 meaning
no input. This makes lots of sense for say a joystick, but it's a little less intuitive for almost all the other buttons on a controller.
The reason that the inputs are configured as virtual axes is so you can define your own -1 to 1 interval using any buttons you like. This is
done by setting a "positive" and "negative" button for a given named input.
Lets take quick look at the default input set up.

![Default Input Settings](/assets/img/InputController/InputSettingsDefault.png)

You can see that the unity input settings are preconfigured with 18 inputs (i.e. it's an array of 18 virtual axis configurations)
I wont go to in detail about what all the settings do, because I don't know. Just know that this is where you're going to configure your input.
I've you've never done that then I highly recommend deleting all the preconfigured inputs and adding all your own to get a feel for how it works.

If you just want to copy me then you still need to delete all the existing inputs, do this by setting the size of the settings array to 0.

![Empty InputSettings](/assets/img/InputController/InputSettingsEmpty.png)

Once we've done this let's replace those old default settings with something a little more uniform.  

It's important remember that the inputs are accessed by **name** at runtime with something like `Input.GetAxis("MyStupidInputSettingName")`
Our system is going to aim to abstract that away so we need a uniform naming scheme, it doesn't need to be complex or clever, just automatable and
understandable to someone reading the code. The simplest one I came up with was `J%nA%a` and `J%nB%b` where `%n` is the 
joystick number, `%a` is the axis number, and `%b` is the button number [^2].

So for each controller we'll have 28 axes numbered 0-27 (`J%nA0`-`J%nA27`) and 20 buttons numbered 0-19 (`J%nB0`-`J%nB19`).
We'll have 1 additional input for each controller called `J%nNONE` We'll use this to map axes and buttons not used but 
a given controller scheme. This is kind of a chore to set up with the unity serialization ui window for input settings. So I 
recommend using a power editor of your choice (***&#42;cough&#42;*** vim ***&#42;cough&#42;***) to make a macro for each input type and just blow through
writing the yaml that way, the settings are serialized as YAML in `/ProjectSettings/InputManager.asset`.

Each axis will define an entry in a yaml list (which is how the settings array gets serialized).
each item in that list will set the `n_Name` following scheme described above. It will also set
`joyNum` to the joyStick number, `axis` to the axis number as well as `dead` and `sensitivity`(these should be set
according to preference). This is done for once for each axis for each controller, so there will be 28 * N axis inputs
(where N=number of configured controllers). If you want to you can just set up all 16, but I doubt your game will support local
16 player, so you should probably limit it to the number of controllers you mean to support.


```yaml

  - serializedVersion: 3
    m_Name: J1A0
    descriptiveName: 
    descriptiveNegativeName: 
    negativeButton: 
    positiveButton: 
    altNegativeButton: 
    altPositiveButton: 
    gravity: 0
    dead: 0.19
    sensitivity: 1
    snap: 0
    invert: 0
    type: 2
    axis: 0
    joyNum: 1

```

Each button will set `joyNum` in the same way that we did for axes as well as `m_Name` using the scheme for buttons,
but will only need to set `positiveButton` to `joystick button %n` where again `%n` is the button number.
Just like the axes there needs to be one for each button for each controller.

```yaml

  - serializedVersion: 3
    m_Name: J1B0
    descriptiveName: 
    descriptiveNegativeName: 
    negativeButton: 
    positiveButton: joystick button 0
    altNegativeButton: 
    altPositiveButton: 
    gravity: 0
    dead: 0
    sensitivity: 0
    snap: 0
    invert: 0
    type: 0
    axis: 0
    joyNum: 1

```

Finally we set the null input `J%nNONE` like an axis with no sensitivity

```yaml
  - serializedVersion: 3
    m_Name: J1NONE
    descriptiveName: 
    descriptiveNegativeName: 
    negativeButton: 
    positiveButton: 
    altNegativeButton: 
    altPositiveButton: 
    gravity: 0
    dead: 0
    sensitivity: 0
    snap: 0
    invert: 0
    type: 0
    axis: 0
    joyNum: 1 

```

With that done we can detect input on any of our controller through 

```cs 

Input.GetAxis($"J{joyNum}A{axis}");
Input.GetButtonDown($"J{joyNum}B{button}");

```

Which is great but it's still not very useful. Different controllers will have different configurations of this
scheme. So for example a Dual Shock 4(Playstation 4) might have it's left stick horizontal and vertical axis on `A0` and `A2` respectively.
Whereas an Xbox 360 controller might have it on `A0` and `A1`.
In fact I've even witnessed input mappings varying for a single controller just between wireless mode and wired.
So we need a way to define which inputs map to what buttons for a given controller. This sounds like a job for scriptable objects.


### InputMap.cs

This brings us to the first piece of source we're gonna look at the `InputMap`.
The `InputMap` class is a Unity `ScriptableObject` that serves to map between our input scheme and an interface that we can understand
and that makes sense. The goal here is be able to get a controllers input state with something like this:

```cs

var leftStickVertical = Input.GetAxis(inputMap.LeftStick.Vertical);

```

That looks a lot more manageable. Let's talk about how to do that.
My initial implementation just had a string from each highlevel input name I wanted
(LeftStick[Vertical|Horizontal], RightStick[...], L1, R1, ButtonTop, ButtonBottom, etc..) which would return the axis or button it maps to.
However I decided that its a little bit safer to define enumerations for each possible button and axis and define the `InputMap` scriptable object to
take those enumeration types as it's members. Let's take a look at those enums.


```cs

public enum InputAxis
{ 
    A0, A1, A2, A3, A4, A5, A6, A7, A8, A9, A10, A11, A12, A13, A14, A15, A16, A17, A18, A19, A20, A21, A22, A23, A24, A25, A26, A27, NONE
}

public enum InputButton
{
    B0, B1, B2, B3, B4, B5, B6, B7, B8, B9, B10, B11, B12, B13, B14, B15, B16, B17, B18, B19, NONE
}

```

It's not too complicated. There are 2 different enums and each one has a value for each of the possible axes or buttons respectively.

I also made a few convenience classes to help model the structure of a controller.

```cs

[System.Serializable]
public class AxisInversion {
    public bool Horizontal = false;
    public bool Vertical = false;
}

[System.Serializable]
public class ControlStick {
    public InputAxis Horizontal = InputAxis.NONE;
    public InputAxis Vertical = InputAxis.NONE;
    public InputButton Press = InputButton.NONE;
    public AxisInversion Inversion;
}

[System.Serializable]
public class DPadAxes {
    public InputAxis Horizontal = InputAxis.NONE; // 1 for right and -1 for left
    public InputAxis Vertical = InputAxis.NONE; // 1 for up and -1 for down
    public AxisInversion Inversion; // flip above assumptions
}

[System.Serializable]
public class DPadButtons {
    public InputButton Left = InputButton.NONE;
    public InputButton Down = InputButton.NONE;
    public InputButton Right = InputButton.NONE;
    public InputButton Up = InputButton.NONE;
}

```

These classes just wrap up the data that constitutes a single joy stick for a controller. As well as a DPad configured as either axes or 
buttons.

Finally we have the actual `InputMap` class.

```cs

[CreateAssetMenu(fileName = "InputMap", menuName = "ScriptableObjects/InputMap", order = 1)]
public class InputMap : ScriptableObject
{
    public InputType Type;
    public ControlStick LeftStick;
    public ControlStick RightStick;
    public DPadAxes DPadAxes;
    public DPadButtons DPadButtons;
    public InputAxis L2Analog = InputAxis.NONE;
    public InputAxis R2Analog = InputAxis.NONE;
    public InputButton L1 = InputButton.NONE;
    public InputButton R1 = InputButton.NONE;
    public InputButton L2 = InputButton.NONE;
    public InputButton R2 = InputButton.NONE;
    public InputButton ButtonLeft = InputButton.NONE;
    public InputButton ButtonBottom = InputButton.NONE;
    public InputButton ButtonRight = InputButton.NONE;
    public InputButton ButtonTop = InputButton.NONE;
    public InputButton Start = InputButton.NONE;
    public InputButton Select = InputButton.NONE;
    public InputButton Extra1 = InputButton.NONE;
    public InputButton Extra2 = InputButton.NONE;
    public InputButton Extra3 = InputButton.NONE;
    public InputButton Extra4 = InputButton.NONE;
    public InputButton Extra5 = InputButton.NONE;
    public InputButton Extra6 = InputButton.NONE;
    public InputButton Extra7 = InputButton.NONE;
    public InputButton Extra8 = InputButton.NONE;
    public InputButton Extra9 = InputButton.NONE;
    public InputButton Extra10 = InputButton.NONE;
    public InputButton Extra11 = InputButton.NONE;
}

```

As you can see it has all the buttons and joysticks you would expect a controller to have and then some. It also makes use of a
unity engine c# attribute `CreateAssetMenu` which will make a menu item for creating a new scriptable object asset of type `InputMap`.

![Create Asset Menu](/assets/img/InputController/CreateAssetMenu.png)

### InputTest.cs

Cool. So now that we have an `InputMap` Scriptable Object class we can configure a new `InputMap` asset for our controller.
The best way to figure out how a given controller maps to unity's input system is to just plug it in and
see which inputs it's triggering. Luckily we've already done all the work of wiring up every single possible input to a 
named and configured input setting so all we need is a little test script to check every single input setting and 
log which input is firing.

Let's see what that looks like.

```cs

[ExecuteInEditMode]
public class InputTest : MonoBehaviour
{
    public const int numAxes = 28;
    public const int numButtons = 21;
    public bool testAxes = true;
    public bool testButtons = true;
    public bool[] Axes = new bool[numAxes];
    public bool[] Buttons = new bool[numButtons];

    void Update()
    {
        var name = "J1";
        if (testAxes)
        {
            for (int i = 0; i < numAxes; ++i)
            {
                if (Axes[i])
                {
                    var axisName = $"{name}A{i}";
                    var axis = Input.GetAxis(axisName);
                    if (axis != 0)
                    {
                        Debug.Log($"A{i}: {axis}");
                    }
                }
            }
        }
        if (testButtons)
        {
            for (int i = 0; i < numButtons; ++i)
            {
                if (Buttons[i])
                {
                    var buttonName = $"{name}B{i}";
                    if (Input.GetButtonDown(buttonName))
                    {
                        Debug.Log(buttonName);
                    }
                }
            }
        }
    }
}

```

As you can see this script just checks every single input possible and outputs it's name (using the scheme we devised) when it's triggered.
Using this script it's easy to figure out the layout of any controller, all we have to do is attach the script to an empty game object in our scene,
plug in our controller and start pressing buttons. The names of the input should appear in the console window when the corresponding
button is pressed [^3].

In the picture below you can see that I've named the Game Object that our script `InputTest.cs` is attached to "controller" and if you look at the
inspector you can see the array of axis inputs as well as our booleans for testing buttons and axis
(not pictured but further down the inspector's scroll area is the array of button inputs, axis 4 and 5 are disabled because they are the
L2 and R2 analog inputs on the wireless Dual Shock 4 controller that I'm using.[^3]

![Input Test Example](/assets/img/InputController/InputTest.png)

### Configuring an InputMap asset

Now we can piece together our input mapping for our controller using the procedure we outlined above. These are the steps:

1. Use the Asset menu to create a new input map asset. ( Assets > Create > Scriptable Objects > Input Map)
2. Name your input map accordingly (I'm using a wireless Dual Shock 4 controller so I'm naming mine `DualShock4Wireless.asset`
I'm differentiating wired and wireless because I happen to know that the mapping will be different depending on the mode.
(I know it's stupid, that's why we're doing all this))
3. Click on the new asset to view it in the inspector.
4. Play your project and press buttons to observe which name they have.
5. Record those names accordingly in your InputMap asset.

Mine looks like this [^4]:

![Input Map Configuration Example](/assets/img/InputController/InputMapConfiguration.png)


### InputController.cs

Next we are gonna build out the system that will allow our behaviors to receive events from our input system
but writing functions like `OnLeftStick` or `OnButtonDown`. To do this we're going to be making use of the C# event/delegate system (pattern?).

This is were the real magic of our system is going to take place.

To kick things off let's take a gander at those 2 enums at the top of the file.

```cs

public enum ControllerNumber
{
	J1 = 1,
	J2 = 2
}

public enum Button
{
	DPadLeft,
	DPadDown,
	DPadRight,
	DPadUp,
	ButtonLeft, // X on Xbox, Square on PS4, Y on Switch, etc.
	ButtonBottom, // A on Xbox, X on PS4, B on Switch, etc.
	ButtonRight, // B on Xbox, Circle on PS4, A on Switch, etc.
	ButtonTop, // Y on Xbox, Triangle on PS4, X on Switch, etc.
	L1, // Left Bumper
	R1, // Right Bumper
	L2, // Left Trigger (digital, use OnLeftTrigger for analog)
	R2, // Right Trigger (digital, use OnRightTrigger for analog)
	L3, // Left stick
	R3, // Right stick
	Start, // What was classically start (Right center button)
	Select, //  What was classically select (Left center button)
			// All Extras are for home button or other system specific weirdness
	Extra1, Extra2, Extra3, Extra4, Extra5, Extra6, Extra7, Extra8, Extra9, Extra10
}

```

I think these are fairly self explanitory, but let's talk about it.

Fhe first enum `ControllerNumber` is just what is sounds like the number of a controller so if your on joystick 1 (`J1` in our naming scheme) then you're
`J1` in the enum. Technically you can have more than 2 joysticks on a system but I don't need more than 2 and I don't feel like copy pastaing all that 
configuration for 16 controllers or whatever it is.

Next is the `Button` enum, this will give us an identifier to use later to pass to our `ButtonDown` event delegate.
Since buttons don't have any analog input data (there's only 2 states for a button, pressed or not pressed) we only need to
attribute a name/id to a button, hence this enum.

```cs


public class InputController : MonoBehaviour
{
	public ControllerNumber Number;
    public InputMap InputMap;

	// Delegates
	public delegate void Stick(float horizontal, float vertical);
	public delegate void DPad(float horizontal, float vertical);
	public delegate void AnalogTrigger(float activation);
	public delegate void ButtonDown(Button button);

	// Events
	public event Stick OnLeftStick;
	public event Stick OnRightStick;
	public event AnalogTrigger OnLeftTrigger;
	public event AnalogTrigger OnRightTrigger;
	public event DPad OnDPad;
	public event ButtonDown OnButtonDown;

	// ...see below...

}

```

To start off we give each controller a number and an InputMap.
What comes next a very simple event listener pattern using builtin c# events and delegates.[^5]
What I have done is for each distinct event I feel a controller might have I've defined a delegate, which is
like the signature (function type) of a function.

I then define the event as being one of these delegates. So in the example I have defined a `Stick` delegate taking 2 floats and returning void,
which both the `OnLeftStick` and `OnRightStick` events use, this means any function with the same signature(type) as
the `Stick` delegate definition can listen to the events `OnLeftStick` or `OnRightStick`. What this means is **any** function that
takes 2 floats and returns void can listen on the `OnLeftStick` or `OnRightStick` event. This will make more sense hopefully
when we look at the InputListener behavior a little later on.

```cs

public class InputController : MonoBehaviour
{
	// ...see above...

	void Start()
	{
        if(InputMap == null) {
            Debug.LogError("You must set the InputMap attribute!");
        }
	}

	void Update()
	{
		var name = Number.ToString();

		var LeftStickH = (
			(InputMap.LeftStick.Inversion.Horizontal ? -1 : 1)
			*
			Input.GetAxis($"{name}{InputMap.LeftStick.Horizontal}")
		);
		var LeftStickV = (
			(InputMap.LeftStick.Inversion.Vertical ? -1 : 1)
			*
			Input.GetAxis($"{name}{InputMap.LeftStick.Vertical}")
		);
		if (LeftStickH != 0 || LeftStickV != 0)
		{
			OnLeftStick?.Invoke(LeftStickH, LeftStickV);
		}
		// ... repeated for right stick, and depad axis ...
		var L2Analog = Input.GetAxis($"{name}{InputMap.L2Analog}");
		if (L2Analog != 0) { OnLeftTrigger?.Invoke(L2Analog); }
		var R2Analog = Input.GetAxis($"{name}{InputMap.R2Analog}");
		if (R2Analog != 0) { OnRightTrigger?.Invoke(R2Analog); }

		if (Input.GetButtonDown($"{name}{InputMap.ButtonLeft}")) {
			OnButtonDown?.Invoke(Button.ButtonLeft);
		}
		if (Input.GetButtonDown($"{name}{InputMap.ButtonBottom}")) {
			OnButtonDown?.Invoke(Button.ButtonBottom);
		}
		if (Input.GetButtonDown($"{name}{InputMap.ButtonRight}")) {
			OnButtonDown?.Invoke(Button.ButtonRight);
		}
		// ... repeat for every single button ...
	}
}

```

Sorry about that split line multiplication but I'm trying to be kind to people with small screens (me on a 13" MBP).

So here you see we just go and check every input using our cool new scheme and invoke a corresponding event, any delegates listening
to that event will be called. Pretty sweet! But wait we still need our delegates in our behavior.



---

[^1]: While I was fact checking some stuff to write this post, I learned about a new unity package the ["Input System"](https://docs.unity3d.com/Packages/com.unity.inputsystem@1.0/manual/index.html) that is supposed to serve as a replacement for the "old" style `UnityEngine.Input` class... I did not know about this before I wrote all this code... (learning!)
[^2]: The Joysticks are numbered 1-16, this means you can have maximum 16 joysticks on one system. Similarly the the axes are numbered 0-27 (for whatever reason the UI for the input settings has them X-Axis, Y-Axis, 1, 2, ... 28. But if you look at the underlying serialization file (`InputManager.asset`) the axes are 0 indexed (they start at 0 and go to N-1).). Lastly unity has cryptically set the maximum number of joystick(controller) buttons to 20, starting 0 and accessed by setting the "Positive Button" setting to "joystick button %b" where again %b is the joystick number in zero indexed fashion.
[^3]: You will probably have 2 axes that output `-1` every single frame, this is almost certainly L2 and R2. Most controllers have their L2 and R2 configured on 2 inputs, one emitting an analog signal which varies by the amount the button is depressed, the other a digital signal that is active only when the button is completely depressed (bottomed out).
[^4]: I've mentioned this a couple of times now, but these configurations vary a lot. For example my Dual Shock 4 needs to be configured differently for wireless mode and wired mode, it also needs to be configured differently for different operating systems. I use a windows machine for most of my development purposes, but I often use my macbook for these write ups so I have to have different configurations for each OS and wireless and wired mode. It's crazy.
[^5]: I've never read **one** article or blog that I thought "Wow, what a succinct description of delegates and events in C#". So I'm not going to link anything like that unfortunately. However I find that when trying to understand something about C# the best place to start is on the microsoft developer docs.[here is the developer docs for delegates&events](https://docs.microsoft.com/en-us/dotnet/csharp/delegates-overview)
