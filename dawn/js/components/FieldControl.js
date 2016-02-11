import React from 'react';
import AceEditor from 'react-ace';
import brace from 'brace';
import EditorActionCreators from '../actions/EditorActionCreators';
import EditorStore from '../stores/EditorStore';
import EditorToolbar from './EditorToolbar';
import Mousetrap from 'mousetrap';
import ConsoleOutput from './ConsoleOutput';
import RobotActions from '../actions/RobotActions';
import Ansible from '../utils/Ansible';
import {Panel} from 'react-bootstrap';
import { EditorButton } from './EditorClasses';
import 'brace/mode/python';
// React-ace themes
import 'brace/theme/monokai';
import 'brace/theme/github';
import 'brace/theme/tomorrow';
import 'brace/theme/kuroir';
import 'brace/theme/twilight';
import 'brace/theme/xcode';
import 'brace/theme/textmate';
import 'brace/theme/solarized_dark';
import 'brace/theme/solarized_light';
import 'brace/theme/terminal';

export default React.createClass({displayName: 'Timer',
	getInitialState: function() {
    	return {
    		secondsElapsed: 0,
    		timer_length: 10,
    		start: Date.now()
    	};
	},
	tick: function() {
        if (this.state.secondsElapsed <= this.state.timer_length)
    	   this.setState({secondsElapsed: new Date() - this.state.start});
	},
	componentDidMount: function() {
	  this.interval = setInterval(this.tick, 50);
	},
    componentWillUnmount: function() {
      clearInterval(this.interval);
    },
    loadInfoFromServer: function() { 
    	$.ajax({
    		url:this.props.url,
    		dataType:'json',
    		cache: false,
    		success: function(data) {
    			this.setState({data:data})
    		}.bind(this),
    		error: function(xhr, status, err) {
    			console.error(this.props.url, status, err.toString());
    		}.bind(this)
    	}); //initializing timer before it renders, avoid fast first second
    },
    handleClick: function(event) { 
        //alert("clicked");
        console.log("Clicked");
    	this.state.secondsElapsed = 0;
        this.state.start = Date.now();
    },
    render: function() {
    	var text = "Reset the timer! Click to reset."
    	var elapsed = Math.round(this.state.secondsElapsed / 100);
        var seconds = (elapsed / 10).toFixed(0);  
        return (
        <div>

            <p onClick = {this.handleClick}> 
        	{text};
            </p>

            <p>The following is a timer: <b>{this.state.timer_length - seconds}</b>
            </p>

        </div>
       );
    }
});
