import AppDispatcher from '../dispatcher/AppDispatcher';
import {ActionTypes} from '../constants/Constants';

var FieldActions = {
  updateTimer(msg) {
    var timeLeft = msg.total_stage_time - msg.stage_time_so_far
    AppDispatcher.dispatch({
      type: ActionTypes.UPDATE_TIMER,
      timeLeft: timeLeft,
      stage: msg.stage_name
    });
  }
};

export default FieldActions;
