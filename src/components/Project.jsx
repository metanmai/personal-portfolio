import {projects} from "../constants/index.js";
import styled from "styled-components";
import PropTypes from "prop-types";
import {ImageBackground} from "./Backgrounds/ImageBackground.jsx";

const ProjectContainer = styled.div`
	position: relative;
  	display: flex;
  	color: #101010;
  	border-radius: 15px;
  	border: 1.5px solid #fdcd00;
  	justify-content: center;
  	align-items: center;
  	text-align: center;
  	cursor: pointer;
  	overflow: hidden;
  
  	&:hover .slide {
		transition: 1s;
		right: 0;
	}
`;

const ProjectName = styled.div`
  	position: absolute;
  	top: 0;
  	left: 0;
  	color: white;
	width: 100%;
	height: 100%;
	display: flex;
  	text-shadow: 10px 10px 16px rgba(0, 0, 0, 1);
  	font-family: 'PT Sans', serif;
  	font-weight: 600;
  	font-size: 20px;
	justify-content: center;
	align-items: center;
`;

const ProjectDescription = styled.div`
	position: absolute;
    right: 100%;
    width: 100%;
  	height: 100%;
  	background-image: url("img/yellow-orange-gradient.jpeg");
  	background-size: auto 100%; // width and height
  	background-position: center;
  	filter: brightness(0.9);
  	justify-content: center;
  	align-items: center;
  	text-align: center;
    transition: 1s;
`;

export const Project = ({index}) => {
	const handleClick = () => {
		window.open(projects[index].link, '_blank');
	};

	return (
		<ProjectContainer onClick={handleClick}>
			<ImageBackground path={projects[index].thumbnail}/>
			<ProjectName>
				{projects[index].name}
			</ProjectName>
			<ProjectDescription className={`slide`}>
				{projects[index].description}
			</ProjectDescription>
		</ProjectContainer>
	)
};

Project.propTypes = {
	index: PropTypes.number.isRequired,
	path: PropTypes.string
};