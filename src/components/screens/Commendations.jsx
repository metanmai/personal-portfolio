import styled from 'styled-components';
import ScreenFrame from './ScreenFrame.jsx';
import { testimonials } from '../../constants/index.js';
import { usePageMeta } from '../../hooks/usePageMeta.js';

const Log = styled.blockquote`
    border: 1px solid var(--dim);
    padding: 1rem 1.2rem;
    margin-bottom: 1.2rem;
    max-width: 75ch;
`;

const Meta = styled.footer`
    color: var(--dim);
    margin-top: 0.6rem;
`;

const Commendations = () => {
    usePageMeta('FIELD COMMENDATIONS', 'Testimonials and endorsements.');

    return (
        <ScreenFrame title="FIELD COMMENDATIONS">
            {testimonials.map((entry, index) => (
                <Log key={entry.person}>
                    <p style={{ color: 'var(--dim)' }}>RECOVERED LOG {String(index + 1).padStart(2, '0')}/{String(testimonials.length).padStart(2, '0')}</p>
                    <p>&ldquo;{entry.text}&rdquo;</p>
                    <Meta>— {entry.person}, {entry.role}, {entry.company}</Meta>
                </Log>
            ))}
        </ScreenFrame>
    );
};

export default Commendations;
