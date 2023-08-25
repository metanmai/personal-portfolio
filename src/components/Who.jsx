import React from 'react';
import styled from "styled-components";

const WhoContainer = styled.div`
  height: 100vh;
  scroll-snap-align: center;
`


const Who = () => {
    return (
        <WhoContainer>
            Who Component
        </WhoContainer>
    );
};

export default Who;