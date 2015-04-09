from grizzly import *
from Robot import *

my_robot = Robot()

def teleop():    
    my_robot.g = Grizzly()
    g.set_mode(ControlMode.NO_PID, DriveMode.DRIVE_COAST)
    g.limit_acceleration(142)
    g.limit_current(10)
    while True:
        try:
            stuff = my_robot.status
            print stuff['0']['axes'][0]
            target = float(stuff['0']['axes'][0]) * 100
            print target
            g.set_target(target)
        except Exception as e:
          print e
a = teleop