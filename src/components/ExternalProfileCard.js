/**
 * @file ExternalProfileCard container module
 * @author Theodor Shaytanov <theodor.shaytanov@gmail.com>
 * @created 30.01.18
 */

import React, { Fragment } from "react";
import PropTypes from "prop-types";
import Card, { CardContent, CardActions } from "material-ui/Card";
import Typography from "material-ui/Typography";
import Button from "material-ui/Button";
import { CircularProgress } from "material-ui/Progress";

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
          <Typography className={classes.card} type="title">
            {externalProfile.name}
          </Typography>
          {userAchievements ? (
            <Fragment>
              <Typography className={classes.card}>
                Registered as{" "}
                <a
                  rel="noopener noreferrer"
                  target="_blank"
                  href={`${externalProfile.url}/user/${userAchievements.id}`}
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
                onClick={() => refreshAchievementsRequest(externalProfile)}
                color="primary"
                disabled={inProgress}
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
                onClick={() => removeExternalProfileRequest(externalProfile)}
                color="secondary"
              >
                Remove
              </Button>
            </Fragment>
          ) : (
            <Button
              color="primary"
              onClick={() => addExternalProfileRequest(externalProfile)}
              raised
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
