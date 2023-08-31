import {useEffect, useState} from 'react';
import styled from 'styled-components'
import Typing from "./Typing.jsx";


const HeroContainer = styled.div`
    height: calc(100vh - 60px);
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
`;

const Container1 = styled.div`
    padding: 15px;
    //background-color: sienna;
    order: ${props => props.order};
    justify-content: center;
    align-items: center;
    display: grid;
    box-sizing: border-box;
    margin: 15px;
    border: 2px solid #9eff88;
    border-radius: 15px;
    backdrop-filter: blur(12px);
    animation: fadeIn 4s ease forwards;
    
    @keyframes fadeIn {
        0% {
            opacity: 0;
        }
        
        100% {
            opacity: 1;
        }
    }
`;

const Container2 = styled.div`
    //background-color: blueviolet;
    order: ${props => props.order};
    justify-content: center;
    align-items: center;
    display: flex;
    border-radius: 15px;
    margin: 15px;
    animation: fadeIn 4s ease forwards;
`;

const TypingContainer = styled.div`
`;

const ParagraphContainer = styled.div`
`;

const FloatImage = styled.img`
    ${({aspectRatio}) =>
    aspectRatio < 1
        ? 
        `
            max-width: 60vw;
        `
        : 
        `
            max-width: 35vw;
        `
    }
    
    //max-width: 30vw;
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
`;

const Paragraph = styled.p`
    font-family: 'PT Sans', sans-serif;
    font-size: 21px;
    line-height: 1.5;
    //margin-bottom: 15px;
`;

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
                <TypingContainer>
                    <Typing/>
                </TypingContainer>
                <ParagraphContainer>
                    <Paragraph>Hello! I&apos;m Tanmai Niranjan, a final year Computer Science student at PES University. I&apos;m passionate about coding, problem-solving, and learning new technologies.</Paragraph>
                    <Paragraph>In my free time, I enjoy working on personal coding projects, exploring new programming languages, and playing video games.</Paragraph>
                </ParagraphContainer>
            </Container1>
            <Container2 order={rightOrder}>
                <FloatImage src={`img/boy-computer.png`} alt={`programmer`} aspectRatio={aspectRatio}/>
            </Container2>
        </HeroContainer>
    );
};

export default Hero;