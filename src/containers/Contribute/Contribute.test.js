import React from "react";
import Contribute from "./Contribute";
import { createMount } from "@material-ui/core/test-utils";

describe("<Contribute />", () => {
  const mount = createMount();
  let props = {
    classes: {
      contriButton: "Contribute-contriButton-292",
      leftIcon: "Contribute-leftIcon-293",
      mainContent: "Contribute-mainContent-291",
      mainDiv: "Contribute-mainDiv-290"
    }
  };
  it("should render properly", () => {
    let component = mount(<Contribute {...props} />);
  });
});
