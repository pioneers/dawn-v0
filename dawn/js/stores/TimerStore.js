import AppDispatcher from '../dispatcher/AppDispatcher';
import {EventEmitter} from 'events';
import { ActionTypes } from '../constants/Constants';
import assign from 'object-assign';
import _ from 'lodash';


let _timerData = {
  timestamp: 0,
  timeLeft: 0,
  stage: 'disconnected from field'
};

let TimerStore = assign({}, EventEmitter.prototype, {
  emitChange() {
    this.emit('change');
  },
  getTimestamp() {
    return _timerData.timestamp
  },
  getTimeLeft() {
    return _timerData.timeLeft;
  },
  getStage() {
    return _timerData.stage;
  }
});

TimerStore.dispatchToken = AppDispatcher.register((action) => {
  switch (action.type) {
    case ActionTypes.UPDATE_TIMER:
      updateTimer(action);
      break;
  }
});
function refreshTimer() {
  TimerStore.emitChange()
}
//setInterval(refreshTimer, 10)

function updateTimer(action) {
  _timerData.timestamp = Date.now()
	_timerData.timeLeft = action.timeLeft;
	_timerData.stage = action.stage;
	//change timeLeft and set stage correctly
	TimerStore.emitChange();
}

export default TimerStore;