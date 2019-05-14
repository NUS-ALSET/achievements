import * as React from "react";
import PropTypes from "prop-types";

import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";

export class ImportDialog extends React.PureComponent {
  static propTypes = {
    onClose: PropTypes.func,
    onFileSelect: PropTypes.func,
    onSelectURL: PropTypes.func,
    open: PropTypes.bool.isRequired
  };

  inputRef = React.createRef();

  state = {};

  onChangeURL = e =>
    this.setState({
      url: e.target.value
    });

  onCommitFileClick = () => {
    this.inputRef.current.click();
  };

  onCommitURLClick = () => this.props.onSelectURL(this.state.url);

  onFileChange = e => this.props.onFileSelect(e.target.files);

  render() {
    const { onFileSelect, onSelectURL, open } = this.props;
    return (
      <Dialog open={open}>
        <DialogTitle>Import</DialogTitle>
        <DialogContent>
          <TextField fullWidth label="URL" onChange={this.onChangeURL} />
          <input
            hidden
            onChange={this.onFileChange}
            ref={this.inputRef}
            type="file"
          />
        </DialogContent>
        <DialogActions>
          <Button color="secondary" onClick={this.props.onClose}>
            Cancel
          </Button>
          {onFileSelect && (
            <Button
              color="primary"
              onClick={this.onCommitFileClick}
              variant="contained"
            >
              Select File
            </Button>
          )}
          {onSelectURL && (
            <Button
              color="primary"
              onClick={this.onCommitURLClick}
              variant="contained"
            >
              Fetch URL
            </Button>
          )}
        </DialogActions>
      </Dialog>
    );
  }
}
