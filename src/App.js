import React from "react";
import { Provider } from "react-redux";
import AppFrame from "./containers/AppFrame/AppFrame";
import Root from "./containers/Root/Root";

import { configureStore } from "./achievementsApp/store";
import { coursesService } from "./services/courses";
import { historyService } from "./services/history";

const store = configureStore();

coursesService.setStore(store);
historyService.setStore(store);

class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <Root>
          <AppFrame />
        </Root>
      </Provider>
    );
  }
}

export default App;
