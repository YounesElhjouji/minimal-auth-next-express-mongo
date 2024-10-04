export interface IMailer {
  sendEmail(destination: string, subject: string, body: string): Promise<void>;
}
