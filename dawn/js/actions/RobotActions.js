import AppDispatcher from '../dispatcher/AppDispatcher';
import {ActionTypes} from '../constants/Constants';
//Adding new changes
import lcm from '../utils/LCM.js'
import fs from 'fs'
//Ending new import

var RobotActions = {
  updatePeripheral(id, value) {
    AppDispatcher.dispatch({
      type: ActionTypes.UPDATE_PERIPHERAL,
      peripheralType: ActionTypes.SENSOR_SCALAR,
      id: id,
      value: value
    });
  },
  clearConsole() {
    AppDispatcher.dispatch({
      type: ActionTypes.CLEAR_CONSOLE,
    });
  },
  updateConnection(connectionStatus) {
    AppDispatcher.dispatch({
      type: ActionTypes.UPDATE_CONNECTION,
      payload: connectionStatus
    });
    // var index = fs.readFileSync("station_number.txt")  
    // lcm.publish("Robot" + index + "/RobotStatus",  {
    //     __type__: "RobotStatus",
    //     connected: connectionStatus
    //   });
  }
};

export default RobotActions;
