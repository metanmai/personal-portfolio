// eslint-disable-next-line no-unused-vars
import React from 'react';
import styled from 'styled-components'

const HeroContainer = styled.div`
  height: 100vh;
  scroll-snap-align: center;
`

const Hero = () => {
    return (
        <HeroContainer>
            Hero Component
        </HeroContainer>
    );
};

export default Hero;