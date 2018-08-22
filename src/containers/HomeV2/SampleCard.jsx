import React from 'react';
import PropTypes from 'prop-types';

import { Link } from "react-router-dom";

import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

// TODO: 4 different logos for CodeCombat, Python, JavaScript activities
// python logo for Jupyter, Colab
import pythonlogo from '../../assets/python-logo-master-v3-TM-flattened.png';
// codecombat logo for cobecombat activities
// import coodecombatlogo from '../../assets/CodeCombat-logo-min.png';
// JS logo for Jest and Game (for now only React based games i think)
// import JSlogo from '../../assets/JSlogo.png';
// Game logo for game activities
// import Gamelogo from '../../assets/Gamelogo.png';

/*
 * the data code design is modeled after
 * Theodor Shaytanov's PathCard container module
 */

const styles = {
  card: {
    maxWidth: 345,
    height: 200,
  },
  mediaPython: {
    height: 30,
    width: 90,
  },
  mediaYouTube: {
    //maxHeight: 160,
    //height: "100%",
    //maxHeight: 150,
    //width: "100%",
    //paddingTop: '56.25%', // 16:9
  },
  contentPython: {
    height: 130,
    width: "100%",
    overflow: "hidden",
  },
  contentYouTube: {
    //display: "flex",
    //alignSelf: "flex-end",
    margin: 0,
    padding:0,
    //border: "2px red solid",
    height: 160,
    width: "100%",
    overflow: "hidden",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    backgroundSize: "100% 100%",
  },
};

class SampleCard extends React.PureComponent {
  static propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    path: PropTypes.string,
    problem: PropTypes.string,
    video: PropTypes.string,
  };

  /*
   * thanks to Github's protrolium (https://gist.github.com/protrolium/8831763)
   * Each YouTube video has 4 generated thumbnails, they are formatted as:
   * http(s)://img.youtube.com/vi/<video-id>/0,1,2,3.jpg
   * 0.jpg is a suitable size in our app
   */
  //function to get the video-id of youtubeURL
  getVideoID = (youtubeURL) => {
    let endID = youtubeURL.substring(youtubeURL.lastIndexOf("?v=") + 3);
    return endID;
  }

  render() {
    // get the data from the dummy Redux State
    // props.path is the owner value
    // props.problem is the key value of the owner
    const { title, description, path, problem, video } = this.props;
    const videoID = this.getVideoID(video);

    return (
      <Card style={styles.card}>
        <CardMedia
          style={video
            ? styles.mediaYouTube
            : styles.mediaPython}
          image={video
            ? ''
            : pythonlogo}
          title={video
            ? "YouTube Video"
            : "Python Exercise"}
        />
        <CardContent
          style={video
            ? {
                ...styles.contentYouTube,
                backgroundImage: `url(https://img.youtube.com/vi/${videoID}/0.jpg`,
              }
            : {
                ...styles.contentPython
              }
          }>
          <Typography
            variant="headline"
            component="p"
            style={video
              ? {
                  color: "white",
                  backgroundColor: "gray",
                  height: 25,
                  position: "absolute",
                  bottom: 60,
                  fontSize: 20
                }
              : {}
            }
          >
            {title}
          </Typography>
          <Typography component="p">
            {description}
          </Typography>
        </CardContent>
        <CardActions>
          <Link
            to={`/paths/${path}/activities/${problem}`}
            style={{ textDecoration: 'none' }}
          >
            <Button size="small" color="primary">
              Learn More
            </Button>
          </Link>
        </CardActions>
      </Card>
    );
  }
}


export default SampleCard;
