import React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";

import AppFrame from "./containers/AppFrame/AppFrame";
import AuthCheck from "./containers/AuthCheck/AuthCheck";

import { configureStore } from "./achievementsApp/store";

const store = configureStore();

class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <AuthCheck>
          <AppFrame />
        </AuthCheck>
      </Provider>
    );
  }
}

render(<App />, document.getElementById("root"));
