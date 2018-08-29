import React, { Fragment } from "react";
import PropTypes from "prop-types";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import Avatar from "@material-ui/core/Avatar";

// TODO: types of Activities:
// YouTube, Jupyter, Jest, Colab, Code Combat, Game
// Avatar with icons for certain Activity types
import PlayArrow from "@material-ui/icons/PlayArrow"; // YouTube
import Adb from "@material-ui/icons/Adb"; // Game

// TODO: amber color python (Jupyter and Colab), red for youtube
import amber from "@material-ui/core/colors/amber";
import red from "@material-ui/core/colors/red";
// Jest:
// import blue from '@material-ui/core/colors/blue';
// CodeCombat:
import lime from "@material-ui/core/colors/lime";
// Game:
// import indigo from '@material-ui/core/colors/indigo';

import SampleCarousel from "./SampleCarousel";

/* eslint-disable */
const styles = {
  card: {
    Width: "90%"
  },
  media: {
    height: 0,
    paddingTop: "56.25%" // 16:9
  },
  actions: {
    display: "flex"
  },
  avatarPy: {
    backgroundColor: amber[500]
  },
  avatarCC: {
    backgroundColor: lime[500]
  },
  avatarYT: {
    backgroundColor: red[500]
  }
};
/* eslint-enable */

class RecommendationListCard extends React.PureComponent {
  static propTypes = {
    RecomType: PropTypes.string.isRequired,
    dummyData: PropTypes.array,
    title: PropTypes.string
  };

  render() {
    // the Firebase data in Redux is nested JSON
    // here temporarily use a dummy JSON with 2 pythonlists and 1 youtubelist
    const { dummyData, title, RecomType } = this.props;

    // TODO: three major categories for Avatar icons
    // YouTube Activities use PlayArrow for Avatar Icon,
    // Game/CodeCombat use Adb icon,
    // Jupyter/Jest/Codelab use '</>'

    // temporary detection for CodeCombat Activities,
    // to change the avatar, logo, and color
    const isCodeCombat = title === "CodeCombat Activities";

    return (
      <div style={{ marginBottom: "24px" }}>
        {/* either use marginBottom here or put a <br /> at parent */}
        <Card style={styles.card}>
          {RecomType === "python" && (
            <Fragment>
              {/* this is temporarily testing the GUI with CodeCombat type
                  feel free to refactor it to a proper solution */}
              <CardHeader
                avatar={
                  <Avatar
                    aria-label="Recommendation"
                    style={isCodeCombat ? styles.avatarCC : styles.avatarPy}
                  >
                    {isCodeCombat ? <Adb /> : "</>"}
                  </Avatar>
                }
                subheader="Recommended for you"
                title={title || "Jupyter Notebook Activities"}
              />
              <CardContent>
                <SampleCarousel
                  dataList={dummyData}
                  isCodeCombat={isCodeCombat}
                  youtubeRecom={false}
                />
              </CardContent>
            </Fragment>
          )}
          {RecomType === "youtube" && (
            <Fragment>
              <CardHeader
                avatar={
                  <Avatar aria-label="Recommendation" style={styles.avatarYT}>
                    <PlayArrow />
                  </Avatar>
                }
                subheader="Recommended for you"
                title={title || "Jupyter Notebook Activities"}
              />
              <CardContent>
                <SampleCarousel dataList={dummyData} youtubeRecom={true} />
              </CardContent>
            </Fragment>
          )}
          {/* other types of Activities with different RecomType etc */}
        </Card>
      </div>
    );
  }
}

export default RecommendationListCard;
