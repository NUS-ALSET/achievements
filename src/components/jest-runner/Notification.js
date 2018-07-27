import React from 'react';

class Notification extends React.Component {
    constructor() {
        super();
        this.state = {
            hide: true
        }
    }
    componentWillReceiveProps(nextProps) {
        this.setState({ hide: !nextProps.message });
        setTimeout(() => {
            this.setState({ hide: true });
        }, 3000)
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