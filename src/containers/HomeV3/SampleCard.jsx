import React from 'react';
import PropTypes from 'prop-types';

import { Link } from "react-router-dom";

import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

// python logo
import pythonlogo from '../../assets/python-logo-master-v3-TM-flattened.png';
// codecombat logo
// import coodecombatlogo from '../../assets/CodeCombat-logo-min.png';

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

  },
  contentPython: {
    height: 130,
    width: "100%",
    overflow: "hidden",
  },
  contentYouTube: {
    margin: 0,
    padding:0,
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

    const { title, description, path, problem, video } = this.props;
    const videoID = this.getVideoID(video);

    // TODO: video && media style

    // for now, we try to have Jupyter and YouTube ready

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
            variant="h5"
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
