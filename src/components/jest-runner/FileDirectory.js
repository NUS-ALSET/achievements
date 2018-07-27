import React from 'react';

class FileDirectory extends React.Component {
    constructor() {
        super();
        this.state = {}
    }
    render() {
        return (
            <div className="sidebar">
                {this.props.files.map(file => file.type !== 'dir' && (
                    <a key={file.path} className={this.props.selectedFile && this.props.selectedFile.path === file.path ? "file1 pointer active-file" : "file1 pointer"} onClick={() => this.props.openFile(file.path)}><span  role="img" aria-label={file.readOnly ? 'Not Editable' : 'Editble'}>{file.readOnly ? '🚫' : '✅'}</span> {file.path}</a>
                ))}
            </div>
        )
    }
}

export default FileDirectory;