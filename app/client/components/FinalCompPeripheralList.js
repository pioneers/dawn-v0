/**
 * Haxors
 */

import React from 'react';
import PeripheralList from './PeripheralList';
import Peripheral from './Peripheral';
import RemoteRobotStore from '../stores/RemoteRobotStore';
import _ from 'lodash';

var FinalCompPeripheralList = React.createClass({
  getInitialState() {
    return {
      peripherals: [],
      connected: 'true'
    };
  },
  onChange() {
    this.setState({connected: 'true'});
    this.setState({peripherals: RemoteRobotStore.getPeripherals()});
  },
  onStop() {
    this.setState({connected: 'false'})
  },
  componentDidMount() {
    RemoteRobotStore.on('change', this.onChange);
    RemoteRobotStore.on('stop', this.onStop);
    this.onChange();
    this.onStop();
  },
  componentWillUnmount() {
    RemoteRobotStore.removeListener('change', this.onChange);
    RemoteRobotStore.removeListener('stop', this.onStop);
  },
  render() {
    if(this.state.connected == 'true'){
      return (
        <PeripheralList header='Connected Components'>
          {_.map(this.state.peripherals, (peripheral) => <Peripheral key={peripheral.id} {...peripheral}/>)}
        </PeripheralList>
      );
    }
    else{
      return(
        <PeripheralList header='Connected Components'>
          There doesn't seem to be any sensors connected. 
        </PeripheralList>
      );
    };
  }
});

export default FinalCompPeripheralList;
