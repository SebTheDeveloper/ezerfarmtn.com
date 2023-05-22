import sendEmail from '../utils/sendEmail.js';

export default async function sendApptConfirmEmail ({ name, email, phoneNumber, date, numberOfKids }) {
  try {
    await sendEmail({
      from: 'Ezer Farm TN',
      to: email,
      subject: 'Your Upcoming Sensory Play Day on Ezer Farm',
      html: `<h1>Hi ${name},</h1>
      <p>This email is to confirm your scheduled Sensory Play Day on ${date}.
      We have your contact number as ${phoneNumber} and your reservation is set for ${numberOfKids} kids.
      We look forward to seeing you!</p>`
    });

    console.log('Email sent successfully!');
  } catch (error) {
    console.error('Error sending email:', error);
  }
};