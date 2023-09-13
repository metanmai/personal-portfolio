import {projects} from "../constants/index.js";
import styled from "styled-components";
import PropTypes from "prop-types";

const ProjectContainer = styled.div`
	position: relative;
  	display: flex;
  	color: #101010;
  	border-radius: 15px;
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

const ImageBackground = styled.div`
  	display: flex;
  	height: 100%;
  	width: 100%;
  	border-radius: 15px;
  	background-image: url(${({path}) => path});
  	background-size: cover;
  	background-repeat: no-repeat;
  	background-position: center;
  	z-index: -10;
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
  	display: flex;
    right: 100%;
    width: 100%;
  	height: 100%;
  	border-radius: 15px;
  	background-image: url("img/yellow-orange-gradient.jpeg");
  	background-size: auto 100%; // width and height
  	background-position: center;
  	font-family: "PT Sans", sans-serif;
  	font-size: 20px;
  	color: white;
  	text-shadow: 3px 3px 3px rgba(0, 0, 0, 0.3);
  	align-items: center;
    transition: 1s;
  
	@media (max-width: 1200px) {
		font-size: 12px;
	}
`;

const Bottom = styled.div`
  	position: absolute;
  	display: flex;
  	max-width: 100%;
  	padding: 8px;
  	font-size: 15px;
  	bottom: 0;
	flex-direction: row;
   	gap: 7px;
	justify-content: flex-end;
	align-items: flex-end;
  	width: 100%;
  	height: 20px;
  
  	@media (max-width: 1200px) {
		font-size: 10px;
	}
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
				<Bottom>
					{projects[index].tech.map((item, index) => (
						<span key={index}> #{item} </span>
					))}
					&nbsp; &nbsp;
				</Bottom>
			</ProjectDescription>
		</ProjectContainer>
	)
};

Project.propTypes = {
	index: PropTypes.number.isRequired,
	path: PropTypes.string
};