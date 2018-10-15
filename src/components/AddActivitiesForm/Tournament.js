import React, {Fragment} from 'react';
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import PropTypes from 'prop-types';
import Select from "@material-ui/core/Select";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import { APP_SETTING } from "../../achievementsApp/config";
import Input from "@material-ui/core/Input";


const TournamentActivity = ({activity, onFieldChange}) => (
    <Fragment>
        <FormControl fullWidth margin="normal">
            <InputLabel shrink htmlFor="select-games">Select Game</InputLabel>
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
            value={activity.unitsPerSide}
            fullWidth
            type="number"
            label="Number of Units for Each Player"
            margin="dense"
            defaultValue="1"
            onChange={e => onFieldChange("unitsPerSide", e.target.value)}
        />
        <TextField
            value={activity.gameTime}
            fullWidth
            label="Select Game Time (sec)"
            margin="dense"
            type="number"
            defaultValue="60"
            onChange={e => onFieldChange("gameTime", Number(e.target.value))}
        />
        <TextField
            value={activity.minimumGameScore}
            fullWidth
            label="Score How Many Points to Win a Single Game"
            margin="dense"
            type="number"
            defaultValue="1"
            onChange={e => onFieldChange("minimumGameScore", e.target.value)}
        />
        <TextField
            value={activity.minimumTournamentScore}
            fullWidth
            label="Minimum tournament score needed to pass"
            margin="dense"
            type="number"
            defaultValue="1"
            onChange={e => onFieldChange("minimumTournamentScore", e.target.value)}
        />
    </Fragment>
);
TournamentActivity.propTypes = {
    activity: PropTypes.objectOf(Object).isRequired,
    onFieldChange: PropTypes.func.isRequired,
}
export default TournamentActivity;