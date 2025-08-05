import nodemailer from 'nodemailer';
import { envConfig } from './env-config';
const template = (code: string) => {
  return `<div>
      <h1>Thank for your registration</h1>
      <p>
        To finish registration please follow the link below:
        <a href="https://somesite.com/confirm-email?code=${code}">
          complete registration
        </a>
      </p>
    </div>`;
};

const transporter = nodemailer.createTransport({
  // host: envConfig.mailtrapHost,
  // port: envConfig.mailtrapPort,
  service: 'gmail',
  auth: {
    user: envConfig.gmailUser,
    pass: envConfig.gmailPass,
  },
  from: envConfig.gmailFrom,
});
export const emailServices = {
  async sendConfirmationCode({ toEmail, code }: { toEmail: string; code: string }) {
    await transporter.sendMail({
      from: `"Bloger Platform" <${envConfig.gmailFrom}>`,
      to: toEmail,
      subject: 'Email confirmation',
      html: template(code),
    });
  },
};
