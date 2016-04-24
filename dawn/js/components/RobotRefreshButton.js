import React from 'react';
import Ansible from '../utils/Ansible';
import { Button } from 'react-bootstrap';

import lcm_publish from '../utils/LCM'
import {stationNumber} from '../utils/StationConfig'

export default React.createClass({
  displayName: 'EstopButton',
    stopRobot() {
    Ansible.sendMessage('stop', {});
    },

  render() {
    return (
      <div>
        <Button 
                bsStyle="warning"
                defaultPressed={true}
                bsSize="large"
                onClick={ this.stopRobot }
                aligned="center"
                style={{paddingTop: "40px", paddingBottom: "40px"}} 
                block>
        RESTART CODE
        </Button>


      </div>
    );
  }
});