import React from 'react';
import PeripheralList from './PeripheralList';
import Peripheral from './Peripheral';
import GameObjectTimerStore from '../stores/GameObjectTimerStore';
import _ from 'lodash';

var GameObjectTimer = React.createClass({
  getInitialState() {
    return { 
      timeLeft: 0,
      lighthouseAvailable: "lighthouse is not available" };
  },
  onChange() {
    this.setState({
      timeLeft: (GameObjectTimerStore.getTimeLeft() / 1000).toFixed(1),
      lighthouseAvailable: GameObjectTimerStore.getAvailable()
    });
  },
  refresh() {
    var timeLeft = (GameObjectTimerStore.getTimeLeft() - (Date.now() - GameObjectTimerStore.getTimestamp())) / 1000
    if (timeLeft < 0){timeLeft = 0}
    this.setState({
      timeLeft: timeLeft.toFixed(1)
    })
  },
  componentDidMount() {
    GameObjectTimerStore.on('change', this.onChange);
    this.onChange();
    setInterval(this.refresh, 20)
  },
  componentWillUnmount() {
    GameObjectTimerStore.removeListener('change', this.onChange);
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

export default GameObjectTimer;
