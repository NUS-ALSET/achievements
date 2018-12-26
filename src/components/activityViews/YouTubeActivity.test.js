import React from 'react';
import YouTubeActivity from "./YouTubeActivity";
import { shallow } from 'enzyme';

describe('<YouTubeActivity />', () => {
  let props = {
    dispatch: jest.fn(),
    onChange: jest.fn(),
    problem: {youtubeURL: "lalala"},
    solution: "somthing"
  };

  it('renders without crashing', () => {
    shallow(<YouTubeActivity {...props} />);
  });
});