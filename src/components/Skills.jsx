import styled from "styled-components";
import BallCanvas from "./Ball.jsx";
import {technologies} from "../constants/index.js";

const SkillsContainer = styled.div`
    height: calc(100vh - 50px);
    scroll-snap-align: center;
    display: grid;
    flex-direction: ${({ aspectRatio }) => aspectRatio < 1 ? "column" : "row"};
    
    ${({ aspectRatio }) =>
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
    padding: 12px;
    //background-color: brown;
    justify-content: center;
    align-items: center;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: repeat(3, 1fr);
    gap: normal;
    height: 100%;
    animation: fadeIn 4s ease forwards;
`

const Container2 = styled.div`
    //background-color: blueviolet;
    //height: 100%;
    padding: 20px;
    border: 2px solid #ff5555;
    border-radius: 15px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0);
    margin: 15px;
    animation: fadeIn 4s ease forwards;
    backdrop-filter: blur(12px);
`

const BallContainer = styled.div`
    max-width: 75%;
`

const Heading = styled.h2`
    font-family: 'Abyssinica SIL', serif;
    color: #ff5555;
    font-size: 100px;
    margin-bottom: 10px;
`;

const Paragraph = styled.p`
    font-family: 'PT Sans', sans-serif;
    font-size: 25px;
    line-height: 1.5;
    margin-bottom: 15px;
`;

const Skills = () => {
    return (
        <SkillsContainer>
            <Container1>
                {technologies.map((technology) => (
                    <BallContainer key={technology.name}>
                        <BallCanvas icon={technology.icon} />
                    </BallContainer>
                ))}
            </Container1>
            <Container2>
                <Heading>Skills</Heading>
                <Paragraph>Hello! I&apos;m Tanmai Niranjan, a final year Computer Science student at PES University. I&apos;m passionate about coding, problem-solving, and learning new technologies.</Paragraph>
                <Paragraph>In my free time, I enjoy working on personal coding projects, exploring new programming languages, and playing video games.</Paragraph>
            </Container2>
        </SkillsContainer>
    );
};

export default Skills;