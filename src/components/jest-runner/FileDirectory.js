import React from "react";

class FileDirectory extends React.Component {
  constructor() {
    super();
    this.state = {};
  }
  render() {
    return (
      <div className="sidebar">
        {this.props.files.map(file =>
          file.type !== "dir" && (
            <button
              className={
                this.props.selectedFile && this.props.selectedFile.path === file.path
                  ? "file1 pointer active-file"
                  : "file1 pointer"
              }
              key={file.path}
              onClick={() => this.props.openFile(file.path)}
            >
              <span  aria-label={file.readOnly ? "Not Editable" : "Editble"} role="img">
                {file.readOnly ? "readOnly" : "not readOnly"}
              </span>
              {file.path}
            </button>
          ))}
      </div>
    );
  }
}

export default FileDirectory;