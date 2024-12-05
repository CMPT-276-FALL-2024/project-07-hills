import React, { useState } from "react";
import { ArrowBigLeft, ArrowBigRight, Circle, CircleDot } from "lucide-react";

const Slideshow = ({ images }) => {
  const [imageIndex, setImageIndex] = useState(0);

  // Show next image
  function showNextImage() {
    setImageIndex((index) => (index === images.length - 1 ? 0 : index + 1));
  }

  // Show previous image
  function showPrevImage() {
    setImageIndex((index) => (index === 0 ? images.length - 1 : index - 1));
  }

  return (
    <div className="relative w-[75%] mx-auto mb-8">
      {/* Slideshow container */}
      <section
        aria-label="Slideshow"
        className="relative w-full h-[450px] flex flex-col items-center"
      >
        {/* Image container */}
        <div className="relative w-full h-[350px] overflow-hidden">
          {images.map(({ url, alt }, index) => (
            <img
              key={url}
              src={url}
              alt={alt}
              aria-hidden={imageIndex !== index}
              className="w-full h-full object-contain absolute transition-transform duration-300"
              style={{
                transform: `translateX(${100 * (index - imageIndex)}%)`,
              }}
            />
          ))}

          {/* Previous image button */}
          <button
            onClick={showPrevImage}
            className="absolute top-1/2 left-4 -translate-y-1/2 p-2 bg-black/30 hover:bg-black/50 rounded-full transition"
            aria-label="View Previous Image"
          >
            <ArrowBigLeft className="stroke-white w-6 h-6" aria-hidden />
          </button>

          {/* Next image button */}
          <button
            onClick={showNextImage}
            className="absolute top-1/2 right-4 -translate-y-1/2 p-2 bg-black/30 hover:bg-black/50 rounded-full transition"
            aria-label="View Next Image"
          >
            <ArrowBigRight className="stroke-white w-6 h-6" aria-hidden />
          </button>
        </div>

        {/* Dots navigation */}
        <div className="mt-[-16px] flex gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              className="w-4 h-4 cursor-pointer"
              aria-label={`View Image ${index + 1}`}
              onClick={() => setImageIndex(index)}
            >
              {index === imageIndex ? (
                <CircleDot className="stroke-white fill-black w-full h-full" aria-hidden />
              ) : (
                <Circle className="stroke-white fill-black w-full h-full" aria-hidden />
              )}
            </button>
          ))}
        </div>
      </section>

      {/* Description section */}
      <div className="text-center text-sm text-gray-700 mt-[-88px] h-[124px] mb-4">
        {images[imageIndex]?.description}
      </div>
    </div>
  );
};

export default Slideshow;
