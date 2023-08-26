import React from 'react';
import styled from "styled-components";

const Navbar = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 1000;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const NavbarContainer = styled.div`
    width: 1400px;
    display: flex;
`

const Links = styled.div`
    width: 1400px;
`

const Logo = styled.img`
  width: 75px; 
  height: auto;
  margin-left: 20px;
  position: fixed;
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

    return (
        <Navbar onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            <NavbarContainer>
                <Logo src={`img/logo-no-background.png`} alt={`logo`}/>
                <Links>
                    <List>
                        <ListItem> Home </ListItem>
                        <ListItem> Who </ListItem>
                        <ListItem> Works </ListItem>
                        <ListItem> Contact </ListItem>
                    </List>
                </Links>
            </NavbarContainer>
        </Navbar>
    );
};

export default NavBar;