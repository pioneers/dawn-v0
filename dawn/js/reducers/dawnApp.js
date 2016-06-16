/**
 * Combining all the reducers into one and exporting it.
 */

import { combineReducers } from 'redux';

import asyncAlerts from './alerts';
import editor from './editor';
import studentConsole from './studentConsole';

const dawnApp = combineReducers({
  asyncAlerts: asyncAlerts,
  editor: editor,
  studentConsole: studentConsole
});

export default dawnApp;
