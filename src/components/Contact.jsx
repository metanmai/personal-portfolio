import {useEffect, useState} from 'react';
import styled from 'styled-components'
import axios from "axios";
import FormSubmitPopup from "../FormSubmitPopup.jsx";

const ContactContainer = styled.div`
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
    padding: 20px;
    border: 2px solid #00d1ff;
    border-radius: 15px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0);
    margin: 15px;
    animation: fadeIn 4s ease forwards;
    backdrop-filter: blur(12px);
`;

const Container2 = styled.div`
    order: ${props => props.order};
    justify-content: center;
    align-items: center;
    display: flex;
    border-radius: 15px;
    margin: 15px;
    animation: fadeIn 4s ease forwards;
`;

const Heading = styled.h2`
    font-family: 'Abyssinica SIL', serif;
    color: #00d1ff;
    font-size: 75px;
    margin-bottom: 10px;
`;

const Paragraph = styled.p`
    font-family: 'PT Sans', sans-serif;
    font-size: 25px;
    line-height: 1.5;
    margin-bottom: 15px;
`;

const FormContainer = styled.div`
    position: relative;
    width: 100%;
    border: 1px solid #ccc;
    background-color: #9b0e0e;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const Form = styled.form`
    max-width: 800px;
    //max-height: 50vh;
    margin: 0;
    position: relative;
    width: 80%;
    padding: 20px;
    justify-content: center;
    align-items: center;
    background-color: #109b26;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    gap: 12px;
`

const Input = styled.input`
    font-family: 'PT Sans', sans-serif;
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    margin-bottom: 15px;
`;

const TextArea = styled.textarea`
    font-family: 'PT Sans', sans-serif;
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
        console.log("Sending Email...");
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
                <Heading>Get in Touch ✉️</Heading>
                <Paragraph>If you&apos;d like to get in touch with me or have any inquiries, please feel free to send me an email using the given form.</Paragraph>
                <Paragraph>I look forward to hearing from you and will respond as soon as possible.</Paragraph>
            </Container1>
            <Container2>
                <FormContainer>
                    {/*<span> HMU.</span>*/}
                    <Form id={`form`} onSubmit={handleSubmit}>
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