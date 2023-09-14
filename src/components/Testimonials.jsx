import styled from "styled-components";
import {TestimonialSlideshow} from "./TestimonialSlider/TestimonialSlideshow.jsx";
import {useEffect, useState} from "react";

const TestimonialsContainer = styled.div.attrs({id: 'Testimonials'})`
    height: calc(100vh - 60px);
    scroll-snap-align: center;
  	-webkit-overflow-scrolling: touch;
    display: grid;
    flex-direction: ${({aspectratio}) => aspectratio < 1 ? "column" : "row"};
    
    ${({aspectratio}) =>
    aspectratio < 1
        ? 
        `
        grid-template-columns: 1fr;
        grid-template-rows: 1fr 1fr;
        `
        : 
        `
        grid-template-columns: 1fr 1fr;
        grid-template-rows: 1fr;
        `
    }
	
    .grid-item {
        padding: 20px;
        border: 1px solid #ddd;
    }
`;

const Container1 = styled.div`
    order: ${props => props.order};
    display: flex;
    border-radius: 15px;
  	justify-content: center;
  	align-items: center;
    animation: fadeIn 4s ease forwards;
`;

const Container2 = styled.div`
padding: 20px;
    overflow-y: auto;
    order: ${props => props.order};
    border: 4px solid #ff7af4;
    border-radius: 15px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0);
    margin: 15px;
    animation: fadeIn 4s ease forwards;
    background-color: rgba(0, 0, 0, 0.25);
    backdrop-filter: blur(8px);
`;

const Heading = styled.h2`
    font-family: 'Abyssinica SIL', serif;
    color: #ff7af4;
    font-size: 75px;
    margin-bottom: 10px;
  
  	@media (max-width: 1200px) {
		font-size: 60px;
	}
`;

const Paragraph = styled.p`
    font-family: 'PT Sans', sans-serif;
    font-size: 25px;
    line-height: 1.5;
    margin-bottom: 15px;
  
  	@media (max-width: 1200px) {
		font-size: 20px;
	}
`;

export const Testimonials = () => {
	const [aspectRatio, setAspectRatio] = useState(window.innerWidth / window.innerHeight);

    const handleResize = () => {
        setAspectRatio(window.innerWidth / window.innerHeight);
    };

    useEffect(() => {
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const leftOrder = aspectRatio >= 1 ? 1 : 2;
    const rightOrder = aspectRatio >= 1 ? 2 : 1;

	return (
		<TestimonialsContainer aspectratio={aspectRatio}>
            <Container1 order={leftOrder}>
				<TestimonialSlideshow/>
            </Container1>
            <Container2 order={rightOrder}>
				<Heading>Testimonials 🙌</Heading>
                <Paragraph>Discover endorsements from professionals who have worked with me. These testimonials showcase my skills and contributions. See why they vouch for my work.</Paragraph>
                <Paragraph> These endorsements are a testament to the quality of my contributions and the trust others have placed in me.</Paragraph>
            </Container2>
        </TestimonialsContainer>
	)
}