import React from "react";
import { createShallow } from "@material-ui/core/test-utils";
import ${NAME} from "../${NAME}";

describe("<${NAME}>", () => {
  let shallow;

  beforeEach(() => {
    shallow = createShallow();
  });

  it("should check snapshot", () => {
    const wrapper = shallow(<${NAME} />);

    expect(wrapper).toMatchSnapshot();
  });

});
