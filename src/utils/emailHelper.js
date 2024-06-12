import nodemailer from "nodemailer";
import { _config } from "../config/config.js";

const emailHelper = async (options) => {
  const transporter = nodemailer.createTransport({
    host: _config.SMTP_HOST,
    port: _config.SMTP_PORT,
    auth: {
      user: _config.SMTP_USER,
      pass: _config.SMTP_PASS,
    },
  });

  const message = {
    from: 'mailtrap@lco.dev', // sender address
    to: options.email, // list of receivers
    subject: options.subject, // Subject line
    text: options.message, // plain text body
  };

  await transporter.sendMail(message);
};

export default emailHelper;
