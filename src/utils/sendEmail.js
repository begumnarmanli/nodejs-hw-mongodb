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
  });

  const mailOptions = {
    from: `"My App" <${process.env.SMTP_FROM}>`,
    to: data.to,
    subject: data.subject,
    html: data.html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email gönderildi, info:", info);
    return info;
  } catch (error) {
    console.error("Email gönderilemedi, hata:", error);
    throw new Error("Email gönderimi başarısız oldu. Lütfen tekrar deneyin.");
  }
};
