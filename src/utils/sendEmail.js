import 'dotenv/config';
import nodemailer from 'nodemailer';

const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = Number(process.env.SMTP_PORT);
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASSWORD = process.env.SMTP_PASSWORD;
const SMTP_FROM = process.env.SMTP_FROM;

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: false,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASSWORD,
  },
});

export const sendEmail = async (options) => {
  const { to, subject, data } = options;

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASSWORD || !SMTP_FROM) {
    throw new Error('E-posta servisi için gerekli ortam değişkenleri tanımlı değil!');
  }

  const htmlContent = `<p>Şifre sıfırlama linki: <a href="${data.resetLink}">${data.resetLink}</a></p>`;

  try {
    const info = await transporter.sendMail({
      from: SMTP_FROM,
      to: to,
      subject: subject,
      html: htmlContent,
    });

    console.log('E-posta başarıyla gönderildi:', info.messageId);
    return info;
  } catch (error) {
    console.error('E-posta gönderilemedi:', error.message);
    throw new Error('Failed to send the email, please try again later.');
  }
};
