import { Injectable, Inject } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { PrismaService } from 'src/prisma/prisma.service';
@Injectable()
export class EmailService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER, // your email address
        pass: process.env.EMAIL_PASS, // your email password
      },
    }),
    private prisma: PrismaService,
  ) {}
  async sendVerificationEmail(email: string, code: string | number) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      throw new Error('User not found');
    } else {
      const verificationLink = `${process.env.FRONTEND_URL}/auth/verify-email?email=${email}&token=${code}`;
      const info = await this.transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Verify Your Email',
        html: `<div><h3>${code} is your verification code.</h3> 
      <p>Or click the following link to verify your email:<a href="${verificationLink}">${verificationLink}</a></p></div>`,
      });
      if (info.accepted.length > 0) {
        await this.cacheManager.set(
          `email_verification_${email}`,
          code,
          300000,
        ); // Store code for 5 minutes
      }
      return info;
    }
  }
  async sendResetCode(email: string, code: string) {
    const info = await this.transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset Code',
      html: `<div><h3>${code} is your password reset code.</h3></div>`,
    });
    return info;
  }
}
