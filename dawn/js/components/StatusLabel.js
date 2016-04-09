import React from 'react';
import {Label} from 'react-bootstrap';
import numeral from 'numeral';

var StatusLabel = React.createClass({
  propTypes: {
    connectionStatus: React.PropTypes.bool,
    runtimeStatus: React.PropTypes.bool,
    battery: React.PropTypes.number
  },
  render() {
    msg = {__type__: 'StatusLight', red: false, yellow: false, green: false, buzzer: false}
    let labelStyle = 'default';
    let labelText = 'Disconnected';
    if (this.props.connectionStatus) {
      if (!this.props.runtimeStatus) {
        labelStyle = 'danger';
        labelText = 'Runtime Error';
        msg.yellow = true
      } else if (this.props.battery < 1) {
        labelStyle = 'warning';
        labelText = 'Battery Issue'
        msg.yellow = true
      } else {
        labelStyle = 'success';
        labelText = `Connected. Battery: ${numeral(this.props.battery).format('0.00')} V`;
        msg.green = true
      }
    } else {
      msg.red = true
    }
    lcm_publish("StatusLight" + parseInt(fs.readFileSync("station_number.txt")) + "/StatusLight", msg)
    return (
      <Label bsStyle={labelStyle}>{labelText}</Label>
    );
  }
});

export default StatusLabel;
