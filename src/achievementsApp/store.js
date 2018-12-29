import { actionsService } from "../services/actions";
import { applyMiddleware, compose, createStore } from "redux";
import thunk from "redux-thunk";
import { reactReduxFirebase } from "react-redux-firebase";
import { connectRouter, routerMiddleware } from "connected-react-router";
import { sagaInjector, sagaMiddleware } from "../services/saga";
import logger from "redux-logger";
import rootReducer from "./reducer";
import firebaseConfig from "./config";


// react-redux-firebase config
const rrfConfig = {
  userProfile: "courseMembers",
  profileParamsToPopulate: ["members:users"]
};

let composeEnhancers = compose;

if (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) {
  composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;
}
// Add reactReduxFirebase enhancer when making store creator
const createStoreWithFirebase = compose(
  reactReduxFirebase(firebaseConfig, rrfConfig)
)(createStore);

export const configureStore = (initialState, history) => {
  const middlewares = [
    thunk,
    sagaMiddleware,
    logger,
    routerMiddleware(history),
    actionsService.catchAction
  ];
  const store = createStoreWithFirebase(
    connectRouter(history)(rootReducer),
    initialState,
    composeEnhancers(applyMiddleware(...middlewares))
  );
  sagaInjector.injections.map(injection => sagaMiddleware.run(injection));

  return store;
};
