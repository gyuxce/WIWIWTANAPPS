import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { Card } from 'components/ui';
import React, { useRef } from 'react';

const CarouselCustom = ({ children }) => {
  const carouselRef = useRef();
  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 4,
      paritialVisibilityGutter: 30,
    },
  };
  return (
    <div
      style={{
        position: 'relative',
      }}
    >
      <Carousel
        ref={carouselRef}
        deviceType={'desktop'}
        partialVisible
        itemClass="image-item"
        responsive={responsive}
        swipeable
        arrows={false}
        draggable
      >
        {children}
      </Carousel>
      <div className="flex flex-row mt-3 gap-2">
        <Card
          className="rounded-2xl"
          bodyClass="p-[0.2rem] flex justify-center items-center"
          onClick={() => carouselRef?.current?.previous()}
        >
          <img className="w-[16px] h-[16px] " src="/img/icon/previous.png" alt="previous" />
        </Card>
        <Card
          className="rounded-2xl"
          bodyClass="p-[0.2rem] flex justify-center items-center"
          onClick={() => carouselRef?.current?.next()}
        >
          <img className="w-[16px] h-[16px] " src="/img/icon/next.png" alt="previous" />
        </Card>
      </div>
    </div>
  );
};

export default CarouselCustom;
