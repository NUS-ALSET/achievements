import React from "react";
import PropTypes from "prop-types";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";

const styles = theme => ({
  root:{
    display: "flex"
  },
  container: {
    display: "flex",
    flexWrap: "wrap",
    width: "calc(100% - 72px)"
  },
  textField: {
    margin: "0px"
  },
  noBorderRadius:{
    borderRadius: 0
  }
});

class MessageForm extends React.Component {

    static propTypes = {
      sendMessage: PropTypes.func
    };
    
    constructor(props) {
      super(props);
      this.state = {
        value: ""
      };
  
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
      this.setState({value: event.target.value});
    }

    handleSubmit(event) {
      event.preventDefault();
      this.props.sendMessage(this.state.value);
      this.setState({
        value: ""
      });
    }

    render() {
      const { classes, isInstructor } = this.props;

      return (
        <div  className={classes.root}>
          <form autoComplete="off" className={classes.container} noValidate  onSubmit={this.handleSubmit}>
            <TextField
              className={classes.textField}
              disabled={!isInstructor}
              fullWidth
              id="outlined-full-width"
              label={isInstructor ? "Write Message Here" : "Only instructor can send the messages"}
              margin="normal"
              multiline
              onChange={this.handleChange}
              placeholder="Hi Kevin"
              rowsMax="4"
              value={this.state.value}
              variant="outlined"
              
            />
          </form>
          <Button
            className={classes.noBorderRadius}
            color="primary"
            disabled={!isInstructor}
            onClick={this.handleSubmit}
            variant="contained"
          >
            Send
          </Button>
        </div>
      );
    }
  }
  
  MessageForm.propTypes = {
    classes: PropTypes.object.isRequired,
    isInstructor: PropTypes.bool
  };

  export default withStyles(styles)(MessageForm);