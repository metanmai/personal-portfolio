import styled from "styled-components";

const ProjectsContainer = styled.div`
  height: calc(100vh - 60px);
  scroll-snap-align: center;
`

const Projects = () => {
    return (
        <ProjectsContainer>
            Projects Component
        </ProjectsContainer>
    );
};

export default Projects;