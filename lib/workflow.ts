import emailjs from '@emailjs/nodejs';
import { Client } from '@upstash/workflow';
import config from './config';

export const workflowClient = new Client({
  token: config.env.upstash.qstashToken,
});

export const sendEmail = async ({
  email,
  subject,
  message,
}: {
  email: string;
  subject: string;
  message: string;
}) => {
  try {
    await emailjs.send(
      config.env.emailjs.serviceId,
      config.env.emailjs.templateId,
      {
        to_email: email,
        subject,
        message,
      },
      {
        publicKey: config.env.emailjs.publicKey,
        privateKey: config.env.emailjs.privateKey,
      }
    );
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};