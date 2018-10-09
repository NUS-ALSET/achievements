import React, {Fragment} from 'react';
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import PropTypes from 'prop-types';
import Select from "@material-ui/core/Select";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import { APP_SETTING } from "../../achievementsApp/config";
import Input from "@material-ui/core/Input";


const GameActivity = ({activity, onFieldChange}) => (
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
    <FormControl fullWidth margin="normal">
      <InputLabel htmlFor="select-mode">Select Play Mode</InputLabel>
      <Select
        input={<Input id="select-mode" />}
        margin="none"
        MenuProps={{
          PaperProps: {
            style: {
              maxHeight: 224,
              width: 250
            }
          }
        }}
        onChange={e => onFieldChange("playMode", e.target.value)}
        value={activity.playMode}
      >
        {[{ mode : 'manual control', label : 'Manual Control' },{ mode : 'custom code', label : 'Custom Code' }].map(key => (
          <MenuItem key={key.mode} value={key.mode}>
            {key.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
    {/* <FormControl fullWidth margin="normal">
      <InputLabel htmlFor="select-level">Select minimum level game must be won at</InputLabel>
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
        onChange={e => onFieldChange("levelsToWin", e.target.value)}
        value={activity.levelsToWin}
      >
        {[1,2,3].map(key => (
          <MenuItem key={key} value={key}>
            {key}
          </MenuItem>
        ))}
      </Select>
    </FormControl> */}
    <TextField
        value={activity.unitsPerSide}
        fullWidth
        type="number"
        label="Number of units each side will have in the game."
        margin="dense"
        onChange={e => onFieldChange("unitsPerSide", e.target.value)}
      />
    <TextField
      value={activity.scoreToWin}
      fullWidth
      label="Score to Win"
      margin="dense"
      type="number"
      onChange={e => onFieldChange("scoreToWin", e.target.value)}
    />
    <TextField
      value={activity.gameTime}
      fullWidth
      label="Select the maximum time limit (in seconds)"
      margin="dense"
      type="number"
      onChange={e => onFieldChange("gameTime", Number(e.target.value))}
    />
  </Fragment>
);
GameActivity.propTypes = {
  activity: PropTypes.objectOf(Object).isRequired,
  onFieldChange: PropTypes.func.isRequired,
}
export default GameActivity;