import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { Button } from "@material-ui/core";
import Switch from "@material-ui/core/Switch";

const styles = theme => ({
  root: {
    width: "100%",
    marginTop: theme.spacing.unit * 3,
    overflowX: "auto"
  },
  table: {
    minWidth: 700
  }
});

function ServicesList(props) {
  const { classes } = props;

  return (
    <Paper className={classes.root}>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell>Service Name</TableCell>
            <TableCell>URL</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Activate</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.keys(props.services || {}).map(key => {
              const service = props.services[key];
              return (
                <TableRow key={service.id}>
                  <TableCell component="th" scope="row">
                    {service.name}
                  </TableCell>
                  <TableCell>{service.url}</TableCell>
                  <TableCell>
                    {service.description}
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={service.enable}
                      color="primary"
                      onChange={() => props.toggleService(service)}
                    />
                  </TableCell>
                  <TableCell>
                    <Button onClick={props.editService(key)}>
                        Edit
                    </Button>
                    {/* <Button onClick={props.deleteService(key)}>Delete</Button> */}
                  </TableCell>
                  
                </TableRow>
              )
          })}
        </TableBody>
      </Table>
    </Paper>
  );
}

ServicesList.propTypes = {
  classes: PropTypes.object.isRequired,
  services: PropTypes.object,
  editService: PropTypes.func,
  deleteService: PropTypes.func,
  toggleService: PropTypes.func
};

export default withStyles(styles)(ServicesList);
