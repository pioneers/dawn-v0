import React from 'react';
import Mousetrap from 'mousetrap';
import _ from 'lodash';
import ConsoleOutput from './ConsoleOutput';
import RobotActions from '../actions/RobotActions';
import Ansible from '../utils/Ansible';
import {Panel, Glyphicon} from 'react-bootstrap';
import { Button } from 'react-bootstrap';

import lcm_publish from '../utils/LCM'
import fs from 'fs'
import {stationNumber} from '../utils/StationConfig'

export default React.createClass({
  displayName: 'EstopButton',
	stopRobot() {
    lcm_publish("Robot" + stationNumber + "/Estop", {__type__: "Estop", estop: true})
    Ansible.sendMessage('stop', {});
    
	},

  render() {
    return (
      <div>
        <Button 
                bsStyle="danger"
                defaultPressed={true}
                bsSize="large"
                onClick={ this.stopRobot }
                aligned="center"
                style={{paddingTop: "40px", paddingBottom: "40px"}} 
                block>
        TOUCHSCREEN ESTOP
        </Button>


      </div>
    );
  }
});