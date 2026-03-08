import { Injectable, Inject } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { EmailService } from 'src/email/email.service';
import generateCode from 'src/lib/generateCode';
@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private emailService: EmailService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
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
    const code = generateCode();
    await this.emailService.sendVerificationEmail(user.email, code);
    return user;
  }
  async requestPasswordReset(email: string): Promise<{ is_sent: boolean }> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    if (user) {
      const code = generateCode();
      await this.emailService.sendResetCode(email, code);
      await this.cacheManager.set(`password_reset_${email}`, code, 300000); // Store code for 5 minutes
      return { is_sent: true };
    }
    return { is_sent: false };
  }
  async resetPassword(
    token: string,
    email: string,
    newPassword: string,
  ): Promise<{ is_reset: boolean }> {
    // Check if the token exists in the cache
    const code = await this.cacheManager.get<string>(`password_reset_${email}`);
    if (code === token) {
      // Remove the token from the cache
      await this.cacheManager.del(`password_reset_${email}`);
      const hash = await argon2.hash(newPassword);
      await this.prisma.user.update({
        where: { email },
        data: { password: hash },
      });
      return { is_reset: true };
    }
    return { is_reset: false };
  }
  async verifyEmail(
    email: string,
    token: string,
  ): Promise<{ is_verified: boolean }> {
    // Check if the token exists in the cache
    const code = await this.cacheManager.get<string>(
      `email_verification_${email}`,
    );
    if (code === token) {
      // Remove the token from the cache
      await this.cacheManager.del(`email_verification_${email}`);
      const user = await this.prisma.user.update({
        where: { email },
        data: { isEmailVerified: true },
      });
      return { is_verified: user.isEmailVerified };
    }
    return { is_verified: false };
  }
  async sendVerificationEmail(email: string) {
    const code = generateCode();
    return await this.emailService.sendVerificationEmail(email, code);
  }
}
