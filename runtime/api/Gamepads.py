# ------
# Gamepad.py class.
# Copyright 2015. Pioneers in Engineering
# ------
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
    return mc.get('gamepad')[index]['axes']

def get_left_x(index):
    """Returns the position of the left joystick on the x axis.

    The value is between -1 and 1, which represents where the left joystick is along
    the x axis. -1 means the left joystick is pushed all the way to the left.

    :param index: The index of the gamepad, usually 0, 1, 2, or 3
    :returns: A double between -1 and 1, negative is pushed to the left.
    """
    return get_joysticks(index)[0]

def get_left_y(index):
    """Returns the position of the left joystick on the y axis.

    The value is between -1 and 1, which represents where the left joystick is along
    the y axis. -1 means the left joystick is pushed all the way forward.

    :param index: The index of the gamepad, usually 0, 1, 2, or 3
    :returns: A double between -1 and 1, negative is pushed forward.
    """
    return get_joysticks(index)[1]

def get_right_x(index):
    """Returns the position of the right joystick on the x axis.

    The value is between -1 and 1, which represents where the right joystick is along
    the x axis. -1 means the right joystick is pushed all the way to the left.

    :param index: The index of the gamepad, usually 0, 1, 2, or 3
    :returns: A double between -1 and 1, negative is pushed to the left.
    """
    return get_joysticks(index)[2]

def get_right_y(index):
    """Returns the position of the right joystick on the y axis.

    The value is between -1 and 1, which represents where the right joystick is along
    the x axis. -1 means the right joystick is pushed all the way forward.

    :param index: The index of the gamepad, usually 0, 1, 2, or 3
    :returns: A decimal between -1 and 1, negative is pushed to the forward
    """
    return get_joysticks(index)[3]

def get_all_buttons(index):
    """Returns a list of button values corresponding to the specified gamepad.

    Each button value is either a 0 (not pressed) or a 1 (pressed). Unlike
    joysticks, there are no in-between values--it can only be a 0 or a 1. To
    see the exact mapping, click on the 'Details' button next to a gamepad in
    Dawn, or refer to https://w3c.github.io/gamepad/#remapping.

    :param index: The index of the gamepad, usually 0, 1, 2, or 3
    :returns: A list of 0's and 1's, each corresponding to a button
    """
    return mc.get('gamepad')[index]['buttons']

def get_button(index,button):
    """Returns whether a button is pressed or not.

    For a specific button (each button has has a number) the output is either 
    True (pressed) or False (not pressed). To see the exact mapping, click on 
    the 'Details' button next to a gamepad in Dawn, or refer to 
    https://w3c.github.io/gamepad/#remapping.

    :param index: The index of the gamepad, usually 0, 1, 2, or 3
    :param button: The number of the button. See above for mappings.
    :returns: A boolean either True (pressed) or False (not pressed) 
    """
    return get_all_buttons(index)[button] == 1;

def get_is_connected(index):
    """Returns whether or not the specified gamepad is connected.

    :param index: The index of the gamepad, usually 0, 1, 2, or 3
    :returns: A boolean value for whether or not that gamepad is connected
    """
    return mc.get('gamepad')[index]['connected']


# If the user knows the layout of the device and it corresponds to the Standard Gamepad
# Layout, then the mapping should be set to standard. Otherwise set mapping property to empty string
def get_mapping(index):
    """Returns the mapping of the specified gamepad. Usually this value will be 'standard.'
    """
    return mc.get('gamepad')[index]['mapping']

