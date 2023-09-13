import {testimonials} from "../../constants/index.js";
import styled from "styled-components";
import PropTypes from "prop-types";

const TestimonialContainer = styled.div`
  	position: relative;
	height: 100%;
  	border-radius: 15px;
`;

const Top = styled.div`
  	position: relative;
  	top: 0;
  	display: flex;
  	flex-direction:column;
	border-top-left-radius: 15px;
  	border-top-right-radius: 15px;
  	height: calc(100% - 75px);
	//background-color: rgba(0, 0, 0, 0.8);
  	background-image: url("img/purple-gradient.jpeg");
	background-size: cover; /* Scale the image to cover the entire element */
	background-repeat: no-repeat; /* Prevent the image from repeating */
	background-attachment: fixed; /* Fix the background image in place */
`;

const Bottom = styled.div`
  	position: absolute;
  	display: flex;
  	//background-color: rgba(0, 0, 0, 1);
  	bottom: 0;
	flex-direction: column;
	justify-content: flex-end;
	align-items: flex-end;
  	width: 100%;
  	height: 75px;
  	background-image: url("img/dark-purple-gradient.jpeg");
  	background-size: cover; /* Scale the image to cover the entire element */
	background-repeat: no-repeat; /* Prevent the image from repeating */
	background-attachment: fixed; /* Fix the background image in place */
`;

const Paragraph = styled.p`
    font-family: 'Roboto Serif', serif;
  	overflow-y: auto;
    font-size: 30px;
    font-style: normal;
  	color: white;
    line-height: 1.5;
  	padding: 10px;
  	margin-bottom: 0;
  
	@media (max-width: 1100px) {
		font-size: 24px;
	}
  
	@media (min-width: 1200px) {
		font-size: 30px;
	}
`;

const Person = styled.span`
  	font-family: 'IBM Plex Serif', serif;
  	font-size: 25px;
  	font-style: normal;
  	color: white;
  	position: absolute;
    bottom: 30px;
    right: 10px;
`;

const Company = styled.span`
	font-family: 'IBM Plex Serif', serif;
  	font-size: 15px;
  	color: white;
  	position: absolute;
    bottom: 10px;
    right: 10px;
`;

export const Testimonial = ({index}) => {
	return (
		<TestimonialContainer>
			<Top>
				<Paragraph>
					&quot;{testimonials[index].text}&quot;
				</Paragraph>
			</Top>
			<Bottom>
				<Person>
					{testimonials[index].person}
				</Person>
				<Company>
					{testimonials[index].role}, {testimonials[index].company}.
				</Company>
			</Bottom>
		</TestimonialContainer>
	)
}

Testimonial.propTypes = {
    index: PropTypes.number.isRequired
};
