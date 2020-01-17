using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public enum ControllerNumber
{
    J1 = 1,
    J2 = 2
}

public enum Button {
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
    Extra1, Extra2,  Extra3,  Extra4,  Extra5,  Extra6,  Extra7,  Extra8,  Extra9,  Extra10
}

[RequireComponent(typeof(InputConfiguration))]
public class InputController : MonoBehaviour
{
    public ControllerNumber Number;
    private InputConfiguration configuration;

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


    void Awake()
    {
        configuration = (configuration) ?? GetComponent<InputConfiguration>();
        Debug.Assert(configuration != null);
    }
   
    void Update()
    {
        var name = Number.ToString();
        var LeftStickH = (configuration.InputMap.LeftStick.Inversion.Horizontal? -1 : 1) * Input.GetAxis($"{name}{configuration.InputMap.LeftStick.Horizontal}");
        var LeftStickV = (configuration.InputMap.LeftStick.Inversion.Vertical ? -1 : 1) * Input.GetAxis($"{name}{configuration.InputMap.LeftStick.Vertical}");
        var RightStickH = (configuration.InputMap.RightStick.Inversion.Horizontal ? -1 : 1) * Input.GetAxis($"{name}{configuration.InputMap.RightStick.Horizontal}");
        var RightStickV = (configuration.InputMap.RightStick.Inversion.Vertical ? -1 : 1) * Input.GetAxis($"{name}{configuration.InputMap.RightStick.Vertical}");

        if (LeftStickH != 0 || LeftStickV != 0)
        {
            OnLeftStick?.Invoke(LeftStickH, LeftStickV);
        }
        if (RightStickH != 0 || RightStickV != 0)
        {
            OnRightStick?.Invoke(RightStickH, RightStickV);
        }
        var DPadH = (configuration.InputMap.DPadAxes.Inversion.Horizontal? -1 : 1) * Input.GetAxis($"{name}{configuration.InputMap.DPadAxes.Horizontal}");
        var DPadV = (configuration.InputMap.DPadAxes.Inversion.Vertical ? -1 : 1) * Input.GetAxis($"{name}{configuration.InputMap.DPadAxes.Vertical}");
        if(DPadH != 0 || DPadV != 0) {
            OnDPad?.Invoke(DPadH, DPadV);
        }
    }
}
