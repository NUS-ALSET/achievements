import React from "react";
import { createShallow } from "@material-ui/core/test-utils";
import sinon from "sinon";
import { RecommendationsListCard } from "../RecommendationsListCard";
import AdbIcon from "@material-ui/icons/Adb";
import CodeIcon from "@material-ui/icons/Code";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";

describe("<RecommendationsListCard />", () => {
  const spy = sinon.spy();
  const shallow = createShallow();
  let props = {
    onRecommendationClick: spy,
    width: "xs",
    type: "game",
    title: "test",
    classes: {
      avatarCode: "RecommendationsListCard-avatarCode-229",
      avatarGame: "RecommendationsListCard-avatarGame-230",
      avatarYoutube: "RecommendationsListCard-avatarYoutube-231",
      card: "RecommendationsListCard-card-232",
      media: "RecommendationsListCard-media-233"
    },
    data: [
      {
        activity: "-LOGaRA8Q88IJx1hOLu-",
        activityId: "-LOGaRA8Q88IJx1hOLu-",
        description: "Finish 'dungeons-of-kithgard' level at CodeCombat",
        type: "codeCombat",
        problem: "-LOGaRA8Q88IJx1hOLu-",
        name: "Dungeon 001 Dungeons of Kithgard",
        level: "test",
        orderIndex: 2,
        path: "-LOG_ocLPebY5IodDO8C",
        owner: "I9nQZbQ5xMdklnudDqGfh1ucOZz2",
        feature: "activity",
        featureType: "codeCombat",
        subHeading: "test"
      },
      {
        activity: "-LKe_zLCjXM9zRpvdzaX",
        activityId: "-LKe_zLCjXM9zRpvdzaX",
        description: "Watch Video and answer the questions",
        type: "youtube",
        problem: "-LKe_zLCjXM9zRpvdzaX",
        name: "Brian Kernighan on Associative Arrays",
        level: "test",
        orderIndex: 1,
        path: "-LKe6K_c8h-g7nnfREc6",
        owner: "I9nQZbQ5xMdklnudDqGfh1ucOZz2",
        feature: "activity",
        featureType: "youtube",
        subHeading: "test"
      },
      {
        activity: "-LM7wOmh-_DT4-b_QwWb",
        activityId: "-LM7wOmh-_DT4-b_QwWb",
        description: "Jupyter Notebook Activity",
        type: "youtube",
        problem: "-LM7wOmh-_DT4-b_QwWb",
        name: "Reorder Array to Odd first",
        orderIndex: 3,
        level: "test",
        path: "-LLd7A7XpcbQiQ9pzAIX",
        owner: "I9nQZbQ5xMdklnudDqGfh1ucOZz2",
        feature: "activity",
        featureType: "jupyterInline",
        subHeading: "test",
        problemURL:
          "https://colab.research.google.com/drive/15dninDyXHKz6HRHs-xfeFxq3dQtYzE3I",
        defaultDestinationKey: "-LM7wPc25sVlAPtbO6DR"
      }
    ]
  };
  let component;
  it("should test getItemDescription", () => {
    component = shallow(<RecommendationsListCard {...props} />);
    expect(component.instance().getItemDescription("")).toEqual("");
    expect(component.instance().getItemDescription("codeCombat")).toEqual(
      "CodeCombat Level"
    );
    expect(component.instance().getItemDescription("jupyter")).toEqual(
      "Colaboratory Notebook"
    );
    expect(component.instance().getItemDescription("jupyterInline")).toEqual(
      "Jupyter Notebook"
    );
    expect(
      component.instance().getItemDescription("NotebookWithUsedSkills")
    ).toEqual("Python Skills");
    expect(component.instance().getItemDescription("youtube")).toEqual("");
  });

  it("should test getSubHeader", () => {
    component = shallow(<RecommendationsListCard {...props} />);
    expect(component.instance().getSubHeader()).toEqual("");
    let testProps = { ...props, title: "CodeCombat Activities" };
    component = shallow(<RecommendationsListCard {...testProps} />);
    expect(component.instance().getSubHeader()).toEqual(
      "Recommended because you have not played them"
    );
    testProps = { ...props, title: "Colaboratory Notebook Activities" };
    component = shallow(<RecommendationsListCard {...testProps} />);
    expect(component.instance().getSubHeader()).toEqual(
      "Recommended because you have not given them a try"
    );
    testProps = {
      ...props,
      title: "Jupyter Notebook Activities With New Skills"
    };
    component = shallow(<RecommendationsListCard {...testProps} />);
    expect(component.instance().getSubHeader()).toEqual(
      "Recommended for you to try new Python skills you have not used before"
    );
    testProps = {
      ...props,
      title: "Jupyter Notebook Activities With Solved Skills"
    };
    component = shallow(<RecommendationsListCard {...testProps} />);
    expect(component.instance().getSubHeader()).toEqual(
      "What are solved skills? to enhance their existing knowledge?"
    );
    testProps = {
      ...props,
      title: "YouTube Video Activities"
    };
    component = shallow(<RecommendationsListCard {...testProps} />);
    expect(component.instance().getSubHeader()).toEqual(
      "Recommended because you have not watched these videos"
    );
  });

  it("should test getAvatarIcon", () => {
    component = shallow(<RecommendationsListCard {...props} />);
    expect(component.instance().getAvatarIcon()).toEqual(<AdbIcon />);
    let testProps = { ...props, type: "youtube" };
    component = shallow(<RecommendationsListCard {...testProps} />);
    expect(component.instance().getAvatarIcon()).toEqual(<PlayArrowIcon />);
    testProps = { ...props, type: "code" };
    component = shallow(<RecommendationsListCard {...testProps} />);
    expect(component.instance().getAvatarIcon()).toEqual(<CodeIcon />);
  });
});
