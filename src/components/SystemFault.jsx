import { Component } from 'react';
import PropTypes from 'prop-types';

class SystemFault extends Component {
    constructor(props) {
        super(props);
        this.state = { error: null };
    }

    static getDerivedStateFromError(error) {
        return { error };
    }

    render() {
        if (this.state.error) {
            return (
                <section>
                    <h2>!!! SYSTEM FAULT !!!</h2>
                    <p>AN UNRECOVERABLE EXCEPTION HALTED THIS TERMINAL.</p>
                    <p>
                        &gt; <a href="/">REBOOT TERMINAL</a>
                    </p>
                </section>
            );
        }
        return this.props.children;
    }
}

SystemFault.propTypes = {
    children: PropTypes.node.isRequired,
};

export default SystemFault;
