import 'dotenv/config';
import nodemailer from 'nodemailer';

const BREVO_API_KEY = process.env.BREVO_API_KEY;
const SMTP_FROM = process.env.SMTP_FROM;
const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';

const getTransporter = () => {
  const SMTP_HOST = process.env.SMTP_HOST;
  const SMTP_PORT = Number(process.env.SMTP_PORT) || 587;
  const SMTP_USER = process.env.SMTP_USER;
  const SMTP_PASSWORD = process.env.SMTP_PASSWORD;

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASSWORD) {
    throw new Error('E-posta servisi için gerekli ortam değişkenleri tanımlı değil!');
  }

  const useSSL = SMTP_PORT === 465;
  
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: useSSL,
    requireTLS: !useSSL,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
      minVersion: 'TLSv1.2',
    },
    connectionTimeout: 10000,
    greetingTimeout: 5000,
    socketTimeout: 10000,
  });
};

const sendEmailViaAPI = async (to, subject, htmlContent) => {
  if (!BREVO_API_KEY) {
    throw new Error('BREVO_API_KEY ortam değişkeni tanımlı değil!');
  }

  if (!SMTP_FROM) {
    throw new Error('SMTP_FROM ortam değişkeni tanımlı değil!');
  }

  const response = await fetch(BREVO_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': BREVO_API_KEY,
    },
    body: JSON.stringify({
      sender: {
        name: 'My App',
        email: SMTP_FROM,
      },
      to: [
        {
          email: to,
        },
      ],
      subject: subject,
      htmlContent: htmlContent,
    }),
  });

  const result = await response.json();

  if (!response.ok) {
    console.error('Brevo API Hatası:', result);
    throw new Error(`Brevo API Hatası: ${JSON.stringify(result)}`);
  }

  console.log('E-posta Brevo API ile başarıyla gönderildi:', result.messageId);
  return result;
};

export const sendEmail = async (options) => {
  const { to, subject, data } = options;

  if (!SMTP_FROM) {
    throw new Error('SMTP_FROM ortam değişkeni tanımlı değil!');
  }

  const htmlContent = `<p>Şifre sıfırlama linki: <a href="${data.resetLink}">${data.resetLink}</a></p>`;

  try {
    // Render'da SMTP portları engellenmiş olabilir, bu yüzden API kullanıyoruz
    // BREVO_API_KEY varsa API kullan (Render'da çalışır)
    if (BREVO_API_KEY) {
      console.log('Brevo API ile e-posta gönderiliyor...');
      return await sendEmailViaAPI(to, subject, htmlContent);
    }

    // API yoksa SMTP'yi dene (local development için)
    console.log('SMTP ile e-posta gönderiliyor...');
    const transporter = getTransporter();
    const info = await transporter.sendMail({
      from: SMTP_FROM,
      to: to,
      subject: subject,
      html: htmlContent,
    });

    console.log('E-posta SMTP ile başarıyla gönderildi:', info.messageId);
    transporter.close();
    return info;
  } catch (error) {
    console.error('E-posta gönderilemedi:', error.message);
    console.error('Hata detayı:', error);
    throw new Error('Failed to send the email, please try again later.');
  }
};
