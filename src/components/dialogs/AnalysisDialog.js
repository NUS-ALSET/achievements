import React from "react";

import Button from "@material-ui/core/Button";

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';


const AnalysisDialog = (props) => {
  return (
    <Dialog
      open={props.open}
      onClose={props.handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      maxWidth={"md"}
    >
      <DialogTitle id="alert-dialog-title">
        {"Jupter Inline Problem Analysis"}
      </DialogTitle>
      <DialogContent>
        <pre style={{ color: 'black', lineHeight: '1.5', padding : '0px 20px'}}>
          {JSON.stringify(props.skills, null, '  ')}
        </pre>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.handleClose} color="primary" autoFocus>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AnalysisDialog;