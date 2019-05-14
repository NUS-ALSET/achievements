/**
 * @file ExternalProfileCard container module
 * @author Theodor Shaytanov <theodor.shaytanov@gmail.com>
 * @created 30.01.18
 */

import CircularProgress from "@material-ui/core/CircularProgress";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import PropTypes from "prop-types";
import React, { Fragment } from "react";
import Typography from "@material-ui/core/Typography";

class ExternalProfileCard extends React.Component {
  static propTypes = {
    addExternalProfileRequest: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
    externalProfile: PropTypes.object.isRequired,
    inProgress: PropTypes.bool,
    isAdmin: PropTypes.bool,
    isOwner: PropTypes.bool,
    refreshAchievementsRequest: PropTypes.func.isRequired,
    removeExternalProfileRequest: PropTypes.func.isRequired,
    userAchievements: PropTypes.object
  };

  render() {
    const {
      addExternalProfileRequest,
      classes,
      externalProfile,
      inProgress,
      isAdmin,
      isOwner,
      refreshAchievementsRequest,
      removeExternalProfileRequest,
      userAchievements
    } = this.props;

    return (
      <Card className={classes.card}>
        <CardContent>
          <Typography className={classes.card} variant="h6">
            {externalProfile.name}
          </Typography>
          {userAchievements ? (
            <Fragment>
              <Typography className={classes.card}>
                Registered as{" "}
                <a
                  href={`${externalProfile.url}/user/${userAchievements.id}`}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {userAchievements.id}
                </a>
                &nbsp;on {externalProfile.url}
              </Typography>
              <Typography className={classes.card}>
                {userAchievements.totalAchievements} completed levels
              </Typography>
            </Fragment>
          ) : (
            <Typography className={classes.card}>
              <a
                href={externalProfile.url}
                rel="noopener noreferrer"
                target="_blank"
              >
                {externalProfile.name}
              </a>
              , {externalProfile.description}
            </Typography>
          )}
        </CardContent>
        {(isOwner || isAdmin) && (
          <CardActions>
            {userAchievements ? (
              <Fragment>
                <Button
                  color="primary"
                  disabled={inProgress}
                  onClick={() => refreshAchievementsRequest(externalProfile)}
                >
                  Fetch levels
                  {inProgress && (
                    <CircularProgress
                      style={{
                        position: "absolute",
                        left: "50%",
                        width: 20,
                        height: 20
                      }}
                    />
                  )}
                </Button>
                <Button
                  color="secondary"
                  onClick={() => removeExternalProfileRequest(externalProfile)}
                >
                  Disconnect
                </Button>
              </Fragment>
            ) : (
              <Button
                color="primary"
                onClick={() => addExternalProfileRequest(externalProfile)}
                variant="contained"
              >
                Add Profile
              </Button>
            )}
          </CardActions>
        )}
      </Card>
    );
  }
}

export default ExternalProfileCard;
