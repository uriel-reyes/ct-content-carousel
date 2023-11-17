import React, { useState, useEffect, CSSProperties } from 'react';
import Reference from 'yup/lib/Reference';
import Button from 'components/commercetools-ui/atoms/button';
import Link from 'components/commercetools-ui/atoms/link';
import Typography from 'components/commercetools-ui/atoms/typography';
import Image, { ImageProps } from 'frontastic/lib/image';

interface LinkReferenceValue {
  _type: string;
  link: string;
  openInNewWindow: boolean;
  type: string;
}

export interface Slide {
  slideType: 'image' | 'youtube';
  image?: ImageProps;
  youtubeLink?: LinkReferenceValue; // Updated type
  summary?: string;
  ctaLabel?: string;
  ctaReference?: LinkReferenceValue; // Assuming this is also a LinkReferenceValue
}

export interface CarouselProps {
  slides: Slide[];
  enableSlideInterval?: boolean;
  interval?: number;
  showArrows?: boolean;
  showDots?: boolean;
}

const Carousel: React.FC<CarouselProps> = ({ slides, enableSlideInterval, interval, showArrows, showDots }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  console.log('Slides:', slides); // Debug: Log slides data

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (enableSlideInterval && interval) {
      intervalId = setInterval(() => {
        setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
      }, interval);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [currentSlide, enableSlideInterval, interval, slides.length]);

  const extractVideoId = (url: string) => {
    const match = url.match(/(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/);
    return match ? match[1] : null;
  };

  const arrowStyle: CSSProperties = {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
    zIndex: 2,
  };

  const dotStyle: CSSProperties = {
    display: 'inline-block',
    height: '10px',
    width: '10px',
    borderRadius: '50%',
    backgroundColor: 'black',
    margin: '0 5px',
    cursor: 'pointer',
  };

  const slideContainerStyle: CSSProperties = {
    position: 'relative',
    width: '100%',
    paddingBottom: '56.25%',
    height: 0,
    overflow: 'hidden',
  };

  const contentStyle: CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  };

  const renderSlide = (slide: Slide) => {
    let slideContent;

    switch (slide.slideType) {
      case 'image':
        if (slide.image) {
          const cropFocus = calculateImageCropFocus(slide.image);
          slideContent = (
            <div className="relative w-full">
              <div className="relative h-[296px] md:h-[532px] lg:h-[668px]">
                <Image
                  {...slide.image}
                  priority
                  loading="eager"
                  alt={slide.summary}
                  fill
                  style={{ objectFit: 'cover' }}
                  className="brightness-75"
                  objectPosition={cropFocus}
                />
              </div>
            </div>
          );
        }
        break;
      case 'youtube':
        if (slide.youtubeLink && slide.youtubeLink.type === 'link') {
          const videoId = extractVideoId(slide.youtubeLink.link);
          console.log('YouTube Video ID:', videoId);

          if (videoId) {
            slideContent = (
              <div style={slideContainerStyle}>
                <iframe
                  src={`https://www.youtube.com/embed/${videoId}`}
                  title="YouTube video player"
                  frameBorder="0"
                  allowFullScreen
                  style={contentStyle}
                ></iframe>
              </div>
            );
          }
        }
        break;
      default:
        slideContent = null;
    }

    // Additional content for each slide
    return (
      <div>
        {slideContent} {/* Render the main content (image or video) */}
        <div className="absolute left-0 top-1/2 w-full -translate-y-1/2 px-48 text-center">
          <Typography as="h1" className="mt-22 text-center text-26 text-white md:mt-32 md:text-36 lg:text-58">
            {slide.summary}
          </Typography>
          {slide.ctaLabel && (
            <a
              href={slide.ctaReference?.link || '#'}
              target={slide.ctaReference?.openInNewWindow ? '_blank' : '_self'}
              rel="noreferrer"
            >
              <Button className="mt-22 md:mt-36 md:px-48 md:py-12 lg:mt-32">
                <Typography as="span" className="text-12 text-neutral-150 md:text-14 lg:text-16">
                  {slide.ctaLabel}
                </Typography>
              </Button>
            </a>
          )}
        </div>
      </div>
    );
  };

  const calculateImageCropFocus = (image: ImageProps) => {
    if (image.gravity?.coordinates) {
      const right = Math.ceil((image.gravity?.coordinates.x / (image.media?.width as number)) * 100);
      const top = Math.ceil((image.gravity?.coordinates.y / (image.media?.height as number)) * 100);
      return `right ${right.toString()}% top ${top.toString()}%`;
    }

    if (image.gravity?.mode === 'center') {
      return 'center';
    }

    return 'initial';
  };

  return (
    <div className="carousel-container" style={{ position: 'relative' }}>
      {slides.map((slide, index) => (
        <div key={index} style={{ display: index === currentSlide ? 'block' : 'none' }}>
          {renderSlide(slide)}
        </div>
      ))}

      {/* Navigation Arrows */}
      {showArrows && (
        <>
          <button
            onClick={() => setCurrentSlide((currentSlide - 1 + slides.length) % slides.length)}
            style={{ ...arrowStyle, left: '10px' }}
          >
            {'<'}
          </button>
          <button
            onClick={() => setCurrentSlide((currentSlide + 1) % slides.length)}
            style={{ ...arrowStyle, right: '10px' }}
          >
            {'>'}
          </button>
        </>
      )}

      {/* Navigation Dots */}
      {showDots && (
        <div style={{ textAlign: 'center', position: 'absolute', bottom: '10px', width: '100%' }}>
          {slides.map((_, index) => (
            <span key={index} onClick={() => setCurrentSlide(index)} style={dotStyle} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Carousel;
