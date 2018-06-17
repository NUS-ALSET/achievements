import React from 'react';
import PropTypes from "prop-types";

import './NukaCarouselStyle.css';
/* the Carousel is from nuka-carousel
 * by Ken Wheeler
 * more @ http://kenwheeler.github.io/nuka-carousel/ 
 */
import Carousel from 'nuka-carousel';

/*
 * the data code design is modeled after
 * Theodor Shaytanov's PathCard container module
 */
import SampleCard from './SampleCard';


// TODO: SampleCarousel and SampleCard will be stateless PureComponents
// TODO: use the render*Controls for Nuka-Carousel to disable arrow 

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
