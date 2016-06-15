import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import dawnApp from './reducers/dawnApp';
import { Provider } from 'react-redux';
import { compose, createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import rootSaga from './utils/sagas';
import DevTools from './components/DevTools';

const sagaMiddleware = createSagaMiddleware();

let store = createStore(
  dawnApp,
  compose(
    applyMiddleware(sagaMiddleware),
    DevTools.instrument()
  )
);

sagaMiddleware.run(rootSaga);

ReactDOM.render(
  <Provider store={store}>
    <div>
      <App/>
      <DevTools/>
    </div>
  </Provider>,
  document.getElementById('content')
);
