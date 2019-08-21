import React from "react";
import { createShallow } from "@material-ui/core/test-utils";
import sinon from "sinon";
import RecommendationCard from "../RecommendationCard";

describe("<RecommendationCard />", () => {
  let shallow = createShallow();
  const spy = sinon.spy();
  const props = {
    activity: {
      activity: "-LOGaRA8Q88IJx1hOLu-",
      activityId: "-LOGaRA8Q88IJx1hOLu-",
      description: "Finish 'dungeons-of-kithgard' level at CodeCombat",
      type: "codeCombat",
      problem: "-LOGaRA8Q88IJx1hOLu-",
      name: "Dungeon 001 Dungeons of Kithgard"
    },
    classes: {
      mediaPython: "RecommendationCard-mediaPython-248",
      mediaYoutube: "RecommendationCard-mediaYoutube-249"
    },
    description: "CodeCombat Level",
    pathId: "-LOG_ocLPebY5IodDO8C",
    type: "game",
    video: "https://www.youtube.com/watch?v=RdZSrD4DUvs",
    subHeading: "test",
    onRecommendationClick: spy
  };
  let component;
  it("should test handleClick", () => {
    component = shallow(<RecommendationCard {...props} />);
    component
      .dive()
      .instance()
      .handleClick();
    expect(spy.calledWith("-LOGaRA8Q88IJx1hOLu-", "-LOG_ocLPebY5IodDO8C"));
  });
  it("should test getVideoID", () => {
    const pyLogoProp = { ...props, type: "python" };
    component = shallow(<RecommendationCard {...pyLogoProp} />);
    const testVidId = component
      .dive()
      .instance()
      .getVideoID("https://www.youtube.com/watch?v=RdZSrD4DUvs");
    expect(testVidId).toEqual("RdZSrD4DUvs");
  });
});
