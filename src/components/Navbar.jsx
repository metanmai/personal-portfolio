import styled from "styled-components";
import {socials} from "../constants/index.js";

const Navbar = styled.div`
    color: white;
    font-family: "PT Sans", sans-serif;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 50px;
    display: flex;
    align-items: center;
    background-color: black;
    border-bottom: 1px solid rgba(255, 255, 255, 0.6);
    animation: fadeIn 1s ease-in-out;
    z-index: 2;
`;

const NavButton = styled.div`
    display: flex;
    width: 100px;
    padding-top: 5px;
    padding-bottom: 5px;
    justify-content: center;
    text-align: center;
    font-size: 15px;
    font-family: 'PT Sans', sans-serif;
    font-weight: 500;
    cursor: pointer;
    background-color: transparent;
    border: 1px solid white;
    border-radius: 50px;
    -webkit-transition: all .15s ease-in-out;
    transition: all .15s ease-in-out;
    color: white;
    
    &:hover {
        box-shadow: 0 0 10px 0 white inset, 0 0 20px 2px white;
        border: 1px solid white;
    }
`;

const Logo = styled.img`
    width: 100px;
    margin: 20px;
`;

const List = styled.ul`
    position: relative;
    list-style: none;
    padding: 0;
    display: flex;
    justify-content: center;
`;

const ListItem = styled.li`
    margin: 0 10px; /* Adjust the spacing between list items */
`;

const Socials = styled.div`
    position: absolute;
    display: flex;
    flex-direction: row-reverse;
    padding: 0 10px;
    right: 0; 
    //background-color: #00154d;
`;

const SocialAcc = styled.div`
  	height: 30px;
  	width: 30px;
    border: 1px solid white;
    margin: 5px;
  	border-radius: 15px;
  	background-image: url(${({path}) => path});
  	background-size: auto 100%; // width and height
  	background-position: center;
    cursor: pointer;
    transition: all .15s ease-in-out;
    color: white;
    
    &:hover {
        box-shadow: 0 0 10px 0 white inset, 0 0 20px 2px white;
        border: 1px solid white;
    }
`;

const NavBar = () => {
    const sections = ["Home", "Skills", "Projects", "Testimonials", "Contact"];
    const handleMouseEnter = () => {
      document.body.style.overflow = 'hidden';
    };

    const handleMouseLeave = () => {
      document.body.style.overflow = 'auto';
    };

    const handleClickScroll = (section) => {
		const element = document.getElementById(section);

		if (element) {
			element.scrollIntoView({ behavior: 'smooth' });
		}
    };

    const handleClick = (link) => {
        window.open(link, '_blank');
    };

    return (
        <Navbar onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            <Logo src={"img/metanmai-logo.svg"}/>
            <List>
                {sections.map((section, index) => (
                    <ListItem key={index}>
                        <NavButton onClick={() => handleClickScroll(section)}>
                            {section}
                        </NavButton>
                    </ListItem>
                ))}
            </List>
            <Socials>
                {socials.map((social, index) => (
                    <SocialAcc
                        key={index}
                        path={social.imgUrl}
                        onClick={() => handleClick(social.link)}/>
                ))}
            </Socials>
        </Navbar>
    );
};

export default NavBar;