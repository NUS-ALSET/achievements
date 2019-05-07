import React from "react";
import VisibilityIcon from "@material-ui/icons/Visibility";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/DeleteForever";

class FileDirectory extends React.Component {
  constructor() {
    super();
    this.state = {};
  }
  render() {
    
    return (
      <div className="sidebar">
        {this.props.files.map(
          (file, index) =>
            file.type !== "dir" && (
              <div
                className={
                  this.props.selectedFile &&
                  this.props.selectedFile.path === file.path
                    ? "file1 pointer active-file"
                    : "file1 pointer"
                }
                key={file.path + index}
                style={{display:'flex'}}
              >
              <div style={{ width :"72px"}}>
                <span
                  aria-label={file.readOnly ? "Not Editable" : "Editable"}
                  role="img"
                >
                  {this.props.editMode ? <EditIcon/> : file.readOnly ? <VisibilityIcon/> : <EditIcon/> }
                </span>
                {this.props.editMode && <span onClick={() => this.props.deleteFile(file)}>
                  <DeleteIcon style={{right: "0px"}} />
                </span>}
              </div>
              <div onClick={() => this.props.openFile(file.path)} style={{width : "calc(100% - 72px)"}}>
                {file.path}
              </div>
              </div>
            )
        )}
      </div>
    );
  }
}

export default FileDirectory;
