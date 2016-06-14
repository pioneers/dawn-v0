import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import dawnApp from './reducers/dawnApp';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

let store = createStore(dawnApp);

ReactDOM.render(
  <Provider store={store}>
    <App/>
  </Provider>,
  document.getElementById('content')
);
