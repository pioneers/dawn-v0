import subprocess, signal, sys
import ansible
import threading
import time
import grizzly
from api import Robot
from api import Gamepads
import hibike
import deviceContext
import time

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
    command = ansible.recv()
    if command:
        print("Message received from ansible!")
        msg_type, content = command['header']['msg_type'], command['content']
        if msg_type == 'execute':
	        print("Ansible said to start the code")
            if not running_code:
                p = subprocess.Popen(['python', 'student_code/student_code.py'])
                with pobslock:
                    pobs.add(p)
                #makes a deamon thread to supervise the process
                t = threading.Thread(target=p_watch, args=(p))
                t.daemon = True
                t.start()
                running_code = True
        elif msg_type == 'stop':
	        print("Ansible said to stop the code")
            if running_code:
                with pobslock:
                    print("killed")
                    for p in pobs: p.kill()
                #kill all motor values
                Robot.set_motor('motor0', 0)
                Robot.set_motor('motor1', 0)
                running_code = False
	    runtime_ansible.sendMessage("sensor_value",connectedDevices)
#        student_command = runtime_ansible.recv()
#        if student_command:
#            hibike_data = {}
#            header = student_command['header']
#            content = student_command['content']
#            if header['msg_type'] == "get_sensor" and content:
#                for name in content:
#                        hibike_data{str(name)} = Robot.get_sensor(name)
#                    except:
##                    try:
#                        print("sensor is not set")
#            elif header['msg_type'] == 'set_motor' and content:
##                runtime_ansible.send_message('sensor_data', hibike_data)
#                for motor_name in content:
#                    try:
#                        Robot.set_motor(motor_name, content[motor_name])
#                        print("motor is not set")
#                    except:
#                        #needs improvement
#                runtime_ansible.send_message('set')
