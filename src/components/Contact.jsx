import {useEffect, useState} from 'react';
import styled from 'styled-components'
import axios from "axios";

const ContactContainer = styled.div`
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
    //background-color: aqua;
    justify-content: center;
    align-items: center;
    display: flex;
    box-sizing: border-box;
`

const Container2 = styled.div`
    //background-color: blueviolet;
    justify-content: center;
    align-items: center;
    display: flex;
    box-sizing: border-box;
`

const FloatImage = styled.img`
    ${({ aspectRatio }) =>
    aspectRatio < 1
        ? 
        `
            max-height: 10%
        `
        : 
        `
            max-width: 80%;
        `
    }
    
    height: auto;
    animation: fadeIn 2s ease forwards, moveUpDown 6s infinite linear;
    
    @keyframes fadeIn {
        0% {
            opacity: 0;
        }
        
        100% {
        opacity: 1;
        }
    }
  
    @keyframes moveUpDown {
        0%, 100% {
          transform: translateY(0);
        }
        25% {
          transform: translateY(-20px);
        }
        
        50% {
          transform: translateY(0);
        }
        
        75% {
          transform: translateY(20px);
        }
    }
`

const FormContainer = styled.form`
    
`

const Title = styled.div`
    
`

const Input = styled.input`
    
`

const Contact = () => {
    const [aspectRatio, setAspectRatio] = useState(window.innerWidth / window.innerHeight);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');

    const handleResize = () => {
        setAspectRatio(window.innerWidth / window.innerHeight);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(name, email, subject, message);
        try {
            const response = await axios.post('http://localhost:3000/send-email', {
                name,
                email,
                subject,
                message
            });
            console.log(response.data.message);

        } catch(error) {
            console.error('Error sending email:', error);
        }
    };

    useEffect(() => {
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <ContactContainer aspectRatio={aspectRatio}>
            <Container1>
                <FloatImage src={`img/mailbox.png`} alt={`mailbox`}/>
            </Container1>
            <Container2>
                <FormContainer onSubmit={handleSubmit}>
                    <Title> HMU.</Title>
                    <Input
                        type={`text`}
                        placeholder={`Name`}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <Input
                        type={`email`}
                        placeholder={`Email`}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <Input
                        type={`text`}
                        placeholder={`Subject`}
                        onChange={(e) => setSubject(e.target.value)}
                    />
                    <textarea
                        placeholder={`Enter your message here`}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                    <button type={`submit`}> Submit </button>
                </FormContainer>
            </Container2>
        </ContactContainer>
    );
};

export default Contact;