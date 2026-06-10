import { useState } from 'react';
import styled from 'styled-components';
import ScreenFrame from './ScreenFrame.jsx';
import { usePageMeta } from '../../hooks/usePageMeta.js';

const Wrapper = styled.div`
    display: flex;
    justify-content: center;
`;

const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 0.9rem;
    max-width: 560px;
    width: 100%;
    margin: 0 auto;
`;

const Field = styled.label`
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
    color: var(--dim);
`;

const inputStyles = `
    background: transparent;
    border: 1px solid var(--dim);
    color: var(--phosphor);
    font: inherit;
    text-shadow: inherit;
    padding: 0.5rem;

    &:focus {
        outline: 2px solid var(--phosphor);
        outline-offset: 1px;
    }
`;

const Input = styled.input`${inputStyles}`;

const TextArea = styled.textarea`
    ${inputStyles}
    min-height: 120px;
    resize: vertical;
`;

const Submit = styled.button`
    align-self: flex-start;
    background: transparent;
    border: 1px solid var(--phosphor);
    color: var(--phosphor);
    font: inherit;
    text-shadow: inherit;
    padding: 0.5rem 1.4rem;
    cursor: pointer;

    &:hover, &:focus-visible {
        background: var(--phosphor);
        color: var(--bg);
        text-shadow: none;
    }

    &:disabled {
        opacity: 0.5;
        cursor: wait;
    }
`;

const Output = styled.p`
    min-height: 1.4em;
`;

const OpenComms = () => {
    const [status, setStatus] = useState('idle');
    usePageMeta('OPEN COMMS CHANNEL', 'Contact Tanmai Nuthi.');

    const handleSubmit = async (event) => {
        event.preventDefault();
        setStatus('sending');
        const data = Object.fromEntries(new FormData(event.target));

        try {
            const response = await fetch('/.netlify/functions/send-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!response.ok) throw new Error('relay failure');
            setStatus('sent');
            event.target.reset();
        } catch {
            setStatus('failed');
        }
    };

    return (
        <ScreenFrame title="OPEN COMMS CHANNEL">
            <Wrapper>
                <Form id="form" onSubmit={handleSubmit}>
                    <Field>
                        CALLSIGN (NAME)
                        <Input name="name" required autoComplete="name" />
                    </Field>
                    <Field>
                        RETURN FREQUENCY (EMAIL)
                        <Input name="email" type="email" required autoComplete="email" />
                    </Field>
                    <Field>
                        SUBJECT
                        <Input name="subject" required />
                    </Field>
                    <Field>
                        MESSAGE
                        <TextArea name="message" required />
                    </Field>
                    <Submit type="submit" disabled={status === 'sending'}>
                        {status === 'sending' ? 'TRANSMITTING...' : '[ TRANSMIT MESSAGE ]'}
                    </Submit>
                    <Output role="status">
                        {status === 'sent' && '> TRANSMISSION SENT ✓'}
                        {status === 'failed' && '> RELAY FAILURE — RETRY'}
                    </Output>
                </Form>
            </Wrapper>
        </ScreenFrame>
    );
};

export default OpenComms;
