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

    :param name: A string that identifies the motor.
    :param value: A decimal value between -100 and 100, the power level you want to set.
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
        return all_data[UUID]
    return 'Error, sensor with that name not found'


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
    servo_data = list(name) + list(servo0) + list(servo1) + list(servo2) + list(servo3)
    mc.set('servo_values',servo_data)

def set_servo(name,servo,value):
    """Sets a degree for a specific servo to turn.

    One servo as specified by its number (0,1,2,3) is set to turn an integer amount of degrees (0-180)

    :param name: A string that identifies the servo
    :param servo: A integer (0,1,2,3) which identifies which servo to turn
    :param value: An integer between 0 and 180 which sets the amount to turn (in degrees)
    """
    servo_data = list(name) + [-1,-1,-1,-1]
    servo_data[servo + 1] = value
    mc.set('servo_values',servo_data)

