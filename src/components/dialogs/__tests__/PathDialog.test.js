import React from "react";

import { createShallow } from "@material-ui/core/test-utils";
import Button from "@material-ui/core/Button";

import PathDialog from "../PathDialog";

describe("<PathDialog>", () => {
  let mockSnapshot;
  let shallow;

  beforeEach(() => {
    mockSnapshot = jest.fn();
    shallow = createShallow();
  });

  // it("should check snapshot", () => {
  //   const wrapper = shallow(<PathDialog dispatch={mockSnapshot}/>);
  //
  //   expect(wrapper).toMatchSnapshot();
  // });
  it("should remove empty", () => {
    const wrapper = shallow(<PathDialog dispatch={mockSnapshot} open={true} />);

    expect(wrapper.instance().removeEmpty({ name: "" })).toEqual({});
    expect(wrapper.instance().removeEmpty({ name: "test" })).toEqual({
      name: "test"
    });
  });

  it("should dispatch `pathChangeRequest` for new path", () => {
    const wrapper = shallow(<PathDialog dispatch={mockSnapshot} open={true} />);
    const commitButton = wrapper.find(Button).at(1);

    commitButton.simulate("click");
    expect(mockSnapshot.mock.calls[0][0]).toEqual({
      pathInfo: {},
      type: "PATH_CHANGE_REQUEST"
    });

    wrapper.setState({
      name: "test"
    });
    commitButton.simulate("click");
    expect(mockSnapshot.mock.calls[1][0]).toEqual({
      pathInfo: { name: "test" },
      type: "PATH_CHANGE_REQUEST"
    });
  });

  it("should dispatch `pathChangeRequest` for existing path", () => {
    const wrapper = shallow(
      <PathDialog
        dispatch={mockSnapshot}
        open={true}
        path={{
          id: "deadbeef",
          name: "foobar"
        }}
      />
    );
    const commitButton = wrapper.find(Button).at(1);
    commitButton.simulate("click");
    expect(mockSnapshot.mock.calls[0][0]).toEqual({
      pathInfo: { id: "deadbeef", name: "foobar" },
      type: "PATH_CHANGE_REQUEST"
    });

    wrapper.setState({
      name: "test"
    });
    commitButton.simulate("click");

    expect(mockSnapshot.mock.calls[1][0]).toEqual({
      pathInfo: { id: "deadbeef", name: "test" },
      type: "PATH_CHANGE_REQUEST"
    });
  });
});
