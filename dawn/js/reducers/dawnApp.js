/**
 * Combining all the reducers into one and exporting it.
 */

import { combineReducers } from 'redux';

import asyncAlerts from './alerts';


const dawnApp = combineReducers({
  asyncAlerts: asyncAlerts
});

export default dawnApp;
