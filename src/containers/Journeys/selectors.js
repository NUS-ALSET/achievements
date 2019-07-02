import { createSelector } from "reselect";

const getJourneys = state => state.firebase.data.journeys;

const getChanges = state => state.journeys.changes;

export const selectJourneys = createSelector(
  getJourneys,
  getChanges,
  (journeys, changes) =>
    Object.assign(
      {},
      ...Object.keys(journeys || {}).map(id => ({
        [id]: {
          ...journeys[id],
          ...(changes[id] || {})
        }
      }))
    )
);
