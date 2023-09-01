import styled from "styled-components";

const TestimonialsContainer = styled.div`
  height: calc(100vh - 60px);
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
`;

const Container1 = styled.div`
    order: ${props => props.order};
    justify-content: center;
    align-items: center;
    display: flex;
    border-radius: 15px;
    margin: 15px;
    animation: fadeIn 4s ease forwards;
`;

const Container2 = styled.div`
  padding: 20px;
  border: 2px solid #ff7af4;
  border-radius: 15px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0);
  margin: 15px;
  animation: fadeIn 4s ease forwards;
  backdrop-filter: blur(12px);
`;

const Heading = styled.h2`
    font-family: 'Abyssinica SIL', serif;
    color: #ff7af4;
    font-size: 75px;
    margin-bottom: 10px;
`;

const Paragraph = styled.p`
    font-family: 'PT Sans', sans-serif;
    font-size: 25px;
    line-height: 1.5;
    margin-bottom: 15px;
`;

export const Testimonials = () => {
	return (
		<TestimonialsContainer>
            <Container1>
            </Container1>
            <Container2>
				<Heading>Testimonials 🙌</Heading>
                <Paragraph>Discover endorsements from professionals who have worked with me. These testimonials showcase my skills and contributions. See why they vouch for my work.</Paragraph>
                <Paragraph> These endorsements are a testament to the quality of my contributions and the trust others have placed in me.</Paragraph>
            </Container2>
        </TestimonialsContainer>
	)
}