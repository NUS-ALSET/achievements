import React from "react";
import { createHashHistory } from "history";

import AppFrame from "./containers/AppFrame/AppFrame";
import Root from "./containers/Root/Root";
import { Provider } from "react-redux";

import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";

import CssBaseline from "@material-ui/core/CssBaseline";

import { configureStore } from "./achievementsApp/store";
import { coursesService } from "./services/courses";
import { historyService } from "./services/history";

const history = createHashHistory();
const store = configureStore(undefined, history);
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
        <CssBaseline />
        <Provider store={store}>
          <Root>
            <AppFrame history={history}/>
          </Root>
        </Provider>
      </MuiThemeProvider>
    );
  }
}

export default App;
