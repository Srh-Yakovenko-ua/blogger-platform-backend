import dotenv from 'dotenv';

dotenv.config();

export const envConfig = {
  mailtrapHost: process.env.MAILTRAP_HOST,
  mailtrapPort: Number(process.env.MAILTRAP_PORT),
  mailtrapUser: process.env.MAILTRAP_USER,
  mailtrapPass: process.env.MAILTRAP_PASS,
  mailtrapFromEmail: process.env.MAILTRAP_FROM_EMAIL,

  gmailFrom: process.env.GMAIL_FROM,
  gmailUser: process.env.GMAIL_USER,
  gmailPass: process.env.GMAIL_APP_PASSWORD,

  refreshSecret: process.env.REFRESH_SECRET_TOKEN,
  refreshExpiredTime: process.env.REFRESH_AC_TIME,
};
