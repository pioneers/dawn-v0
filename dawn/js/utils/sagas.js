import fs from 'fs';
import { takeEvery } from 'redux-saga';
import { cps, call, put } from 'redux-saga/effects';
import { remote } from 'electron';

const dialog = remote.dialog;

/**
 * The electron showOpenDialog interface does not work well
 * with redux-saga's 'cps' for callbacks. To make things nicer, we
 * wrap the Electron dialog functionality in a promise,
 * which works well with redux-saga's 'call' for promises.
 *
 * @return {Promise} - fulfilled if user selects file, rejected otherwise
 */
function openFileDialog() {
  return new Promise(function(resolve, reject) {
    dialog.showOpenDialog({
      filters: [{ name: 'python', extensions: ['py']}]
    }, (filepaths) => {
      if (filepaths === undefined) {
        reject();
      } else {
        resolve(filepaths[0]);
      }
    });
  });
}

/**
 * Using Promise for Electron save dialog functionality for the same
 * reason as above.
 *
 * @return {Promise} - fulfilled with filepath once user hits save.
 */
function saveFileDialog() {
  return new Promise(function(resolve, reject) {
    dialog.showSaveDialog({
      filters: [{ name: 'python', extensions: ['py']}]
    }, (filepath) => {
      if (filepath === undefined) {
        reject();
      }

      // Automatically append .py extension if they don't have it
      if (!filepath.endsWith('.py')) {
        filepath = filepath + '.py';
      }
      resolve(filepath);
    });
  });
}

function* openFile(action) {
  const filepath = yield call(openFileDialog);
  const data = yield cps(fs.readFile, filepath, 'utf8');
  yield put({
    type: 'OPEN_FILE_SUCCEEDED',
    code: data,
    filepath: filepath
  });
}

function* saveFile(action) {
  console.log('Happening');
  var filepath = action.filepath;
  var code = action.code;
  var callback = action.callback;
  if (filepath === null) {
    filepath = yield call(saveFileDialog);
  }
  yield cps(fs.writeFile, filepath, code);
  yield put({
    type: 'SAVE_FILE_SUCCEEDED',
    code: code,
    filepath: filepath,
    callback: callback
  });
}

export default function* rootSaga() {
  yield [
    takeEvery('OPEN_FILE', openFile),
    takeEvery('SAVE_FILE', saveFile)
  ];
}
