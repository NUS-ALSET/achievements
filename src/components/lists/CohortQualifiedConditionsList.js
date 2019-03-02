import React, { Fragment } from "react";
import { withStyles } from "@material-ui/core/styles";
import ListSubheader from "@material-ui/core/ListSubheader";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ExploreIcon from "@material-ui/icons/Explore";


const styles = theme => ({
  nested: {
    paddingLeft: theme.spacing.unit * 12
  },
});

const CohortQualifiedConditionsList = ({ qualifiedConditions, pathsData, classes }) => {
  return (
      <List
        component="nav"
        subheader={
          <ListSubheader component="ul">{"Complete these conditions of following path to qualify this cohort"}</ListSubheader>
        }
        dense
        className={classes.root}
      >
        {Object.keys(qualifiedConditions).map(pathId => {
          const name = (pathsData.find(path=>path.id===pathId) || {}).name;
          const pathCondition = qualifiedConditions[pathId];
          const activitiesToComplete = (pathCondition.activitiesToComplete || {});
          return (
            <Fragment key={pathId}>
              <ListItem>
                <ListItemIcon>
                  <ExploreIcon />
                </ListItemIcon>
                <ListItemText primary={name} />
              </ListItem>
              <List component="ul" dense>
                <Fragment>
                  {Boolean(pathCondition.allActivities) > 0 && (
                    <ListItem className={classes.nested}>
                      <ListItemText
                        primary={`Complete all activities from this path`}
                      />
                    </ListItem>
                  )}
                  {!Boolean(pathCondition.allActivities) &&
                    Number(pathCondition.numOfCompletedActivities) > 0 && (
                      <ListItem className={classes.nested}>
                        <ListItemText
                          primary={`Atleast complete ${
                            pathCondition.numOfCompletedActivities
                          } activities`}
                        />
                      </ListItem>
                    )}
                </Fragment>
                {!Boolean(pathCondition.allActivities) && Object.keys(activitiesToComplete).length>0 && (
                  <ListItem className={classes.nested}>
                    <ListItemText
                      primary={`Complete following activities from this path`}
                    />
                  </ListItem>
                )}
                {!Boolean(pathCondition.allActivities) &&
                  Object.keys(activitiesToComplete).map(
                    activityId => {
                      const activity =
                        activitiesToComplete[activityId];
                      return (
                        <ListItem
                          key={activityId}
                          className={classes.nested}
                        >
                          <ListItemText
                            inset
                            primary={activity.name}
                          />
                        </ListItem>
                      );
                    }
                  )}
              </List>
            </Fragment>
          );
        })}
      </List>
  );
};

export default withStyles(styles)(CohortQualifiedConditionsList);
