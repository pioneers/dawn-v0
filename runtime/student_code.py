from api import Robot, Gamepads
import time
while True:
    print(-Gamepads.get_joysticks(0)[1])
    Robot.set_motor('rightMotor', -Gamepads.get_joysticks(0)[3]*100.0)
    Robot.set_motor('leftMotor', -Gamepads.get_joysticks(0)[1]*100.0)
    Robot.set_motor('dr12_rightJoint_#0', -Gamepads.get_joysticks(0)[3]*100.0)
    Robot.set_motor('dr12_leftJoint_#0', -Gamepads.get_joysticks(0)[1]*100.0)\
    
    # if bumping against the wall, back up
    if Robot.get_sensor('3bumperForceSensor') < -15.0:
        Robot.set_motor('rightMotor', -20.0)
        Robot.set_motor('leftMotor', -20.0)
        time.sleep(1.0)
    time.sleep(0.1)
