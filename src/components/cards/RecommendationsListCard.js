/**
 * @file PathCard container module
 * @author Theodor Shaytanov <theodor.shaytanov@gmail.com>
 * @created 13.06.18
 */

import React from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import withWidth from "@material-ui/core/withWidth";

import Carousel from "nuka-carousel";

import Fab from "@material-ui/core/Fab";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader/CardHeader";
import Avatar from "@material-ui/core/Avatar/Avatar";

import amber from "@material-ui/core/colors/amber";
import lime from "@material-ui/core/colors/lime";
import red from "@material-ui/core/colors/red";

// Game
import AdbIcon from "@material-ui/icons/Adb";
// Python
import CodeIcon from "@material-ui/icons/Code";
// YouTube
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import KeyboardArrowLeftIcon from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@material-ui/icons/KeyboardArrowRight";
import RecommendationCard from "./RecommendationCard";

import "./css/NukaCarouselStyle.css";

const COLOR_SELECTOR = 500;

const ITEMS_PER_SLIDE = {
  xs: 1,
  sm: 2,
  md: 3,
  lg: 4,
  xl: 5,
  default: 4
};
const styles = {
  avatarCode: {
    backgroundColor: amber[COLOR_SELECTOR]
  },
  avatarGame: {
    backgroundColor: lime[COLOR_SELECTOR]
  },
  avatarYoutube: {
    backgroundColor: red[COLOR_SELECTOR]
  },
  card: {
    width: "90%",
    marginBottom: 24
  },
  media: {
    height: 0,
    paddingTop: "56.25%" // 16:9
  }
};

export class RecommendationsListCard extends React.PureComponent {
  static propTypes = {
    classes: PropTypes.object,
    data: PropTypes.array.isRequired,
    onRecommendationClick: PropTypes.func,
    type: PropTypes.oneOf(["code", "youtube", "game"]).isRequired,
    title: PropTypes.string.isRequired,
    width: PropTypes.string.isRequired
  };

  getAvatarIcon = () => {
    switch (this.props.type) {
      case "game":
        return <AdbIcon />;
      case "youtube":
        return <PlayArrowIcon />;
      default:
        return <CodeIcon />;
    }
  };

  getItemDescription(type) {
    switch (type) {
      case "codeCombat":
        return "CodeCombat Level";
      case "jupyter":
        return "Colaboratory Notebook";
      case "jupyterInline":
        return "Jupyter Notebook";
      case "youtube":
        return "";
      // case "game":
      // return "React-Python Game";
      case "NotebookWithNewSkills":
      case "NotebookWithUsedSkills":
        return "Python Skills";
      default:
        return "";
    }
  }

  // temporarily select the subheader to display
  // TODO: change to "Our Suggestions" for new/non-logger users
  getSubHeader = () => {
    switch (this.props.title) {
      case "CodeCombat Activities":
        return "Recommended because you have not played them";
      case "Colaboratory Notebook Activities":
        return "Recommended because you have not given them a try";
      case "Jupyter Notebook Activities":
        return "Recommended because you have not completed them";
      case "Jupyter Notebook Activities With New Skills":
        return "Recommended for you to try new Python skills you have not used before";
      case "Jupyter Notebook Activities With Solved Skills":
        return "What are solved skills? to enhance their existing knowledge?";
      case "YouTube Video Activities":
        return "Recommended because you have not watched these videos";
      default:
        return "";
    }
  };

  render() {
    // the Firebase data in Redux is nested JSON
    // here temporarily use a dummy JSON with 2 pythonlists and 1 youtubelist
    const {
      classes,
      data,
      onRecommendationClick,
      type,
      title,
      width
    } = this.props;
    let avatarClass = "";

    switch (type) {
      case "game":
        avatarClass = classes.avatarGame;
        break;
      case "youtube":
        avatarClass = classes.avatarYoutube;
        break;
      default:
        avatarClass = classes.avatarCode;
    }
    let itemsPerSlide = ITEMS_PER_SLIDE[width] || ITEMS_PER_SLIDE.default;

    return (
      <Card className={classes.card}>
        <CardHeader
          avatar={
            <Avatar aria-label="Recommendation" className={avatarClass}>
              {this.getAvatarIcon()}
            </Avatar>
          }
          subheader={this.getSubHeader()}
          title={title || "Other Activities"}
        />
        <CardContent>
          <Carousel
            cellSpacing={10}
            className="customizeCarousel"
            renderCenterLeftControls={({ currentSlide, goToSlide }) => {
              const previousSlideIndex = Math.max(
                currentSlide - itemsPerSlide,
                0
              );
              return (
                <Fab
                  aria-label="prevSlide"
                  onClick={() => goToSlide(previousSlideIndex)}
                  size="small"
                  style={
                    currentSlide !== 0
                      ? { visibility: "visible", left: "-12px" }
                      : { visibility: "hidden" }
                  }
                >
                  <KeyboardArrowLeftIcon />
                </Fab>
              );
            }}
            renderCenterRightControls={({ currentSlide, goToSlide }) => {
              const nextSlideIndex =
                currentSlide + 2 * itemsPerSlide > data.length
                  ? currentSlide + (data.length % itemsPerSlide)
                  : currentSlide + itemsPerSlide;
              return (
                <Fab
                  aria-label="nexSlide"
                  onClick={() => goToSlide(nextSlideIndex)}
                  size="small"
                  style={
                    data.length < itemsPerSlide ||
                    currentSlide >= data.length - itemsPerSlide
                      ? { visibility: "hidden" }
                      : { visibility: "visible", right: "-12px" }
                  }
                >
                  <KeyboardArrowRightIcon />
                </Fab>
              );
            }}
            slidesToShow={itemsPerSlide}
            speed={600}
          >
            {data.map((item, index) => (
              <RecommendationCard
                activity={item}
                description={this.getItemDescription(item.type)}
                key={index}
                onRecommendationClick={onRecommendationClick}
                pathId={item.path || item.owner}
                subHeading={item.subHeading || ""}
                type={type}
                video={item.youtubeURL || ""}
              />
            ))}
          </Carousel>
        </CardContent>
      </Card>
    );
  }
}

export default withWidth()(withStyles(styles)(RecommendationsListCard));
