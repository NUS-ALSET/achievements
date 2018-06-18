import React from "react";
import RecommendationListCard from "./RecommendationListCard";

import DummyReduxState from './DummyDataFirebase';

class HomeV2 extends React.PureComponent {
  render() {
    // three dummy RecommendationListCard
    // two for python problems, one for YouTube videos
    return (
      <div>
        <RecommendationListCard
          RecomType="python"
          dummyData={DummyReduxState.pythonBigList}
        />
        <br />
        <RecommendationListCard
          RecomType="python"
          dummyData={DummyReduxState.pythonSmallList}
        />
        <br />
        <RecommendationListCard
          RecomType="youtube"
          dummyData={DummyReduxState.YouTubeList}
        />
      </div>
    );
  }
}

export default HomeV2;
