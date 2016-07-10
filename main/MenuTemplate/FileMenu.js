/**
 * Defines the File menu
 */

import RendererBridge from '../RendererBridge';
import {
  openFile,
  saveFile,
  createNewFile,
} from '../../renderer/actions/EditorActions';

const FileMenu = {
  label: 'File',
  submenu: [
    {
      label: 'New File',
      click() {
        RendererBridge.reduxDispatch(createNewFile());
      },
    },
    {
      label: 'Open file',
      click() {
        RendererBridge.reduxDispatch(openFile());
      },
    },
    {
      label: 'Save file',
      click() {
        const filepath = RendererBridge.reduxState.editor.filepath;
        const code = RendererBridge.reduxState.editor.editorCode;
        RendererBridge.reduxDispatch(saveFile(filepath, code));
      },
    },
    {
      label: 'Save file as',
      click() {
        RendererBridge.reduxDispatch(saveFile(null, RendererBridge.reduxState.editor.editorCode));
      },
    },
  ],
};

export default FileMenu;
