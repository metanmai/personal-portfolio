import styled from "styled-components";
import BallCanvas from "./Ball.jsx";
import {technologies} from "../constants/index.js";

const WhoContainer = styled.div`
  height: 100vh;
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
    //background-color: blue;
    justify-content: center;
    align-items: center;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: repeat(3, 1fr);
    gap: 10px; /* Adjust the gap as needed */
    width: 100%;
    height: 100vh; /* Adjust the height as needed */
`

const Container2 = styled.div`
    background-color: blueviolet;
    justify-content: center;
    align-items: center;
    display: flex;
    box-sizing: border-box;
`

const BallContainer = styled.div`
    max-width: 100%;
`

const Who = () => {
    return (
        <WhoContainer>
            <Container1>
                {technologies.map((technology) => (
                    <BallContainer key={technology.name}>
                        <BallCanvas icon={technology.icon} />
                    </BallContainer>
                ))}
            </Container1>
            <Container2>
                Container2
            </Container2>
        </WhoContainer>
    );
};

export default Who;