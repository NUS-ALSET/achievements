import React from "react";
import PropTypes from "prop-types";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";

const styles = theme => ({
  root:{
    display: "flex",
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
      // alert("A message was submitted: " + this.state.value);
      event.preventDefault();
      this.props.sendMessage(this.state.value);
    }

    render() {
      const { classes } = this.props;

      return (
        <div  className={classes.root}>
          <form autoComplete="off" className={classes.container} noValidate  onSubmit={this.handleSubmit}>
              {/* <TextField
                className={classes.textField}
                fullWidth
                id="standard-multiline-flexible"
                // label="Input your message"
                margin="normal"
                multiline
                onChange={this.handleChange}
                rowsMax="4"
                value={this.state.value}
                placeholder={"Write your message here..."}
              /> */}
            <TextField
              className={classes.textField}
              fullWidth
              id="outlined-full-width"
              // InputLabelProps={{
              //   shrink: true,
              // }}
              label="Write Message Here"
              margin="normal"
              multiline
              placeholder="Hi Kevin"
              rowsMax="4"
              variant="outlined"
              value={this.state.value}
              onChange={this.handleChange}

        />
              
          </form>
          <Button color="primary" onClick={this.handleSubmit} className={classes.noBorderRadius} variant="contained">
            Send
          </Button>
        </div>
      );
    }
  }
  
  MessageForm.propTypes = {
    classes: PropTypes.object.isRequired
  };

  export default withStyles(styles)(MessageForm);