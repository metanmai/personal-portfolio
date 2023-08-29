import nodemailer from "nodemailer";
import 'dotenv/config';

exports.handler = async (event) => {
    const { name, email, subject, message } = JSON.parse(event.body);

    console.log(name, '\n', email, '\n', subject, '\n', message)

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

    try {
        const info = await transporter.sendMail(mailOptions);
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Email sent successfully!', response: info.response })
        };
    } catch (error) {
        console.error('Error sending email:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Email sending failed.' })
        };
    }
};