import 'dotenv/config';
import nodemailer from 'nodemailer';

const getTransporter = () => {
  const SMTP_HOST = process.env.SMTP_HOST;
  const SMTP_PORT = Number(process.env.SMTP_PORT) || 587;
  const SMTP_USER = process.env.SMTP_USER;
  const SMTP_PASSWORD = process.env.SMTP_PASSWORD;

  console.log('SMTP Ayarları:', {
    host: SMTP_HOST,
    port: SMTP_PORT,
    user: SMTP_USER ? `${SMTP_USER.substring(0, 3)}***` : 'YOK',
    password: SMTP_PASSWORD ? '***' : 'YOK',
  });

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASSWORD) {
    console.error('Eksik SMTP değişkenleri:', {
      SMTP_HOST: !!SMTP_HOST,
      SMTP_PORT: !!SMTP_PORT,
      SMTP_USER: !!SMTP_USER,
      SMTP_PASSWORD: !!SMTP_PASSWORD,
    });
    throw new Error('E-posta servisi için gerekli ortam değişkenleri tanımlı değil!');
  }

  // Brevo SMTP için port 587 (STARTTLS) veya 465 (SSL) kullanılabilir
  // Render'da bazen port 587 engellenmiş olabilir, bu yüzden 465'i de deneyebiliriz
  const useSSL = SMTP_PORT === 465;
  
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: useSSL, // true for 465, false for 587
    requireTLS: !useSSL, // STARTTLS için
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
      minVersion: 'TLSv1.2',
    },
    connectionTimeout: 60000, // 60 seconds
    greetingTimeout: 30000, // 30 seconds
    socketTimeout: 60000, // 60 seconds
    logger: true,
    debug: true,
  });
};

export const sendEmail = async (options) => {
  const { to, subject, data } = options;

  const SMTP_FROM = process.env.SMTP_FROM;
  if (!SMTP_FROM) {
    console.error('SMTP_FROM ortam değişkeni tanımlı değil!');
    throw new Error('SMTP_FROM ortam değişkeni tanımlı değil!');
  }

  const htmlContent = `<p>Şifre sıfırlama linki: <a href="${data.resetLink}">${data.resetLink}</a></p>`;

  let transporter;
  try {
    transporter = getTransporter();
    console.log('SMTP transporter oluşturuldu, e-posta gönderiliyor...');
    
    const info = await Promise.race([
      transporter.sendMail({
        from: SMTP_FROM,
        to: to,
        subject: subject,
        html: htmlContent,
      }),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('E-posta gönderme timeout (60 saniye)')), 60000)
      )
    ]);

    console.log('E-posta başarıyla gönderildi:', info.messageId);
    if (transporter) {
      transporter.close();
    }
    return info;
  } catch (error) {
    console.error('E-posta gönderilemedi:', error.message);
    console.error('Hata tipi:', error.constructor.name);
    if (error.code) {
      console.error('Hata kodu:', error.code);
    }
    if (error.response) {
      console.error('SMTP yanıtı:', error.response);
    }
    if (transporter) {
      transporter.close();
    }
    throw new Error('Failed to send the email, please try again later.');
  }
};
