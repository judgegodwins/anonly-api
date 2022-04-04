import Mailgun from "mailgun.js";
import formData from 'form-data';
import Logger from "../core/Logger";

const mailgun = new Mailgun(formData);

const mg = mailgun.client({ username: 'api', key: process.env.MAILGUN_API_KEY || '' });

interface Data {
  from: string;
  to: string[];
  subject: string;
  text?: string;
  html?: string;
}

export default (data: Data) => {
  return mg.messages.create(process.env.MAILGUN_DOMAIN as string, data)
}