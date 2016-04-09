import AppDispatcher from '../dispatcher/AppDispatcher';
import LCM from './lcm_ws_bridge'
import FieldActions from '../actions/FieldActions.js'
import AlertActions from '../actions/AlertActions.js'
import fs from 'fs'
localStorage.setItem('bridgeAddress', fs.readFileSync('lcm_bridge_addr.txt'))


let bridgeAddress = localStorage.getItem('bridgeAddress') || '127.0.0.1';
let lcm = null;
let lcm_ready = false;
function makeLCM(){
    lcm = new LCM('ws://' + bridgeAddress + ':8000/');
    function subscribeAll() {
        lcm_ready = true;
        console.log('Connected to LCM Bridge')
        lcm.subscribe("Timer/Time", "Time", function(msg) {
           FieldActions.updateTimer(msg)
        })
        lcm.subscribe("Heartbeat/Beat", "Heartbeat", function(msg) {
           FieldActions.updateHeart(msg)
        })
        lcm.subscribe("Robot" + fs.readFileSync('station_number.txt') + "/RobotControl", "RobotControl", function(msg) {
            FieldActions.updateRobot(msg)
        })
        lcm.subscribe("Timer/Match", "Match", function(msg) {
            FieldActions.updateMatch(msg)
        })
        lcm.subscribe("LiveScore/LiveScore", "LiveScore", function(msg) {
            FieldActions.updateScore(msg)
        })
        lcm.subscribe("LighthouseTimer/LighthouseTime", "LighthouseTime", FieldActions.updateLighthouseTimer)
    }
    lcm.on_ready(subscribeAll)
    lcm.on_close(makeLCM)
}
makeLCM()

function lcm_publish(channel, msg) {
    if (lcm_ready) {
        lcm.publish(channel, msg)
    }
}


export default lcm_publish;
