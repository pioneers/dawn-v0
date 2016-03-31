import AppDispatcher from '../dispatcher/AppDispatcher';
import {EventEmitter} from 'events';
import { ActionTypes } from '../constants/Constants';
import assign from 'object-assign';
import _ from 'lodash';


let _lighthouseTimerData = {
  timestamp: 0,
  timeLeft: 0, // time sent over lcm
  computedTime: 0, // estimation of time combining timestamps with lcm data
  enabled: false,
  available: false
};

let LighthouseTimerStore = assign({}, EventEmitter.prototype, {
  emitChange() {
    this.emit('change');
  },
  getTimestamp() {
    return _lighthouseTimerData.timestamp
  },
  getComputedTime() {
    return _lighthouseTimerData.computedTime;
  },
  getTimeLeft() {
    return _lighthouseTimerData.timeLeft;
  },
  getEnabled() {
    return +_lighthouseTimerData.enabled;
  },
  getAvailable() {
    return _lighthouseTimerData.available;
  }
});

LighthouseTimerStore.dispatchToken = AppDispatcher.register((action) => {
  switch (action.type) {
    case ActionTypes.UPDATE_LIGHTHOUSETIMER:
      updateTimer(action);
      break;
  }
});
function refreshTimer() {
  _lighthouseTimerData.computedTime = (_lighthouseTimerData.timeLeft - (Date.now() - _lighthouseTimerData.timestamp))
  if (_lighthouseTimerData.computedTime < 0){_lighthouseTimerData.computedTime = 0}
  LighthouseTimerStore.emitChange()
}
setInterval(refreshTimer, 80)

function updateTimer(action) {
  //console.log("baby");
  _lighthouseTimerData.timestamp = Date.now()
	_lighthouseTimerData.timeLeft = action.timeLeft;
  _lighthouseTimerData.computedTime = action.timeLeft;
  _lighthouseTimerData.enabled = action.enabled;
	_lighthouseTimerData.available = action.available;
	//change timeLeft and set stage correctly
	LighthouseTimerStore.emitChange();
}

export default LighthouseTimerStore;