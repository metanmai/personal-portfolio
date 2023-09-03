import PropTypes from 'prop-types';
import './NavButton.css';

export const NavButton = ({id}) => {
    const handleClickScroll = () => {
		const element = document.getElementById(id);

		console.log(typeof element)
		if (element) {
			element.scrollIntoView({ behavior: 'smooth' });
		}
  };

	return (
			<div className={`button button-1`} onClick={handleClickScroll}>
				{id}
			</div>
	)
};

NavButton.propTypes = {
  id: PropTypes.string.isRequired, // Ensure id is a required string
};