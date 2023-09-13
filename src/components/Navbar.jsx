import styled from "styled-components";
import {socials} from "../constants/index.js";
import {useEffect, useRef, useState} from "react";

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
    flex-direction: ${({ vertical }) => (vertical ? 'column' : 'row')};
    justify-content: center;
    margin: 0 0;
`;

const ListItem = styled.li`
    margin: 10px 10px; /* Adjust the spacing between list items */
`;

const Socials = styled.div`
    position: ${(props) => (props.footer ? `relative` : `absolute`)};
    display: flex;
    flex-direction: row-reverse;
    right: ${(props) => (props.footer ? `` : `0`)};
    padding: ${(props) => (props.footer ? `10px 0` : `0 10px`)};
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

const DropdownButton = styled.div`
    user-select: none;
    position: absolute;
    right: 10px;
    height: 30px;
  	width: 30px;
    border: 1px solid white;
    margin: 5px;
  	border-radius: 15px;
  	background-image: url(${({path}) => path});
  	background-size: auto 90%; // width and height
  	background-position: center;
    cursor: pointer;
    transition: all .15s ease-in-out;
    color: white;
    
    &:hover {
        box-shadow: 0 0 10px 0 white inset, 0 0 20px 2px white;
        border: 1px solid white;
    }
`;

const DropdownMenu = styled.div`
    position: absolute;
    top: -100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    border-left: 1px solid rgba(255, 255, 255, 0.6);
    border-bottom: 1px solid rgba(255, 255, 255, 0.6);
    border-bottom-left-radius: 10px;
    align-items: center;
    padding: 0 10px;
    right: 0;
    background-color: rgba(0, 0, 0, 0.8);
    transition: top 0.3s ease;
`;

const NavBar = () => {
    const [showButtons, setShowButtons] = useState(false);
    const [dropdown, setDropdown] = useState(false);
    const dropdownRef = useRef(null);
    const dropdownButtonRef = useRef(null);
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

    useEffect(() => {
        const handleResize = () => {
            const thresholdWidth = 900;

            if (window.innerWidth > thresholdWidth) {
                setShowButtons(true);
                setDropdown(false)
            } else {
                setShowButtons(false);
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize();

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current &&
                !dropdownRef.current.contains(event.target) &&
                event.target !== dropdownButtonRef.current) {
            setDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <Navbar onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            <Logo src={"img/metanmai-logo.svg"}/>
            {showButtons &&
                <List vertical={false}>
                    {sections.map((section, index) => (
                        <ListItem key={index}>
                            <NavButton onClick={() => handleClickScroll(section)}>
                                {section}
                            </NavButton>
                        </ListItem>
                    ))}
                </List>
            }
            {showButtons &&
                <Socials footer={false}>
                    {socials.map((social, index) => (
                        <SocialAcc
                            key={index}
                            path={social.imgUrl}
                            onClick={() => handleClick(social.link)}
                        />
                    ))}
                </Socials>
            }
            {!showButtons &&
                <DropdownButton
                    ref={dropdownButtonRef}
                    path={`img/hamburger-button.png`}
                    onClick={() => setDropdown(!dropdown)}
                />
            }
            {
                dropdown &&
                <DropdownMenu style={{ top: dropdown ? '51px' : '-100%' }} ref={dropdownRef}>
                    <List vertical={true}>
                        {sections.map((section, index) => (
                            <ListItem key={index}>
                                <NavButton onClick={() => handleClickScroll(section)}>
                                    {section}
                                </NavButton>
                            </ListItem>
                        ))}
                    </List>
                    <Socials footer={true}>
                        {socials.map((social, index) => (
                            <SocialAcc
                                key={index}
                                path={social.imgUrl}
                                onClick={() => handleClick(social.link)}
                            />
                        ))}
                    </Socials>
                </DropdownMenu>
            }
        </Navbar>
    );
};

export default NavBar;