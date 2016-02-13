import AppDispatcher from '../dispatcher/AppDispatcher';
import LCM from './lcm_ws_bridge'
import FieldActions from '../actions/FieldActions.js'

let bridgeAddress = localStorage.getItem('bridgeAddress') || '127.0.0.1';
let lcm = null;
function makeLCM(){
    lcm = new LCM('ws://' + bridgeAddress + ':8000/');
    function subscribeAll() {
        console.log('Connected to LCM Bridge')
        lcm.subscribe("Timer/Time", "Time", function(msg) {
           FieldActions.updateTimer(msg)
        })
        lcm.subscribe("Heartbeat/Beat", "Heartbeat", function(msg) {
           FieldActions.updateHeart(msg)
        })  
    }
    lcm.on_ready(subscribeAll)
    lcm.on_close(makeLCM)
}
makeLCM()


