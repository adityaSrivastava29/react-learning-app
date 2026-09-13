import React, { useState, useEffect } from "react";


const images = [
  { id: 1, url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80", title: "Tropical Beach Sunset" },
  { id: 2, url: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80", title: "Foggy Mountain Forest" },
  { id: 3, url: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80", title: "Starry Night Sky" },
];

export const CarouselChallenge: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  useEffect(() => {
    if (!isAutoPlay) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [isAutoPlay]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center text-xs">
        <span className="font-semibold opacity-80">Slide {currentIndex + 1} of {images.length}</span>
        <button
          onClick={() => setIsAutoPlay(!isAutoPlay)}
          className={`px-3 py-1 rounded font-bold transition-all ${
            isAutoPlay ? "bg-emerald-600 text-white" : "bg-gray-500 text-white"
          }`}>
          {isAutoPlay ? "⏱️ Auto-Play ON (3s)" : "⏸️ Auto-Play OFF"}
        </button>
      </div>

      <div
        onMouseEnter={() => setIsAutoPlay(false)}
        onMouseLeave={() => setIsAutoPlay(true)}
        className="relative rounded-xl overflow-hidden shadow-lg aspect-video bg-gray-900 border border-gray-800 flex items-center justify-center">
        <img
          src={images[currentIndex].url}
          alt={images[currentIndex].title}
          className="w-full h-full object-cover transition-all duration-500"
        />

        {/* Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent text-white text-sm font-bold">
          {images[currentIndex].title}
        </div>

        {/* Arrow Buttons */}
        <button
          onClick={handlePrev}
          className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 hover:bg-black/80 text-white font-bold flex items-center justify-center">
          ❮
        </button>
        <button
          onClick={handleNext}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 hover:bg-black/80 text-white font-bold flex items-center justify-center">
          ❯
        </button>

        {/* Dot Indicators */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
          {images.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                currentIndex === idx ? "bg-white scale-125" : "bg-white/40"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CarouselChallenge;
