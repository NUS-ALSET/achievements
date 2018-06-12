import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
// amber color python, red for youtube
import red from '@material-ui/core/colors/red';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import MoreVertIcon from '@material-ui/icons/MoreVert';

import SampleCarousel from './SampleCarousel';

const styles = theme => ({
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
  avatar: {
    backgroundColor: red[500],
  },
});

class RecommendationListCardYo extends React.Component {
  handleClickMoreVert = () => {
    alert("more to come");
  }

  render() {
    const { classes } = this.props;

    return (
      <div>
        <Card className={classes.card}>
          <CardHeader
            avatar={
              <Avatar aria-label="Recommendation" className={classes.avatar}>
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
            <SampleCarousel />
          </CardContent>
          <CardContent>
            <Typography component="p">
              Discover more YouTube educational content.
            </Typography>
          </CardContent>
          <CardActions className={classes.actions} disableActionSpacing>
            <IconButton aria-label="Add to favorites">
              <FavoriteIcon />
            </IconButton>
            <IconButton aria-label="Share">
              <ShareIcon />
            </IconButton>
          </CardActions>
        </Card>
      </div>
    );
  }
}

RecommendationListCardYo.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(RecommendationListCardYo);
