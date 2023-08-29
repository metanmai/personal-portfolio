import {useEffect, useState} from 'react';
import styled from 'styled-components'
import Typing from "./Typing.jsx";


const HeroContainer = styled.div`
    height: 100vh;
    scroll-snap-align: center;
    display: grid;
    flex-direction: ${({aspectRatio}) => aspectRatio < 1 ? "column" : "row"};
  
    ${({aspectRatio}) =>
    aspectRatio < 1
        ? 
        `
        grid-template-columns: 1fr;
        grid-template-rows: 1fr 1fr;
        `
        : 
        `
        grid-template-columns: 1fr 1fr;
        grid-template-rows: 1fr;
        `
    }

  /* Additional styling for grid items */
  .grid-item {
    padding: 20px;
    border: 1px solid #ddd;
  }
`

const Container1 = styled.div`
    //background-color: aqua;
    justify-content: center;
    align-items: center;
    order: ${props => props.order};
    display: flex;
    box-sizing: border-box;
`

const Container2 = styled.div`
    //background-color: blueviolet;
    order: ${props => props.order};
    justify-content: center;
    align-items: center;
    display: flex;
    box-sizing: border-box;
`

const FloatImage = styled.img`
    ${({aspectRatio}) =>
    aspectRatio < 1
        ? 
        `
            max-height: 40%;
        `
        : 
        `
            max-width: 40%;
        `
    }
    
    height: auto;
    animation: fadeIn 2s ease forwards, moveUpDown 6s infinite linear;
    
    @keyframes fadeIn {
        0% {
            opacity: 0;
        }
        
        100% {
        opacity: 1;
        }
    }
  
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
                <Typing/>
            </Container1>
            <Container2 order={rightOrder}>
                <FloatImage src={`img/boy-computer.png`} alt={`programmer`} aspectRatio={aspectRatio}/>
            </Container2>
        </HeroContainer>
    );
};

export default Hero;