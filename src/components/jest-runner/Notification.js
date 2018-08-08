import React from 'react';

class Notification extends React.Component {
    constructor() {
        super();
        this.state = {
            hide: true
        }
        this.timer = null;
    }
    componentWillReceiveProps(nextProps) {
        this.setState({ hide: !nextProps.message });
        this.timer=setTimeout(() => {
            this.setState({ hide: true });
        }, 3000)
    }
    componentWillUnmount(){
        window.clearTimeout(this.timer);
    }
    render() {
        return this.state.hide ? '' :
            (<div className="notification">
                {this.props.message}
            </div>
            )
    }
}

export default Notification;