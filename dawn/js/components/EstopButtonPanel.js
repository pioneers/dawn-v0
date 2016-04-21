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
import stationNumber from '../utils/StationConfig'

export default React.createClass({
  displayName: 'EstopButton',
	stopRobot() {
    console.log("MOBOT")
    Ansible.sendMessage('stop', {});
    lcm_publish("Robot" + stationNumber + "/Estop", {__type__: "Estop", estop: true})
	},

  render() {
    var defaultStyle = {
      color: 'red'
    };
    return (
      <Panel
        header="Estop"
        bsStyle="primary"
        id="estop-panel"
        defaultExpanded >
        <Button style = {defaultStyle}
                defaultPressed={true}
                bsSize="large"
                onClick={ this.stopRobot() }
                label="ESTOP"
                aligned="center" />


      </Panel>
    );
  }
});