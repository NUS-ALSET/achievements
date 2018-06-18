import React, { Fragment } from "react";
import PropTypes from 'prop-types';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
// amber color python, red for youtube
import amber from '@material-ui/core/colors/amber';
import red from '@material-ui/core/colors/red';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import MoreVertIcon from '@material-ui/icons/MoreVert';

import SampleCarousel from './SampleCarousel';


const styles = {
  card: {
    Width: "90%",
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  actions: {
    display: 'flex',
  },
  avatarPy: {
    backgroundColor: amber[500],
  },
  avatarYo: {
    backgroundColor: red[500],
  },
};

class RecommendationListCardPy extends React.PureComponent {
  static propTypes = {
    RecomType: PropTypes.string.isRequired,
    dummyData: PropTypes.array,
  };

  handleClickMoreVert = () => {
    alert("more to come");
  }

  render() {
    // the Firebase data in Redux is nested JSON
    // here temporarily use a dummy JSON with 2 pythonlists and 1 youtubelist
    const { dummyData } = this.props;

    return (
      <Card style={styles.card}>
        {(this.props.RecomType === "python") &&
          <Fragment>
            <CardHeader
              avatar={
                <Avatar aria-label="Recommendation" style={styles.avatarPy}>
                  Py
                </Avatar>
              }
              action={
                <IconButton onClick={this.handleClickMoreVert}>
                  <MoreVertIcon />
                </IconButton>
              }
              title="Recommended for you"
              subheader="in Python"
            />
            <CardContent>
              <SampleCarousel
                youtubeRecom={false}
                dataList={dummyData}
              />
            </CardContent>
            <CardContent>
              <Typography component="p">
                Your next quest for Python learning.
              </Typography>
            </CardContent>
          </Fragment>
        }
        {(this.props.RecomType === "youtube") &&
          <Fragment>
            <CardHeader
              avatar={
                <Avatar aria-label="Recommendation" style={styles.avatarYo}>
                  Y
                </Avatar>
              }
              action={
                <IconButton onClick={this.handleClickMoreVert}>
                  <MoreVertIcon />
                </IconButton>
              }
              title="Recommended for you"
              subheader="in YouTube"
            />
            <CardContent>
              <SampleCarousel
                youtubeRecom={true}
                dataList={dummyData}
              />
            </CardContent>
            <CardContent>
              <Typography component="p">
                Discover more YouTube educational content.
              </Typography>
            </CardContent>
          </Fragment>
        }
        <CardActions style={styles.actions} disableActionSpacing>
          <IconButton aria-label="Add to favorites">
            <FavoriteIcon />
          </IconButton>
          <IconButton aria-label="Share">
            <ShareIcon />
          </IconButton>
        </CardActions>
      </Card>
    );
  }
}


export default RecommendationListCardPy;
