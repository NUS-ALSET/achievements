/**
 * @file PathsSelector container module
 * @author Theodor Shaytanov <theodor.shaytanov@gmail.com>
 * @created 19.09.18
 */

import React from "react";
import PropTypes from "prop-types";
import FormControl from "@material-ui/core/FormControl/FormControl";
import InputLabel from "@material-ui/core/InputLabel/InputLabel";
import Select from "@material-ui/core/Select/Select";
import Input from "@material-ui/core/Input/Input";
import ListSubheader from "@material-ui/core/ListSubheader/ListSubheader";
import MenuItem from "@material-ui/core/MenuItem/MenuItem";
import Checkbox from "@material-ui/core/Checkbox/Checkbox";
import ListItemText from "@material-ui/core/ListItemText/ListItemText";

const ITEMS_HEIGHT = 216;
const ITEM_PADDING_TOP = 8;

class PathsSelector extends React.PureComponent {
  static propTypes = {
    allowMultiple: PropTypes.bool,
    onChange: PropTypes.func,
    paths: PropTypes.shape({
      myPaths: PropTypes.object,
      publicPaths: PropTypes.object
    }),
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.arrayOf(PropTypes.string)
    ])
  };

  static defaultProps = {
    allowPublic: true,
    multiple: false,
    value: []
  };

  render() {
    const { allowMultiple, onChange, paths, value } = this.props;
    const myPaths = paths.myPaths;
    const publicPaths = paths.publicPaths;

    const selected = Array.isArray(value) ? value : [value];

    return (
      <FormControl disabled={!(myPaths && publicPaths)} fullWidth>
        <InputLabel htmlFor="select-multiple-checkbox">Paths</InputLabel>
        <Select
          input={<Input id="select-multiple-checkbox" />}
          MenuProps={{
            PaperProps: {
              style: {
                maxHeight: ITEMS_HEIGHT + ITEM_PADDING_TOP,
                width: 250
              }
            }
          }}
          multiple={allowMultiple}
          onChange={onChange}
          renderValue={selected =>
            Array.isArray(selected)
              ? selected
                  .map(
                    id =>
                      ((myPaths || {})[id] || (publicPaths || {})[id] || {})
                        .name || ""
                  )
                  .join(", ")
              : selected
          }
          value={selected}
        >
          {myPaths && (
            <ListSubheader
              component="div"
              disableSticky
              style={{ outlineWidth: 0 }}
            >
              Own Paths
            </ListSubheader>
          )}
          {myPaths &&
            Object.keys(myPaths).map(id => (
              <MenuItem key={id} value={id}>
                <Checkbox checked={selected.includes(id)} />
                <ListItemText primary={myPaths[id].name} />
              </MenuItem>
            ))}
          {publicPaths && (
            <ListSubheader
              component="div"
              disableSticky
              style={{ outlineWidth: 0 }}
            >
              Public Paths
            </ListSubheader>
          )}
          {publicPaths &&
            Object.keys(publicPaths).map(id => (
              <MenuItem key={id} value={id}>
                <Checkbox checked={selected.includes(id)} />
                <ListItemText primary={publicPaths[id].name} />
              </MenuItem>
            ))}
        </Select>
      </FormControl>
    );
  }
}

export default PathsSelector;
