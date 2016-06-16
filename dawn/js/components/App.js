import React from 'react';
import Joyride from 'react-joyride';
import DNav from './DNav';
import Dashboard from './Dashboard';
import RobotInfoStore from '../stores/RobotInfoStore';
import RuntimeConfig from './RuntimeConfig';
import joyrideSteps from './JoyrideSteps';
import smalltalk from 'smalltalk';
import { removeAsyncAlert } from '../actions/AlertActions';
import { remote, ipcRenderer } from 'electron';
import { connect } from 'react-redux';
const storage = remote.require('electron-json-storage');

let App = React.createClass({
  displayName: 'Dawn',
  getInitialState() {
    return {
      steps: [],
      isRunningCode: RobotInfoStore.getIsRunningCode(),
      connectionStatus: RobotInfoStore.getConnectionStatus(),
      runtimeStatus: RobotInfoStore.getRuntimeStatus(),
      batteryLevel: RobotInfoStore.getBatteryLevel(),
      runtimeVersion: RobotInfoStore.getRuntimeVersion()
    };
  },
  componentDidMount() {
    this.addSteps(joyrideSteps);
    RobotInfoStore.on('change', this.updateRobotInfo);
    ipcRenderer.on('start-interactive-tour', ()=>{
      this.startTour();
    });
    storage.has('firstTime').then((hasKey)=>{
      if (!hasKey) {
        this.startTour();
        storage.set('firstTime', {first: true}, (err)=>{
          if (err) throw err;
        });
      }
    });
  },
  componentWillReceiveProps(nextProps) {
    let asyncAlerts = nextProps.asyncAlerts;
    // If the alerts list has changed, display the latest one.
    if (asyncAlerts !== this.props.asyncAlerts) {
      let latestAlert = asyncAlerts[asyncAlerts.length - 1];
      if (latestAlert !== undefined) {
        this.updateAlert(latestAlert);
      }
    }
  },
  componentWillUnmount() {
    RobotInfoStore.removeListener('change', this.updateRobotInfo);
  },
  updateRobotInfo() {
    this.setState({
      isRunningCode: RobotInfoStore.getIsRunningCode(),
      connectionStatus: RobotInfoStore.getConnectionStatus(),
      runtimeStatus: RobotInfoStore.getRuntimeStatus(),
      batteryLevel: RobotInfoStore.getBatteryLevel(),
      runtimeVersion: RobotInfoStore.getRuntimeVersion()
    });
  },
  updateAlert(latestAlert) {
    smalltalk.alert(latestAlert.heading, latestAlert.message).then(()=>{
      this.props.onAlertDone(latestAlert.id);
    }, ()=>{
      this.props.onAlertDone(latestAlert.id);
    });
  },
  addSteps(steps) {
    let joyride = this.refs.joyride;
    if (!Array.isArray(steps)) {
      steps = [ steps ];
    }
    if (!steps.length) {
      return false;
    }
    this.setState((currentState) => {
      currentState.steps = currentState.steps.concat(joyride.parseSteps(steps));
      return currentState;
    });
  },
  addTooltip(data) {
    this.refs.joyride.addTooltip(data);
  },
  startTour() {
    this.refs.joyride.start(true);
  },
  completeCallback(steps, skipped) {
    this.refs.joyride.reset(false);
  },
  render() {
    return (
      <div>
        <DNav
          startTour={this.startTour}
          runtimeStatus={this.state.runtimeStatus}
          connection={this.state.connectionStatus}
          battery={this.state.batteryLevel}
          isRunningCode={this.state.isRunningCode}
        />
        <Joyride
          ref="joyride"
          steps={this.state.steps}
          type="continuous"
          showSkipButton={true}
          completeCallback={this.completeCallback}
          locale={{back: 'Previous', close: 'Close', last: 'End Tour', next: 'Next', skip: 'Skip Tour'}}
        />
        <div style={{ height: '60px', marginBottom: '21px' }}/>
        <Dashboard {...this.props}
          addSteps={this.addSteps}
          addTooltip={this.addTooltip}
	  connectionStatus={this.state.connectionStatus}
          runtimeStatus={this.state.runtimeStatus}
          isRunningCode={this.state.isRunningCode}
        />
        <RuntimeConfig
          connectionStatus={this.state.connectionStatus}
          runtimeVersion={this.state.runtimeVersion}/>
      </div>
    );
  }
});

const mapStateToProps = (state) => {
  return {
    asyncAlerts: state.asyncAlerts
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onAlertDone: (id) => {
      dispatch(removeAsyncAlert(id));
    }
  };
};

App = connect(mapStateToProps, mapDispatchToProps)(App)

export default App;
