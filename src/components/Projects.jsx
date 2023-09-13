import styled from "styled-components";
import {projects} from "../constants/index.js";
import {Project} from "./Project.jsx";
import {useEffect, useState} from "react";

const ProjectsContainer = styled.div.attrs({id: 'Home'})`
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
    padding: 20px;
    overflow-y: auto;
    border: 4px solid #fdcd00;
    border-radius: 15px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0);
    margin: 15px;
    animation: fadeIn 4s ease forwards;
    background-color: rgba(0, 0, 0, 0.25);
    backdrop-filter: blur(8px);
`;

const Container2 = styled.div`
    padding: 20px;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 25px;
    margin: 15px;
`;

const Heading = styled.h2`
    font-family: 'Abyssinica SIL', serif;
    color: #fdcd00;
    font-size: 75px;
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

const Projects = () => {
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

    return (
        <ProjectsContainer aspectRatio={aspectRatio}>
            <Container1>
                <Heading>Projects 💡</Heading>
                <Paragraph>Welcome to my projects showcase, where I have the pleasure of sharing some exciting work I&apos;ve been up to.</Paragraph>
                <Paragraph> As a computer science enthusiast, I&apos;ve turned my curiosity into cool projects that I&apos;d like to share with you. These aren&apos;t just lines of code; they&apos;re a reflection of my passion and creativity.</Paragraph>
            </Container1>
            <Container2>
                {projects.map((project, index) => (
                    <Project key={project.id} index={index}/>
                ))}
            </Container2>
        </ProjectsContainer>
    );
};

export default Projects;