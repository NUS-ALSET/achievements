/**
 * @file ExternalSourceCard container module
 * @author Theodor Shaytanov <theodor.shaytanov@gmail.com>
 * @created 30.01.18
 */

import React from "react";
import PropTypes from "prop-types";
import Card, { CardContent, CardActions } from "material-ui/Card";
import Typography from "material-ui/Typography";
import Button from "material-ui/Button";

class ExternalSourceCard extends React.PureComponent {
  static propTypes = {
    externalSource: PropTypes.object.isRequred,
    classes: PropTypes.object.isRequired
  };

  render() {
    const { classes, externalSource } = this.props;

    return (
      <Card className={classes.card}>
        <CardContent>
          <Typography className={classes.card} type="title">
            {externalSource.name}
          </Typography>
          <Typography className={classes.card}>
            <a href={externalSource.url}>{externalSource.name}</a>,{" "}
            {externalSource.description}
          </Typography>
        </CardContent>
        <CardActions>
          <Button color="primary" raised>
            Add Profile
          </Button>
        </CardActions>
      </Card>
    );
  }
}

export default ExternalSourceCard;
