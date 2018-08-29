/* eslint-disable no-magic-numbers */
import React from "react";
import PropTypes from "prop-types";

import Button from "@material-ui/core/Button";
import KeyboardArrowRightIcon from "@material-ui/icons/KeyboardArrowRight";
import KeyboardArrowLeftIcon from "@material-ui/icons/KeyboardArrowLeft";
// withWidth() higher-order component to change React DOM based on breakpoint
// here change Nuka-carousel's slidesToShow dynamically with width
import withWidth from "@material-ui/core/withWidth";

import "./NukaCarouselStyle.css";
/* the Carousel is from nuka-carousel
 * by Ken Wheeler
 * more @ https://github.com/FormidableLabs/nuka-carousel
 */
import Carousel from "nuka-carousel";

/*
 * the data code design is modeled after
 * Theodor Shaytanov's PathCard container module
 */
import SampleCard from "./SampleCard";

// TODO: SampleCarousel and SampleCard will be stateless PureComponents
// TODO: incorporate this into the Firebase userRecommendations

class SampleCarousel extends React.PureComponent {
  static propTypes = {
    dataList: PropTypes.array,
    youtubeRecom: PropTypes.bool,
    // for slidesToShow
    width: PropTypes.string,
    // temporary logo detection for CodeCombat
    isCodeCombat: PropTypes.bool
  };

  render() {
    // retrieve the dummyData
    const { youtubeRecom, dataList, width, isCodeCombat } = this.props;
    // width is a string, detect media query via MUI
    let itemPerSlide;
    switch (width) {
      case "xs":
        itemPerSlide = 1;
        break;
      case "sm":
        itemPerSlide = 2;
        break;
      case "md":
        itemPerSlide = 3;
        break;
      case "lg":
        itemPerSlide = 4;
        break;
      case "xl":
        itemPerSlide = 5;
        break;
      default:
        itemPerSlide = 4;
    }

    return (
      <Carousel
        cellSpacing={10}
        className="customizeCarousel"
        renderCenterLeftControls={({ currentSlide, goToSlide }) => {
          const previousSlideIndex = Math.max(currentSlide - itemPerSlide, 0);
          return (
            <Button
              aria-label="prevSlide"
              mini
              onClick={() => goToSlide(previousSlideIndex)}
              style={
                currentSlide !== 0
                  ? { visibility: "visible", left: "-22px" }
                  : { visibility: "hidden" }
              }
              variant="fab"
            >
              <KeyboardArrowLeftIcon />
            </Button>
          );
        }}
        renderCenterRightControls={({ currentSlide, goToSlide }) => {
          const nextSlideIndex =
            currentSlide + itemPerSlide <= dataList.length
              ? currentSlide + itemPerSlide
              : dataList.length;
          return (
            <Button
              aria-label="nexSlide"
              mini
              onClick={() => goToSlide(nextSlideIndex)}
              style={
                dataList.length < itemPerSlide ||
                currentSlide >= dataList.length - itemPerSlide
                  ? { visibility: "hidden" }
                  : { visibility: "visible", right: "-20px" }
              }
              variant="fab"
            >
              <KeyboardArrowRightIcon />
            </Button>
          );
        }}
        slidesToShow={itemPerSlide}
        speed={1000}
      >
        {dataList.map((item, index) => (
          <SampleCard
            activityTitle={item.name}
            description={youtubeRecom ? "" : `${item.type} Activity`}
            isCodeCombat={isCodeCombat}
            key={index}
            path={item.path || item.owner}
            problem={item.actualProblem}
            subHeading={item.subHeading || ""}
            video={youtubeRecom ? item.youtubeURL : ""}
          />
        ))}
      </Carousel>
    );
  }
}

export default withWidth()(SampleCarousel);
