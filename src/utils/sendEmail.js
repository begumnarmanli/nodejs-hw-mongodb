import 'dotenv/config';
import path from 'node:path';
import fs from 'node:fs/promises';
import handlebars from 'handlebars';
import { TEMPLATES_DIR } from '../constants/index.js';

const BREVO_API_KEY = process.env.BREVO_API_KEY;
const SMTP_FROM = process.env.SMTP_FROM;
const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";

export const sendEmail = async (options) => {
    const { to, subject, template, data } = options;

    const templatePath = path.join(TEMPLATES_DIR, template);
    const source = await fs.readFile(templatePath, 'utf-8');
    const compiledTemplate = handlebars.compile(source);
    const htmlContent = compiledTemplate(data);

    const requestBody = {
        sender: {
            name: "My App",
            email: SMTP_FROM
        },
        to: [
            {
                email: to
            }
        ],
        subject: subject,
        htmlContent: htmlContent,
    };

    console.log("Brevo HTTP API ile e-posta gönderimi deneniyor...");

    try {
        const response = await fetch(BREVO_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'api-key': BREVO_API_KEY
            },
            body: JSON.stringify(requestBody),
            signal: AbortSignal.timeout(10000)
        });

        const result = await response.json();

        if (response.ok) {
            console.log("Email Brevo API ile başarıyla gönderildi. ID:", result.messageId);
            return result;
        } else {
            console.error("Email gönderilemedi, Brevo API Hatası:", result);
            throw new Error(`Brevo API Hatası ${response.status}: ${JSON.stringify(result)}`);
        }

    } catch (error) {
        console.error("Email gönderilemedi, HATA MESAJI:", error.message);
        throw new Error(`SMTP bağlantı/gönderim hatası: ${error.message}`);
    }
};
