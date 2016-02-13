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
      timeLeft: (TimerStore.getTimeLeft() / 1000).toFixed(1),
      stage: TimerStore.getStage()
    });
  },
  refresh() {
    var timeLeft = (TimerStore.getTimeLeft() - (Date.now() - TimerStore.getTimestamp())) / 1000
    if (timeLeft < 0){timeLeft = 0}
    this.setState({
      timeLeft: timeLeft.toFixed(1)
    })
  },
  componentDidMount() {
    TimerStore.on('change', this.onChange);
    this.onChange();
    setInterval(this.refresh, 20)
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
