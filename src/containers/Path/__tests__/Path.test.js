/**
 * Path container tests
 */

import React from "react";
import { createShallow } from "@material-ui/core/test-utils";
import { Path } from "../Path";

import Button from "@material-ui/core/Button";

// noinspection RequiredAttributes
describe("<Path>", () => {
  let shallow;
  let spy;

  beforeEach(() => {
    shallow = createShallow();
    spy = jest.fn();
  });

  it("should generate Path container", () => {
    const wrapper = shallow(
      <Path
        classes={{}}
        match={{
          params: {
            pathId: "testPath"
          }
        }}
        onAddAssistant={spy}
        onAssistantKeyChange={spy}
        onCloseDialog={spy}
        onOpen={spy}
        onProblemChangeRequest={spy}
        onRemoveAssistant={spy}
        pathActivities={{
          activities: [],
          path: {
            id: ""
          }
        }}
        pathStatus="test"
        ui={{
          dialog: "false"
        }}
        uid="testUser"
      />
    );

    expect(wrapper.find(Button).length).toBe(0);
  });
});
