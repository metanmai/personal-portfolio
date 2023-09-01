import {testimonials} from "../constants/index.js";
import styled from "styled-components";
import PropTypes from "prop-types";

const TestimonialContainer = styled.div`
  	display: flex;
  	flex-direction: column;
  	top: 0;
  	background-color: #9eff88;
	min-height: 100%;
  	margin: 0;
`;

const Top = styled.div`
  	position: relative;
  	display: flex;
	margin: 0;
  	width: 100%;
  	height: calc(100% - 75px);
	background-color: rgba(159, 0, 0, 0.2);
`;

const Bottom = styled.div`
  	position: relative;
  	display: flex;
  	background-color: rgba(0, 0, 210, 0.2);
  	
	flex-direction: column;
	justify-content: flex-end;
	align-items: flex-end;
  	width: 100%;
  	height: 75px;
`;

const Paragraph = styled.p`
    font-family: 'PT Sans', sans-serif;
    font-size: 30px;
  	color: white;
    line-height: 1.5;
  	padding: 10px;
`;

const Person = styled.span`
  	font-family: "Abyssinica SIL", sans-serif;
  	font-size: 25px;
  	font-style: normal;
  	color: white;
  	position: absolute;
    bottom: 30px;
    right: 10px;
`;

const Company = styled.span`
	font-family: "Abyssinica SIL", sans-serif;
  	font-size: 15px;
  	color: white;
  	font-style: normal;
  	position: absolute;
    bottom: 10px;
    right: 10px;
`;

export const Testimonial = ({index}) => {
	return (
		<TestimonialContainer>
			{/*<Top>*/}
			{/*	<Paragraph>*/}
			{/*		&quot;{testimonials[index].text}&quot;*/}
			{/*	</Paragraph>*/}
			{/*</Top>*/}
			{/*<Bottom>*/}
			{/*	<Person>*/}
			{/*		{testimonials[index].person}*/}
			{/*	</Person>*/}
			{/*	<Company>*/}
			{/*		{testimonials[index].role}, {testimonials[index].company}.*/}
			{/*	</Company>*/}
			{/*</Bottom>*/}
		</TestimonialContainer>
	)
}

Testimonial.propTypes = {
    index: PropTypes.number.isRequired
};
