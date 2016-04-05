import AppDispatcher from '../dispatcher/AppDispatcher';
import {ActionTypes} from '../constants/Constants';
import Ansible from '../utils/Ansible'

var FieldActions = {
  updateTimer(msg) {
    var timeLeft = msg.total_stage_time - msg.stage_time_so_far
    AppDispatcher.dispatch({
      type: ActionTypes.UPDATE_TIMER,
      timeLeft: timeLeft,
      stage: msg.stage_name,
      totalTime: msg.total_stage_time
    });
  },
  updateHeart(msg) {
    AppDispatcher.dispatch({
      type: ActionTypes.UPDATE_HEART,
      state: msg.state
    });
  },
  updateRobot(msg) {
    AppDispatcher.dispatch({
      type: ActionTypes.UPDATE_ROBOT,
      autonomous: msg.autonomous,
      enabled: msg.enabled
    });
    if (msg.enabled) {
      if (msg.autonomous) {
        Ansible.sendMessage('execute', {
          code: "import time\nprint time.strftime('starting autonomous at %l:%M:%S %p')\n"
        });
      } else {
        Ansible.sendMessage('execute', {
          code: `
"""
Sample student code that drives the robot based off of joystick values.
Copyright 2016. Pioneers in Engineering.
"""
from api.Gamepads import *
from api.Robot import *
import time
print time.strftime('starting autonomous at %l:%M:%S %p')
while True:
    #Change to correct gamepad_index if necessary
    gamepad_index = 0

    #Get the joystick values of the left y-axis and right y-axis
    joystick_1_value = get_axis(gamepad_index, Joystick.LEFT_Y)
    joystick_2_value = get_axis(gamepad_index, Joystick.RIGHT_Y)

    #Drives the robot at 75% of its poewr, based off of the joystick values.
    set_motor('motor0', 0.75 * joystick_1_value)
    set_motor('motor1', 0.75 * joystick_2_value)

    time.sleep(.05)
`
        });       
      }
      console.log("RUNNING SOBOT: " + (msg.autonomous ? "AUTONOMOUS" : "TELEOP"))
    } else {
      Ansible.sendMessage('stop', {});
      console.log("NOT RUNNING SOBOT: " + (msg.estop ? "ESTOP" : "NOT ESTOP"))
    }
  },
  updateLighthouseTimer(msg) {
    AppDispatcher.dispatch({
      type: ActionTypes.UPDATE_LIGHTHOUSETIMER,
      timeLeft: msg.time_left,
      enabled: msg.enabled,
      available: msg.available
    });
  }
};


export default FieldActions;
