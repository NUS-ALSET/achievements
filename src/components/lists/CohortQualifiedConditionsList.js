import React, { Fragment } from "react";
import { withStyles } from "@material-ui/core/styles";
import ListSubheader from "@material-ui/core/ListSubheader";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ExploreIcon from "@material-ui/icons/Explore";
import Typography from "@material-ui/core/Typography";

const styles = theme => ({
  nested: {
    paddingLeft: theme.spacing.unit * 12
  }
});

const CohortQualifiedConditionsList = ({
  qualifiedConditions = {},
  pathsData = [],
  classes,
  cohortMemberQualificationStatus = {},
  uid,
  showAllUserStatus
}) => {
  const totalMembers = Object.keys(cohortMemberQualificationStatus).length;
  const qualifiedMembers = Object.keys(cohortMemberQualificationStatus).reduce(
    (count, id) => (cohortMemberQualificationStatus[id] ? count + 1 : count),
    0
  );
  const isCurrentUserQualified = cohortMemberQualificationStatus[uid];
  
  return (
    <Fragment>
      <div style={{ height: "20px" }} />
      <Typography>
        {`${qualifiedMembers} members qualifed out of ${totalMembers}`}
      </Typography>
      {!showAllUserStatus && (
        <Typography>
          {isCurrentUserQualified
            ? "You are qualified."
            : "You are not qualified"}
        </Typography>
      )}
      {showAllUserStatus && (
        <Fragment>
          <Typography>Users Qualification Status:</Typography>
          {Object.keys(cohortMemberQualificationStatus).map(id => (
            <Typography
              key={id}
              className={classes.nested}
              style={{
                color: cohortMemberQualificationStatus[id] ? "blue" : "red"
              }}
            >
             <span style={{ width: "200px"}}> {id} </span>: {String(cohortMemberQualificationStatus[id])}
            </Typography>
          ))}
        </Fragment>
      )}

      <List
        component="nav"
        subheader={
          <ListSubheader component="ul">
            {"Conditions to qualify this cohort"}
          </ListSubheader>
        }
        dense
        className={classes.root}
      >
        {Object.keys(qualifiedConditions).length === 0 && (
          <ListItem>
            <ListItemText primary={"No condition added yet!"} />
          </ListItem>
        )}
        {Object.keys(qualifiedConditions).map(pathId => {
          const name = (pathsData.find(path => path.id === pathId) || {}).name;
          const pathCondition = qualifiedConditions[pathId];
          console.log(pathCondition)
          const activitiesToComplete = pathCondition.activitiesToComplete || {};
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
                  {Number(pathCondition.allActivities) > 0 && (
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
                {!Boolean(pathCondition.allActivities) &&
                  Object.keys(activitiesToComplete).length > 0 && (
                    <ListItem className={classes.nested}>
                      <ListItemText
                        primary={`Complete following activities from this path`}
                      />
                    </ListItem>
                  )}
                {!Boolean(pathCondition.allActivities) &&
                  Object.keys(activitiesToComplete).map(activityId => {
                    const activity = activitiesToComplete[activityId];
                    return (
                      <ListItem key={activityId} className={classes.nested}>
                        <ListItemText inset primary={activity.name} />
                      </ListItem>
                    );
                  })}
              </List>
            </Fragment>
          );
        })}
      </List>
    </Fragment>
  );
};

export default withStyles(styles)(CohortQualifiedConditionsList);
