import styled from 'styled-components';
import { useLocation } from 'react-router-dom';
import { useClock } from '../../hooks/useClock.js';

const Bar = styled.footer`
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 50;
    background: var(--bg);
    border-top: 1px solid var(--dim);
    color: var(--dim);
    font-size: 0.85em;
    padding: 0.25rem 1rem;
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    text-shadow: none;
`;

const Right = styled.div`
    display: flex;
    gap: 0.5rem;
    align-items: center;
`;

const Hints = styled.span`
    @media (max-width: 600px) {
        display: none;
    }
`;

const StatusBar = () => {
    const { pathname } = useLocation();
    const clock = useClock();

    return (
        <Bar>
            <span>NORMAL · {pathname}</span>
            <Right>
                <Hints>{'[ESC] MENU · [↑↓ 1-5] SELECT ·'}</Hints>
                <span>{clock}</span>
            </Right>
        </Bar>
    );
};

export default StatusBar;
