import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
// import { User } from 'src/generated/prisma/client';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { EmailService } from 'src/email/email.service';
@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private emailService: EmailService,
  ) {}
  async validateUser(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (user && (await argon2.verify(user.password, password))) {
      return {
        id: user.id,
        email: user.email,
        name: user.name,
        brandName: user.brandName,
        logoUrl: user.logoUrl,
      };
    }
    return null;
  }
  signIn(user: {
    email: string;
    id: string;
    brandName: string;
    logoUrl: string;
    name: string;
  }): { access_token: string } {
    const payload = {
      email: user.email,
      id: user.id,
      brandName: user.brandName,
      logoUrl: user.logoUrl,
      name: user.name,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
  async signUp(
    email: string,
    name: string,
    password: string,
    // brandName: string,
  ) {
    const hash = await argon2.hash(password);
    const user = await this.prisma.user.create({
      data: {
        email,
        name,
        password: hash,
        // brandName,
      },
    });
    return await this.emailService.sendVerificationEmail(user.email);
  }
  async requestPasswordReset(email: string): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    if (user) {
      // Generate a password reset token and send it via email
      const token = Math.random().toString(36).substr(2); // Simple token generation, consider using a more secure method
      // Store the token in the database with an expiration time (not implemented here)
      console.log(`Generated password reset token for ${email}: ${token}`);
      // Send the token via email using your email service
    }
  }
  // async resetPassword(token: string, newPassword: string): Promise<void> {
  //   // Validate the token and reset the user's password
  //   // This is a placeholder implementation, you should implement token validation and password reset logic
  //   console.log(
  //     `Resetting password with token: ${token} and new password: ${newPassword}`,
  //   );
  // }
  // async verifyAccount(token: string): Promise<void> {
  //   // Validate the token and verify the user's account
  //   // This is a placeholder implementation, you should implement token validation and account verification logic
  //   console.log(`Verifying account with token: ${token}`);
  // }
}
