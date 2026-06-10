import PropTypes from 'prop-types';

const SystemFault = ({ children }) => children;

SystemFault.propTypes = {
    children: PropTypes.node.isRequired,
};

export default SystemFault;
