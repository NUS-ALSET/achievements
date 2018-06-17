import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

const styles = {
  card: {
    maxWidth: 345,
    height: 200,
  },
  media: {
    height: 30,
    width: 90,
    // paddingTop: '56.25%', // 16:9
  },
  content: {
    height: 130,
    width: "100%",
    overflow: "hidden",
  },
};

class SampleCard extends React.Component {
  render() {
    const { classes } = this.props;
    return (
      <div>
        <Card className={classes.card}>
          <CardMedia
            className={classes.media}
            image="https://www.python.org/static/community_logos/python-logo-master-v3-TM-flattened.png"
            title="Python Language"
          />
          <CardContent className={classes.content}>
            <Typography variant="headline" component="p">
              If Then
            </Typography>
            <Typography component="p">
              Learn about Python conditional statements to write useful programs. The simplest form is the if statement, and there are more like while and for...
            </Typography>
          </CardContent>
          <CardActions>
            <Button size="small" color="primary">
              Learn More
            </Button>
          </CardActions>
        </Card>
      </div>
    );
  }
}

SampleCard.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SampleCard);
