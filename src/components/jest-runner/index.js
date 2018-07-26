import React from 'react';
import Editor from './Editor';
import Output from './Output';
import Loader from './Loader';
import Notification from './Notification';
import FileDirectory from './FileDirectory';

import {APP_SETTING} from '../../achievementsApp/config';

import './index.css';



class JestRunner extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            output: null,
            notificationMsg: '',
            selectedFile: props.files && props.files.length>0 ? props.files[0] : null,
            files: props.files || []
        };
    }
    componentWillReceiveProps(nextProps){
        this.setState({ files : nextProps.files || [], selectedFile: nextProps.files && nextProps.files.length>0 ? nextProps.files[0] : null})
    }
    showNotification = (message) => {
        this.setState({ notificationMsg: message });
    }
    showLoading = () => {
        this.setState({ loading: true });
    }
    hideLoading = () => {
        this.setState({ loading: false });
    }
    showOutput = (output) => {
        this.setState({ output: output });
    }
    hideOutput = () => {
        this.setState({ output: null });
    }
    handleError = (err = {}) => {
        console.log('error', err);
        this.showNotification('Error');
        this.hideLoading();
    }
    openFile = (filePath) => {
        const selectedFile = this.state.files.find(file => file.path === filePath);
        if (selectedFile) {
            this.setState({ selectedFile })
        }
    }
    saveFile = (file, code) => {
        this.setState({ files: this.state.files.map(f => f.path === file.path ? { ...f, code } : f) ,selectedFile : {...this.state.selectedFile, code}})
    }
    postFiles = () => {
        this.hideOutput();
        // this.saveFile();
        let body = {}
        if (this.state.files.length === 0) {
            return;
        }
        this.state.files.forEach(file => {
            if (file.type !== 'dir') {
                const fileName =  file.path;
                body[fileName] = file.code;
            }
        })
        this.showLoading();
        fetch(APP_SETTING.AWS_SERVER_URL, {
            method: 'POST',
            body: JSON.stringify({ files: body }),
            headers: {
                "Content-Type": "application/json; charset=utf-8",
            },
        })
            .then(response => response.json())
            .then(data => {
                console.log('server response', data, JSON.stringify(data));
                if (data.message && data.message === 'Internal server error') {
                    // this.showOutput(data.message);

                } else {
                    this.showOutput(data.results);
                }
                this.hideLoading();
            })
            .catch(err => {
                this.handleError(err);
                // this.showResult(err.message);
            })
    }
    render() {
        const { output, loading, notificationMsg, files, selectedFile } = this.state;
        return (
            <div>
                <div className="super">
                    {files.length > 0 &&
                        <div className="mainWrap" id="editor-panel">

                            <div className="container" id="container">
                                <FileDirectory files={files} selectedFile={selectedFile} openFile={this.openFile} />
                                <Editor selectedFile={selectedFile} saveFile={this.saveFile} />
                            </div>

                            <div style={{ height: '97px' }}>
                                <p className="note">Note :Only files with <span  role="img" aria-label={'Editble'}>✅</span> icon are editable.</p>
                                <button className="bigBtn" id="postButton" onClick={this.postFiles}>Run Tests</button>
                            </div>

                        </div>}
                    {output && <Output output={output} />}
                </div>
                {loading && <Loader />}
                <Notification message={notificationMsg} />
            </div>)
    }

}

export default JestRunner;
