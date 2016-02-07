import React from 'react';
import InlineEdit from 'react-edit-inline';
import Ansible from '../../utils/Ansible';
import smalltalk from 'smalltalk';

var NameEdit = React.createClass({
  propTypes: {
    name: React.PropTypes.string,
    id: React.PropTypes.string
  },
  dataChange(data) {
    var valid_name = true;
    for (var checker = 0; checker < data.name.length; checker++){
      if (data.name.charAt(checker) === " " || data.name.charAt(checker) === "\\"){
        valid_name = false;
        smalltalk.alert(
        'Names cannot contain spaces or backslashes.',
        'Please choose another name.'
      )
      } 
    }
    if (valid_name){
      Ansible.sendMessage('custom_names', {
      id: this.props.id,
      name: data.name
    });
    }
  },
  render() {
    return (
      <div>
        <InlineEdit
          activeClassName="editing"
          text={this.props.name}
          change={this.dataChange}
          paramName="name"
          style = {{
            backgroundColor: 'white',
            minWidth: 150,
            display: 'inline-block',
            margin: 0,
            padding: 0,
            fontSize:15,
            outline: 0,
            border: 0
          }}
        />
      </div>
    );
  }
});

export default NameEdit;
