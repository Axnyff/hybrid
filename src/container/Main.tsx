import React from 'react';
import { createStore, compose, applyMiddleware, AnyAction } from 'redux';

import { createEpicMiddleware } from 'redux-observable';
import { Provider } from 'react-redux';
import Game from './Game';
import { reducer, State } from 'store/';
import rootEpic from 'store/epics';

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: any;
  }
}

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const epicMiddleWare = createEpicMiddleware<AnyAction, AnyAction, State>();

const store = createStore(
  reducer, composeEnhancers(
    applyMiddleware(epicMiddleWare)
  ));

epicMiddleWare.run(rootEpic);

const Main = () => {
  return (
    <Provider store={store}>
      <Game />
    </Provider>
  );
};

export default Main;
