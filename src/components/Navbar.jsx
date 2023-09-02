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
    background-color: rgba(0, 0, 0, 0.75);
    border-bottom: 1px solid rgba(255, 255, 255, 0.6);
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
    margin: 0 12px; /* Adjust the spacing between list items */
`;

const Socials = styled.div`
    position: absolute;
    display: inline-block;
    right: 0;
    background-color: red;
`;

const NavBar = () => {
    const sections = ["Home", "Skills", "Projects", "Testimonials", "Contact"];
    const handleMouseEnter = () => {
      document.body.style.overflow = 'hidden';
    };

    const handleMouseLeave = () => {
      document.body.style.overflow = 'auto';
    };


    return (
        <Navbar onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            <NavbarContainer>
                <Links>
                    <List>
                        {sections.map((section, index) => (
                            <ListItem key={index}>
                                <NavButton text={section}/>
                            </ListItem>
                        ))}
                    </List>
                </Links>
                <Socials>
                    1
                </Socials>
            </NavbarContainer>
        </Navbar>
    );
};

export default NavBar;