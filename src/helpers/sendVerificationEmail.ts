import { Types } from 'mongoose';
import config from '../config';
import sendEmail from './sendEmail';

const sendVerificationEmail = (email: string, userId: Types.ObjectId, lookupId: string) => {
  if (!process.env.CLIENT_URL) 
    return Promise.reject(new Error("Client URL not specified"));

  const link = `${config.app.clientUrl}/verify?code=${lookupId}`

  return sendEmail({
    from: "Anonly <mailgun@sandbox18ed15bccce24869a3391d51ced7d77a.mailgun.org>",
    to: [email],
    subject: "Verify your email",
    html: `<p>Use the link to verify your email 
      <a href=${link}>${link}</a>
    </p>`
  })
}

export default sendVerificationEmail;