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
        onCloseDialog={spy}
        onNotification={spy}
        onOpen={spy}
        onOpenSolution={spy}
        onProblemChangeRequest={spy}
        onProblemDialogShow={spy}
        onProblemMoveRequest={spy}
        onProblemSolutionSubmit={spy}
        onProfileUpdate={spy}
        onPushPath={spy}
        onRequestMoreProblems={spy}
        onToggleJoinStatus={spy}
        pathActivities={{
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
