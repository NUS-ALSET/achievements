import { actionsService } from "../services/actions";
import { applyMiddleware, compose, createStore } from "redux";
import { reactReduxFirebase } from "react-redux-firebase";
import { sagaInjector, sagaMiddleware } from "../services/saga";
import firebase from "firebase";
import logger from "redux-logger";
import rootReducer from "./reducer";

const rrfConfig = {
  userProfile: "courseMembers",
  profileParamsToPopulate: ["members:users"]
};

let composeEnhancers = compose;

if (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) {
  composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;
}

export const configureStore = initialState => {
  const middlewares = [sagaMiddleware, logger, actionsService.catchAction];
  const store = compose(reactReduxFirebase(firebase, rrfConfig))(createStore)(
    rootReducer,
    initialState,
    composeEnhancers(applyMiddleware(...middlewares))
  );
  sagaInjector.injections.map(injection => sagaMiddleware.run(injection));

  return store;
};
