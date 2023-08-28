import bodyParser from "body-parser";
import express from "express";
import nodemailer from "nodemailer";
import 'dotenv/config';
import cors from "cors";

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/send-email', (req, res) => {
    const { name, email, subject, message } = req.body;

    const transporter = nodemailer.createTransport({
        host: 'smtp.elasticemail.com',
        port: 2525,
        secure: false,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    const mailOptions = {
        from: "tanmaiemailclient@gmail.com",
        to: "tanmaiemailclient@protonmail.com",
        subject: subject,
        text: `Name: ${name} \n\n\n Email: ${email} \n\n\n ${message} \n\n\n`
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
