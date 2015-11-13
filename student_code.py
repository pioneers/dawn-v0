from api import Gamepads, Robot
import time

while True:
    gpads = Gamepads.get_all()
    #val = gpads['0']['axes'][1]
    #if abs(val) > 0.5:
    #    print val
    if Robot.get_sensor("45912395041309643275") == 1:
        #Robot.set_motor('motor0', 0)
        #Robot.set_motor('motor1', 0)
        print("hi")
    else:
        num = 40 * Gamepads.get_joysticks('0')[1]
        num2 = 40 * Gamepads.get_joysticks('0')[3]
        if num > 20:
            print("less than 20")
        if num2 > 20:
            print("other less than 20")
        #Robot.set_motor('motor0', 0)
        #Robot.set_motor('motor0', 40 * Gamepads.get_joysticks('0')[1])
        #Robot.set_motor('motor1', 40 * Gamepads.get_joysticks('0')[3])
    time.sleep(.05)