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

class ExternalProfileCard extends React.PureComponent {
  static propTypes = {
    userAchievements: PropTypes.object,
    externalProfile: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
    addExternalProfileRequest: PropTypes.func.isRequired,
    refreshAchievementsRequest: PropTypes.func.isRequired,
    removeExternalProfileRequest: PropTypes.func.isRequired,
    inProgress: PropTypes.bool
  };

  render() {
    const {
      classes,
      inProgress,
      userAchievements,
      externalProfile,
      addExternalProfileRequest,
      refreshAchievementsRequest,
      removeExternalProfileRequest
    } = this.props;

    return (
      <Card className={classes.card}>
        <CardContent>
          <Typography className={classes.card} variant="title">
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
              </Typography>
              <Typography className={classes.card}>
                {userAchievements.totalAchievements} achievements
              </Typography>
            </Fragment>
          ) : (
            <Typography className={classes.card}>
              <a href={externalProfile.url}>{externalProfile.name}</a>,{" "}
              {externalProfile.description}
            </Typography>
          )}
        </CardContent>
        <CardActions>
          {userAchievements ? (
            <Fragment>
              <Button
                color="primary"
                disabled={inProgress}
                onClick={() => refreshAchievementsRequest(externalProfile)}
              >
                Refresh achievements
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
                Remove
              </Button>
            </Fragment>
          ) : (
            <Button
              color="primary"
              onClick={() => addExternalProfileRequest(externalProfile)}
              variant="raised"
            >
              Add Profile
            </Button>
          )}
        </CardActions>
      </Card>
    );
  }
}

export default ExternalProfileCard;
