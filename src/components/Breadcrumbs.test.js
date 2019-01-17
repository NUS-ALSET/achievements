import React from "react";
import { shallow } from "enzyme";
import Button from "@material-ui/core/Button";
import Breadcrumbs from "./Breadcrumbs";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";


describe("<Breadcrumbs>", () => {
  it("Should render a non-link Typography if paths is single item", () => {
    const wrapper = shallow(
      <Breadcrumbs
        paths={[
          {
            label: "Cohorts",
            link: "/cohorts"
          }
        ]}
      />
    );
    expect(wrapper.dive().find(Button).length).toEqual(0);
    expect(wrapper.dive().find(Typography).length).toEqual(1);
  });

  it("should render a Button followed by a non-link Typography if paths contains multiple items", () => {
    const wrapper = shallow(
      <Breadcrumbs
        paths={[
          {
            label: "Cohorts",
            link: "/cohorts"
          },
          {
            label: "cohortName"
          }
        ]}
      />
    );
    expect(wrapper.dive().find(Button).length).toEqual(1);
  });

  it("Should render a ToolBar with Buttons for action props", () => {
    const wrapper = shallow(
      <Breadcrumbs
      action={[
        {
          label: "Refresh",
          handler: () => {}
        },
        {
          label: "Hide closed",
          handler: () => {}
        }
      ]
      }
      paths={[
        {
          label: "Courses",
          link: "/courses"
        },
        {
          label: "courseName"
        }
      ]}
    />
    );
    expect(wrapper.dive().find(Toolbar).length).toEqual(2);
    expect(wrapper.dive().find(Button).length).toEqual(3);
  });
});
