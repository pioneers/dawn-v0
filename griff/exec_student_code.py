from multiprocessing import Process, Pipe, Manager
import time, os
from Robot import Robot
from student_code import teleop
# import ansible

def run_student_code(shared_data):
    ''' execute student code in student_code.py '''
    try:
        robot = Robot(shared_data)
        teleop(robot)
    except Exception as e:
        print "Student code error: " + repr(e)

# def update_shared_data(shared_data):
#     '''recieves a dictionary from ansible and updates shared_data'''
#     ansible.init()
#     while True:
#         msg = ansible.recv() #get data from ansible
#         if msg:
#             try:
#                 for arg in msg:
#                     shared_data[arg] = msg[arg]
#             except Exception as e:
#                 print e

def update_shared_data(shared_data):
    while True:
        time.sleep(1)
        shared_data['test'] = time.time()

def get_status():
    ''' status getter method meant for Robot.py'''
    return shared_data

shared_data = Manager().dict()
update_subprocess = Process(target=update_shared_data, args = (shared_data,))
code_subprocess = Process(target=run_student_code, args = (shared_data,))
print "About to start update update_subprocess"
update_subprocess.start()
print "Updating started. About to execute student code"
code_subprocess.start()
print "Running student code"
update_subprocess.join()
code_subprocess.join()

while True:
    time.sleep(1)
    # if not is_alive(data):
    #     code_subprocess.terminate()
    #     update_subprocess.terminate()
    # #Do general control stuff
code_subprocess.terminate()
update_subprocess.terminate()
