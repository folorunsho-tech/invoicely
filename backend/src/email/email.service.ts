import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
@Injectable()
export class EmailService {
  private transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER, // your email address
      pass: process.env.EMAIL_PASS, // your email password
    },
  });
  async sendVerificationEmail(email: string) {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const verificationLink = `${process.env.FRONTEND_URL}/auth/verify-email?email=${email}&token=${code}`;
    const info = await this.transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Verify Your Email',
      html: `<div><h3>${code} is your verification code.</h3> 
      <p>Or click the following link to verify your email:<a href="${verificationLink}">${verificationLink}</a></p></div>`,
    });
    return info;
  }
}
