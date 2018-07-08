/**
 * @file PathCard container module
 * @author Theodor Shaytanov <theodor.shaytanov@gmail.com>
 * @created 13.06.18
 */

import React from "react";
import PropTypes from "prop-types";

import { Link } from "react-router-dom";

import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";

import KeyboardArrowRightIcon from "@material-ui/icons/KeyboardArrowRight";

class PathCard extends React.PureComponent {
  static propTypes = {
    featured: PropTypes.bool,
    path: PropTypes.string,
    problem: PropTypes.string,
    title: PropTypes.string.isRequired,
    video: PropTypes.string
  };

  render() {
    const { featured, path, problem, title, video } = this.props;

    return (
      <Card
        style={
          featured
            ? {
                height: "calc(100% - 8px)",
                minHeight: 200,
                margin: 4,
                position: "relative"
              }
            : {
                margin: 4,
                flex: 1,
                minHeight: 120,
                minWidth: 160,
                position: "relative",
                width: "25%"
              }
        }
      >
        {video && (
          <CardMedia
            image={`https://img.youtube.com/vi/${video}/0.jpg`}
            style={{
              height: "100%"
            }}
          />
        )}
        <CardContent>
          <Typography>{title}</Typography>
        </CardContent>
        <CardActions
          style={{
            background: "rgba(255,255,255,0.54)",
            bottom: 0,
            justifyContent: "flex-end",
            position: "absolute",
            width: "100%"
          }}
        >
          <Link to={`/paths/${path}/activities/${problem}`}>
            <IconButton color="inherit">
              <KeyboardArrowRightIcon />
            </IconButton>
          </Link>
        </CardActions>
      </Card>
    );
  }
}

export default PathCard;
