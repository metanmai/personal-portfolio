import React from 'react';
import styled from "styled-components";

const ContactContainer = styled.div`
  height: 100vh;
  scroll-snap-align: center;
`

const Contact = () => {
    return (
        <ContactContainer>
            Contact Component
        </ContactContainer>
    );
};

export default Contact;