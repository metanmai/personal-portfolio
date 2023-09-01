import styled from "styled-components";
import {useState} from "react";
import {testimonials} from "../constants/index.js";

const TestimonialList = styled.div`
    width: 100%;
    overflow: hidden;
    position: relative;
`;

const TestimonialBlock = styled.div`
    display: flex;
    transition: transform 0.5s ease-in-out;
`;

const Testimonial = styled.div`
  width: 100%;
  height: 200px; /* Adjust the height as needed */
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  background-color: #ff0000; /* Background color for testimonials */
`;

const NavContainer = styled.div`
    display: flex;
    justify-content: space-between;
    margin-top: 10px; /* Adjust spacing as needed */
`;

const NavButton = styled.button`
    background-color: #0074d9; /* Button background color */
    color: #fff; /* Button text color */
    border: none;
    padding: 5px 10px;
    cursor: pointer;

    &:hover {
        background-color: #0056b3; /* Hover background color */
    }
`;

export const TestimonialSlideshow = () => {
	const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);
	const [nextTestimonialIndex, setNextTestimonialIndex] = useState(currentTestimonialIndex + 1);
	const [previousTestimonialIndex, setPreviousTestimonialIndex] = useState(currentTestimonialIndex - 1);

    const goToNextTestimonial = () => {
        setCurrentTestimonialIndex(currentTestimonialIndex + 1 % testimonials.length);
		setNextTestimonialIndex((nextTestimonialIndex + 1) % testimonials.length);
		setPreviousTestimonialIndex((previousTestimonialIndex + 1) % testimonials.length);
    };

    const goToPreviousTestimonial = () => {
		setCurrentTestimonialIndex(currentTestimonialIndex - 1 % testimonials.length);
		setNextTestimonialIndex((nextTestimonialIndex - 1) % testimonials.length);
		setPreviousTestimonialIndex((previousTestimonialIndex - 1) % testimonials.length);
	};

	return (
			<TestimonialList>
				<TestimonialBlock style={{ transform: `translateX(-${currentTestimonialIndex * 100}%)` }}>

				</TestimonialBlock>
				<NavContainer>
					<NavButton onClick={goToPreviousTestimonial}>
						&lt; Previous
					</NavButton>
					<NavButton onClick={goToNextTestimonial}>
						Next &gt;
					</NavButton>
				</NavContainer>
			</TestimonialList>
	)
}