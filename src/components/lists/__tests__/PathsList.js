import React from "react";
import { StaticRouter } from "react-router";
import sinon from "sinon";
import { createShallow ,createMount} from "@material-ui/core/test-utils";
import PathsList from "../PathsList";

describe("<PathsList />", () => {

  let shallow,
  mount,
  mockDispatch;
  beforeEach(() => {
    shallow = createShallow();
    mount = createMount();
    mockDispatch=sinon.spy();
  });

  it("Should test PathsList component", () => {
    const props = {
        dispatch :()=>{},
        header :"",
        paths :{},
        selectedPathId :"",
        userId :""
    };
    const component = shallow(
      <PathsList {...props} />
    );
    expect(component).toMatchSnapshot();
  });

  it("Should test selectPath function of PathsList component", () => {
    const props = {
        dispatch :mockDispatch,
        header :"",
        paths :{},
        selectedPathId :"",
        userId :""
    };
    const component = shallow(
      <PathsList {...props} />
    );
    component.instance().selectPath("test");
    expect(mockDispatch.calledWith({
      type: "PATH_SELECT",
      pathId : "test"
    })).toEqual(true);
  });
});
