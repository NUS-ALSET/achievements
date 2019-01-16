import React from "react";
import ReactDOM from "react-dom";
import Editor from "./Editor";
import Output from "./Output";
import Loader from "./Loader";
import Notification from "./Notification";
import FileDirectory from "./FileDirectory";
import EditIcon from "@material-ui/icons/Edit";

import { APP_SETTING } from "../../achievementsApp/config";

import "./index.css";

class JestRunner extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      output: null,
      notificationMsg: "",
      selectedFile: this.getFirstWritableFile(props),
      files: this.getFiles(props),
      solution: props.solution
    };
    this.testSolution = null;
  }
  getFirstWritableFile(props) {
    const files = this.getFiles(props);
    return files && files.length > 0
      ? files.find(f => !f.readOnly)
        ? files.find(f => !f.readOnly)
        : files[0]
      : null;
  }
  getFiles(props) {
    let files = [];
    if (props.files) {
      files = props.files;
    }
    if (props.solution && props.solution.solvedFiles) {
      files = files.map(f => {
        const solvedFile = props.solution.solvedFiles.find(
          f1 => f.path === f1.path
        );
        return solvedFile ? solvedFile : f;
      });
    }
    return files;
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      files: this.getFiles(nextProps),
      selectedFile: this.getFirstWritableFile(nextProps),
      solution: nextProps.solution
    });
  }
  showNotification = message => {
    this.setState({ notificationMsg: message });
  };
  showLoading = () => {
    this.setState({ loading: true });
  };
  hideLoading = () => {
    this.setState({ loading: false });
  };
  showOutput = output => {
    this.setState({ output: output });
    const jestRunnerNode = ReactDOM.findDOMNode(this.refs.jestRunnerEle);
    jestRunnerNode.scrollTo(0, 1000);
    this.testSolution = {
      files: [...this.state.files],
      output: output
    };
  };
  hideOutput = () => {
    this.setState({ output: null });
  };
  handleError = (err = {}) => {
    console.log("error", err);
    this.showNotification("Error");
    this.hideLoading();
  };
  openFile = filePath => {
    const selectedFile = this.state.files.find(file => file.path === filePath);
    if (selectedFile) {
      this.setState({ selectedFile });
    }
  };
  saveFile = (file, code) => {
    this.setState({
      files: this.state.files.map(f =>
        f.path === file.path ? { ...f, code } : f
      ),
      selectedFile: { ...this.state.selectedFile, code }
    });
  };
  postFiles = () => {
    this.hideOutput();
    // this.saveFile();
    let body = {};
    if (this.state.files.length === 0) {
      return;
    }
    this.state.files.forEach(file => {
      if (file.type !== "dir") {
        const fileName = file.path;
        body[fileName] = file.code;
      }
    });
    this.showLoading();
    this.testSolution = null;
    fetch(APP_SETTING.AWS_SERVER_URL, {
      method: "POST",
      body: JSON.stringify({ files: body }),
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      }
    })
      .then(response => response.json())
      .then(data => {
        console.log("server response", data);
        if (data.message && data.message === "Internal server error") {
          // this.showOutput(data.message);
        } else {
          this.showOutput(data.results);
        }
        this.hideLoading();
      })
      .catch(err => {
        this.handleError(err);
        // this.showResult(err.message);
      });
  };
  submitTest = () => {
    this.props.onSubmit(this.testSolution);
  };
  render() {
    const {
      output,
      loading,
      notificationMsg,
      files,
      selectedFile,
      solution
    } = this.state;
    const { readOnly } = this.props;
    return (
      <div>
        <div className="super" ref="jestRunnerEle">
          {files.length > 0 && (
            <div className="mainWrap" id="editor-panel">
              <div className="container" id="container">
                <FileDirectory
                  files={files}
                  openFile={this.openFile}
                  selectedFile={selectedFile}
                />
                <Editor
                  readOnly={readOnly}
                  saveFile={this.saveFile}
                  selectedFile={selectedFile}
                />
              </div>

              <div style={{ height: "97px" }}>
                <p className="note">
                  Note : Only files with{" "}
                  <span aria-label={"Editable"} role="img">
                    <EditIcon/>
                  </span>{" "}
                  icon are editable.
                </p>
                {!readOnly && (
                  <button className="bigBtn" onClick={this.postFiles}>
                    Run Tests
                  </button>
                )}
              </div>
            </div>
          )}
          {solution && solution.testResult && (
            <Output isSubmitted={true} output={solution.testResult} />
          )}
          {output && (
            <div>
              <Output output={output} />
              {output.success && (
                <div style={{ height: "97px" }}>
                  <button className="bigBtn" onClick={this.submitTest}>
                    {solution && solution.testResult
                      ? "Update Solution"
                      : "Submit Solution"}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        {loading && <Loader />}
        <Notification message={notificationMsg} />
      </div>
    );
  }
}

export default JestRunner;
