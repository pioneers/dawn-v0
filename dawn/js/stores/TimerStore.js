import AppDispatcher from '../dispatcher/AppDispatcher';
import {EventEmitter} from 'events';
import { ActionTypes } from '../constants/Constants';
import assign from 'object-assign';
import _ from 'lodash';


let _timerData = {
  timestamp: 0,
  timeLeft: 0, // time sent over lcm
  computedTime: 0, // estimation of time combining timestamps with lcm data
  totalTime: 0,

  // TODO: This should not be part of the store?
  stage: 'disconnected from field',
  width: 100,
  color: "progress-bar-info"
};

let TimerStore = assign({}, EventEmitter.prototype, {
  emitChange() {
    this.emit('change');
  },
  getTimestamp() {
    return _timerData.timestamp
  },
  getComputedTime() {
    return _timerData.computedTime;
  },
  getTimeLeft() {
    return _timerData.timeLeft;
  },
  getStage() {
    return _timerData.stage;
  },
  getWidth() {
    return _timerData.width;
  },
  getColor() {
    return _timerData.color;
  }
});

TimerStore.dispatchToken = AppDispatcher.register((action) => {
  switch (action.type) {
    case ActionTypes.UPDATE_TIMER:
      updateTimer(action);
      break;
  }
});
// TODO karthik-shanmugam: this logic should be in the component not the store...
function computeWidthAndColor() {
  if (_timerData.stage == 'Teleop' || _timerData.stage == 'Autonomous') {
    _timerData.width = 100 * _timerData.timeLeft / _timerData.totalTime;
    if (_timerData.width > 20) {
      _timerData.color = 'progress-bar-success active'
    } else if (_timerData.width > 5) {
      _timerData.color = 'progress-bar-warning active'
    } else {
      _timerData.color = 'progress-bar-danger active'
    }
  } else {
    _timerData.width = 100
    _timerData.color = 'progress-bar-info'
  }
}
function refreshTimer() {
  var timeLeft = (_timerData.timeLeft - (Date.now() - _timerData.timestamp))
  if (timeLeft < 0){timeLeft = 0}
  _timerData.computedTime = timeLeft;
  computeWidthAndColor();
  TimerStore.emitChange()
}
setInterval(refreshTimer, 200)

function updateTimer(action) {
  _timerData.timestamp = Date.now()
	_timerData.timeLeft = action.timeLeft;
  _timerData.computedTime = action.timeLeft;
	_timerData.stage = action.stage;
  _timerData.totalTime = action.totalTime;
  computeWidthAndColor();
	//change timeLeft and set stage correctly
	TimerStore.emitChange();
}

export default TimerStore;