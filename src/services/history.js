import { createBrowserHistory } from "history";
import { routeChange } from "../containers/Root/actions";
import GoogleAnalytics from "react-ga";

// temp ky's GA ID for testing
GoogleAnalytics.initialize("UA-48967212-1");

export const history = createBrowserHistory();

const trackPage = page => {
  GoogleAnalytics.set({
    page
  });
  GoogleAnalytics.pageview(page);
};

export class HistoryService {
  setStore(store) {
    this.store = store;
    let pathname;
    history.listen((location, method) => {
      if (pathname !== location.pathname) {
        trackPage(location.pathname);
        pathname = location.pathname;
      }
      this.store.dispatch(routeChange(location.pathname, method));
    });
  }
}

export const historyService = new HistoryService();
