import React from 'react';
import PropTypes from "prop-types";

import Button from '@material-ui/core/Button';
import KeyboardArrowRightIcon from "@material-ui/icons/KeyboardArrowRight";
import KeyboardArrowLeftIcon from "@material-ui/icons/KeyboardArrowLeft";
// withWidth() higher-order component to change React DOM based on breakpoint
// here change Nuka-carousel's slidesToShow dynamically with width
import withWidth from "@material-ui/core/withWidth";

import './NukaCarouselStyle.css';
/* the Carousel is from nuka-carousel
 * by Ken Wheeler
 * more @ https://github.com/FormidableLabs/nuka-carousel
 */
import Carousel from 'nuka-carousel';

/*
 * the data code design is modeled after
 * Theodor Shaytanov's PathCard container module
 */
import SampleCard from './SampleCard';



class SampleCarousel extends React.PureComponent {
  static propTypes = {
    dataList: PropTypes.array,
    youtubeRecom: PropTypes.bool,
    // for slidesToShow
    width: PropTypes.string,
  };

  render() {
    const { youtubeRecom, dataList, width } = this.props;
    // width is a string, detect media query via MUI
    let itemPerSlide;
    switch(width) {
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
    };

    return (
      <Carousel
        slidesToShow={itemPerSlide}
        cellSpacing={10}
        speed={1000}
        className="customizeCarousel"
        renderCenterLeftControls={({ currentSlide, goToSlide }) => {
          const previousSlideIndex = (
            (currentSlide - itemPerSlide) > 0
            ? (currentSlide - itemPerSlide)
            : 0
          );
          return (
            <Button
              variant="fab"
              mini
              aria-label="prevSlide"
              style={(currentSlide !== 0)
                ? {visibility: "visible", left: "-22px"}
                : {visibility: "hidden"}
              }
              onClick={()=>goToSlide(previousSlideIndex)}
            >
              <KeyboardArrowLeftIcon />
            </Button>
          );
        }}
        renderCenterRightControls={({ currentSlide, goToSlide }) => {
          const nextSlideIndex = (
            (currentSlide + itemPerSlide) <= dataList.length
            ? (currentSlide + itemPerSlide)
            : dataList.length
          );
          return (
            <Button
              variant="fab"
              mini
              aria-label="nexSlide"
              style={(dataList.length < itemPerSlide
                || currentSlide >= (dataList.length-itemPerSlide))
                ? {visibility: "hidden"}
                : {visibility: "visible", right: "-20px"}
              }
              onClick={()=>goToSlide(nextSlideIndex)}
            >
              <KeyboardArrowRightIcon />
            </Button>
          );
        }}
      >
        {dataList.map( (item, index) => (
            <SampleCard
              key={index}
              title={item.name}
              description={youtubeRecom
                ? ""
                : `${item.type} Python problem`}
              path={item.path}
              problem={item.actualProblem}
              video={youtubeRecom
                ? item.youtubeURL
                : ""}
            />
        ))}
      </Carousel>
    );
  }
}

export default withWidth()(SampleCarousel);
