import React from "react";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import PropTypes from "prop-types";

class AddNewService extends React.Component {

    static propTypes = {
        handleServiceChange: PropTypes.func,
        createNewService: PropTypes.func,
        validate: PropTypes.func,
        editing: PropTypes.bool,
        service: PropTypes.object
      };

    state = {
        newServiceDetails: {}
    }

    addService = () => {
        this.props.createNewService(this.state.newServiceDetails);
    }
    handleServiceChange = name => e => {
        this.setState({
            newServiceDetails: {
                ...this.state.newServiceDetails,
                [name]: e.target.value
            }
        }, () => {
            const { newServiceDetails: { name, accessToken, profileUrl, levelsUrl }} = this.state;
            this.props.validate(!(name && accessToken && profileUrl && levelsUrl))
        });
    }

    
    render() {
        const { editing, service } = this.props;
        return (
            <Grid container spacing={24}>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label={"Service Name"}
                        onChange={this.handleServiceChange("name")}
                        value={service.name}
                    />
                    <TextField
                        fullWidth
                        label={"Access Token"}
                        onChange={this.handleServiceChange("accessToken")}
                        value={service.accessToken}
                    />
                    <TextField
                        fullWidth
                        label={"Profile URL"}
                        onChange={this.handleServiceChange("profileUrl")}
                        value={service.profileUrl}
                    />
                    <TextField
                        fullWidth
                        label={"Levels URL"}
                        onChange={this.handleServiceChange("levelsUrl")}
                        value={service.levelsUrl}
                    />
                </Grid>
                <Grid item sm={9} xs={12} />
            </Grid>
        );
    }
}

export default AddNewService;