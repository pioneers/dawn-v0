import React from 'react';
import PeripheralList from './PeripheralList';
import Peripheral from './Peripheral';
import LighthouseTimerStore from '../stores/LighthouseTimerStore';
import _ from 'lodash';

var LighthouseTimer = React.createClass({
  getInitialState() {
    return { 
      timeLeft: 0,
      status: 'Disconnected from field' };
  },
  onChange() {
    var status = '';
    if (LighthouseTimerStore.getEnabled()) {
      if (LighthouseTimerStore.getAvailable()) {
        status = "Available";
      } else {
        status = "Unavailable";
      }
    } else {
      status = "Disabled";
    }
    this.setState({
      timeLeft: (LighthouseTimerStore.getTimeLeft() / 1000).toFixed(1),
      status: status
    });
  },
  refresh() {
    if (this.state.status != "Unavailable") {return;}
    var timeLeft = (LighthouseTimerStore.getTimeLeft() - (Date.now() - LighthouseTimerStore.getTimestamp())) / 1000
    if (timeLeft < 0){timeLeft = 0}
    this.setState({
      timeLeft: timeLeft.toFixed(1)
    })
  },
  componentDidMount() {
    LighthouseTimerStore.on('change', this.onChange);
    this.onChange();
    setInterval(this.refresh, 80)
  },
  componentWillUnmount() {
    LighthouseTimerStore.removeListener('change', this.onChange);
  },
  render: function() {
        return (
        <div>
            <p>
              Lighthouse Chief {this.state.status}: <b>{this.state.timeLeft}</b>
            </p>
        </div>
       );
    }
});

export default LighthouseTimer;
