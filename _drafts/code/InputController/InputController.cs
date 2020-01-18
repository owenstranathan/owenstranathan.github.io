using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public enum ControllerNumber
{
    J1 = 1,
    J2 = 2
}

public enum Button
{
    ButtonLeft,     // X on Xbox, Square on PlayStation, Y on Nintendo, etc.
    ButtonBottom,   // A on Xbox, X on PlayStation, B on Nintendo, etc.
    ButtonRight,    // B on Xbox, Circle on PlayStation, A on Switch, etc.
    ButtonTop,      // Y on Xbox, Triangle on PlayStation, X on Nintendo, etc.
    L1,             // Left Bumper
    R1,             // Right Bumper
    L2,             // Left Trigger (digital, use OnLeftTrigger for analog)
    R2,             // Right Trigger (digital, use OnRightTrigger for analog)
    L3,             // Left stick press
    R3,             // Right stick press
    Start,          // What was classically start (Right center button, varies)
    Select,         // What was classically select (Left center button, varies)
    // All Extras are for home button or other system specific weirdness
    // (i.e. home buttons, screen capture buttons, whatever the big touch sensitive button on Sony Dual Shock 4 is)
    Extra1, Extra2, Extra3, Extra4, Extra5, Extra6, Extra7, Extra8, Extra9, Extra10
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
        var LeftStickInversion = configuration.InputMap.LeftStick.Inversion;
        var RightStickInversion = configuration.InputMap.RightStick.Inversion;
        var LeftStickH = (LeftStickInversion.Horizontal ? -1 : 1) * Input.GetAxis($"{name}{configuration.InputMap.LeftStick.Horizontal}");
        var LeftStickV = (LeftStickInversion.Vertical ? -1 : 1) * Input.GetAxis($"{name}{configuration.InputMap.LeftStick.Vertical}");
        var RightStickH = (RightStickInversion.Horizontal ? -1 : 1) * Input.GetAxis($"{name}{configuration.InputMap.RightStick.Horizontal}");
        var RightStickV = (RightStickInversion.Vertical ? -1 : 1) * Input.GetAxis($"{name}{configuration.InputMap.RightStick.Vertical}");
        var DPadInversion = configuration.InputMap.DPadAxes.Inversion;
        var DPadH = (DPadAxesInversion.Horizontal ? -1 : 1) * Input.GetAxis($"{name}{configuration.InputMap.DPadAxes.Horizontal}");
        var DPadV = (DPadAxesInversion.Vertical ? -1 : 1) * Input.GetAxis($"{name}{configuration.InputMap.DPadAxes.Vertical}");
        if (LeftStickH != 0 || LeftStickV != 0)
        {
            OnLeftStick?.Invoke(LeftStickH, LeftStickV);
        }
        if (RightStickH != 0 || RightStickV != 0)
        {
            OnRightStick?.Invoke(RightStickH, RightStickV);
        }
        if (DPadH != 0 || DPadV != 0)
        {
            OnDPad?.Invoke(DPadH, DPadV);
        }
    }
}
