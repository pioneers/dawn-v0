from multiprocessing import Process, Pipe, Manager
# from grizzly import *

class Robot:
    def __init__(self, shared_data):
        # do stuff
    	self.shared_data = shared_data
    @property
    def status(self):
        ''' let students access robot status data'''
        return shared_data