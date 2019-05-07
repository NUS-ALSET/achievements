import React from "react";
import AceEditor from "react-ace";
import "brace/mode/javascript";
import "brace/mode/jsx";
import "brace/mode/css";
import "brace/mode/typescript";
import "brace/mode/scss";
import "brace/theme/github";

const extensions = {
  js: "jsx", // becuase in react javascript is reactive javascript
  py: "python",
  ts: "typescript"
};

class Editor extends React.Component {
  constructor() {
    super();
    this.state = {
      code: "",
      extension: "jsx"
    };
    this.isResetUndoManager = false;
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.selectedFile) {
      if (
        this.props.selectedFile &&
        this.props.selectedFile.path !== nextProps.selectedFile.path &&
        this.props.selectedFile.code !== this.state.code
      ) {
        const hasOk = window.confirm("Do you want to save changes?");
        if (hasOk) {
          this.props.saveFile(this.props.selectedFile, this.state.code);
        }
      }
      const exts = nextProps.selectedFile.path.split(".");
      let ext = exts[exts.length - 1];
      ext = extensions[ext] ? extensions[ext] : ext;
      this.setState({ code: nextProps.selectedFile.code, extension: ext });
      this.isResetUndoManager = true;
    }
  }
  resetUndoManager = () => {
    if (this.isResetUndoManager) {
      const session = this.refs.AceEditor.editor.getSession();
      const undoManager = session.getUndoManager();
      undoManager.reset();
      session.setUndoManager(undoManager);
      this.isResetUndoManager = false;
    }
  };
  componentDidUpdate() {
    this.resetUndoManager();
  }
  componentDidMount() {
    this.resetUndoManager();
  }
  render() {
    const readOnly = (() => {
      if (typeof this.props.readOnly === "undefined") {
        return this.props.selectedFile &&
        (this.props.selectedFile.readOnly || this.props.readOnly)
      } else {
        return this.props.readOnly;
      }
    })();

    return (
      <div className="editor">
        <button
          className="save-btn"
          onClick={() =>
            this.props.saveFile(this.props.selectedFile, this.state.code)
          }
          style={{
            right:
            this.props.selectedFile && this.props.selectedFile.code === this.state.code
                ? "-250px"
                : "0px"
          }}
        >
          Save File
        </button>
        <AceEditor
          editorProps={{ $blockScrolling: true }}
          fontSize={16}
          height={"100%"}
          mode={this.state.extension}
          name="alsetEditor"
          onChange={v => {
            this.setState({ code: v });
          }}
          readOnly={
            readOnly
          }
          ref="AceEditor"
          showPrintMargin={false}
          theme="github"
          value={this.state.code}
          width={"100%"}
        />
      </div>
    );
  }
}

export default Editor;
