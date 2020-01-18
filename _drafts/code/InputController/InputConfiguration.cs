using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using UnityEngine;


[RequireComponent(typeof(InputController))]
[ExecuteInEditMode]
public class InputConfiguration : MonoBehaviour
{
    public string Name;
    public InputType Type;
    public InputMap InputMap
    {
        get {
            Debug.Assert(AvailableInputMaps.Length > 0);
            return AvailableInputMaps[(int)Type];
        }
    }

    private InputController inputController;
    public InputMap[] AvailableInputMaps;

    void Awake()
    {
        inputController = (inputController) ?? GetComponent<InputController>();
        Debug.Assert(inputController != null);
        updateName();
        AvailableInputMaps = new List<InputMap>(Resources.FindObjectsOfTypeAll<InputMap>()).OrderBy(x => x.Type).ToArray();
        if (AvailableInputMaps.Length == 0)
        {
            Debug.LogError(
                "There are no input maps in the project.\n" +
                "Use Assets > Create > ScriptableObjects > InputMap to create a mapping for your input");
        }
    }

    void Update()
    {
        updateName();
    }

    private void updateName()
    {
        var joyStickNames = Input.GetJoystickNames();
        var cnum = (int)inputController.Number;
        if (cnum <= joyStickNames.Length)
        {
            Name = joyStickNames[cnum - 1];
        }
    }
}
