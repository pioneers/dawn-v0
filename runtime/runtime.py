<<<<<<< HEAD
import subprocess, signal, sys
from ansible import Ansible
import threading
import time

from grizzly import *
#from api import Robot
#from api import Gamepads
import hibike
import deviceContext
import time

dawn_ansible = Ansible('dawn')
runtime_ansible = Ansible('runtime')

#Robot.init()

#def get_peripherals():
#    while True:
#        peripherals = {}
#        peripherals['rightLineSensor'] = sensors.getRightLineSensorReading()
#        peripherals['leftLineSensor'] = sensors.getLeftLineSensorReading()
#        peripheral_readings = ansible.AMessage(
#                'peripherals', peripherals)
#        ansible.send(peripheral_readings)
#        time.sleep(0.05)

#peripheral_thread = threading.Thread(target=get_peripherals)
#peripheral_thread.daemon = True
#peripheral_thread.start()

running_code = False

pobs = set() # set of all active processes
pobslock = threading.Lock()  # Ensures that only one processs modifies pobs at a time

def numpobs():
    with pobslock:
        return len(pobs)

#signal handlers
def sigterm_handler(signal, fram):
    with pobslock:
        for p in pobs: p,kill()

def sigint_handler(signal, fram):
    sys.exit(0)

signal.signal(signal.SIGINT, sigint_handler)
signal.signal(signal.SIGTERM, sigterm_handler)


#function to watch processes
def p_watch(p):
    with pobslock:
        pobs.remove(p)

student_ansible = Ansible('student_code')
dawn_ansible = Ansible('dawn')
runtime_ansible = Ansible('runtime')
context = deviceContext.DeviceContext()
h = hibike.Hibike(context)
connectedDevices = h.getEnumeratedDevices()
h.subToDevices(connectedDevices)

while True:
    command = dawn_ansible.recv()
    if command:
        print("Message received from ansible! " + command['header']['msg_type'])
        msg_type, content = command['header']['msg_type'], command['content']
        if msg_type == 'execute':
	        print("Ansible said to start the code")
            if not running_code:
                p = subprocess.Popen(['python', 'student_code/student_code.py'])
                with pobslock:
                    pobs.add(p)
                #makes a deamon thread to supervise the process
                #t = threading.Thread(target=p_watch, args=(p,))
                #t.daemon = True
                #t.start()
                running_code = True
        elif msg_type == 'stop':
	        print("Ansible said to stop the code")
            if running_code:
                with pobslock:
                    print("killed")
                    for p in pobs:
                        p.terminate() #ideal way to shut down
                        #p.kill()
                    pobs.clear()
                    #for p in pobs: p.kill() #brut force stuck processes
                #kill all motor values
                for addr in Grizzly.get_all_ids():
                    Grizzly(addr).set_target(0)
                running_code = False
        elif msg_type == 'gamepad':
            runtime_ansible.send(command)
        runtime_ansible.sendMessage("sensor_value",connectedDevices)
=======
import subprocess, multiprocessing, time
import memcache, ansible, hibike
from grizzly import *
import usb
import os

# Useful motor mappings
name_to_grizzly, name_to_values, name_to_ids = {}, {}, {}
student_proc, console_proc = None, None
robot_status = 0 # a boolean for whether or not the robot is executing code

if 'HIBIKE_SIMULATOR' in os.environ and os.environ['HIBIKE_SIMULATOR'] in ['1', 'True', 'true']:
    import hibike_simulator
    h = hibike_simulator.Hibike()
else:
    h = hibike.Hibike()
connectedDevices = h.getEnumeratedDevices()
# TODO: delay should not always be 20
connectedDevices = [(device, 20) for (device, device_type) in connectedDevices]
h.subToDevices(connectedDevices)

# connect to memcache
memcache_port = 12357
mc = memcache.Client(['127.0.0.1:%d' % memcache_port])

def get_all_data(connectedDevices):
    all_data = {}
    for t in connectedDevices:
        all_data[t[0]] = h.getData(t[0],"dataUpdate")
    return all_data

# Called on start of student code, finds and configures all the connected motors
def initialize_motors():
    try:
        addrs = Grizzly.get_all_ids()
    except usb.USBError:
        print("WARNING: no Grizzly Bear devices found")
        addrs = []

    # Brute force to find all
    for index in range(len(addrs)):
        # default name for motors is motor0, motor1, motor2, etc
        grizzly_motor = Grizzly(addrs[index])
        grizzly_motor.set_mode(ControlMode.NO_PID, DriveMode.DRIVE_COAST)
        grizzly_motor.limit_acceleration(142)
        grizzly_motor.limit_current(10)
        grizzly_motor.set_target(0)

        name_to_grizzly['motor' + str(index)] = grizzly_motor
        name_to_values['motor' + str(index)] = 0
        name_to_ids['motor' + str(index)] = addrs[index]

    mc.set('motor_values', name_to_values)

# Called on end of student code, sets all motor values to zero
def stop_motors():
    for name, grizzly in name_to_grizzly.iteritems():
        grizzly.set_target(0)
        name_to_values[name] = 0

    mc.set('motor_values', name_to_values)

# A process for sending the output of student code to the UI
def log_output(stream):
    for line in stream:
        ansible.send_message('UPDATE_CONSOLE', {
            'console_output': {
                'value': line
            }
        })
        time.sleep(0.5) # need delay to prevent flooding ansible

def msg_handling(msg):
    global robot_status, student_proc, console_proc
    msg_type, content = msg['header']['msg_type'], msg['content']
    if msg_type == 'execute' and not robot_status:
        student_proc = subprocess.Popen(['python', '-u', 'student_code/student_code.py'],
                stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
        # turns student process stdout into a stream for sending to frontend
        lines_iter = iter(student_proc.stdout.readline, b'')
        # start process for watching for student code output
        console_proc = multiprocessing.Process(target=log_output, args=(lines_iter,))
        console_proc.start()
        initialize_motors()
        robot_status= 1
    elif msg_type == 'stop' and robot_status:
        student_proc.terminate()
        console_proc.terminate()
        stop_motors()
        robot_status = 0
    elif msg_type == 'gamepad':
        mc.set('gamepad', content)

sensor_data_last_sent = 0
def send_sensor_data(data):
    global sensor_data_last_sent
    # HACK to avoid spamming UI. Should really send only when sensors update
    if time.time() < sensor_data_last_sent + 1:
        return
    sensor_data_last_sent = time.time()

    for device_id, value in all_sensor_data.items():
        ansible.send_message('UPDATE_PERIPHERAL', {
            'peripheral': {
                'name': 'sensor_{}'.format(device_id),
                'peripheralType':'SENSOR_SCALAR',
                'value': value,
                'id': device_id
                }
            })



while True:
    msg = ansible.recv()
    # Handle any incoming commands from the UI
    if msg:
        msg_handling(msg)

    # Send whether or not robot is executing code
    ansible.send_message('UPDATE_STATUS', {
        'status': {'value': robot_status}
    })

    # Send battery level
    ansible.send_message('UPDATE_BATTERY', {
        'battery': {
            'value': 100 # TODO: Make this not a lie
        }
    })

    # Update sensor values, and send to UI
    all_sensor_data = get_all_data(connectedDevices)
    send_sensor_data(all_sensor_data)
    mc.set('sensor_values', all_sensor_data)

    # Send motor values to UI, if the robot is running
    if robot_status:
        name_to_value = mc.get('motor_values') or {}
        for name in name_to_value:
            grizzly = name_to_grizzly[name]
            grizzly.set_target(name_to_value[name])
            ansible.send_message('UPDATE_PERIPHERAL', {
                'peripheral': {
                    'name': name,
                    'peripheralType':'MOTOR_SCALAR',
                    'value': name_to_value[name],
                    'id': name_to_ids[name]
                }
            })

    time.sleep(0.05)

>>>>>>> 66ed4583d69c63f850071aac0f67b2f933e1de20
