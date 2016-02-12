from api import Robot
from api import Gamepads
servo_value = 0
while True:
    x = Gamepads.get_axis(0, Gamepads.Joystick.LEFT_X)
    val = Robot.get_color_sensor(42508118071184087178507)
    print "val is", val
