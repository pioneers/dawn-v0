import AppDispatcher from '../dispatcher/AppDispatcher';
import {EventEmitter} from 'events';
import { ActionTypes } from '../constants/Constants';
import assign from 'object-assign';
import _ from 'lodash';
import fs from 'fs'

let _robotData = {
  station: parseInt(fs.readFileSync("station_number.txt")),
  isBlue: parseInt(fs.readFileSync("station_number.txt")) < 2,
  teamNumber: 0,
  teamName: "unknown",
  stationTag: ''
};
if (_robotData.isBlue) {
  _robotData.stationTag = "Blue " + (_robotData.station+1) + " "
} else {
  _robotData.stationTag = "Gold " + (_robotData.station-1) + " "
}
let _matchData = {
  matchNumber: 0,
  teamNumbers: [0, 0, 0, 0],
  teamNames: ["Offline", "Offline", "Offline", "Offline"] 
}

let _score = {
  blue: 0,
  gold: 1
}

let _heart = false

let FieldStore = assign({}, EventEmitter.prototype, {
  emitChange() {
    this.emit('change');
  },
  getHeart() {
    return _heart;
  },
  getIsBlue() {
    return _robotData.isBlue;
  },
  getTeamNumber() {
    return _robotData.teamNumber;
  },
  getTeamName() {
    return _robotData.teamName;
  },
  getMatchNumber() {
    return _matchData.matchNumber;
  },
  getTeamNumbers() {
    return _matchData.teamNumbers;
  },
  getTeamNames() {
    return _matchData.teamNames;
  },
  getBlueScore() {
    return _score.blue;
  },
  getGoldScore() {
    return _score.gold;
  },
  getStation() {
    return _robotData.station;
  },
  getStationTag() {
    return _robotData.stationTag;
  }});

FieldStore.dispatchToken = AppDispatcher.register((action) => {
  switch (action.type) {
    case ActionTypes.UPDATE_HEART:
      updateHeart(action);
      break;
    case ActionTypes.UPDATE_MATCH:
      updateMatch(action);
      break;
    case ActionTypes.UPDATE_SCORE:
      updateScore(action);
      break;
  }
});

function updateHeart(action) {
  _heart = action.state
  FieldStore.emitChange()
}

function updateMatch(action) {
    _matchData.matchNumber = action.matchNumber;
    _matchData.teamNumbers = action.teamNumbers;
    _matchData.teamNames = action.teamNames;

    _robotData.teamNumber = _matchData.teamNumbers[_robotData.station];
    _robotData.teamName = _matchData.teamNames[_robotData.station];
    FieldStore.emitChange();
}

function updateScore(action) {
    _score.blue = 20 * action.treasure_autonomous[0] + 15 * action.treasure_autonomous[1] + 10 * action.treasure_teleop[0] + 5 * action.treasure_teleop[1];
    _score.gold = 20 * action.treasure_autonomous[2] + 15 * action.treasure_autonomous[3] + 10 * action.treasure_teleop[2] + 5 * action.treasure_teleop[3];
    FieldStore.emitChange();
}

export default FieldStore;