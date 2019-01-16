import React from "react";
import VisibilityIcon from "@material-ui/icons/Visibility";
import EditIcon from "@material-ui/icons/Edit";

class FileDirectory extends React.Component {
  constructor() {
    super();
    this.state = {};
  }
  render() {
    return (
      <div className="sidebar">
        {this.props.files.map(
          file =>
            file.type !== "dir" && (
              <div
                className={
                  this.props.selectedFile &&
                  this.props.selectedFile.path === file.path
                    ? "file1 pointer active-file"
                    : "file1 pointer"
                }
                key={file.path}
                style={{display:'flex'}}
                onClick={() => this.props.openFile(file.path)}
              >
                <span
                  aria-label={file.readOnly ? "Not Editable" : "Editable"}
                  role="img"
                >
                  {file.readOnly ? <VisibilityIcon/> : <EditIcon/>}
                </span>
                &nbsp;&nbsp;{file.path}
              </div>
            )
        )}
      </div>
    );
  }
}

export default FileDirectory;
