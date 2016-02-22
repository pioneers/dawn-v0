import React from 'react';
import AceEditor from 'react-ace';
import brace from 'brace';
import EditorActionCreators from '../actions/EditorActionCreators';
import EditorStore from '../stores/EditorStore';
import EditorToolbar from './EditorToolbar';
import Mousetrap from 'mousetrap';
import smalltalk from 'smalltalk';
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
import Timer from './Timer'
import FieldStore from '../stores/FieldStore'

export default React.createClass({
  getInitialState() {
    return {
      showConsole: true,
      filepath: null,
      latestSaveCode: '',
      editorCode: '',
      editorTheme: localStorage.getItem('editorTheme') || 'monokai',
      heart: false
    };
  },
  componentDidMount() {
    Mousetrap.prototype.stopCallback = function(e, element, combo) {
      return false; // Always respond to keyboard combos
    };

    Mousetrap.bind(['mod+s'], (e)=>{
      if (e.preventDefault) {
        e.preventDefault();
      }
      this.saveFile();
    });

    // If possible, reopen the last opened file.
    let lastFile = localStorage.getItem('lastFile');
    if (lastFile !== null) {
      EditorActionCreators.readFilepath(lastFile);
    }

    EditorStore.on('change', this.updateEditorData);
    FieldStore.on('change', this.updateFieldData);
  },
  componentWillUnmount() {
    Mousetrap.unbind(['mod+s']);
    EditorStore.removeListener('change', this.updateEditorData);
  },
  updateFieldData() {
    this.setState({
      heart: FieldStore.getHeart()
    });
  }, 
  updateEditorData() {
    this.setState({
      filepath: EditorStore.getFilepath(),
      latestSaveCode: EditorStore.getLatestSaveCode(),
      editorCode: EditorStore.getEditorCode()
    });
  },
  openFile() {
    if (this.hasUnsavedChanges()) {
      smalltalk.alert(
        'You have unsaved changes.',
        'Please save or discard them before opening another file.'
      ).then(()=>console.log('Ok.'), ()=>console.log('Cancel.'));
    } else {
      EditorActionCreators.openFile();
    }
  },
  saveFile() {
    EditorActionCreators.saveFile(this.state.filepath, this.state.editorCode);
  },
  createNewFile() {
    if (this.hasUnsavedChanges()) {
      smalltalk.alert(
        'You have unsaved changes.',
        'Please save or discard them before creating a new file.'
      ).then(()=>console.log('Ok.'), ()=>console.log('Cancel.'));
    } else {
      EditorActionCreators.createNewFile();
    }
  },
  deleteFile() {
    smalltalk.confirm(
      'Warning:',
      'This will delete your file permanently!').then(()=>{
        EditorActionCreators.deleteFile(this.state.filepath);
      }, ()=>console.log('Cancel.'))
  },
  editorUpdate(newVal) {
    EditorActionCreators.editorUpdate(newVal);
  },
  toggleConsole() {
    this.setState({showConsole: !this.state.showConsole});
    // must call resize method after changing height of ace editor
    setTimeout(()=>this.refs.CodeEditor.editor.resize(), 0.1);
  },
  clearConsole() {
    RobotActions.clearConsole();
  },
  startRobot() {
    Ansible.sendMessage('execute', {
      code: this.state.editorCode
    });
  },
  stopRobot() {
    Ansible.sendMessage('stop', {});
  },
  generateButtons() {
    // The buttons which will be in the button toolbar
    return [
      {
        groupId: 'file-operations-buttons',
        buttons: [
          new EditorButton('save', 'Save', this.saveFile, 'floppy-disk', true),
          new EditorButton('open', 'Open', this.openFile, 'folder-open', true),
          new EditorButton('create', 'New', this.createNewFile, 'file', true),
          new EditorButton('delete', 'Delete', this.deleteFile, 'trash', true)
        ],
      }, {
        groupId: 'code-execution-buttons',
        buttons: [
          new EditorButton('run', 'Run', this.startRobot, 'play', (this.props.isRunningCode || !this.props.connectionStatus || true)),
          new EditorButton('stop', 'Stop', this.stopRobot, 'stop', !(this.props.isRunningCode && this.props.connectionStatus) && false),
          new EditorButton('toggle-console', 'Toggle Console', this.toggleConsole, 'console'),
          new EditorButton('clear-console', 'Clear Console', this.clearConsole, 'remove')
        ]
      }
    ];
  },
  pathToName(filepath) {
    if (filepath !== null) {
      return filepath.split('/').pop();
    } else {
      return '[ New File ]';
    }
  },
  hasUnsavedChanges() {
    return (this.state.latestSaveCode !== this.state.editorCode);
  },
  changeTheme(theme) {
    localStorage.setItem('editorTheme', theme);
    this.setState({editorTheme: theme});
  },
  themes: [
    'monokai',
    'github',
    'tomorrow',
    'kuroir',
    'twilight',
    'xcode',
    'textmate',
    'solarized_dark',
    'solarized_light',
    'terminal'
  ],
  render() {
    let consoleHeight = 250;
    let editorHeight = 530;
    return (
      <Panel
        header={'Editing: ' + this.pathToName(this.state.filepath) +
          (this.hasUnsavedChanges() ? '*' : '')}
        bsStyle="primary">
        <EditorToolbar
          buttons={ this.generateButtons() }
          unsavedChanges={ this.hasUnsavedChanges() }
          changeTheme={ this.changeTheme }
          editorTheme={ this.state.editorTheme }
          themes={ this.themes }
        />
        <div style={this.state.heart ? {'color': 'red', 'height': '20px', 'fontSize': 'large'} : {'color': 'red', 'height': '20px', 'fontSize': 'small'}}>&hearts;</div>
        <Timer {...this.props} />
        <ConsoleOutput
          show={this.state.showConsole}
          height={String(consoleHeight) + 'px'}
          output={this.props.consoleData}/>
      </Panel>
    );
  }
});
