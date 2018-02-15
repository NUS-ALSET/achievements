import { createBrowserHistory } from "history";
import { routeChange } from "../containers/Root/actions";

export const history = createBrowserHistory();

export class HistoryService {
  setStore(store) {
    this.store = store;
    history.listen((location, method) =>
      this.store.dispatch(routeChange(location.pathname, method))
    );
  }
}

export const historyService = new HistoryService();
