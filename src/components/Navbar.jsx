import styled from "styled-components";
import {NavButton} from "./NavButton/NavButton.jsx";

const Navbar = styled.div`
    color: white;
    font-family: "PT Sans", sans-serif;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    //border: 2px solid white;
    background-color: rgba(0, 0, 0, 0.75);
    border-bottom: 1px solid rgba(255, 255, 255, 0.4);
    backdrop-filter: blur(3px);
    animation: fadeIn 1s ease-in-out;
`;

const NavbarContainer = styled.div`
    width: 1400px;
    display: flex;
`;

const Links = styled.div`
    width: 1400px;
`;

const List = styled.ul`
    position: relative;
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    justify-content: center;
`;

const ListItem = styled.li`
    margin: 0 15px; /* Adjust the spacing between list items */
`;

const NavBar = () => {
      const handleMouseEnter = () => {
          document.body.style.overflow = 'hidden'; // Prevent scrolling
      };

      const handleMouseLeave = () => {
          document.body.style.overflow = 'auto'; // Enable scrolling
      };

      // const { scrollToSection } = useScrollContext();

    return (
        <Navbar onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            <NavbarContainer>
                <Links>
                    <List>
                        <ListItem>
                            <NavButton text={`Home`}/>
                        </ListItem>
                        <ListItem>
                            <NavButton text={`Skills`}/>
                        </ListItem>
                        <ListItem>
                            <NavButton text={`Projects`}/>
                        </ListItem>
                        <ListItem>
                            <NavButton text={`Testimonials`}/>
                        </ListItem>
                        <ListItem>
                            <NavButton text={`Contact`}/>
                        </ListItem>
                    </List>
                </Links>
            </NavbarContainer>
        </Navbar>
    );
};

export default NavBar;