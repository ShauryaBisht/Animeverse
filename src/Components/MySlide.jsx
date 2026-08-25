import React from "react";
import Slider from "react-slick";

function MySlider({ img1, img2, img3, img4, img5 }) {
  const settings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
    pauseOnHover: true,
  };

  const images = [img1, img2, img3, img4, img5].filter(Boolean);

  return (
    <div className="w-full max-w-[280px] sm:max-w-[320px] mx-auto overflow-hidden">
      <Slider {...settings}>
        {images.map((img, idx) => (
          <div key={idx} className="outline-none px-1">
            <div className="relative aspect-[2/3] w-full overflow-hidden rounded-xl bg-neutral-950 shadow-inner">
              <img
                src={img}
                alt={`Featured anime ${idx + 1}`}
                className="h-full w-full object-cover rounded-xl transition duration-500 hover:scale-105"
              />
              <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-white/10" />
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default MySlider;