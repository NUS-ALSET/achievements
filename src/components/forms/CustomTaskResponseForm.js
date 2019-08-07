/* eslint-disable react/display-name */
import * as React from "react";
import PropTypes from "prop-types";
import Loadable from "react-loadable";

import LinearProgress from "@material-ui/core/LinearProgress";
import TextField from "@material-ui/core/TextField";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";

const AceEditor = Loadable({
  loader: () => import("../../components/AceEditor"),
  loading: () => <LinearProgress />
});

const NotebookPreview = Loadable({
  loader: () => import("@nteract/notebook-preview"),
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
  frameRef = React.createRef();

  componentDidMount() {
    this.updateIFrame();
  }

  updateIFrame() {
    const { taskInfo } = this.props;
    const { tabIndex } = this.state;
    if (this.frameRef.current) {
      // It should be XSS safe since `iframe` has sandbox attribute
      this.frameRef.current.contentDocument.body.innerHTML =
        taskInfo.response.data[tabIndex];
      // Adjust height by content
      this.frameRef.current.style.height = `${
        this.frameRef.current.contentDocument.body.scrollHeight
      }px`;
    }
  }

  getFeedback = () => {
    const { taskInfo } = this.props;
    const { tabIndex } = this.state;
    switch (tabIndex) {
      case "htmlFeedback":
        this.updateIFrame();
        break;
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
            value={JSON.stringify(taskInfo.response.data[tabIndex], null, "  ")}
            width={"100%"}
          />
        );
      case "analysisInput":
        return (
          <AceEditor
            maxLines={Infinity}
            minLines={3}
            mode="json"
            readOnly={true}
            setOptions={{ showLineNumbers: false }}
            theme="github"
            value={JSON.stringify(taskInfo.response.data[tabIndex], null, "  ")}
            width={"100%"}
          />
        );
      case "ipynbFeedback":
        return <NotebookPreview notebook={taskInfo.response.data[tabIndex]} />;
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
          {taskInfo &&
            taskInfo.response &&
            taskInfo.response.data &&
            taskInfo.response.data["ipynbFeedback"] && (
              <Tab label="ipynb" value="ipynbFeedback" />
            )}
          {taskInfo &&
            taskInfo.response &&
            taskInfo.response.data &&
            taskInfo.response.data["analysisInput"] && (
              <Tab label="Analysis Input" value="analysisInput" />
            )}
        </Tabs>
        <iframe
          hidden={tabIndex !== "htmlFeedback"}
          ref={this.frameRef}
          sandbox="allow-same-origin"
          style={styles.iframeStyle}
          title="HTML Preview"
        />
        {taskInfo &&
          taskInfo.response &&
          taskInfo.response.data &&
          taskInfo.response.data[tabIndex] &&
          this.getFeedback()}
      </React.Fragment>
    );
  }
}
