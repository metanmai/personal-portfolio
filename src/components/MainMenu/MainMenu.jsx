import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { menuItems, personal } from '../../constants/index.js';
import { usePageMeta } from '../../hooks/usePageMeta.js';

const Header = styled.header`
    border-bottom: 1px solid var(--dim);
    padding-bottom: 0.6rem;
    margin-bottom: 1.6rem;
    color: var(--dim);
    font-size: 0.9em;
`;

const Name = styled.h1`
    font-size: clamp(2.2rem, 8vw, 4rem);
    letter-spacing: 0.04em;
    margin-bottom: 0.2rem;
`;

const Tagline = styled.p`
    color: var(--dim);
    margin-bottom: 2rem;
`;

const Menu = styled.ul`
    list-style: none;
`;

const Row = styled.button`
    display: block;
    width: 100%;
    max-width: 640px;
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
`;

const Hint = styled.span`
    opacity: 0.6;
`;

const Cursor = styled.span`
    animation: blink 1s steps(1) infinite;

    @keyframes blink {
        50% { opacity: 0; }
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
            <Name>{personal.name}</Name>
            <Tagline>
                {personal.role} · EST. {personal.established} · STATUS: ONLINE
            </Tagline>
            <Menu>
                {menuItems.map((item, index) => (
                    <li key={item.path}>
                        <Row
                            data-active={index === selected}
                            onMouseEnter={() => setSelected(index)}
                            onClick={() => navigate(item.path)}
                        >
                            &gt; [{item.num}] {item.label} <Hint>...... {item.hint}</Hint>
                        </Row>
                    </li>
                ))}
            </Menu>
            <p style={{ marginTop: '1.5rem' }}>
                &gt; <Cursor>█</Cursor>
            </p>
        </main>
    );
};

export default MainMenu;
