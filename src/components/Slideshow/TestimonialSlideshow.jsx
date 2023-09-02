import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/effect-cards';
import './slideshow.css';
import { Autoplay, EffectCards } from 'swiper/modules';
import {testimonials} from "../../constants/index.js";
import {Testimonial} from "./Testimonial.jsx";

export const TestimonialSlideshow = () => {
  return (
    <>
      <Swiper
        effect={'cards'}
        grabCursor={true}
        modules={[Autoplay, EffectCards]}
        className="mySwiper"
        autoplay={{delay: 6000, disableOnInteraction: false}}
        loop={true}
      >
          {testimonials.map((testimonial, index) => (
            <SwiperSlide key={testimonial.text} >
                <Testimonial index={index}/>
            </SwiperSlide>
          ))}
      </Swiper>
    </>
  );
}
