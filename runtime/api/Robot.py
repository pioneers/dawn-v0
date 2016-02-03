# ------
# Robot.py class 
# This runs the robot.
# Copyright 2015. Pioneers in Engineering.
# ------
import memcache

memcache_port = 12357
mc = memcache.Client(['127.0.0.1:%d' % memcache_port]) # connect to memcache

motor = {}

def get_motor(name):
    """Returns the current power value for a motor.

    :param name: A string that identifies the motor
    :returns: A value between -100 and 100, which is the power level of that motor.
    """
    name_to_value = mc.get('motor_values')
    if name in name_to_value:
        return name_to_value[name]
    return 'Error, motor with that name not found'

def set_motor(name, value):
    """Sets a motor to the specified power value.

    :param name: A string that identifies the motor
    :param value: A decimal value between -100 and 100, the power level you want to set
    """
    name_to_value = mc.get('motor_values')
    if name in name_to_value:
        name_to_value[name] = value
        mc.set('motor_values', name_to_value)
    else:
        print("No motor with that name")

# TODO: implement
def get_sensor(name): #name is raw UID, with count added in front
    """Returns the value, or reading corresponding to the specified sensor.
    """
    all_data = mc.get('sensor_values')
    if name in all_data:
        return all_data[name]
    return 'Sensor not found.'

def get_all_motors():
    """Returns the current power values for every connected motor.
    """
    return mc.get('motor_values')

def set_flag(flag,light1,light2,light3,light4):  #TODO UID convert to int
    """Sets the brightness of every LED on the team flag.

    Each LED has four levels, represented by integers. Each light is set to 0 (off), 
    1 (low), 2 (medium), or 3 (high)

    :param flag: A string that identifies the team flag. 
    :param light1: An integer (0,1,2,3) which sets brightness for LED 1
    :param light2: An integer (0,1,2,3) which sets brightness for LED 2
    :param light3: An integer (0,1,2,3) which sets brightness for LED 3
    :param light4: An integer (0,1,2,3) which sets brightness for LED 4
    """
    flag_data = list(flag) + list(light1) + list(light2) + list(light3) + list(light4)
    mc.set('flag_values',flag_data)

def set_LED(flag,light,value): #TODO UID convert to int
    """Sets the brightness of a specific LED on the team flag.

    Each LED has four levels, represented by integers. Each light is set to 0 (off),
    1 (low), 2 (medium), or 3 (high). Each light has a specific index associated with it, 
    an integer 1, 2, 3, 4.

    :param flag: A string that identifies the team flag.
    :param light: An integer (1,2,3,4) which identifies which LED top set.
    :param value: An integer (0,1,2,3) which sets brightness for the specified LED
    """
    flag_data = list(flag) + list(-1) + list(-1) + list(-1) + list(-1)
    flag_data[light] = value
    mc.set('flag_values',flag_data)

