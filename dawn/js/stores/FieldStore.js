import AppDispatcher from '../dispatcher/AppDispatcher';
import {EventEmitter} from 'events';
import { ActionTypes } from '../constants/Constants';
import assign from 'object-assign';
import _ from 'lodash';


let _robotData = {
  isBlue: true,
  teamNumber: 0,
  teamName: "unknown"
};

let heart = false

let FieldStore = assign({}, EventEmitter.prototype, {
  emitChange() {
    this.emit('change');
  },
  getHeart() {
    return heart;
  },
  getIsBlue() {
    return _robotData.isBlue;
  },
  getTeamNumber() {
    return _robotData.teamNumber;
  },
  getTeamName() {
    return _robotData.teamName;
  }
});

FieldStore.dispatchToken = AppDispatcher.register((action) => {
  switch (action.type) {
    case ActionTypes.UPDATE_ROBOT:
      updateRobot(action);
      break;
    case ActionTypes.UPDATE_HEART:
      updateHeart(action);
      break;
  }
});
function updateHeart(action) {
  heart = action.state
  FieldStore.emitChange()
}
function updateRobot(action) {
    _robotData.isBlue = action.isBlue;
    _robotData.teamNumber = action.teamNumber;
    _robotData.teamName = action.teamName
    //change timeLeft and set stage correctly
    FieldStore.emitChange();
}

export default FieldStore;