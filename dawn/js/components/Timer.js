import React from 'react';
import PeripheralList from './PeripheralList';
import Peripheral from './Peripheral';
import TimerStore from '../stores/TimerStore';
import _ from 'lodash';

var Timer = React.createClass({
  getInitialState() {
    return { 
      timeLeft: 0,
      stage: "disconnected" };
  },
  onChange() {
    this.setState({
      timeLeft: TimerStore.getTimeLeft(),
      stage: TimerStore.getStage()
    });
  },
  componentDidMount() {
    TimerStore.on('change', this.onChange);
    this.onChange();
  },
  componentWillUnmount() {
    TimerStore.removeListener('change', this.onChange);
  },
  render: function() {
        return (
        <div>
            <p>
              The following is a timer: <b>{this.state.timeLeft}</b>
            </p>
            <p>
              Stage: <b>{this.state.stage}</b>
            </p>
        </div>
       );
    }
});

export default Timer;
