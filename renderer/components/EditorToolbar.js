import React from 'react';
import {
  DropdownButton,
  MenuItem,
  ButtonGroup,
  ButtonToolbar,
} from 'react-bootstrap';
import _ from 'lodash';

class EditorToolbar extends React.Component {
  renderToolbar() {
    return (
      _.map(this.props.buttons, (group, groupIndex) => (
        <ButtonGroup key={String(groupIndex)} id={group.groupId}>
          {_.map(group.buttons, (button, buttonIndex) => (
            button.render(String(groupIndex) + String(buttonIndex))
          ))}
        </ButtonGroup>
      ))
    );
  }

  render() {
    return (
      <div>
        <ButtonToolbar id="editor-toolbar">
          {this.renderToolbar()}
          <DropdownButton
            title="Theme"
            bsSize="small"
            id="choose-theme"
          >
            {_.map(this.props.themes, (theme, index) => (
              <MenuItem
                active={theme === this.props.editorTheme}
                onClick={_.partial(this.props.changeTheme, theme)}
                key={index}
              >
                {theme}
              </MenuItem>
            ))}
          </DropdownButton>
        </ButtonToolbar>
      </div>
    );
  }
}

EditorToolbar.propTypes = {
  buttons: React.PropTypes.array.isRequired,
  unsavedChanges: React.PropTypes.bool.isRequired,
  editorTheme: React.PropTypes.string,
  changeTheme: React.PropTypes.func,
  runtimeStatus: React.PropTypes.bool,
  themes: React.PropTypes.array,
};

export default EditorToolbar;
