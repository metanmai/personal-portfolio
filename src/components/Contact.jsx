import {useEffect, useState} from 'react';
import styled from 'styled-components'
import axios from "axios";
import FormSubmitPopup from "../FormSubmitPopup.jsx";

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
            
        `
        : 
        `
            
        `
    }
    max-width: 250px;
    max-height: 50vh;
    //background-color: brown;
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

const FormContainer = styled.div`
    max-width: 70%;
    max-height: 50vh;
    justify-content: center;
    align-items: center;
    border-radius: 15px;
    //background-color: crimson;
    width: 100%;
    margin: 0;
    gap: 10px;
`;

const Form = styled.form`
    max-width: 600px;
    max-height: 50vh;
    margin: 0;
    position: relative;
    width: 80%;
    padding: 20px;
    justify-content: center;
    align-items: center;
    //background-color: #109b26;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    gap: 12px;
`

const Input = styled.input`
    font-family: 'Abyssinica SIL', serif;
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    margin-bottom: 15px;
`;

const TextArea = styled.textarea`
    font-family: 'Abyssinica SIL', serif;
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    margin-bottom: 15px;
    resize: vertical;
    max-height: 40vh;
`;

const Button = styled.button`
    font-family: 'Abyssinica SIL', serif;
    color: white;
    display: block;
    width: 100%;
    padding: 10px;
    background-color: #007bff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    
    &:hover {
    background-color: #0056b3;
    }
`;

const Loading = styled.img`
    max-width: 11px;
    animation: rotation 1s infinite linear;
    
    @keyframes rotation {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
}
`;

const Contact = () => {
    const [aspectRatio, setAspectRatio] = useState(window.innerWidth / window.innerHeight);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [showPopup, setShowPopup] = useState(false);
    const [showLoading, setShowLoading] = useState(false)
    const [status, setStatus] = useState(false)

    const handleResize = () => {
        setAspectRatio(window.innerWidth / window.innerHeight);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(name, email, subject, message);
        setShowLoading(true)

        try {
            const response = await axios.post('/.netlify/functions/send-email', {
                name,
                email,
                subject,
                message
            });
            console.log(response.data.message);

            setShowLoading(false)
            setShowPopup(true);
            setStatus(true)

            const form = document.getElementById("form");
            const inputs = form.querySelectorAll("input, textarea");

            inputs.forEach((input) => {
                input.value = "";
            });

        } catch(error) {
            console.error('Error sending email:', error);

            setShowLoading(false);
            setShowPopup(true);
            setStatus(false)

        } finally {
            setTimeout(() => {
                setShowPopup(false);
            }, 5000);
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
                <FloatImage src={`img/mailbox.png`} alt={`mailbox`} />
            </Container1>
            <Container2>
                <FormContainer>
                    <Form id={`form`} onSubmit={handleSubmit}>
                        <span> HMU.</span>
                        <Input
                            required
                            type={`text`}
                            placeholder={`Name`}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <Input
                            required
                            type={`email`}
                            placeholder={`Email`}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <Input
                            required
                            type={`text`}
                            placeholder={`Subject`}
                            onChange={(e) => setSubject(e.target.value)}
                        />
                        <TextArea
                            rows={`10`}
                            wrap="soft"
                            placeholder={`Message`}
                            onChange={(e) => setMessage(e.target.value)}
                        />
                        <Button type={`submit`}> Send {showLoading && <Loading src={`img/loading.png`}/>} </Button>
                    </Form>
                    {showPopup && <FormSubmitPopup status={status}/>}
                </FormContainer>
            </Container2>
        </ContactContainer>
    );
};

export default Contact;