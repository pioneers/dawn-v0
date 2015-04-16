from multiprocessing import Process, Pipe, Manager
import exec_student_code
# from grizzly import *

class Robot:
    def __init__(self):
        # do stuff
    	nothing = True
    @property
    def status(self):
        ''' let students access robot status data'''
        return exec_student_code.get_status()