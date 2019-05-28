import React from "react";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import PropTypes from "prop-types";

class ServiceForm extends React.Component {

    static propTypes = {
        handleServiceChange: PropTypes.func,
        createNewService: PropTypes.func,
        validate: PropTypes.func,
        editing: PropTypes.bool,
        service: PropTypes.object,
        updateServiceDetails: PropTypes.func
    };

    componentDidUpdate(prevProps) {
        if (Object.keys(this.props.service).length
        && JSON.stringify(prevProps.service) !== JSON.stringify(this.props.service)) {
            this.setState({
                service: this.props.service
            });
        }
    }

    state = {
        service: {}
    }

    addService = () => {
        const addUpdate = Object.keys(this.props.service).length
                            ? "updateServiceDetails" : "createNewService"
        this.props[addUpdate](this.state.service)
    }

    handleServiceChange = name => e => {
        this.setState({
            service: {
                ...this.state.service,
                [name]: e.target.value
            }
        });
    }
    
    render() {
        const {
            service,
            service: {
            name, accessToken, profileUrl, levelsUrl, url, description
            }
        } = this.state;
        this.props.validate(!(name && accessToken && url && profileUrl && levelsUrl && description))
        return (
            <Grid container spacing={24}>
                <Grid item xs={12}>
                    <TextField
                        disabled={this.props.editing}
                        fullWidth
                        label={"Service Name"}
                        onChange={this.handleServiceChange("name")}
                        value={service.name || ""}
                    />
                    <TextField
                        fullWidth
                        label={"Access Token"}
                        onChange={this.handleServiceChange("accessToken")}
                        value={service.accessToken || ""}
                    />
                    <TextField
                        fullWidth
                        label={"Base URL"}
                        onChange={this.handleServiceChange("url")}
                        value={service.url || ""}
                    />
                    <TextField
                        fullWidth
                        label={"Profile URL"}
                        onChange={this.handleServiceChange("profileUrl")}
                        value={service.profileUrl || ""}
                    />
                    <TextField
                        fullWidth
                        label={"Levels URL"}
                        onChange={this.handleServiceChange("levelsUrl")}
                        value={service.levelsUrl || ""}
                    />
                    <TextField
                        fullWidth
                        label={"Description"}
                        onChange={this.handleServiceChange("description")}
                        value={service.description || ""}
                    />
                </Grid>
            </Grid>
        );
    }
}

export default ServiceForm;