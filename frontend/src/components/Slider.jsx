import React, { useState, useEffect } from 'react';

const Slider = () => {
  const slides = [
    { url: 'https://img.freepik.com/premium-vector/modern-sale-banner-website-slider-template-design_54925-45.jpg?w=2000' },
    { url: 'https://static.vecteezy.com/system/resources/previews/004/299/835/original/online-shopping-on-phone-buy-sell-business-digital-web-banner-application-money-advertising-payment-ecommerce-illustration-search-free-vector.jpg' },
    { url: 'https://static.vecteezy.com/system/resources/previews/004/707/493/non_2x/online-shopping-on-phone-buy-sell-business-digital-web-banner-application-money-advertising-payment-ecommerce-illustration-search-vector.jpg' },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? slides.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const nextSlide = () => {
    const isLastSlide = currentIndex === slides.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  // --- Auto-play Logic (3 Seconds) ---
  useEffect(() => {
    const slideInterval = setInterval(() => {
      nextSlide();
    }, 3000); // 3000ms = 3 seconds

    return () => clearInterval(slideInterval); // Memory leak se bachne ke liye cleanup
  }, [currentIndex]);

  return (
    // Height ko thoda kam kiya hai taaki screen par perfect dikhe (h-[450px])
    <div className='max-w-full h-[300px] md:h-[450px] w-full m-auto relative group'>
      <div
        style={{ backgroundImage: `url(${slides[currentIndex].url})` }}
        className='w-full h-full rounded-b-xl bg-center bg-cover duration-700 shadow-md'
      ></div>

      {/* Left Arrow */}
      <div
        onClick={prevSlide}
        className='hidden group-hover:block absolute top-[50%] -translate-x-0 translate-y-[-50%] left-8 text-2xl rounded-full p-2 bg-black/30 text-white cursor-pointer hover:bg-black/60 transition'
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
      </div>

      {/* Right Arrow */}
      <div
        onClick={nextSlide}
        className='hidden group-hover:block absolute top-[50%] -translate-x-0 translate-y-[-50%] right-8 text-2xl rounded-full p-2 bg-black/30 text-white cursor-pointer hover:bg-black/60 transition'
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </div>

      {/* Dots */}
      <div className='flex justify-center py-2 gap-2'>
        {slides.map((_, index) => (
          <div
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`cursor-pointer transition-all duration-500 rounded-full ${currentIndex === index ? "bg-orange-500 w-5" : "bg-gray-300 w-2"
              } h-2`}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default Slider;