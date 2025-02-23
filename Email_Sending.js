import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Function to send email
const sendEmail = async (email, name, role) => {
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp-relay.brevo.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    // Define email content based on role
    const text =
      role === 'Vendor'
        ? `Hello ${name},

Welcome to Travel Online Booking as a valued Vendor! Your login was successful, and you can now manage your listings, track bookings, and provide amazing travel experiences to our users.

We are excited to have you onboard and look forward to a great partnership.

Best Regards,  
Travel Online Booking Team`

        : `Hello ${name}, 

We are thrilled to have you onboard! Your login was successful, and you can now explore the best travel deals and holiday packages.

Enjoy your journey with us!

Best Regards,  
Travel Online Booking Team`;

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Welcome to Travel Online Booking!',
      text: text
    };

    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

export default sendEmail;
