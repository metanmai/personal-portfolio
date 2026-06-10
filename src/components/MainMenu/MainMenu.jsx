import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { asciiBanner, menuItems, personal } from '../../constants/index.js';
import { usePageMeta } from '../../hooks/usePageMeta.js';
import StatusPanel from './StatusPanel.jsx';

const Header = styled.header`
    border-bottom: 1px solid var(--dim);
    padding-bottom: 0.6rem;
    margin-bottom: 1.6rem;
    color: var(--dim);
    font-size: 0.9em;
`;

const Title = styled.h1`
    margin-bottom: 0.6rem;
`;

const VisuallyHidden = styled.span`
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    clip-path: inset(50%);
    white-space: nowrap;
    border: 0;
`;

const Banner = styled.pre`
    font-family: inherit;
    font-size: clamp(7px, 1.3vw, 15px);
    line-height: 1.15;
    letter-spacing: 0;
    color: var(--phosphor);
    text-shadow: inherit;
    overflow: hidden;
    margin: 0;
`;

const Tagline = styled.p`
    color: var(--dim);
    margin-bottom: 2rem;
`;

const Layout = styled.div`
    display: grid;
    grid-template-columns: minmax(0, 1.3fr) minmax(0, 1fr);
    gap: 3rem;
    align-items: start;

    @media (max-width: 900px) {
        grid-template-columns: minmax(0, 1fr);
        gap: 2rem;
    }
`;

const Menu = styled.ul`
    list-style: none;
`;

const Marker = styled.span`
    display: inline-block;
    width: 1.4em;
`;

const RowLabel = styled.span`
    display: inline-block;
`;

const Row = styled.button`
    display: block;
    width: 100%;
    min-height: 44px;
    background: none;
    border: none;
    font: inherit;
    color: var(--phosphor);
    text-shadow: inherit;
    text-align: left;
    cursor: pointer;
    padding: 0.4rem 0.6rem;

    &:hover, &:focus-visible, &[data-active='true'] {
        background: var(--phosphor);
        color: var(--bg);
        text-shadow: none;
        outline: none;
    }

    &[data-active='true'] ${RowLabel} {
        animation: bump 0.4s steps(2) infinite;
    }

    &:hover ${RowLabel} {
        animation: flicker 120ms steps(2, end) 1;
    }

    @keyframes bump {
        50% { transform: translateX(4px); }
    }

    @keyframes flicker {
        0% { opacity: 1; }
        50% { opacity: 0.75; }
        100% { opacity: 1; }
    }

    @media (prefers-reduced-motion: reduce) {
        &[data-active='true'] ${RowLabel},
        &:hover ${RowLabel} {
            animation: none;
        }
    }
`;

const Hint = styled.span`
    opacity: 0.6;
`;

const Cursor = styled.span`
    animation: blink 1s steps(1) infinite;

    @keyframes blink {
        50% { opacity: 0; }
    }

    @media (prefers-reduced-motion: reduce) {
        animation: none;
    }
`;

const MainMenu = () => {
    const navigate = useNavigate();
    const [selected, setSelected] = useState(0);
    usePageMeta('MAIN MENU', 'Operate the terminal: projects, experience, comms.');

    useEffect(() => {
        const onKey = (event) => {
            if (event.target.closest('input, textarea')) return;
            const digit = Number(event.key);
            if (digit >= 1 && digit <= menuItems.length) {
                navigate(menuItems[digit - 1].path);
            } else if (event.key === 'ArrowDown') {
                setSelected((s) => (s + 1) % menuItems.length);
            } else if (event.key === 'ArrowUp') {
                setSelected((s) => (s - 1 + menuItems.length) % menuItems.length);
            } else if (event.key === 'Enter' && event.target.tagName !== 'BUTTON' && event.target.tagName !== 'A') {
                navigate(menuItems[selected].path);
            }
        };

        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [navigate, selected]);

    return (
        <main>
            <Header>
                TANMAI INDUSTRIES (TM) TERMLINK PROTOCOL
                <br />
                ENTER PASSWORD NOW — ACCESS GRANTED
            </Header>
            <Title>
                <VisuallyHidden>{personal.name}</VisuallyHidden>
                <Banner aria-hidden="true">{asciiBanner.join('\n')}</Banner>
            </Title>
            <Tagline>
                {personal.role} · EST. {personal.established} · STATUS: ONLINE
            </Tagline>
            <Layout>
                <Menu>
                    {menuItems.map((item, index) => (
                        <li key={item.path}>
                            <Row
                                data-active={index === selected}
                                onMouseEnter={() => setSelected(index)}
                                onClick={() => navigate(item.path)}
                            >
                                <Marker>{index === selected ? '► ' : '> '}</Marker>
                                <RowLabel>
                                    [{item.num}] {item.label} <Hint>...... {item.hint}</Hint>
                                </RowLabel>
                            </Row>
                        </li>
                    ))}
                    <li>
                        <p style={{ marginTop: '1.5rem', padding: '0.4rem 0.6rem' }}>
                            &gt; <Cursor>█</Cursor>
                        </p>
                    </li>
                </Menu>
                <StatusPanel />
            </Layout>
        </main>
    );
};

export default MainMenu;
