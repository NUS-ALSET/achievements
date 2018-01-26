import React from "react";
import { Provider } from "react-redux";
import AppFrame from "./containers/AppFrame/AppFrame";
import AuthCheck from "./containers/AuthCheck/AuthCheck";

import { configureStore } from "./achievementsApp/store";
import { coursesService } from "./services/courses";

const store = configureStore();

coursesService.setStore(store);

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

export default App;
