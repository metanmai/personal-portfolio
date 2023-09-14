import styled from "styled-components";
import BallCanvas from "./Balls/Ball.jsx";
import {technologies} from "../constants/index.js";
import {useEffect, useState} from "react";

const SkillsContainer = styled.div.attrs({id: 'Skills'})`
    height: calc(100vh - 60px);
    scroll-snap-align: center;
    display: grid;
    flex-direction: ${({aspectratio}) => aspectratio < 1 ? "column" : "row"};
    
    ${({aspectratio}) =>
    aspectratio < 1
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
    padding: 12px;
    overflow-y: auto;
    justify-content: center;
    align-items: center;
    order: ${props => props.order};
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: repeat(3, 1fr);
    gap: normal;
    height: 100%;
    animation: fadeIn 4s ease forwards;
`

const Container2 = styled.div`
    padding: 20px;
    overflow-y: auto;
    order: ${props => props.order};
    border: 4px solid #ff3939;
    border-radius: 15px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0);
    margin: 15px;
    animation: fadeIn 4s ease forwards;
    background-color: rgba(0, 0, 0, 0.25);
    backdrop-filter: blur(8px);
`

const BallContainer = styled.div`
    max-width: 75%;
`

const Heading = styled.h2`
    font-family: 'Abyssinica SIL', serif;
    color: #ff3939;
    font-size: 100px;
    margin-bottom: 10px;
    
    @media (max-width: 1200px) {
		font-size: 60px;
	}
`;

const Paragraph = styled.p`
    font-family: 'PT Sans', sans-serif;
    font-size: 25px;
    line-height: 1.5;
    margin-bottom: 15px;
    
    @media (max-width: 1200px) {
		font-size: 20px;
	}
`;

const Skills = () => {
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
        <SkillsContainer aspectratio={aspectRatio}>
            <Container1 order={leftOrder}>
                {technologies.map((technology) => (
                    <BallContainer key={technology.name} style={{cursor: "grab"}}>
                        <BallCanvas icon={technology.icon} />
                    </BallContainer>
                ))}
            </Container1>
            <Container2 order={rightOrder}>
                <Heading>Skills 📝</Heading>
                <Paragraph>I possess a diverse skill set that spans web development, AWS cloud services, Git version control, Docker containerization, Tensorflow for AI/ML, and proficiency in C++ and Python frameworks.</Paragraph>
                <Paragraph>Beyond technology, I excel in leadership and cooperative workgroup positions. My practical experience facilitates open communication and ensures project success.</Paragraph>
            </Container2>
        </SkillsContainer>
    );
};

export default Skills;