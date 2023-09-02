import PropTypes from "prop-types";
import styled from "styled-components";

const Background = styled.div`
  	display: flex;
  	height: 100%;
  	width: 100%;
  	border-radius: 15px;
  	background-image: url(${({path}) => path});
  	background-size: auto 100%; // width and height
  	background-position: center;
  	filter: brightness(${({brightness}) => brightness});
  	z-index: -10;
`;

export const ImageBackground = ({path, brightness}) => {
	return (
		<Background path={path} brightness={brightness}>
		</Background>
	)
};

ImageBackground.PropTypes = {
	path: PropTypes.string.isRequired,
	brightness: PropTypes.number.isRequired
};