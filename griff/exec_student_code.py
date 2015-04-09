from multiprocessing import Process, Pipe, Manager
import time, os
import ansible
import student_code
        
def run_student_code(shared_data):
    ''' execute student code located in student_code.py '''
    try:
        student_code.teleop()
    except Exception as e:
        print(e)

def update_shared_data(shared_data):
    '''communicate between ansible and shared_data'''
    ansible.init()
    while True:
        msg = ansible.recv() #get data from ansible
        if msg:
            try:
                for arg in msg:
                    shared_data[arg] = msg[arg]
            except Exception as e:
                print e
                pass

def share_data_with_Robot():
    return shared_data

shared_data = Manager().dict()
code_subprocess = Process(target=run_student_code, args = (shared_data,))
update_subprocess = Process(target=update_shared_data, args = (shared_data,))
update_subprocess.start()
code_subprocess.start()
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
