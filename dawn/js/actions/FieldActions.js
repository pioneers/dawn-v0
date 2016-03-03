import AppDispatcher from '../dispatcher/AppDispatcher';
import {ActionTypes} from '../constants/Constants';
import Ansible from '../utils/Ansible'

var FieldActions = {
  updateTimer(msg) {
    var timeLeft = msg.total_stage_time - msg.stage_time_so_far
    AppDispatcher.dispatch({
      type: ActionTypes.UPDATE_TIMER,
      timeLeft: timeLeft,
      stage: msg.stage_name
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
      Ansible.sendMessage('execute', {
        code: "print 'running'"
      });
      console.log("RUNNING SOBOT")
    } else {
      Ansible.sendMessage('stop', {});
    }
  },
  updateGameObjectTimer(msg) {
    AppDispatcher.dispatch({
      type: ActionTypes.UPDATE_GAMEOBJTIMER,
      timeLeft: msg.time_left,
      lighthouseAvailable: msg.is_lighthouse_on
    });
  }
};


export default FieldActions;
