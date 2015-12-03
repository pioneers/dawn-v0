# ------
# Robot.py class
# This runs the robot.
# Copyright 2015. Pioneers in Engineering.
# ------
<<<<<<< HEAD
from grizzly import *
#import hibike.hibike as sensors

#import Motors
=======
import memcache
>>>>>>> 66ed4583d69c63f850071aac0f67b2f933e1de20

memcache_port = 12357
mc = memcache.Client(['127.0.0.1:%d' % memcache_port]) # connect to memcache

motor = {}
<<<<<<< HEAD
name_to_grizzly = {}
runtime_ansible = None
connectedDevices = []

def init():
    addrs = Grizzly.get_all_ids()
    addrs = Grizzly.get_all_ids()
    runtime_ansible = Ansible('runtime')

    #h = hibike.Hibike()
    #connectedDevices = h.getEnumeratedDevices() #get list of devices
    #h.subscribeToDevices(connectedDevices) #subscribe to devices

    # Brute force to find all
    for index in range(len(addrs)):
        # default name for motors is motor0, motor1, motor2, etc
        grizzly_motor = Grizzly(addrs[index])
        grizzly_motor.set_mode(ControlMode.NO_PID, DriveMode.DRIVE_COAST)
        grizzly_motor.limit_acceleration(142)
        grizzly_motor.limit_current(10)
        grizzly_motor.set_target(0)

        name_to_grizzly['motor' + str(index)] = grizzly_motor
        #motor['motor' + str(index)] = grizzly_motor.get_target()

    print(name_to_grizzly, addrs)
=======
>>>>>>> 66ed4583d69c63f850071aac0f67b2f933e1de20

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
<<<<<<< HEAD
    print(name_to_grizzly)
    grizzly = name_to_grizzly[name]
    grizzly.set_target(value)
    #motor[name] = value
=======
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
>>>>>>> 66ed4583d69c63f850071aac0f67b2f933e1de20

# TODO: implement


def update():
	command = runtime_ansible.recv()
	if command:
		msg_type, content = command['header']['msg_type'], command['content']
		if msg_type == "sensor_value":
+            connectedDevices = command

def get_sensor(name):
<<<<<<< HEAD
	for t in connectedDevices: # search list for name? on our own or using hibike getData???
        if t[0] == name:
            return t[1]
    return 'Error'#searched list
=======
    """Returns the value, or reading corresponding to the specified sensor.
    """
    all_data = mc.get('sensor_values')
    if name in all_data:
        return all_data[name]
    return 'Error, sensor with that name not found'
>>>>>>> 66ed4583d69c63f850071aac0f67b2f933e1de20

def get_all_motors():
    """Returns the current power values for every connected motor.
    """
    return mc.get('motor_values')
