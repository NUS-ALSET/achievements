/* eslint-disable no-magic-numbers */
import React from "react";
import { createShallow } from "@material-ui/core/test-utils";
import sinon from "sinon";
import renderer from "react-test-renderer";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import { BrowserRouter as Router } from "react-router-dom";

import PathsTable from "../PathsTable";
import { TableBody, TableRow, IconButton } from "@material-ui/core";

describe("<PathsTable>", () => {
  let shallow;
  let mockDispatch;

  beforeEach(() => {
    mockDispatch = sinon.spy();
    shallow = createShallow({
      dive: true
    });
  });

  it("should generate cells wihout throwing", () => {
    const wrapper = shallow(
      <PathsTable
        pathDialogShow={mockDispatch}
        paths={{
          "LEOF9q3Vdsd-gx1": { pathKey: "LEOF9q3Vdsd-gx1" },
          "LEOF9dedq3V-gx1": { pathKey: "LEOF9dedq3V-gx1" }
        }}
        viewCreatedTab={true}
      />
    );

    expect(wrapper.find(TableHead).find(TableCell).length).toEqual(4);
  });

  it("should generate rows without throwing", () => {
    const wrapper = shallow(
      <PathsTable
        pathDialogShow={mockDispatch}
        paths={{
          "LEOF9q3Vdsd-gx1": { pathKey: "LEOF9q3Vdsd-gx1" },
          "LEOF9dedq3V-gx1": { pathKey: "LEOF9dedq3V-gx1" }
        }}
        viewCreatedTab={true}
      />
    );
    expect(wrapper.find(TableBody).find(TableRow).length).toEqual(2);
  });

  it("should render row w/o edit button", () => {
    const wrapper = shallow(
      <PathsTable
        pathDialogShow={mockDispatch}
        paths={{
          "LEOF9q3Vdsd-gx1": { pathKey: "LEOF9q3Vdsd-gx1" }
        }}
        viewCreatedTab={false}
      />
    );

    expect(wrapper.find(TableHead).find(TableCell).length).toEqual(5);
    expect(wrapper.find(IconButton).length).toEqual(1);
  });

  it("should render empty cell", () => {
    const wrapper = shallow(
      <PathsTable pathDialogShow={mockDispatch} paths={{}} />
    );
    expect(wrapper.find(TableBody).find(TableRow).length).toEqual(1);
  });

  it("should render cells for owner", () => {
    const wrapper = shallow(
      <PathsTable
        pathDialogShow={mockDispatch}
        paths={{}}
        viewCreatedTab={true}
      />
    );
    expect(
      wrapper
        .find(TableHead)
        .find(TableRow)
        .find(TableCell).length
    ).toEqual(4);
  });

  it("renders correctly when there are no paths", () => {
    const tree = renderer
      .create(
        <PathsTable
          pathDialogShow={mockDispatch}
          paths={{}}
          viewCreatedTab={true}
        />
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("renders correctly when there is one path", () => {
    const paths = {
      "LEOF9dedq3V-gx1": { pathKey: "LEOF9dedq3V-gx1" }
    };
    const tree = renderer
      .create(
        <Router>
          <PathsTable
            pathDialogShow={mockDispatch}
            paths={paths}
            viewCreatedTab={true}
          />
        </Router>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("renders correctly when there are multiple paths", () => {
    const paths = {
      "LEOF9dedq3V-gx1": { pathKey: "LEOF9dedq3V-gx1" },
      "LEOF9dedgfV-gx3": { pathKey: "LEOF9dedgfV-gx3" },
      "LEOF9debgbV-gx5": { pathKey: "LEOF9debgbV-gx5" }
    };
    const tree = renderer
      .create(
        <Router>
          <PathsTable
            pathDialogShow={mockDispatch}
            paths={paths}
            viewCreatedTab={true}
          />
        </Router>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
