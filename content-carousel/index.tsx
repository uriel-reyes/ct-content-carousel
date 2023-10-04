import React, { useState, useEffect } from 'react';
import Hero, { HeroProps } from 'components/commercetools-ui/organisms/content/hero';

interface CarouselData extends HeroProps {
  enableSlideInterval?: boolean;
  interval?: number;
  showArrows?: boolean;
  showDots?: boolean;
}

interface Props {
  data: CarouselData;
}

const ContentCarousel: React.FC<Props> = ({ data }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = data.slides;

  const nextSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (data.enableSlideInterval && typeof data.interval === 'number') {
      intervalId = setInterval(nextSlide, data.interval);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [data.enableSlideInterval, data.interval, slides.length, nextSlide]);

  const getYouTubeVideoId = (url: string) => {
    try {
      return new URL(url).searchParams.get('v');
    } catch (error) {
      console.error("Invalid YouTube URL:", url);
      return null;
    }
  };

  const videoId = getYouTubeVideoId(slides[currentSlide].youtubeLink);

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      {slides[currentSlide].slideType === 'image' ? (
        <Hero
          image={slides[currentSlide].image}
          title={slides[currentSlide].title}
          subtitle={slides[currentSlide].subtitle}
          ctaLabel={slides[currentSlide].ctaLabel}
          ctaReference={slides[currentSlide].ctaReference}
        />
      ) : slides[currentSlide].slideType === 'youtube' && videoId ? (
        <iframe
          width="100%"
          height="315"
          src={`https://www.youtube.com/embed/${videoId}`}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      ) : null}

      {/* Conditional Arrows */}
      {data.showArrows && (
        <>
          <button 
            onClick={prevSlide} 
            style={{ 
              position: 'absolute', 
              top: '50%', 
              left: '5%', 
              transform: 'translateY(-50%)',
              zIndex: 1,
              fontSize: '2rem' 
            }}>
            {'<'}
          </button>
          <button 
            onClick={nextSlide} 
            style={{ 
              position: 'absolute', 
              top: '50%', 
              right: '5%', 
              transform: 'translateY(-50%)',
              zIndex: 1,
              fontSize: '2rem'  
            }}>
            {'>'}
          </button>
        </>
      )}

      {/* Conditional Dots */}
      {data.showDots && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px', position: 'absolute', bottom: '10px', width: '100%' }}>
          {slides.map((_, index) => (
            <span
              key={index}
              onClick={() => setCurrentSlide(index)}
              style={{
                display: 'inline-block',
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: currentSlide === index ? 'black' : 'gray',
                margin: '0 4px',
                cursor: 'pointer'
              }}
            ></span>
          ))}
        </div>
      )}
    </div>
  );
};

export default ContentCarousel;
