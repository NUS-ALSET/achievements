import { arrayOf, boolean, func, number, shape, string } from "prop-types";

// A problem could have other fields depending on its type
export const activity = shape({
  description: string,
  id: string,
  name: string,
  orderIndex: number,
  owner: string,
  path: string,
  solved: boolean,
  type: string
});

export const pathActivities = shape({
  path: shape({
    id: string,
    name: string,
    owner: string,
    totalActivities: number
  }),
  activities: arrayOf(activity).isRequired
});

export const breadcrumbAction = shape({
  label: string.isRequired,
  handler: func.isRequired
});

export const breadcrumbPath = shape({
  label: string.isRequired,
  link: string
});
