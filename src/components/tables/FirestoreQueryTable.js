/**
 * @file Firestore Query  Table
 * @author Aishwarya Lakshminarasimhan <aishwaryarln@gmail.com>
 * @created 03.07.18
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

export const QUERY_OPTIONS = [
  "collection",
  "doc",
  "whereTest",
  "whereCondition",
  "whereTestValue",
  "orderBy",
  "orderByDirection",
  "limit"
];

class FirestoreQueryTable extends React.PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    firestoreQueryHandler: PropTypes.func
  };

  state = {
    query: {
      firestore: {
        collection: "",
        doc: "",
        whereTest: "",
        whereCondition: "",
        whereTestValue: "",
        orderBy: "",
        orderByDirection: "",
        limit: ""
      }
    }
  };

  onFieldChange = (field, value) => {
    let data = { ...this.state.query };
    if (QUERY_OPTIONS.indexOf(field) !== -1) {
      data.firestore[field] = value;
    }
    this.setState({ ...this.state, query: data });
    this.props.firestoreQueryHandler(data);
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
                firebase.firestore()
              </Typography>
            </TableCell>
            <TableCell align="left"> </TableCell>
          </TableRow>
          <TableRow key="collection">
            <TableCell align="right">
              <Typography className={classes.instructions}>
                .collection("{this.state.query.firestore.collection}")
              </Typography>
            </TableCell>
            <TableCell align="left">
              <TextField
                required
                id="outlined-name"
                label="collection"
                className={classes.textField}
                value={this.state.query.firestore.collection}
                onChange={e => this.onFieldChange("collection", e.target.value)}
                margin="dense"
                variant="outlined"
              />{" "}
            </TableCell>
          </TableRow>
          <TableRow key="doc">
            <TableCell align="right">
              <Typography className={classes.instructions}>
                .doc("{this.state.query.firestore.doc}
                ")
              </Typography>
            </TableCell>
            <TableCell align="left">
              {" "}
              <TextField
                id="outlined-name"
                label="doc"
                className={classes.textField}
                value={this.state.query.firestore.doc}
                onChange={e => this.onFieldChange("doc", e.target.value)}
                margin="dense"
                variant="outlined"
              />
            </TableCell>
          </TableRow>
          <TableRow key="where">
            <TableCell align="right">
              <Typography className={classes.instructions}>
                .where( "{this.state.query.firestore.whereTest}", "
                {this.state.query.firestore.whereCondition}", "
                {this.state.query.firestore.whereTestValue}" )
              </Typography>
            </TableCell>
            <TableCell align="left">
              <div>
                <TextField
                  id="outlined-name"
                  label="whereTest"
                  className={classes.textField}
                  value={this.state.query.firestore.whereTest}
                  onChange={e =>
                    this.onFieldChange("whereTest", e.target.value)
                  }
                  margin="dense"
                  variant="outlined"
                />
                <TextField
                  id="outlined-name"
                  label="whereCondition"
                  className={classes.textField}
                  value={this.state.query.firestore.whereCondition}
                  onChange={e =>
                    this.onFieldChange("whereCondition", e.target.value)
                  }
                  margin="dense"
                  variant="outlined"
                />
                <TextField
                  id="outlined-name"
                  label="whereTestValue"
                  className={classes.textField}
                  value={this.state.query.firestore.whereTestValue}
                  onChange={e =>
                    this.onFieldChange("whereTestValue", e.target.value)
                  }
                  margin="dense"
                  variant="outlined"
                />
              </div>
            </TableCell>
          </TableRow>
          <TableRow key="orderBy">
            <TableCell align="right">
              <Typography className={classes.instructions}>
                .orderBy("{this.state.query.firestore.orderBy}","
                {this.state.query.firestore.orderByDirection}")
              </Typography>
            </TableCell>
            <TableCell align="left">
              <TextField
                id="outlined-name"
                label="orderBy"
                className={classes.textField}
                value={this.state.query.firestore.orderBy}
                onChange={e => this.onFieldChange("orderBy", e.target.value)}
                margin="dense"
                variant="outlined"
              />
              <TextField
                id="outlined-name"
                label="orderByDirection"
                className={classes.textField}
                value={this.state.query.firestore.orderByDirection}
                onChange={e =>
                  this.onFieldChange("orderByDirection", e.target.value)
                }
                margin="dense"
                variant="outlined"
              />
            </TableCell>
          </TableRow>
          <TableRow key="limit">
            <TableCell align="right">
              <Typography className={classes.instructions}>
                .limit({this.state.query.firestore.limit})
              </Typography>
            </TableCell>
            <TableCell align="left">
              <TextField
                id="outlined-name"
                label="limit"
                type="number"
                className={classes.textField}
                value={this.state.query.firestore.limit}
                onChange={e => this.onFieldChange("limit", e.target.value)}
                margin="dense"
                variant="outlined"
              />
            </TableCell>
          </TableRow>
          <TableRow key="get">
            <TableCell align="right">
              <Typography className={classes.instructions}>.get()</Typography>
            </TableCell>
            <TableCell align="left"> </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
  }
}

export default FirestoreQueryTable;
