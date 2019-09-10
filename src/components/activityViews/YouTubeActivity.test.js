import React from "react";
import YouTubeActivity from "./YouTubeActivity";
import { mount } from "enzyme";

describe("<YouTubeActivity />", () => {
  let props = {
    dispatch: jest.fn(),
    onChange: jest.fn(),
    problem: {
      code: 1,
      description: "dummy description",
      fronzen: 1,
      isCorrectInput: true,
      name: "test",
      orderIndex: 2,
      owner: "I9nQZbQ5xMdklnudDqGfh1ucOZz2",
      path: "-LKe6K_c8h-g7nnfREc6",
      pathId: "-LKe6K_c8h-g7nnfREc6",
      pathName: "test pathname",
      problemId: "LKe_rbtMrzSW5E3Swz9",
      problemName: "test name",
      questionAfer: true,
      solved: true,
      type: "youtube",
      youtubeURL: "https://www.youtube.com/watch?v=XvDZLjaCJuw",
      questionAnswer: true,
      topics: true,
      questionCustom: true,
      customText: "test text"
    },
    solution: {
      checked: false,
      loading: false,
      answers: "Wrong answer haha",
      youtubeEvents: {}
    },
    setProblemOpenTime: jest.fn()
  };

  it("should be able to use methods to change internal state", () => {
    let component = mount(<YouTubeActivity {...props} />);
    component.instance().setAnswer("test qns", "answer");
    component.instance().setYoutubeEvent("play", 0.019344165939331054);
  });
});
