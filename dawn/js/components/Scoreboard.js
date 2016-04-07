import React from 'react';
import TimerStore from '../stores/TimerStore';
import FieldStore from '../stores/FieldStore';
import LighthouseTimerStore from '../stores/LighthouseTimerStore';
import _ from 'lodash';

var Scoreboard = React.createClass({
  getInitialState() {
    return { 
      timeLeft: 0,
      stage: "Offline",
      width: 50,
      color: "progress-bar-info",
      lighthouseTimeLeft: 0,
      lighthouseWidth: 50,
      lightouseStatus: "Offline",
      lighthouseColor: "progress-bar-info",
      station: 0,
      blueScore: 0,
      goldScore: 0,
      matchNumber: 0,
      teamNumbers: [0, 0, 0, 0],
      teamNames: ["Offline", "Offline", "Offline", "Offline"] };
  },
  onTimerChange() {
    this.setState({
      timeLeft: (TimerStore.getComputedTime() / 1000).toFixed(1),
      stage: TimerStore.getStage(),
      width: TimerStore.getWidth(),
      color: TimerStore.getColor()
    });
  },
  //TODO
  onLighthouseChange() {
    var timeLeft = (LighthouseTimerStore.getComputedTime() / 1000)
    var width = 100
    var color = "progress-bar-info";
    var status = "Disabled"
    if (LighthouseTimerStore.getEnabled()) {
      color = "progress-bar-success"
      status = "Available"
    }

    if (LighthouseTimerStore.getEnabled() && ! LighthouseTimerStore.getAvailable()) {
      color = "progress-bar-danger active"
      width = 100 * ((LighthouseTimerStore.getTimeLeft() / 1000) / 10)
      status = "Unavailable for " + timeLeft.toFixed(1)
    }

    this.setState({
      lighthouseTimeLeft: timeLeft.toFixed(1),
      lighthouseWidth: width,
      lighthouseColor: color,
      lightouseStatus: status
    });
  },
  onFieldChange() {
    this.setState({
      blueScore: FieldStore.getBlueScore(),
      goldScore: FieldStore.getGoldScore(),
      matchNumber: FieldStore.getMatchNumber(),
      teamNumbers: FieldStore.getTeamNumbers(),
      teamNames: FieldStore.getTeamNames(),
      station: FieldStore.getStation()
    })
  },
  componentDidMount() {
    TimerStore.on('change', this.onTimerChange);
    this.onTimerChange();

    LighthouseTimerStore.on('change', this.onLighthouseChange);
    this.onLighthouseChange();

    FieldStore.on('change', this.onFieldChange);
    this.onFieldChange();
    //setInterval(this.refresh, 80)
  },
  componentWillUnmount() {
    TimerStore.removeListener('change', this.onTimerChange);
  },
  render: function() {
        return (
        <div>
        <div className="row">
          <div className="col-xs-12 col-md-12">
            <div className="row">
              <div className="col-xs-5 col-sm-4">
                <div className="panel panel-default pioneers-blue">
                  <div className="row">
                    <div className="col-md-7 col-xs-5">
                      <div className="team-0">{this.state.teamNumbers[0]} {this.state.teamNames[0]}</div>
                      <div className="team-1">{this.state.teamNumbers[1]} {this.state.teamNames[1]}</div>
                    </div>
                    <div className="col-md-1 col-md-offset-3 col-xs-1 col-xs-offset-4">
                      <div className="score-blue text-right" style={{}}>{this.state.blueScore}</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xs-2 col-sm-4 clock">
                <div className="text-center">{this.state.timeLeft}</div>
              </div>
              <div className="col-xs-5 col-sm-4">
                <div className="panel panel-default pioneers-gold">
                  <div className="row">
                    <div className="col-md-1 col-xs-1">
                      <div className="score-gold" style={{}}>{this.state.goldScore}</div>
                    </div>
                    <div className="col-md-7  col-md-offset-3 col-xs-5 col-xs-offset-4">
                      <div className="team-2 text-right">{this.state.teamNames[2]} {this.state.teamNumbers[2]}</div>
                      <div className="team-3 text-right">{this.state.teamNames[3]} {this.state.teamNumbers[3]}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-xs-12 col-md-12">
            <div className="progress timer">
              <div className={"progress-bar progress-bar-striped " + this.state.color} role="progressbar" aria-valuenow={45} aria-valuemin={0} aria-valuemax={100} style={{width: this.state.width+"%"}}>
                <span>{this.state.stage}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-xs-12 col-md-12">
            <div className="progress lighthouse-timer">
              <div className={"progress-bar progress-bar-striped " + this.state.lighthouseColor} role="progressbar" aria-valuenow={45} aria-valuemin={0} aria-valuemax={100} style={{width: this.state.lighthouseWidth+"%"}}>
                <span>{"Lighthouse Chief " + this.state.lightouseStatus}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
       );
    }
});

export default Scoreboard;
