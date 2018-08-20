import React from "react";
import { createShallow } from "@material-ui/core/test-utils";
import sinon from "sinon";

import Button from "@material-ui/core/Button";

import { Paths } from "../Paths";

describe("<Paths.test.js>", () => {
  let shallow;
  let dispatch;

  beforeEach(() => {
    shallow = createShallow();
    dispatch = sinon.spy();
  });

  it("should check snapshot", () => {
    const wrapper = shallow(
      <Paths
        dispatch={dispatch}
        joinedPaths={{}}
        myPaths={{}}
        problems={[]}
        publicPaths={{}}
        selectedPathId="asd"
        ui={{ dialog: {} }}
        uid={"abcd"}
      />
    );

    expect(wrapper.find(Button).length).toBe(0);
  });
});
