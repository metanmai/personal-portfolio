import PropTypes from 'prop-types';
import './NavButton.css';

export const NavButton = ({text}) => {
	return (
		<div className={`button button-1`}>
			{text}
		</div>
	)
};

NavButton.PropTypes = {
	text: PropTypes.string.isRequired
};