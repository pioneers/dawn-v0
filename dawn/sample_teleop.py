from api.Gamepads import *
from api.Robot import *
import time
print time.strftime('starting teleop at %l:%M:%S %p')
while True:
    #Change to correct gamepad_index if necessary
    gamepad_index = 0

    #Get the joystick values of the left y-axis and right y-axis
    joystick_1_value = get_axis(gamepad_index, Joystick.LEFT_Y)
    joystick_2_value = get_axis(gamepad_index, Joystick.RIGHT_Y)

    #Drives the robot at 75% of its poewr, based off of the joystick values.
    set_motor('motor0', -0.75 * joystick_1_value)
    set_motor('motor1', 0.75 * joystick_2_value)

    time.sleep(.05)