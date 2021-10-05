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
  if (!process.env.MAILGUN_DOMAIN) {
    return Promise.reject(new Error('Mailgun domain not set'))
  }

  console.log('Outside if')
  return mg.messages.create(process.env.MAILGUN_DOMAIN as string, data)
}