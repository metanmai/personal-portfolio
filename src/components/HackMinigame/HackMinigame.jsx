import PropTypes from 'prop-types';

const HackMinigame = ({ onWin }) => (
    <p onClick={onWin}>SECURITY LAYER PENDING INSTALLATION...</p>
);

HackMinigame.propTypes = {
    onWin: PropTypes.func.isRequired,
};

export default HackMinigame;
