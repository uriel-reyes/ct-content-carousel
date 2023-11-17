import React from 'react';
import Carousel, { CarouselProps } from 'components/commercetools-ui/organisms/content/carousel';

interface ContentCarouselProps {
  data: CarouselProps;
}

const ContentCarousel: React.FC<ContentCarouselProps> = ({ data }) => {
  return (
    <Carousel
      slides={data.slides}
      enableSlideInterval={data.enableSlideInterval}
      interval={data.interval}
      showArrows={data.showArrows}
      showDots={data.showDots}
    />
  );
};

export default ContentCarousel;
