/**
 * @file Firebase Query  Table
 * @author Aishwarya Lakshminarasimhan <aishwaryarln@gmail.com>
 * @created 02.07.18
 */

import React from "react";
import PropTypes from "prop-types";

//Import MaterialUI components
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";

class FirebaseQueryTable extends React.PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    firebaseQueryHandler: PropTypes.func
  };
  state = {
    query: {
      firebase: {
        ref: "",
        orderByChild: "",
        equalTo: "",
        limitToFirst: "",
        limitToLast: ""
      }
    }
  };

  onFieldChange = (field, value) => {
    let data = { ...this.state.query };
    switch (field) {
      case "ref":
        data.firebase.ref = value;
        break;
      case "orderByChild":
        data.firebase.orderByChild = value;
        break;
      case "equalTo":
        data.firebase.equalTo = value;
        break;
      case "limitToFirst":
        data.firebase.limitToFirst = value;
        break;
      case "limitToLast":
        data.firebase.limitToLast = value;
        break;
      default:
        break;
    }
    this.setState({ ...this.state, query: data });
    this.props.firebaseQueryHandler(data);
  };

  isIncorrect = () => {
    if (this.state.name && this.state.isCorrectInput) {
      return false;
    } else {
      return true;
    }
  };

  render() {
    const { classes } = this.props;

    return (
      <Table className={classes.table} size="small">
        <TableHead>
          <TableRow>
            <TableCell align="left" />
            <TableCell align="left" />
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow key="firebase">
            <TableCell align="right">
              <Typography className={classes.instructions}>
                firebase.database()
              </Typography>
            </TableCell>
            <TableCell align="left"> </TableCell>
          </TableRow>
          <TableRow key="ref">
            <TableCell align="right">
              <Typography className={classes.instructions}>
                .ref({this.state.query.firebase.ref})
              </Typography>
            </TableCell>
            <TableCell align="left">
              <TextField
                required
                id="outlined-name"
                label="ref"
                className={classes.textField}
                value={this.state.query.firebase.ref}
                onChange={e => this.onFieldChange("ref", e.target.value)}
                margin="dense"
                variant="outlined"
              />{" "}
            </TableCell>
          </TableRow>
          <TableRow key="orderByChild">
            <TableCell align="right">
              <Typography className={classes.instructions}>
                .orderByChild({this.state.query.firebase.orderByChild})
              </Typography>
            </TableCell>
            <TableCell align="left">
              {" "}
              <TextField
                id="outlined-name"
                label="orderByChild"
                className={classes.textField}
                value={this.state.query.firebase.orderByChild}
                onChange={e =>
                  this.onFieldChange("orderByChild", e.target.value)
                }
                margin="dense"
                variant="outlined"
              />
            </TableCell>
          </TableRow>
          <TableRow key="equalTo">
            <TableCell align="right">
              <Typography className={classes.instructions}>
                .equalTo({this.state.query.firebase.equalTo})
              </Typography>
            </TableCell>
            <TableCell align="left">
              <TextField
                id="outlined-name"
                label="equalTo"
                className={classes.textField}
                value={this.state.query.firebase.equalTo}
                onChange={e => this.onFieldChange("equalTo", e.target.value)}
                margin="dense"
                variant="outlined"
              />
            </TableCell>
          </TableRow>
          <TableRow key="limitToFirst">
            <TableCell align="right">
              <Typography className={classes.instructions}>
                .limitToFirst({this.state.query.firebase.limitToFirst})
              </Typography>
            </TableCell>
            <TableCell align="left">
              <TextField
                id="outlined-name"
                label="limitToFirst"
                type="number"
                className={classes.textField}
                value={this.state.query.firebase.limitToFirst}
                onChange={e =>
                  this.onFieldChange("limitToFirst", e.target.value)
                }
                margin="dense"
                variant="outlined"
              />
            </TableCell>
          </TableRow>
          <TableRow key="limitToLast">
            <TableCell align="right">
              <Typography className={classes.instructions}>
                .limitToLast({this.state.query.firebase.limitToLast})
              </Typography>
            </TableCell>
            <TableCell align="left">
              <TextField
                id="outlined-name"
                label="limitToLast"
                type="number"
                className={classes.textField}
                value={this.state.query.firebase.limitToLast}
                onChange={e =>
                  this.onFieldChange("limitToLast", e.target.value)
                }
                margin="dense"
                variant="outlined"
              />
            </TableCell>
          </TableRow>
          <TableRow key="once">
            <TableCell align="right">
              <Typography className={classes.instructions}>
                .once("value")
              </Typography>
            </TableCell>
            <TableCell align="left" />
          </TableRow>
        </TableBody>
      </Table>
    );
  }
}

export default FirebaseQueryTable;
