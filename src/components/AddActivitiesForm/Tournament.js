import React, {Fragment} from "react";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import PropTypes from "prop-types";
import Select from "@material-ui/core/Select";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import { APP_SETTING } from "../../achievementsApp/config";
import Input from "@material-ui/core/Input";


const TournamentActivity = ({activity, onFieldChange}) => (
    <Fragment>
        <FormControl fullWidth margin="normal">
            <InputLabel htmlFor="select-games" shrink>Select Game</InputLabel>
            <Select
                input={<Input id="select-games" />}
                margin="none"
                MenuProps={{
                PaperProps: {
                    style: {
                    maxHeight: 224,
                    width: 250
                    }
                }
                }}
                onChange={e => onFieldChange("game", e.target.value)}
                value={activity.game}
            >
                {Object.keys(APP_SETTING.games).map(id => (
                <MenuItem key={APP_SETTING.games[id].name} value={id}>
                    {APP_SETTING.games[id].name}
                </MenuItem>
                ))}
            </Select>
        </FormControl>

        <TextField
            defaultValue="1"
            fullWidth
            label="Number of Units for Each Player"
            margin="dense"
            onChange={e => onFieldChange("unitsPerSide", e.target.value)}
            type="number"
            value={activity.unitsPerSide}
        />
        <TextField
            defaultValue="60"
            fullWidth
            label="Select Game Time (sec)"
            margin="dense"
            onChange={e => onFieldChange("gameTime", Number(e.target.value))}
            type="number"
            value={activity.gameTime}
        />
        <TextField
            defaultValue="1"
            fullWidth
            label="Score How Many Points to Win a Single Game"
            margin="dense"
            onChange={e => onFieldChange("minimumGameScore", e.target.value)}
            type="number"
            value={activity.minimumGameScore}
        />
        <TextField
            defaultValue="1"
            fullWidth
            label="Minimum tournament score needed to pass"
            margin="dense"
            onChange={e => onFieldChange("minimumTournamentScore", e.target.value)}
            type="number"
            value={activity.minimumTournamentScore}
        />
    </Fragment>
);
TournamentActivity.propTypes = {
    activity: PropTypes.objectOf(Object).isRequired,
    onFieldChange: PropTypes.func.isRequired
};
export default TournamentActivity;