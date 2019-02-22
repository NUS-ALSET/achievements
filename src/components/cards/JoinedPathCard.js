/**
 * @file PathCard container module
 * @author Theodor Shaytanov <theodor.shaytanov@gmail.com>
 * @created 13.06.18
 */

import React from "react";
import PropTypes from "prop-types";

import { Link } from "react-router-dom";

import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";

class JoinedPathCard extends React.PureComponent {
  static propTypes = {
    classes: PropTypes.shape({
      card: PropTypes.string
    }).isRequired,
    id: PropTypes.string,
    isOwner: PropTypes.bool,
    name: PropTypes.string,
    onInspect: PropTypes.func,
    solutions: PropTypes.number
  };
  onInspectClick = () => this.props.onInspect(this.props.id);

  render() {
    const { classes, id, isOwner, name, solutions } = this.props;

    return (
      <Card className={classes.card}>
        <CardContent>
          <Typography className={classes.card} variant="h6">
            {name}
          </Typography>
          <Typography>{solutions} achievements</Typography>
        </CardContent>
        <CardActions style={{ float: "right" }}>
          {isOwner && <Button onClick={this.onInspectClick}>Inspect</Button>}
          <Link style={{ textDecoration: "none" }} to={`/paths/${id}`}>
            <Button>View</Button>
          </Link>
        </CardActions>
      </Card>
    );
  }
}

export default JoinedPathCard;
