# ------
# Robot.py class 
# This runs the robot.
# Copyright 2015. Pioneers in Engineering.
# ------
import memcache

memcache_port = 12357
mc = memcache.Client(['127.0.0.1:%d' % memcache_port]) # connect to memcache

motor = {}

def _lookup(name): #Returns actual UID given name
    return name

def get_motor(name):
    """Returns the current power value for a motor.

    :param name: A string that identifies the motor
    :returns: A value between -100 and 100, which is the power level of that motor.
    """
    name_to_value = mc.get('motor_values')
    assert type(name) is str, "Type Mismatch: Must pass in a string"
    try:
        return name_to_value[name]
    except KeyError:
        raise KeyError("Motor name not found.")

def set_motor(name, value):
    """Sets a motor to the specified power value.

    :param name: A string that identifies the motor.
    :param value: A decimal value between -100 and 100, the power level you want to set.
    """
    assert type(name) is str, "Type Mismatch: Must pass in a string to name."
    assert type(value) is int or type(name) is float, "Type Mismatch: Must pass in an integer or float to value."
    assert value <= 100 and value >= -100, "Motor value must be a decimal between -100 and 100 inclusive."
    name_to_value = mc.get('motor_values')
    try:
        name_to_value[name] = value
        mc.set('motor_values', name_to_value)
    except KeyError:
        raise KeyError("No motor with that name")

# TODO: implement
def get_sensor(name): #name is raw UID, with count added in front
    """Returns the value, or reading corresponding to the specified sensor.
    """
    name = _lookup(name)
    all_data = mc.get('sensor_values')
    try:
        return all_data[UUID]
    except KeyError:
        raise KeyError("No Sensor with that name")


def get_all_motors():
    """Returns the current power values for every connected motor.
    """
    return mc.get('motor_values')

def set_flag(name,light1,light2,light3,light4):  #TODO UID convert to int
    """Sets the brightness of every LED on the team flag.

    Each LED has four levels, represented by integers. Each light is set to 0 (off), 
    1 (low), 2 (medium), or 3 (high)

    :param name: A string that identifies the team flag. 
    :param light1: An integer (0,1,2,3) which sets brightness for LED 1
    :param light2: An integer (0,1,2,3) which sets brightness for LED 2
    :param light3: An integer (0,1,2,3) which sets brightness for LED 3
    :param light4: An integer (0,1,2,3) which sets brightness for LED 4
    """
    correct_range = range(4)
    assert light1 in correct_range, "Error: input for light1 must be an integer between 0 and 3 inclusive"
    assert light2 in correct_range, "Error: input for light2 must be an integer between 0 and 3 inclusive"
    assert light3 in correct_range, "Error: input for light3 must be an integer between 0 and 3 inclusive"
    assert light4 in correct_range, "Error: input for light4 must be an integer between 0 and 3 inclusive"
    name = _lookup(name)
    flag_data = list(name) + list(light1) + list(light2) + list(light3) + list(light4)
    mc.set('flag_values',flag_data)

def set_LED(name,light,value): #TODO UID convert to int
    """Sets the brightness of a specific LED on the team flag.

    Each LED has four levels, represented by integers. Each light is set to 0 (off),
    1 (low), 2 (medium), or 3 (high). Each light has a specific index associated with it, 
    an integer 1, 2, 3, 4.

    :param name: A string that identifies the team flag.
    :param light: An integer (1,2,3,4) which identifies which LED top set.
    :param value: An integer (0,1,2,3) which sets brightness for the specified LED
    """
    name = _lookup(name)
    assert light in range(1,5), "Error: light number must be an Integer between 1 and 4 inclusive"
    assert value in range(4),"Error: value must be an integer between 0 and 3 inclusive"
    flag_data = list(name) + [-1,-1,-1,-1]
    flag_data[light] = value
    mc.set('flag_values',flag_data)

def set_all_servos(name,servo0,servo1,servo2,servo3): #TODO How does the servos specifically work
    """Sets a degree for each servo to turn.

    Each servo (0,1,2,3) is set to turn an interger amount of degrees (0-180)

    :param name: A string that identifies the servos.
    :param servo0: An integer between 0 and 180 which sets the amount to (turn in degrees) for servo 0
    :param servo1: An integer between 0 and 180 which sets the amount to (turn in degrees) for servo 1
    :param servo2: An integer between 0 and 180 which sets the amount to (turn in degrees) for servo 2
    :param servo3: An integer between 0 and 180 which sets the amount to (turn in degrees) for servo 3
    """
    name = _lookup(name)
    correct_range = range(181)
    assert servo0 in correct_range, "servo0 must be between 0 and 180 inclusive"
    assert servo1 in correct_range, "servo1 must be between 0 and 180 inclusive"
    assert servo2 in correct_range, "servo2 must be between 0 and 180 inclusive"
    assert servo3 in correct_range, "servo3 must be between 0 and 180 inclusive"
    servo_data = list(name) + list(servo0) + list(servo1) + list(servo2) + list(servo3)
    mc.set('servo_values',servo_data)

def set_servo(name,servo,value):
    """Sets a degree for a specific servo to turn.

    One servo as specified by its number (0,1,2,3) is set to turn an integer amount of degrees (0-180)

    :param name: A string that identifies the servo
    :param servo: A integer (0,1,2,3) which identifies which servo to turn
    :param value: An integer between 0 and 180 which sets the amount to turn (in degrees)
    """
    name = _lookup(name)
    servo_data = list(name) + [-1,-1,-1,-1]
    servo_data[servo + 1] = value
    mc.set('servo_values',servo_data)

#TODO Figure out how data is from battery buzzer
def get_battery():
    """Returns the battery level of the battery.

    This returns the total level (in volts) of the battery. This value ranges from 0-12 volts
    :returns: A double between 0-12 represneting the current voltage level of the battery
    """

def battery_safe():
    """Returns a boolean indicating whether the battery is safe or not.

    Returns either True (battery is safe) or False (battery is not safe) based on 
    the battery level.
    """

def get_color_sensor(name,color):
    """Returns the value from the color sensor for a specific color.

    Each color sensor senses red, green, and blue, returning a 
    number between 0 and 1, where 1 indicates a higher intensity. This function returns
    the result from one specific color sensor.

    :param name: A string that identifies the color sensor
    :param color: A integer that identifies which specific color sensor to return
                  where 0 specifies the red sensor, 1 specifies the green sensor, 
                  and 2 specifies the blue sensor
    :returns: A double between 0 and 1, where 1 indicates a higher intensity
    """
    all_data = mc.get('sensor_values')
    name = _lookup(name)
    if name in all_data:
        return all_data[name][color]
    return 'Sensor not found.'

def get_luminosity(name):
    """Returns the luminosity for the specified color sensor.

    The color sensor returns the luminosity detected by the color sensor, represnted by
    a decimal between 0 and 1, where 1 indicates higher intensity.

    :param name: A string that identifies the color sensor
    :returns: A double between 0 and 1, where 1 indicates a higher intensity
    """
    all_data = mc.get('sensor_values')
    name = _lookup(name)
    if name in all_data:
        return all_data[name][3]
    return 'Sensor not found.'

def get_hue(name):
    """Returns the hue detected at the specified color sensor.

    This uses the red, green, and blue sensors on the color sensor to return the 
    detected hue, which is represented as a double between 0 and 360. See 
    https://en.wikipedia.org/wiki/Hue for more information on hue.

    :param name: A string that identifies the color sensor
    :returns: A double between 0 and 360 representing the detected hue
    """
    all_data = mc.get('sensor_values')
    name = _lookup(name)
    if name in all_data:
        r = all_data[name][0]
        g = all_data[name][1]
        b = all_data[name][2]
        denom = max(r,g,b) - min(r,g,b)
        if r > g and r > b:
            return (g - b)/denom
        elif g > r and g > b:
            return 2.0 + (b - r)/denom
        else:
            return 4.0 + (r - g)/denom
    return 'Sensor not found.'



class SensorValueOutOfBounds(Exception):
    pass