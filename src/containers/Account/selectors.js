/**
 * Selectors for Account container
 */

/**
 *
 * @param {AchievementsAppState} state
 * @param {*} ownProps
 * @returns {*}
 */
export const getDisplayName = (state, ownProps) =>
  state.firebase.auth.uid &&
  state.firebase.data &&
  state.firebase.data.users &&
  state.firebase.data.users[
    ownProps.match.params.accountId || state.firebase.auth.uid
  ] &&
  state.firebase.data.users[
    ownProps.match.params.accountId || state.firebase.auth.uid
  ].displayName;
