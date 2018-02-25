import React from "react";
import AppFrame from "./containers/AppFrame/AppFrame";
import Root from "./containers/Root/Root";
import { Provider } from "react-redux";

import { MuiThemeProvider, createMuiTheme } from "material-ui/styles";

import Reboot from "material-ui/Reboot";

import { configureStore } from "./achievementsApp/store";
import { coursesService } from "./services/courses";
import { historyService } from "./services/history";

const store = configureStore();
const theme = createMuiTheme({
  typography: {
    htmlFontSize: 14
  }
});

coursesService.setStore(store);
historyService.setStore(store);

class App extends React.Component {
  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <Provider store={store}>
          <Root>
            <Reboot />
            <AppFrame />
          </Root>
        </Provider>
      </MuiThemeProvider>
    );
  }
}

export default App;
