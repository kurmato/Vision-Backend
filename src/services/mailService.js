const { sendEmail } = require('../config/mailer');

const sendBookingConfirmation = async (email, bookingDetails) => {
  const subject = 'Booking Confirmation';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Booking Confirmed!</h2>
      <p>Dear ${bookingDetails.fullName},</p>
      <p>Your booking has been successfully confirmed.</p>
      <h3>Booking Details:</h3>
      <ul>
        <li><strong>Event/Occasion:</strong> ${bookingDetails.occasions}</li>
        <li><strong>Event Date:</strong> ${new Date(bookingDetails.eventDate).toLocaleDateString()}</li>
        <li><strong>City:</strong> ${bookingDetails.city}</li>
        ${bookingDetails.budget ? `<li><strong>Budget:</strong> $${bookingDetails.budget}</li>` : ''}
        ${bookingDetails.noOfAttendees ? `<li><strong>Attendees:</strong> ${bookingDetails.noOfAttendees}</li>` : ''}
      </ul>
      ${bookingDetails.additionalInfo ? `<p><strong>Additional Info:</strong> ${bookingDetails.additionalInfo}</p>` : ''}
      <p>We will contact you shortly to discuss further details.</p>
      <p>Thank you for choosing our service!</p>
    </div>
  `;

  await sendEmail(email, subject, html);
};

const sendRequirementConfirmation = async (email, requirementDetails) => {
  const subject = 'Requirement Submitted Successfully';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Requirement Received!</h2>
      <p>Dear ${requirementDetails.fullName},</p>
      <p>We have received your requirement and will get back to you soon.</p>
      <h3>Your Requirement:</h3>
      <ul>
        <li><strong>Event/Occasion:</strong> ${requirementDetails.occasions}</li>
        <li><strong>Event Date:</strong> ${new Date(requirementDetails.eventDate).toLocaleDateString()}</li>
        <li><strong>City:</strong> ${requirementDetails.city}</li>
        ${requirementDetails.budget ? `<li><strong>Budget:</strong> $${requirementDetails.budget}</li>` : ''}
      </ul>
      ${requirementDetails.additionalInfo ? `<p><strong>Additional Info:</strong> ${requirementDetails.additionalInfo}</p>` : ''}
      <p>Our team will review your requirement and contact you soon.</p>
      <p>Thank you!</p>
    </div>
  `;

  await sendEmail(email, subject, html);
};

const sendContactConfirmation = async (email, name) => {
  const subject = 'Thank You for Contacting Us';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Thank You!</h2>
      <p>Dear ${name},</p>
      <p>We have received your message and will respond to you as soon as possible.</p>
      <p>Our team typically responds within 24-48 hours.</p>
      <p>Thank you for reaching out to us!</p>
    </div>
  `;

  await sendEmail(email, subject, html);
};

const sendAdminContactNotification = async (contactDetails) => {
  const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_USER;
  const subject = 'New Contact Form Submission';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${contactDetails.name}</p>
      <p><strong>Email:</strong> ${contactDetails.email}</p>
      <p><strong>Message:</strong></p>
      <p>${contactDetails.message}</p>
      <p><strong>Submitted At:</strong> ${new Date().toLocaleString()}</p>
    </div>
  `;

  await sendEmail(adminEmail, subject, html);
};

module.exports = {
  sendBookingConfirmation,
  sendRequirementConfirmation,
  sendContactConfirmation,
  sendAdminContactNotification
};
