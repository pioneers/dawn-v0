from multiprocessing import Process, Pipe, Manager
import exec_student_code

class Robot:
	def __init__(self):
		update_process = Process(target=update, args = (self,))
		update_process.start()
		update_process.join()

	def update(self):
		self.status = exec_student_code.share_data_with_Robot()