import styled from "styled-components";
import PropTypes from 'prop-types';

const PopUp = styled.div`
	position: relative;
	top: 100%;
	left: 50%;
	transform: translateX(-50%);
	background-color: ${({status}) => status ? "#3dca03" : "#ec2e2e"};
	padding: 10px;
	border-radius: 5px;
	text-align: center;
	z-index: 1000;
`;

const FormSubmitPopup = ({status}) => {
	return (
		<PopUp status={status}>
			{status ? "Email Sent Successfully!" : "The email could not be sent."}
		</PopUp>
	);
};

FormSubmitPopup.propTypes = {
	status: PropTypes.bool
}

export default FormSubmitPopup;