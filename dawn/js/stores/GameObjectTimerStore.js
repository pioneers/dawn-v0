import AppDispatcher from '../dispatcher/AppDispatcher';
import {EventEmitter} from 'events';
import { ActionTypes } from '../constants/Constants';
import assign from 'object-assign';
import _ from 'lodash';


let _gameobjtimerData = {
  timestamp: 0,
  timeLeft: 0,
  lighthouseAvailable: 'Disconnected from field'
};

let GameObjectTimerStore = assign({}, EventEmitter.prototype, {
  emitChange() {
    this.emit('change');
  },
  getTimestamp() {
    return _gameobjtimerData.timestamp
  },
  getTimeLeft() {
    return _gameobjtimerData.timeLeft;
  },
  getAvailable() {
    return _gameobjtimerData.lighthouseAvailable;
  }
});

GameObjectTimerStore.dispatchToken = AppDispatcher.register((action) => {
  switch (action.type) {
    case ActionTypes.UPDATE_GAMEOBJTIMER:
      updateTimer(action);
      break;
  }
});
function refreshTimer() {
  GameObjectTimerStore.emitChange
}
//setInterval(refreshTimer, 10)

function updateTimer(action) {
  //console.log("baby");
  _gameobjtimerData.timestamp = Date.now()
	_gameobjtimerData.timeLeft = action.timeLeft;
	_gameobjtimerData.lighthouseAvailable = action.lighthouseAvailable;
	//change timeLeft and set stage correctly
	GameObjectTimerStore.emitChange();
}

export default GameObjectTimerStore;