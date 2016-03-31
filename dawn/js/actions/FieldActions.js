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
          code: "import time\nprint time.strftime('starting teleop at %l:%M:%S %p')\n"
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
