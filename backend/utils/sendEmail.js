import nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';

dotenv.config();

const sendEmail = async (options) => {
  // Create a transporter
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    },
    secure: false,
    tls: {
      rejectUnauthorized: false
    },
  });

  // Define email options
  const mailOptions = {
    from: `Ezer Farm TN <${process.env.SMTP_USER}>`,
    to: options.to,
    subject: options.subject,
    bcc: options.bcc,
    text: options.text,
    html: options.html
  };

  // Send the email
  await transporter.sendMail(mailOptions);
};

export default sendEmail;
