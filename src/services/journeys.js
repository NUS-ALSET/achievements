import firebase from "firebase/app";

export class JourneysService {
  async getActivities(journeyId) {
    const snap = await firebase
      .database()
      .ref(`/journeyActivities/${journeyId}`)
      .once("value");
    return (await snap.val()) || {};
  }

  validateJourney(journeyInfo) {
    // In case of existence id of journey then we should update journey.
    // Update could contain only partial fields on existing journey
    if (journeyInfo.id) {
      if (journeyInfo.name === "") {
        throw new Error("Missing journey name");
      }
    } else {
      // Otherwise, we suppose creation new journey
      if (!journeyInfo.name) {
        throw Error("Missing journey name");
      }
    }
  }

  /**
   * This method creates a new journey if journeyInfo has no `id` field and
   * updates existing one in another case
   *
   * @param {String} uid user id of journey creator
   * @param {Object} journeyInfo
   * @param {String} [journeyInfo.id]
   * @param {String} journeyInfo.name
   * @param {String} journeyInfo.description
   * @param {Array} journeyInfo.activities
   *
   * @returns {String} id of affected journey
   */
  async setJourney(uid, journeyInfo) {
    this.validateJourney(journeyInfo);
    if (journeyInfo.id) {
      await firebase
        .database()
        .ref(`/journeys/${journeyInfo.id}`)
        .update(journeyInfo);
      if (journeyInfo.activities && journeyInfo.activities.length) {
        await firebase
          .database()
          .ref(`/journeyActivities/${journeyInfo.id}`)
          .update(
            Object.assign(
              {},
              ...journeyInfo.activities.map((activity, index) => ({
                [activity.id]: index + 1
              }))
            )
          );
      }
      return journeyInfo.id;
    }
    const key = firebase
      .database()
      .ref("/journeys")
      .push().key;

    await firebase
      .database()
      .ref(`/journeys/${key}`)
      .set({
        name: journeyInfo.name,
        description: journeyInfo.description || "",
        owner: uid,
        id: key
      });
    return key;
  }

  /**
   * Add activities to journey
   *
   * @param {String} journeyId
   * @param {Array<String>} activities
   * @param {Array<String>} existing
   */
  async addActivities(journeyId, activities, existing) {
    const ids = Object.assign(
      {},
      ...activities
        .filter(id => !existing.includes(id))
        .map((id, index) => ({
          [id]: index + 1
        }))
    );

    return this.fetchJourneyActivities(journeyId, ids);
  }

  /**
   * Remove activity from journey. It will reorder all affected activities
   *
   * @param {String} journeyId
   * @param {String} activityId
   */
  async deleteActivity(journeyId, activityId) {
    const existing = (await this.getActivities(journeyId)) || {};
    let activitiesOrderChange;

    // If there's no existing activity with required id at journey then exit
    const orderIndex = existing[activityId];
    if (!orderIndex) {
      return;
    }

    // Otherwise, we need update all existing activities and decrease their
    // order index
    for (const [existingId, index] of Object.entries(existing)) {
      if (index > orderIndex) {
        activitiesOrderChange = activitiesOrderChange || {};
        activitiesOrderChange[existingId] = index - 1;
      }
    }

    return Promise.all([
      firebase
        .database()
        .ref(`/journeyActivities/${journeyId}/${activityId}`)
        .remove(),
      activitiesOrderChange &&
        firebase
          .database()
          .ref(`/journeyActivities/${journeyId}`)
          .update(activitiesOrderChange)
    ]);
  }

  /**
   * Reorder activity position at journey
   *
   * @param {String} journeyId
   * @param {String} activityId
   * @param {"up"|"down"} direction
   */
  async moveActivity(journeyId, activityId, direction) {
    const existing = await this.getActivities(journeyId);
    let changes;
    const targetIndex = existing[activityId];
    if (!targetIndex) {
      return;
    }
    const orders = Object.assign(
      {},
      ...Object.keys(existing).map(key => ({ [existing[key]]: key }))
    );
    switch (direction) {
      case "up":
        if (orders[targetIndex - 1]) {
          changes = {
            [orders[targetIndex - 1]]: targetIndex,
            [activityId]: targetIndex - 1
          };
        }
        break;
      case "down":
        if (orders[targetIndex + 1]) {
          changes = {
            [orders[targetIndex + 1]]: targetIndex,
            [activityId]: targetIndex + 1
          };
        }
        break;
      default:
    }
    return Object.assign(orders, changes);
  }

  /**
   * Returns activities data with path data for journeys
   *
   * @param {String} journeyId
   * @param {Array<String>} [ids] optional parameter. Ignores journey id if
   *  providen
   */
  async fetchJourneyActivities(journeyId, ids) {
    const snap =
      !ids &&
      (await firebase
        .database()
        .ref(`/journeyActivities/${journeyId}`)
        .once("value"));
    const journeyActivities = ids || (await snap.val()) || {};
    const pathsMap = {};
    const activities = await Promise.all(
      Object.keys(journeyActivities)
        .sort((a, b) => (journeyActivities[a] > journeyActivities[b] ? 1 : -1))
        .map(async activityId => {
          const snapshot = await firebase
            .database()
            .ref(`/activities/${activityId}`)
            .once("value");
          return { id: activityId, ...((await snapshot.val()) || {}) };
        })
    );

    for (const activity of activities) {
      pathsMap[activity.path] = true;
    }

    await Promise.all(
      Object.keys(pathsMap).map(async id => {
        const snapshot = await firebase
          .database()
          .ref(`/paths/${id}`)
          .once("value");
        pathsMap[id] = await snapshot.val();
        return pathsMap[id];
      })
    );
    return activities.map(activity => ({
      id: activity.id,
      name: activity.name || "",
      description: activity.description || "",
      pathId: activity.path || "",
      pathName: pathsMap[activity.path].name || ""
    }));
  }
}

export const journeysService = new JourneysService();
