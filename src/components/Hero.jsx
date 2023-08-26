import React, {useEffect, useState} from 'react';
import styled from 'styled-components'

const HeroContainer = styled.div`
    height: 100vh;
    scroll-snap-align: center;
    display: grid;
    flex-direction: ${({ aspectRatio }) => (aspectRatio <= 1 ? 'row' : 'column')};
  
     ${({ aspectRatio }) =>
    aspectRatio <= 1
      ? `
    grid-template-columns: 1fr;
    grid-template-rows: 1fr 1fr;
  `
      : `
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr;
  `}

  /* Additional styling for grid items */
  .grid-item {
    padding: 20px;
    border: 1px solid #ddd;
  }
`

const Left = styled.div`
    background-color: aqua;
    order: ${props => props.order};
`

const Right = styled.div`
    background-color: blueviolet;
    order: ${props => props.order};
`

const Hero = () => {
    const [aspectRatio, setAspectRatio] = useState(window.innerWidth / window.innerHeight);

    const handleResize = () => {
        setAspectRatio(window.innerWidth / window.innerHeight);
    };

    useEffect(() => {
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const leftOrder = aspectRatio >= 1 ? 1 : 2;
    const rightOrder = aspectRatio >= 1 ? 2 : 1;

    return (
        <HeroContainer aspectRatio={aspectRatio}>
            <Left order={leftOrder}>
                Left Container
            </Left>
            <Right order={rightOrder}>
                Right Container
            </Right>
        </HeroContainer>
    );
};

export default Hero;