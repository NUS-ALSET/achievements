/**
 * @file Recommendation card component module
 * @author Theodor Shaytanov <theodor.shaytanov@gmail.com>
 * @created 30.08.18
 */

import React from "react";
import PropTypes from "prop-types";

import { Link } from "react-router-dom";

import withStyles from "@material-ui/core/styles/withStyles";

import Button from "@material-ui/core/Button/Button";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";

import codeCombatLogo from "../../assets/CodeCombat-logo-min.png";
import pythonLogo from "../../assets/python-logo-master-v3-TM-flattened.png";
import { ACTIVITY_TYPES } from "../../services/paths";

const styles = {
  card: {
    maxWidth: 345,
    height: 200
  },
  mediaPython: {
    height: 30,
    width: 90
  },
  mediaYouTube: {
    // maxHeight: 160,
    // height: "100%",
    // maxHeight: 150,
    // width: "100%",
    // paddingTop: '56.25%', // 16:9
  },
  contentPython: {
    height: 130,
    width: "100%",
    overflow: "hidden"
  },
  contentYouTube: {
    // display: "flex",
    // alignSelf: "flex-end",
    margin: 0,
    padding: 0,
    // border: "2px red solid",
    height: 160,
    width: "100%",
    overflow: "hidden",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    backgroundSize: "auto 180px",
    backgroundColor: "black"
  }
};

class RecommendationCard extends React.PureComponent {
  static propTypes = {
    activity: PropTypes.object.isRequired,
    classes: PropTypes.object,
    description: PropTypes.string,
    onRecommendationClick: PropTypes.func,
    pathId: PropTypes.string,
    subHeading: PropTypes.string,
    type: PropTypes.oneOf(["code", "youtube", "game"]).isRequired,
    video: PropTypes.string
  };

  getVideoID = youtubeURL => {
    // eslint-disable-next-line no-magic-numbers
    return youtubeURL.substring(youtubeURL.lastIndexOf("?v=") + 3);
  };

  handleClick = () => {
    const { activity, onRecommendationClick, pathId } = this.props;
    if (activity.type === ACTIVITY_TYPES.codeCombat.id) {
      window.open(`//codecombat.com/play/level/${activity.level}`, "_blank");
    }

    if (onRecommendationClick) {
      onRecommendationClick(activity.problem || activity.activity, pathId);
    }
  };

  render() {
    // get the data from the dummy Redux State
    // props.path is the owner value
    // props.problem is the key value of the owner
    const {
      activity,
      classes,
      description,
      pathId,
      type,
      subHeading,
      video
    } = this.props;
    const videoID = this.getVideoID(video);
    const youtubeBackground = `url(https://img.youtube.com/vi/${videoID}/0.jpg`;
    let image;

    switch (type) {
      case "game":
        image = codeCombatLogo;
        break;
      default:
        image = pythonLogo;
    }

    return (
      <Card style={styles.card}>
        <Link
          onClick={() => this.handleClick()}
          style={{ textDecoration: "none" }}
          to={
            (activity.type !== "codeCombat" &&
              `/paths/${pathId}/activities/${activity.problem ||
                activity.activity}`) ||
            ""
          }
        >
          <CardMedia
            className={video ? classes.mediaYouTube : classes.mediaPython}
            image={image}
            title={video ? "YouTube Video" : "Python Exercise"}
          />
          <CardContent
            style={
              video
                ? {
                    ...styles.contentYouTube,
                    backgroundImage: youtubeBackground
                  }
                : {
                    ...styles.contentPython
                  }
            }
          >
            <Typography
              style={
                video
                  ? {
                      color: "white",
                      backgroundColor: "gray",
                      height: 25,
                      position: "absolute",
                      bottom: 60,
                      fontSize: 15
                    }
                  : {}
              }
              variant="subtitle1"
            >
              {activity.name}
            </Typography>
            <Typography variant="caption">
              {subHeading || description}
            </Typography>
          </CardContent>
          <CardActions>
            <Button color="primary" size="small">
              Learn More
            </Button>
          </CardActions>
        </Link>
      </Card>
    );
  }
}

export default withStyles(styles)(RecommendationCard);
