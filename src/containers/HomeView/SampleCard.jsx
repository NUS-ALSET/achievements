import React from 'react';
import PropTypes from 'prop-types';

import { Link } from "react-router-dom";

import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

/*
 * the data code design is modeled after
 * Theodor Shaytanov's PathCard container module
 */

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

class SampleCard extends React.PureComponent {
  static propTypes = {
    // key is not a prop
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    path: PropTypes.string,
    problem: PropTypes.string
  };

  render() {
    // get the data from the dummy Redux State
    // props.path is the owner value
    // props.problem is the key value of the owner
    const { title, description, path, problem } = this.props;

    return (
      <Card style={styles.card}>
        <CardMedia
          style={styles.media}
          image="https://www.python.org/static/community_logos/python-logo-master-v3-TM-flattened.png"
          title="Python Language"
        />
        <CardContent style={styles.content}>
          <Typography variant="headline" component="p">
            {title}
          </Typography>
          <Typography component="p">
            {description}
          </Typography>
        </CardContent>
        <CardActions>
          <Link
            to={`/paths/${path}/problems/${problem}`}
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
