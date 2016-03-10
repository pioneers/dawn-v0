import React from 'react';
import PeripheralList from './PeripheralList';
import Peripheral from './Peripheral';
import GameObjectTimerStore from '../stores/LighthouseTimerStore';
import _ from 'lodash';

var LighthouseTimer = React.createClass({
  getInitialState() {
    return { 
      timeLeft: 0,
      lighthouseAvailable: 'Disconnected from field' };
  },
  onChange() {
    this.setState({
      timeLeft: (LighthouseTimerStore.getTimeLeft() / 1000).toFixed(1),
      lighthouseAvailable: LighthouseTimerStore.getAvailable()
    });
  },
  refresh() {
    var timeLeft = (LighthouseTimerStore.getTimeLeft() - (Date.now() - LighthouseTimerStore.getTimestamp())) / 1000
    if (timeLeft < 0){timeLeft = 0}
    this.setState({
      timeLeft: timeLeft.toFixed(1)
    })
  },
  componentDidMount() {
    LighthouseTimerStore.on('change', this.onChange);
    this.onChange();
    setInterval(this.refresh, 20)
  },
  componentWillUnmount() {
    LighthouseTimerStore.removeListener('change', this.onChange);
  },
  render: function() {
        return (
        <div>
            <p>
              The following is a timer: <b>{this.state.timeLeft}</b>
            </p>
            <p>
              Stage: <b>{this.state.lighthouseAvailable}</b>
            </p>
        </div>
       );
    }
});

export default LighthouseTimer;
