/**
 * Combining all the reducers into one and exporting it.
 */

import { combineReducers } from 'redux';

import asyncAlerts from './alerts';
import editor from './editor';

const dawnApp = combineReducers({
  asyncAlerts: asyncAlerts,
  editor: editor
});

export default dawnApp;
