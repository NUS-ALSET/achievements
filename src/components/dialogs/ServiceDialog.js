import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import PropTypes from "prop-types";
import React from "react";
import ServiceForm from "../../containers/Admin/ServiceForm";

class ServiceDialog extends React.PureComponent {
  static propTypes = {
    onClose: PropTypes.func,
    open: PropTypes.bool.isRequired,
    createNewService: PropTypes.func,
    editing: PropTypes.bool,
    service: PropTypes.object,
    updateServiceDetails: PropTypes.func
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
    this.child.current.addService();
  }

  render() {
    const {
      onClose,
      open,
      editing,
      createNewService,
      updateServiceDetails
    } = this.props;

    return (
      <Dialog onClose={onClose} open={open}>
        <DialogTitle>{editing ? "Update" : "Add"} Third Party Service</DialogTitle>
        <DialogContent>
          <ServiceForm
            createNewService={createNewService}
            editing={editing}
            ref={this.child}
            service={this.props.service}
            updateServiceDetails={updateServiceDetails}
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
