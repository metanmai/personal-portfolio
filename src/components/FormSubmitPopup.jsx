import styled from "styled-components";
import PropTypes from 'prop-types';

const PopUp = styled.div`
	position: relative;
  	font-family: "PT Sans", sans-serif;
	background-color: ${({status}) => status ? "#3dca03" : "#ec2e2e"};
	padding: 10px;
	border-radius: 10px;
	text-align: center;
  	opacity: ${({show}) => show ? 1 : 0};
`;

const FormSubmitPopup = ({status, show}) => {
	return (
		<PopUp status={status} show={show}>
			{status ? "Email Sent Successfully!" : "The email could not be sent."}
		</PopUp>
	);
};

FormSubmitPopup.propTypes = {
	status: PropTypes.bool,
	show: PropTypes.bool
}

export default FormSubmitPopup;