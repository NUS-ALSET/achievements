import React from "react";
import RecommendationListCardPy from "../containers/HomeView/RecommendationListCardPy";
import RecommendationListCardYo from "../containers/HomeView/RecommendationListCardYo";

export class Home extends React.PureComponent {
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
