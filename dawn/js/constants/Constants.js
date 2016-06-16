import keyMirror from 'keymirror';

module.exports = {
  VERSION: '0.4.0',
  ActionTypes: keyMirror({
    UPDATE_BATTERY:null,
    UPDATE_GAMEPADS: null,
    UPDATE_FILENAMES: null,
    UPDATE_FILENAME: null,
    UPDATE_PERIPHERAL: null,
    UPDATE_STATUS: null,
    UPDATE_CONNECTION: null,
    runtime_version: null
  }),
  PeripheralTypes: keyMirror({
    MOTOR_SCALAR: null,
    SENSOR_BOOLEAN: null,
    SENSOR_SCALAR: null,
    LimitSwitch: null,
    LineFollower: null,
    Potentiometer: null,
    Encoder: null,
    ColorSensor: null,
    MetalDetector: null,
    ExampleDevice: null
  })
};
