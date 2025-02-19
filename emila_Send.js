import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com', // Brevo SMTP Server
  port: 587,
  secure: false, // Use TLS
  auth: {
    user: '860e4b001@smtp-brevo.com', // Your Brevo login email
    pass: 'IzULMNJSR302Vav4', // Use Brevo SMTP key (not your actual password)
  },
});

const mailOptions = {
  from: 'rudrapatel2992003@gmail.com', // Use your verified Brevo sender email
  to: 'rudrapatel2992003@gmail.com',
  subject: 'Test Email via Brevo SMTP',
  text: 'Hello, this is a test email sent using Brevo SMTP in Node.js!',
};

transporter.sendMail(mailOptions)
  .then(info => console.log('Email sent:', info.response))
  .catch(error => console.error('Error:', error));
