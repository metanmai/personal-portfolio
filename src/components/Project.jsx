import {projects} from "../constants/index.js";
import styled from "styled-components";
import PropTypes from "prop-types";
import {useState} from "react";
import {ImageBackground} from "./Backgrounds/ImageBackground.jsx";

const ProjectContainer = styled.div`
	position: relative;
  	display: flex;
  	color: #101010;
  	border-radius: 15px;
  	border: 1px solid #fdcd00;
  	justify-content: center;
  	align-items: center;
  	text-align: center;
`;

const ProjectName = styled.div`
  	position: absolute;
  	top: 0;
  	left: 0;
  	color: white;
	width: 100%; /* Make the wrapper cover the entire container width */
	height: 100%; /* Make the wrapper cover the entire container height */
	display: flex;
	justify-content: center; /* Center horizontally */
	align-items: center; /* Center vertically */
`;

const HoverContainer = styled.div`
	position: absolute;
	top: 0;
	left: 0;
	width: 100%; /* Make the wrapper cover the entire container width */
	height: 100%; /* Make the wrapper cover the entire container height */
	display: flex;
	justify-content: center; /* Center horizontally */
	align-items: center; /* Center vertically */
`;

export const Project = ({index}) => {
	const [brightness, setBrightness] = useState(0.5);

	const handleMouseEnter = () => {
			setBrightness(0.8);
	};

	const handleMouseLeave = () => {
		setBrightness(0.5);
	};

	return (
		<ProjectContainer
			brightness={brightness}
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
		>
			<ImageBackground path={projects[index].thumbnail} brightness={brightness}/>
			<ProjectName>
				{projects[index].name}
			</ProjectName>
			<HoverContainer>
				{projects[index].description}
			</HoverContainer>
		</ProjectContainer>
	)
};

Project.propTypes = {
	index: PropTypes.number.isRequired
};