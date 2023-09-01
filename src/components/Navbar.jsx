import styled from "styled-components";

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
    //justify-content: center;
`;

const ListItem = styled.li`
    margin: 0 30px; /* Adjust the spacing between list items */
`;

const ListItemLink = styled.a`
    text-decoration: none;
    color: white;
    font-size: 1.2rem;
    font-weight: 600;
    transition: all 0.2s ease-in-out;
    &:hover {
        color: #f5cb5c;
    }
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
            {/*<NavbarContainer>*/}
            {/*    <Links>*/}
            {/*        <List>*/}
            {/*            <ListItem>*/}
            {/*                <ListItemLink onClick={() => scrollToSection("home")}>*/}
            {/*                    Home*/}
            {/*                </ListItemLink>*/}
            {/*            </ListItem>*/}
            {/*            <ListItem>*/}
            {/*                <ListItemLink onClick={() => scrollToSection("skills")}>*/}
            {/*                    Skills*/}
            {/*                </ListItemLink>*/}
            {/*            </ListItem>*/}
            {/*            <ListItem>*/}
            {/*                <ListItemLink onClick={() => scrollToSection("projects")}>*/}
            {/*                    Projects*/}
            {/*                </ListItemLink>*/}
            {/*            </ListItem>*/}
            {/*            <ListItem>*/}
            {/*                <ListItemLink onClick={() => scrollToSection("contact")}>*/}
            {/*                    Contact*/}
            {/*                </ListItemLink>*/}
            {/*            </ListItem>*/}
            {/*        </List>*/}
            {/*    </Links>*/}
            {/*</NavbarContainer>*/}
        </Navbar>
    );
};

export default NavBar;