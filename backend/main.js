import bodyParser from "body-parser";
import express from "express";
import nodemailer from "nodemailer";

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/send_email', (req, res) => {
    const { name, email, subject, message } = req.body;

    const transporter = nodemailer.createTransport({
        service: 'gmail', // Example: 'Gmail'
        auth: {
            user: 'tanmaiemailclient@gmail.com', // Replace with your email address
            pass: 'email123_' // Replace with your email password
        }
    });

    const mailOptions = {
        from: email,
        to: email, // Replace with the recipient's email address
        subject: subject,
        text: `Name: ${name} \n\n ${message}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
            res.status(500).json({ message: 'Email sending failed.' });
        } else {
            console.log('Email sent:', info.response);
            res.json({ message: 'Email sent successfully!' });
        }
    });
});

const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
