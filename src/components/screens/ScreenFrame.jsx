import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useScramble } from '../../hooks/useScramble.js';

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

    /* Leave clearance for the fixed PhosphorSwitch blob (top-right) on mobile,
       so the back link never collides with it. */
    @media (max-width: 700px) {
        padding-right: 44px;
    }
`;

const Title = styled.h2`
    font-size: clamp(1.4rem, 4vw, 2rem);
    letter-spacing: 0.06em;
`;

const BackLink = styled(Link)`
    color: var(--dim);
    text-decoration: none;
    padding: 0.4rem 0.5rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;

    &:hover, &:focus-visible {
        background: var(--phosphor);
        color: var(--bg);
        text-shadow: none;
    }

    /* On desktop show the full label; hide the compact one. */
    .back-compact { display: none; }
    .back-full { display: inline; }

    /* On mobile show only the compact label, with a 44px touch target. */
    @media (max-width: 700px) {
        min-width: 44px;
        min-height: 44px;
        padding: 0.4rem 0.6rem;

        .back-compact { display: inline; }
        .back-full { display: none; }
    }
`;

const ScreenFrame = ({ title, children }) => {
    const scrambledTitle = useScramble(title);
    return (
        <Frame>
            <Bar>
                <Title>▸ {scrambledTitle}</Title>
                <BackLink to="/" aria-label="back to main menu">
                    <span className="back-full">[ESC] MAIN MENU</span>
                    <span className="back-compact">[◂ BACK]</span>
                </BackLink>
            </Bar>
            {children}
        </Frame>
    );
};

ScreenFrame.propTypes = {
    title: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
};

export default ScreenFrame;
