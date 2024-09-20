"use node";

import { Resend } from "resend";
import nodemailer from 'nodemailer';
import { ReactElement } from 'react';
import ReactDOMServer from 'react-dom/server';

const resend = new Resend(process.env.AUTH_RESEND_KEY);

// Define types for our environment variables
interface EnvVariables {
  ENVIRONMENT: 'development' | 'production';
  AUTH_EMAIL: string;
  SITE_URL: string;
  AUTH_RESEND_KEY: string;
}

// Helper function to get typed environment variables
function getEnvVariable(key: keyof EnvVariables): string {
  const value = process.env[key];
  if (value === undefined) {
    throw new Error(`Environment variable ${key} is not set`);
  }
  return value;
}

// Type for the email sending function
type SendEmailFunction = (to: string, subject: string, reactComponent: ReactElement) => Promise<void>;

// Helper function for sending emails
export const sendEmail: SendEmailFunction = async (to, subject, reactComponent) => {
  const environment = getEnvVariable('ENVIRONMENT') as EnvVariables['ENVIRONMENT'];

  if (environment === 'development') {
    // Use Nodemailer for local development
    const transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: 'rodrick75@ethereal.email',
        pass: 'Jq7JZe8ABCgZX8kCRY'
      }
    });

    const htmlContent = ReactDOMServer.renderToString(reactComponent);
    console.log(to)

    const info = await transporter.sendMail({
      from: getEnvVariable('AUTH_EMAIL') ?? "Complex saas template <development@example.com>",
      to,
      subject,
      html: htmlContent
    });

    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  } else {
    // Use Resend for production
    const res = await resend.emails.send({
      from: getEnvVariable('AUTH_EMAIL') ?? "Complex saas template <onboarding@resend.dev>",
      to,
      subject,
      react: reactComponent
    });

    console.log(res);
  }
};