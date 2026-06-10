import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const Frame = styled.section`
    max-width: 920px;
    margin: 0 auto;
`;

const Bar = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 1rem;
    flex-wrap: wrap;
    border-bottom: 1px solid var(--dim);
    padding-bottom: 0.5rem;
    margin-bottom: 1.5rem;
`;

const Title = styled.h2`
    font-size: clamp(1.4rem, 4vw, 2rem);
    letter-spacing: 0.06em;
`;

const BackLink = styled(Link)`
    color: var(--dim);
    text-decoration: none;
    padding: 0.4rem 0.5rem;

    &:hover, &:focus-visible {
        background: var(--phosphor);
        color: var(--bg);
        text-shadow: none;
    }
`;

const ScreenFrame = ({ title, children }) => (
    <Frame>
        <Bar>
            <Title>▸ {title}</Title>
            <BackLink to="/">[ESC] MAIN MENU</BackLink>
        </Bar>
        {children}
    </Frame>
);

ScreenFrame.propTypes = {
    title: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
};

export default ScreenFrame;
