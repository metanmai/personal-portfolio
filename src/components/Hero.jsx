import React, {useEffect, useState} from 'react';
import styled, {keyframes} from 'styled-components'

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

const Container1 = styled.div`
    background-color: aqua;
    order: ${props => props.order};
`

const Container2 = styled.div`
    background-color: blueviolet;
    order: ${props => props.order};
    justify-content: center;
    align-items: center;
    display: flex;
`

const FloatImage = styled.img`
    max-width: 100%;
    height: auto;
    animation: moveUpDown 6s infinite linear;
  
    @keyframes moveUpDown {
      0%, 100% {
          transform: translateY(0);
      }
      25% {
          transform: translateY(-20px);
      }
      
      50% {
          transform: translateY(0);
      }
      
      75% {
          transform: translateY(20px);
      }
    }
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
            <Container1 order={leftOrder}>
                Container1
            </Container1>
            <Container2 order={rightOrder}>
                <FloatImage src={`img/programmer.png`} alt={`programmer`}/>
            </Container2>
        </HeroContainer>
    );
};

export default Hero;