import React from "react";
import RecommendationListCardPy from "./RecommendationListCardPy";
import RecommendationListCardYo from "./RecommendationListCardYo";

class HomeV2 extends React.PureComponent {
  render() {
    return (
      <div>
        <RecommendationListCardPy />
        <br />
        <RecommendationListCardYo />
      </div>
    );
  }
}

export default HomeV2;
