import nodemailer from "nodemailer";

export const sendEmail = async (data) => {
  console.log("sendEmail fonksiyonu çağrıldı");
  console.log("Gönderilecek veri:", data);

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
    connectionTimeout: 15000,
    greetingTimeout: 5000,
    socketTimeout: 15000,
  });

  try {
    await transporter.verify();
    console.log("SMTP bağlantısı ve kimlik doğrulama başarılı.");

    const mailOptions = {
      from: `"My App" <${process.env.SMTP_FROM}>`,
      to: data.to,
      subject: data.subject,
      html: data.html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email gönderildi, info:", info);
    return info;

  } catch (error) {
    console.error("Email gönderilemedi, HATA KODU:", error.code);
    console.error("Email gönderilemedi, HATA MESAJI:", error.message);
    console.error("Email gönderilemedi, detay:", error);

    throw new Error(`SMTP bağlantı/gönderim hatası: ${error.message}`);
  }
};
