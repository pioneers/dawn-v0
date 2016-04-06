import AppDispatcher from '../dispatcher/AppDispatcher';
import {ActionTypes} from '../constants/Constants';
import Ansible from '../utils/Ansible'
fs = require('fs')

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
          code: fs.readFileSync('sample_autonomous.py')
        });
      } else {
        Ansible.sendMessage('execute', {
          code: fs.readFileSync('sample_teleop.py')
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
