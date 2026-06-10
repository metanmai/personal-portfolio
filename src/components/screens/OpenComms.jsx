import { useRef, useState } from 'react';
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
    max-width: 620px;
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
    font-size: 1.05em;
    padding: 0.65rem 0.8rem;

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

const FIELD_ORDER = ['name', 'email', 'subject', 'message', 'submit'];

const REJECTION_MESSAGES = {
    name: '> TRANSMISSION REJECTED: CALLSIGN REQUIRED',
    email: '> TRANSMISSION REJECTED: RETURN FREQUENCY INVALID',
    subject: '> TRANSMISSION REJECTED: SUBJECT REQUIRED',
    message: '> TRANSMISSION REJECTED: MESSAGE REQUIRED',
};

const EMAIL_RE = /^\S+@\S+\.\S+$/;

const validate = (data) => {
    if (!data.name || !data.name.trim()) return 'name';
    const email = (data.email || '').trim();
    if (!email || !EMAIL_RE.test(email)) return 'email';
    if (!data.subject || !data.subject.trim()) return 'subject';
    if (!data.message || !data.message.trim()) return 'message';
    return null;
};

const OpenComms = () => {
    const [status, setStatus] = useState('idle');
    const [invalidField, setInvalidField] = useState(null);
    const fieldRefs = {
        name: useRef(null),
        email: useRef(null),
        subject: useRef(null),
        message: useRef(null),
        submit: useRef(null),
    };
    usePageMeta('OPEN COMMS CHANNEL', 'Contact Tanmai Nuthi.');

    const focusField = (name) => {
        const node = fieldRefs[name]?.current;
        if (node) node.focus();
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = Object.fromEntries(new FormData(event.target));
        const bad = validate(data);
        if (bad) {
            setStatus('invalid');
            setInvalidField(bad);
            focusField(bad);
            return;
        }
        setInvalidField(null);
        setStatus('sending');

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

    const moveFocus = (currentName, direction) => {
        const idx = FIELD_ORDER.indexOf(currentName);
        if (idx === -1) return;
        const nextIdx = idx + direction;
        if (nextIdx < 0 || nextIdx >= FIELD_ORDER.length) return;
        focusField(FIELD_ORDER[nextIdx]);
    };

    const handleKeyDown = (name) => (event) => {
        if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
        const target = event.target;

        // For textarea: only intercept when caret is at the boundary.
        if (name === 'message' && target instanceof HTMLTextAreaElement) {
            const { selectionStart, selectionEnd, value } = target;
            if (event.key === 'ArrowDown') {
                if (selectionStart !== value.length || selectionEnd !== value.length) return;
            } else {
                if (selectionStart !== 0 || selectionEnd !== 0) return;
            }
        }

        event.preventDefault();
        moveFocus(name, event.key === 'ArrowDown' ? 1 : -1);
    };

    return (
        <ScreenFrame title="OPEN COMMS CHANNEL">
            <Wrapper>
                <Form id="form" onSubmit={handleSubmit} noValidate>
                    <Field>
                        CALLSIGN (NAME)
                        <Input
                            name="name"
                            required
                            autoComplete="name"
                            ref={fieldRefs.name}
                            onKeyDown={handleKeyDown('name')}
                        />
                    </Field>
                    <Field>
                        RETURN FREQUENCY (EMAIL)
                        <Input
                            name="email"
                            type="email"
                            required
                            autoComplete="email"
                            ref={fieldRefs.email}
                            onKeyDown={handleKeyDown('email')}
                        />
                    </Field>
                    <Field>
                        SUBJECT
                        <Input
                            name="subject"
                            required
                            ref={fieldRefs.subject}
                            onKeyDown={handleKeyDown('subject')}
                        />
                    </Field>
                    <Field>
                        MESSAGE
                        <TextArea
                            name="message"
                            required
                            ref={fieldRefs.message}
                            onKeyDown={handleKeyDown('message')}
                        />
                    </Field>
                    <Submit
                        type="submit"
                        disabled={status === 'sending'}
                        ref={fieldRefs.submit}
                        onKeyDown={handleKeyDown('submit')}
                    >
                        {status === 'sending' ? 'TRANSMITTING...' : '[ TRANSMIT MESSAGE ]'}
                    </Submit>
                    <Output role="status">
                        {status === 'sent' && '> TRANSMISSION SENT ✓'}
                        {status === 'failed' && '> RELAY FAILURE — RETRY'}
                        {status === 'invalid' && invalidField && REJECTION_MESSAGES[invalidField]}
                    </Output>
                </Form>
            </Wrapper>
        </ScreenFrame>
    );
};

export default OpenComms;
