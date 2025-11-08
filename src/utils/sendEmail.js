import nodemailer from "nodemailer";

export const sendEmail = async (data) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const mailOptions = {
    from: `"My App" <${process.env.SMTP_FROM}>`,
    to: data.to,
    subject: data.subject,
    html: data.html,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully to: ${data.to}`);
  } catch (error) {
    console.error("Failed to send email:", error.message);
    throw new Error("Failed to send the email, please try again later.");
  }
};
