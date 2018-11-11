import React from "react";
import { AnyAction, applyMiddleware, compose, createStore } from "redux";

import { Provider } from "react-redux";
import { createEpicMiddleware } from "redux-observable";
import { reducer, State } from "store/";
import rootEpic from "store/epics/";
import Game from "./Game";

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: any;
  }
}

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const epicMiddleWare = createEpicMiddleware<AnyAction, AnyAction, State>();

const store = createStore(
  reducer,
  composeEnhancers(applyMiddleware(epicMiddleWare))
);

epicMiddleWare.run(rootEpic);

const Main = () => {
  return (
    <Provider store={store}>
      <Game />
    </Provider>
  );
};

export default Main;
