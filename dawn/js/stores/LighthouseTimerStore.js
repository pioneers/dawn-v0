import AppDispatcher from '../dispatcher/AppDispatcher';
import {EventEmitter} from 'events';
import { ActionTypes } from '../constants/Constants';
import assign from 'object-assign';
import _ from 'lodash';


let _lighthousetimerData = {
  timestamp: 0,
  timeLeft: 0,
  lighthouseAvailable: 'Disconnected from field'
};

let LighthouseTimerStore = assign({}, EventEmitter.prototype, {
  emitChange() {
    this.emit('change');
  },
  getTimestamp() {
    return _lighthousetimerData.timestamp
  },
  getTimeLeft() {
    return _lighthousetimerData.timeLeft;
  },
  getAvailable() {
    return _lighthousetimerData.lighthouseAvailable;
  }
});

GameObjectTimerStore.dispatchToken = AppDispatcher.register((action) => {
  switch (action.type) {
    case ActionTypes.UPDATE_LIGHTHOUSETIMER:
      updateTimer(action);
      break;
  }
});
function refreshTimer() {
  LighthouseTimerStore.emitChange
}
//setInterval(refreshTimer, 10)

function updateTimer(action) {
  //console.log("baby");
  _lighthousetimerData.timestamp = Date.now()
	_lighthousetimerData.timeLeft = action.timeLeft;
	if action.lighthouseAvailable:
    _lighthousetimerData.lighthouseAvailable = "Lighthouse is available"
  else:
    _lighthousetimerData.lighthouseAvailable = "Lighthouse is unavailable"
	//change timeLeft and set stage correctly
	LighthouseTimerStore.emitChange();
}

export default LighthouseTimerStore;