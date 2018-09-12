import React from "react";
import { createHashHistory } from "history";

import AppFrame from "./containers/AppFrame/AppFrame";
import Root from "./containers/Root/Root";
import { Provider } from "react-redux";

import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";

// MUI's CssBaseline applies the normalization of CSS styles across browsers
import CssBaseline from "@material-ui/core/CssBaseline";

import { configureStore } from "./achievementsApp/store";
import { coursesService } from "./services/courses";
import { pathsService } from "./services/paths";
import { historyService } from "./services/history";
import { firebaseService } from "./services/firebaseService";

const history = createHashHistory();
const store = configureStore(undefined, history);
const theme = createMuiTheme({
  palette: {
    primary: {
      // deepblue
      main: "#1a237e"
    },
    secondary: {
      // red
      main: "#c62828"
    }
  },
  typography: {
    htmlFontSize: 14
  }
});

coursesService.setStore(store);
historyService.setStore(store);
pathsService.setStore(store);
firebaseService.setStore(store);

class App extends React.Component {
  // MuiThemeProvider makes the theme available down the React tree
  // thanks to React context.
  render() {
    return (
      <MuiThemeProvider theme={theme}>
        {/* CssBaseline normalize a consistent CSS baseline across browsers. */}
        <CssBaseline />
        <Provider store={store}>
          <Root>
            <AppFrame history={history} />
          </Root>
        </Provider>
      </MuiThemeProvider>
    );
  }
}

export default App;
