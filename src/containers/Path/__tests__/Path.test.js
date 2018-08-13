import React from "react";
import { createShallow } from "@material-ui/core/test-utils";
import { Path } from "../Path";

// noinspection RequiredAttributes
describe("<Path>", () => {
  let shallow;
  let spy;

  beforeEach(() => {
    shallow = createShallow();
    spy = jest.fn();
  });

  it("should check snapshot", () => {
    const wrapper = shallow(
      <Path
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
          dialog: false
        }}
        uid="testUser"
      />
    );

    expect(wrapper).toMatchSnapshot();
  });
});
