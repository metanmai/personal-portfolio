import styled from "styled-components";

const Navbar = styled.div`
    background-color: darkorchid;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
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

    return (
        <Navbar onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            <NavbarContainer>
                <Links>
                    <List>
                        <ListItem> Home </ListItem>
                        <ListItem> Skills </ListItem>
                        <ListItem> Projects </ListItem>
                        <ListItem> Contact </ListItem>
                    </List>
                </Links>
            </NavbarContainer>
        </Navbar>
    );
};

export default NavBar;