import React from 'react';
import './NukaCarouselStyle.css';
/* the Carousel is from nuka-carousel
 * by Ken Wheeler
 * more @ http://kenwheeler.github.io/nuka-carousel/ 
 */
import Carousel from 'nuka-carousel';
import SampleCard from './SampleCard';

class SampleCarousel extends React.Component {
  render() {
    return (
      <Carousel
        slidesToShow={4}
        cellSpacing={10}
        className="customizeCarousel"
      >
        <SampleCard />
        <SampleCard />
        <SampleCard />
        <SampleCard />
        <SampleCard />
        <SampleCard />
      </Carousel>
    );
  }
}

export default SampleCarousel;
