import React from 'react';
import PropTypes from "prop-types";

import Button from '@material-ui/core/Button';
import KeyboardArrowRightIcon from "@material-ui/icons/KeyboardArrowRight";
import KeyboardArrowLeftIcon from "@material-ui/icons/KeyboardArrowLeft";

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


// TODO: SampleCarousel and SampleCard will be stateless PureComponents
// TODO: incorporate this into the Firebase userRecommendations

class SampleCarousel extends React.PureComponent {
  static propTypes = {
    dataList: PropTypes.array,
    youtubeRecom: PropTypes.bool,
  };

  render() {
    // retrieve the dummyData
    const { youtubeRecom, dataList } = this.props;
    console.log("??????", dataList);

    return (
      <Carousel
        slidesToShow={4}
        cellSpacing={10}
        className="customizeCarousel"
        renderCenterLeftControls={({ previousSlide, currentSlide }) => (
          <Button
            variant="fab"
            mini
            aria-label="prevSlide"
            style={(currentSlide !== 0)
              ? {visibility: "visible", left: "-22px"}
              : {visibility: "hidden"}
            }
            onClick={previousSlide}
          >
            <KeyboardArrowLeftIcon />
          </Button>
        )}
        renderCenterRightControls={({ nextSlide, currentSlide }) => (
          <Button
            variant="fab"
            mini
            aria-label="nexSlide"
            style={(dataList.length < 4
              || currentSlide === (dataList.length-4))
              ? {visibility: "hidden"}
              : {visibility: "visible", right: "-20px"}
            }
            onClick={nextSlide}
          >
            <KeyboardArrowRightIcon />
          </Button>
        )}
      >
        {dataList.map( (item, index) => (
            <SampleCard
              key={index}
              title={item.name}
              description={youtubeRecom
                ? ""
                : `${item.type} Python problem`}
              path={item.owner}
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

export default SampleCarousel;
