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
            <InputLabel htmlFor="select-games">Select Game</InputLabel>
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
            label="Number of units each side will have in the game."
            margin="dense"
            onChange={e => onFieldChange("unitsPerSide", e.target.value)}
        />
        <TextField
            value={activity.gameTime}
            fullWidth
            label="Select the maximum time limit (in seconds)"
            margin="dense"
            type="number"
            onChange={e => onFieldChange("gameTime", Number(e.target.value))}
        />
        <FormControl fullWidth margin="normal">
            <InputLabel htmlFor="select-level">Select the minimum score needed to win an individual game</InputLabel>
            <Select
                input={<Input id="select-level" />}
                margin="none"
                MenuProps={{
                PaperProps: {
                    style: {
                    maxHeight: 224,
                    width: 250
                    }
                }
                }}
                onChange={e => onFieldChange("minimumGameScore", e.target.value)}
                value={activity.minimumGameScore}
            >
                {[0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10].map(key => (
                <MenuItem key={key} value={key}>
                    {key}
                </MenuItem>
                ))}
            </Select>
        </FormControl>
        <FormControl fullWidth margin="normal">
            <InputLabel htmlFor="select-level">Select the minimum tournament score needed</InputLabel>
            <Select
                input={<Input id="select-level" />}
                margin="none"
                MenuProps={{
                PaperProps: {
                    style: {
                    maxHeight: 224,
                    width: 250
                    }
                }
                }}
                onChange={e => onFieldChange("minimumTournamentScore", e.target.value)}
                value={activity.minimumTournamentScore}
            >
                {[0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10].map(key => (
                <MenuItem key={key} value={key}>
                    {key}
                </MenuItem>
                ))}
            </Select>
        </FormControl>
    </Fragment>
);
TournamentActivity.propTypes = {
    activity: PropTypes.objectOf(Object).isRequired,
    onFieldChange: PropTypes.func.isRequired,
}
export default TournamentActivity;