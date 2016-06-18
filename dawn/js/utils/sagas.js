/**
 * Redux sagas are how we handle complicated asynchronous stuff with redux.
 * See http://yelouafi.github.io/redux-saga/index.html for docs.
 * Sagas use ES6 generator functions, which have the '*' in their declaration.
 */

import fs from 'fs';
import { takeEvery, delay } from 'redux-saga';
import { cps, call, put, fork, take, race } from 'redux-saga/effects';
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

/**
 * This saga acts as a "heartbeat" to check whether we are still receiving
 * updates from Runtime.
 *
 * NOTE that this is different from whether or not the Ansible connection
 * is still alive.
 */
function* runtimeHeartbeat() {
  while (true) {
    // Start a race between a delay and receiving an UPDATE_STATUS action from
    // runtime. Only the winner will have a value.
    const { update, timeout } = yield race({
      update: take('UPDATE_STATUS'),
      timeout: call(delay, 1000) // The delay is 1000 ms, or 1 second.
    });

    // If update wins, we assume we are connected, otherwise disconnected.
    if (update) {
      yield put({ type: 'RUNTIME_CONNECT' });
    } else {
      yield put({ type: 'RUNTIME_DISCONNECT' });
    }
  }
}

/**
 * This saga removes peripherals that have not been updated by Runtime
 * recently (they are assumed to be disconnected).
 */
function* reapPeripheral(action) {
  let id = action.peripheral.id;
  // Start a race between a delay and receiving an UPDATE_PERIPHERAL action for
  // this same peripheral (per peripheral.id). Only the winner has a value.
  const { peripheralUpdate, timeout } = yield race({
    peripheralUpdate: take((action) => {
      return action.type === 'UPDATE_PERIPHERAL' && action.peripheral.id === id;
    }),
    timeout: call(delay, 3000) // The delay is 3000 ms, or 3 seconds.
  });

  // If the delay won, then we have not received an update for this peripheral
  // recently and remove it from our state.
  if (timeout) {
    yield put({ type: 'PERIPHERAL_DISCONNECT', peripheralId: id });
  }
}

/**
 * The root saga combines all the other sagas together into one.
 */
export default function* rootSaga() {
  yield [
    takeEvery('OPEN_FILE', openFile),
    takeEvery('SAVE_FILE', saveFile),
    takeEvery('UPDATE_PERIPHERAL', reapPeripheral),
    fork(runtimeHeartbeat)
  ];
}
