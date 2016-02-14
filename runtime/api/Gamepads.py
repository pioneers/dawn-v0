# ------
# Gamepad.py class.
# Copyright 2015. Pioneers in Engineering
# ------
'''
This module contains functions for getting gamepad data.

To use this module, you must first import it:

>>> from api import Gamepads
'''
#import memcache

# Connect to memcache
memcache_port = 12357
#mc = memcache.Client(['127.0.0.1:%d' % memcache_port])

def get_all():
    """Returns a list a list of values for every gamepad connected.

    :returns: A list of axes and button data for each connected gamepad

    :Examples:

    >>> gpads = Gamepads.get_all()
    >>> gamepad0 = gpads[0]
    """
    return mc.get('gamepad')

def get_joysticks(index):
    """Returns a list of axes values corresponding to the specified gamepad.

    Each returned value is between -1 and 1, which represents where the joystick
    is along that axis. For example, if axes[0] is -1, then the left joystick
    has been pushed all the way to the left. In order to get a better sense of
    the joystick mappings, click the 'Details' button next to a gamepad in Dawn
    or refer to https://w3c.github.io/gamepad/#remapping.

    On a standard gamepad:
    - axes[0] represents the horizontal axis of the left joystick.
    - axes[1] represents the vertical axis of the left joystick
    - axes[2] represents the horizontal axis of the right joystick
    - axes[3] represent the vertical axis of the right joystick

    :param index: The index of the gamepad, usually 0, 1, 2, or 3
    :returns: A list of 4 decimal values, each corresponding to a joystick axis.

    :Examples:

    >>> axes = Gamepads.get_joysticks(0)
    """
    gamepad_index = mc.get("gamepad")[index]
    assert gamepad_index != None, "gamepad index not found"
    return gamepad_index['axes']

def get_axis(index,axis):
    """Returns the position of a specified joystick.

    Each returned value is between -1 and 1, which represents where the joystick
    is along that axis. In order to get a better sense of
    the joystick mappings, click the 'Details' button next to a gamepad in Dawn
    or refer to https://w3c.github.io/gamepad/#remapping.

    On a standard gamepad:
    - axes[0] represents the horizontal axis of the left joystick
    - axes[1] represents the vertical axis of the left joystick
    - axes[2] represents the horizontal axis of the right joystick
    - axes[3] represent the vertical axis of the right joystick

    :param index: The index of the gamepad, usually 0, 1, 2, or 3
    :param axis: An integer (0,1,2,3) which specifies the axis.
    :returns: A list of 4 decimal values, each corresponding to a joystick axis.
    """
    return get_joysticks(index)[axis]

def get_left_x(index):
    """Returns the position of the left joystick on the x axis.

    The value is between -1 and 1, which represents where the left joystick is along
    the x axis. -1 means the left joystick is pushed all the way to the left.

    :param index: The index of the gamepad, usually 0, 1, 2, or 3
    :returns: A double between -1 and 1, negative is pushed to the left.

    :Examples:

    >>> left_x = Gamepads.get_left_x(0)

    """
    return get_joysticks(index)[0]

def get_left_y(index):
    """Returns the position of the left joystick on the y axis.

    The value is between -1 and 1, which represents where the left joystick is along
    the y axis. -1 means the left joystick is pushed all the way forward.

    :param index: The index of the gamepad, usually 0, 1, 2, or 3
    :returns: A double between -1 and 1, negative is pushed forward.

    :Examples:

    >>> left_y = Gamepads.get_left_y(0)

    """
    return get_joysticks(index)[1]

def get_right_x(index):
    """Returns the position of the right joystick on the x axis.

    The value is between -1 and 1, which represents where the right joystick is along
    the x axis. -1 means the right joystick is pushed all the way to the left.

    :param index: The index of the gamepad, usually 0, 1, 2, or 3
    :returns: A double between -1 and 1, negative is pushed to the left.

    :Examples:

    >>> right_x = Gamepads.get_right_x(0)

    """
    return get_joysticks(index)[2]

def get_right_y(index):
    """Returns the position of the right joystick on the y axis.

    The value is between -1 and 1, which represents where the right joystick is along
    the x axis. -1 means the right joystick is pushed all the way forward.

    :param index: The index of the gamepad, usually 0, 1, 2, or 3
    :returns: A decimal between -1 and 1, negative is pushed to the forward

    :Examples:

    >>> right_y = Gamepads.get_right_y(0)

    """
    return get_joysticks(index)[3]

def get_all_buttons(index):
    """Returns a list of button values corresponding to the specified gamepad.

    Each button value is either False (not pressed) or True (pressed). Unlike
    joysticks, there are no in-between values--it can only be False or True. To
    see the exact mapping, click on the 'Details' button next to a gamepad in
    Dawn, or refer to https://w3c.github.io/gamepad/#remapping.

    :param index: The index of the gamepad, usually 0, 1, 2, or 3
    :returns: A list of booleans, each corresponding to a button being pressed or not pressed

    :Examples:

    >>> all_buttons = Gamepads.get_all_buttons(0)
    >>> all_buttons[1]
    True
    >>> all_buttons
    [False, True, False, False, False, True, False, False, True, False, False, False]

    """
    gamepad_index = mc.get("gamepad")[index]
    assert gamepad_index != None, "gamepad index not found"
    return [x == 1 for x in gamepad_index['buttons']]

def get_button(index,button):
    """Returns whether a button is pressed or not.

    For a specific button (each button has has a number) the output is either 
    True (pressed) or False (not pressed). To see the exact mapping, click on 
    the 'Details' button next to a gamepad in Dawn, or refer to 
    https://w3c.github.io/gamepad/#remapping.

    :param index: The index of the gamepad, usually 0, 1, 2, or 3
    :param button: Enum of button, see api documentation for more details
    :returns: A boolean either True (pressed) or False (not pressed) 

    :Examples:

    >>> button = Gamepads.get_button(0,6)
    >>> button
    False

    """

    return get_all_buttons(index)[button] == 1;

def get_is_connected(index):
    """Returns whether or not the specified gamepad is connected.

    :param index: The index of the gamepad, usually 0, 1, 2, or 3
    :returns: A boolean value for whether or not that gamepad is connected
    """
    gamepad_index = mc.get("gamepad")[index]
    assert gamepad_index != None, "gamepad index not found"
    return gamepad_index['connected']


# If the user knows the layout of the device and it corresponds to the Standard Gamepad
# Layout, then the mapping should be set to standard. Otherwise set mapping property to empty string
def get_mapping(index):
    """Returns the mapping of the specified gamepad. Usually this value will be 'standard.'
    """
    gamepad_index = mc.get("gamepad")[index]
    assert gamepad_index != None, "gamepad index not found"
    return gamepad_index['mapping']

#class for enums for buttons.
class button:
    x = 2
    y = 3
    a = 0
    b = 1
    start = 9
    back = 8
    R_trigger = 7
    L_trigger = 6
    L_bumper = 4
    R_bumper = 5
    R_stick = 11
    L_stick = 10
    xbox = 16
    dpad_down = 13
    dpad_up = 12
    dpad_right = 15
    dpad_left = 14
