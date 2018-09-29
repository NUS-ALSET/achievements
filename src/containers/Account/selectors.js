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

export const getProfileData = state =>
  Object.keys(state.firebase.data.profileData || {})
    .map(profileKey => {
      const profileType = state.firebase.data.profileData[profileKey];

      return {
        id: profileKey,
        weight: profileType.weight,
        title: profileType.title,
        options: Object.keys(profileType.options || {})
          .map(optionKey => ({
            name: optionKey,
            id: profileType.options[optionKey]
          }))
          .sort((a, b) => (a.id > b.id ? 1 : -1))
      };
    })
    .sort((a, b) => (a.weight > b.weight ? 1 : -1));
