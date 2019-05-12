/* eslint-disable react/display-name */
import * as React from "react";
import PropTypes from "prop-types";
import Loadable from "react-loadable";
import parse from "html-react-parser";

import LinearProgress from "@material-ui/core/LinearProgress";
import TextField from "@material-ui/core/TextField";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";

const AceEditor = Loadable({
  loader: () => import("../../components/AceEditor"),
  loading: () => <LinearProgress />
});
const styles = {
  iframeStyle: {
    width: "100%"
  }
};

export class CustomTaskResponseForm extends React.PureComponent {
  static propTypes = {
    taskInfo: PropTypes.any
  };
  state = {
    tabIndex: "htmlFeedback"
  };

  getFeedback = () => {
    const { taskInfo } = this.props;
    const { tabIndex } = this.state;
    switch (tabIndex) {
      case "htmlFeedback":
        return parse(taskInfo.response.data[tabIndex]);
      case "textFeedback":
        return (
          <TextField
            fullWidth
            multiline
            value={taskInfo.response.data[tabIndex]}
          />
        );
      case "jsonFeedback":
        return (
          <AceEditor
            maxLines={Infinity}
            minLines={3}
            mode="json"
            readOnly={true}
            setOptions={{ showLineNumbers: false }}
            theme="github"
            value={JSON.stringify(
              JSON.parse(taskInfo.response.data[tabIndex]),
              null,
              2
            )}
            width={"100%"}
          />
        );
      default:
        return taskInfo.response.data[tabIndex];
    }
  };
  onChangeTab = (e, tabIndex) => {
    this.setState({ tabIndex });
  };
  render() {
    const { taskInfo } = this.props;
    const { tabIndex } = this.state;
    return (
      <React.Fragment>
        <Tabs onChange={this.onChangeTab} value={tabIndex}>
          <Tab label="HTML" value="htmlFeedback" />
          <Tab label="JSON" value="jsonFeedback" />
          <Tab label="Text" value="textFeedback" />
        </Tabs>
        {taskInfo &&
          taskInfo.response &&
          taskInfo.response.data &&
          taskInfo.response.data[tabIndex] &&
          this.getFeedback()}
      </React.Fragment>
    );
  }
}
