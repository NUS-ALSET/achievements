import { applyMiddleware, compose, createStore } from "redux";
import logger from "redux-logger";
import rootReducer from "./reducer";
import firebase from "firebase";
import { reactReduxFirebase } from "react-redux-firebase";
import { sagaMiddleware, sagaInjector } from "../services/saga";
import { actionsService } from "../services/actions";

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
