import { IMailer } from '../application/interfaces/MailerInterface';
import nodemailer from 'nodemailer';

export class NodeMailer implements IMailer {
  transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_ADDRESS,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  async sendEmail(
    destination: string,
    subject: string,
    body: string
  ): Promise<void> {
    const mailOptions = {
      from: process.env.EMAIL_ADDRESS,
      to: destination,
      subject: subject,
      text: body,
    };

    await this.transporter.sendMail(mailOptions);
  }
}
