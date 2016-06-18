/**
 * Entrypoint for main process of Electron application.
 */

'use strict';
import { app, BrowserWindow, Menu, ipcMain } from 'electron';
import storage from 'electron-json-storage';
import {
  openFile,
  saveFile,
  deleteFile,
  createNewFile,
  editorUpdate,
  changeTheme,
  increaseFontsize,
  decreaseFontsize
} from '../renderer/actions/EditorActions';

// reduxState is synchronized with the frontend redux state.
let reduxState;
ipcMain.on('stateUpdate', (event, state) => {
  reduxState = state;
});

// Dispatch redux actions to the frontend.
const reduxDispatch = (action) => {
  mainWindow.webContents.send('dispatch', action);
};

let template = [
  {
    label: 'Dawn',
    submenu: [
      {
        label: 'Reset user settings',
        click: function() {
          storage.clear();
        }
      },
      {
        label: 'Quit',
        accelerator: 'CommandOrControl+Q',
        click: function() { app.quit(); }
      }
    ]
  },
  {
    label: 'File',
    submenu: [
      {
        label: 'New File',
        click: () => reduxDispatch(createNewFile())
      },
      {
        label: 'Open file',
        click: () => reduxDispatch(openFile())
      },
      {
        label: 'Save file',
        click: () => {
          let filepath = reduxState.editor.filepath;
          let code = reduxState.editor.editorCode;
          reduxDispatch(saveFile(filepath, code));
        }
      },
      {
        label: 'Save file as',
        click: () => reduxDispatch(saveFile(null, reduxState.editor.editorCode))
      }
    ]
  },
  {
    label: 'Edit',
    submenu: [
      {
        label: 'Cut',
        accelerator: 'CommandOrControl+X',
        role: 'cut'
      },
      {
        label: 'Copy',
        accelerator: 'CommandOrControl+C',
        role: 'copy'
      },
      {
        label: 'Paste',
        accelerator: 'CommandOrControl+V',
        role: 'paste'
      }
    ]
  },
  {
    label: 'Debug',
    submenu: [
      {
        label: 'Simulate Competition',
        click: function() {
          mainWindow.webContents.send('simulate-competition');
        }
      }
    ]
  },
  {
    label: 'Config',
    submenu: [
      {
        label: 'Runtime Config',
        click: function() {
          mainWindow.webContents.send('show-runtime-config');
        }
      }
    ]
  },
  {
    label: 'Help',
    submenu: [
      {
        label: 'Interactive Tutorial',
        click: function() {
          mainWindow.webContents.send('start-interactive-tour');
        }
      }
    ]
  }
];

let mainWindow;
app.on('window-all-closed', function() {
  app.quit();
});

app.on('ready', function() {

  mainWindow = new BrowserWindow();
  mainWindow.maximize();

  mainWindow.loadURL(`file://${__dirname}/static/index.html`);

  mainWindow.on('closed', function() {
    mainWindow = null;
  });

  // Add open devtools option to main menu.
  template[3].submenu.unshift({
    label: 'Toggle DevTools',
    click: function() {
      mainWindow.webContents.toggleDevTools();
    }
  });

  // In development mode, allow quick reloading to see effects of code changes.
  if (process.env.NODE_ENV === 'development') {
    template[3].submenu.unshift({
      label: 'Reload',
      accelerator: 'CommandOrControl+R',
      click: function() {
        mainWindow.reload();
      }
    });
  }

  let menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
});
