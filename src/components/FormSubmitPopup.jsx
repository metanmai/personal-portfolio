import styled from "styled-components";
import PropTypes from 'prop-types';

const PopUp = styled.div`
	position: relative;
  	font-family: "PT Sans", sans-serif;
	background-color: ${({status}) => status ? "#3dca03" : "#ec2e2e"};
	padding: 10px;
	border-radius: 10px;
	text-align: center;
  	opacity: ${({show}) => show};
  	transition: opacity 0.2s ease; 
`;

const FormSubmitPopup = ({status, show}) => {
	return (
		<PopUp status={status} show={show}>
			{status ? "Email Sent Successfully!" : "The email could not be sent."}
		</PopUp>
	);
};

FormSubmitPopup.propTypes = {
	status: PropTypes.number.isRequired,
	show: PropTypes.number.isRequired
}

export default FormSubmitPopup;