import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import PropTypes from "prop-types";
import React from "react";
import AddNewService from "../../containers/Admin/AddNewService";

class ServiceDialog extends React.PureComponent {
  static propTypes = {
    onClose: PropTypes.func,
    onCommit: PropTypes.func,
    open: PropTypes.bool.isRequired,
    createNewService: PropTypes.func,
    editing: PropTypes.bool,
    service: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.child = React.createRef();
  }

  state = {
    solution: "",
    isCorrectInput: false,
    submitDisabled: true
  };

  validate = isNotValid => {
    this.setState({
        submitDisabled: isNotValid ? true : false
    })
  }

  onSubmit = () => {
    // console.log(this.props.createNewService());
    this.child.current.addService();
   }
  render() {
    const { onClose, open } = this.props;

    return (
      <Dialog onClose={onClose} open={open}>
        <DialogTitle>Add/Edit Third Party Service</DialogTitle>
        <DialogContent>
          <AddNewService
            createNewService={this.props.createNewService}
            editing={this.props.editing}
            ref={this.child}
            service={this.props.service}
            validate={this.validate}
          />
        </DialogContent>
        <DialogActions>
          <Button color="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            color="primary"
            disabled={this.state.submitDisabled}
            onClick={this.onSubmit}
            variant="contained"
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default ServiceDialog;
