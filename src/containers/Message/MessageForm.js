import React from "react";
import PropTypes from "prop-types"

class MessageForm extends React.Component {

    static propTypes = {
      sendMessage: PropTypes.func
    };
    
    constructor(props) {
      super(props);
      this.state = {
        value: "Please write the message that you want to send to all users."
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
      return (
        <div className="example">
          <form onSubmit={this.handleSubmit}>
              <textarea value={this.state.value} onChange={this.handleChange} cols={40} rows={10} />
            <input type="submit" value="Submit" />
          </form>
          <div className="preview">
            <h1>Preview</h1>
            <div>{this.state.value}</div>
          </div>
        </div>
      );
    }
  }
  
export default MessageForm;