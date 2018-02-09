import axios from "axios";
import throttle from "lodash/throttle";

const THROTTLE_WAIT = 1000;

export class CodeCombatService {
  // noinspection JSMethodCanBeStatic
  /**
   *
   * @param {String} user
   * @returns {String}
   */
  sliggify(user) {
    return user.toLowerCase().replace(/ /g, "-");
  }
  checkUser = throttle(user => {
    if (!user) {
      return Promise.resolve(false);
    }
    return axios
      .get(
        `https://codecombat.com/db/user/${this.sliggify(
          user
        )}/level.sessions?project=state.complete,created`
      )
      .then(() => true)
      .catch(err => err.message);
  }, THROTTLE_WAIT);
}

export const codeCombatService = new CodeCombatService();
