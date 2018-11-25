import React from "react";
import ReactDOM from "react-dom";
import Main from "./container/Main";

if (module.hot) {
  module.hot.accept('./container/Main', () => {
    ReactDOM.render(<Main />, document.getElementById("root"));
  });
}

ReactDOM.render(<Main />, document.getElementById("root"));
