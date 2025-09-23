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

const templateForRecovery = (code: string) => {
  return `<h1>Password recovery</h1>
       <p>To finish password recovery please follow the link below:
          <a href='https://somesite.com/password-recovery?recoveryCode=${code}'>recovery password</a>
      </p>`;
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
const mailTrapTransporter = nodemailer.createTransport({
  host: envConfig.mailtrapHost, // напр. "sandbox.smtp.mailtrap.io"
  port: envConfig.mailtrapPort, // напр. 2525
  auth: {
    user: envConfig.mailtrapUser,
    pass: envConfig.mailtrapPass,
  },
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

  async sendRecoveryPassword({ toEmail, code }: { toEmail: string; code: string }) {
    await transporter.sendMail({
      from: `"Bloger Platform" <${envConfig.mailtrapFromEmail}>`,
      to: toEmail,
      subject: 'Email recovery',
      html: templateForRecovery(code),
    });
  },
};
