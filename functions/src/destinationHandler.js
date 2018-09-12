const admin = require("firebase-admin");

exports.addDestination = (title, ownerId, sourceKey, hasPathSource = false) => {

  const destinationKey = admin
    .database()
    .ref('destinations')
    .push()
    .key;

  return Promise.all[
    admin
      .database()
      .ref(`destinations/${destinationKey}`)
      .set({
        title,
        sourceKey,
        sourceType: hasPathSource ? 'path' : 'activity',
        originator: ownerId,
        updatedOn: Date.now()
      }),
    admin
      .database()
      .ref(`${hasPathSource ? 'paths' : 'activities'}/${sourceKey}/defaultDestinationKey`)
      .set(destinationKey)
  ]
};


exports.updateDestinationSkills = (activityId, { skills = {} }) => {
  let activity = {};
  let path = {};
  return skills ? admin
    .database()
    .ref(`activities/${activityId}`)
    .once('value')
    .then(snapshot => snapshot.val())
    .then(value => { activity = value })
    .then(() => admin
      .database()
      .ref(`paths/${activity.path}`)
      .once('value')
    )
    .then(snapshot => snapshot.val())
    .then(value => { path = value })
    .then(() => admin
      .database()
      .ref(`destinations/${path.defaultDestinationKey}`)
      .once('value')
    )
    .then(snapshot => snapshot.val())
    .then(pathDestination => {
      const pathSkills = pathDestination.skills || {};
      const updateActivityDestination = admin
        .database()
        .ref(`destinations/${activity.defaultDestinationKey}`)
        .update({
          title: activity.name,
          skills,
          updatedOn: Date.now()
        })
      if (pathDestination) {
        Object.keys(skills).forEach(feature => {
          pathSkills[feature] = Object.assign((pathSkills[feature] || {}), skills[feature]);
        })
        return Promise.all([
          updateActivityDestination,
          admin
            .database()
            .ref(`destinations/${path.defaultDestinationKey}`)
            .update({
              title: path.name,
              skills: pathSkills,
              updatedOn: Date.now()
            })
        ])
      }
      return updateActivityDestination;
    })
    : Promise.resolve()
}