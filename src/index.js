import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
// import registerServiceWorker from "./registerServiceWorker";

ReactDOM.render(<App />, document.getElementById("root"));
// registerServiceWorker();

// Dirty workaround to clear cache
if (window.location.href.indexOf("/__/auth/handler") !== -1) {
  window.location.reload(true);
}
