import createSagaMiddleware from "redux-saga";

export const sagaInjector = {
  injections: [],
  inject(saga) {
    if (!Array.isArray(saga)) {
      saga = [saga];
    }

    sagaInjector.injections.push(...saga);
  }
};

export const sagaMiddleware = createSagaMiddleware();
