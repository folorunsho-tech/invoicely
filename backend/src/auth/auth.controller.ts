import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
  Query,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @UseGuards(LocalAuthGuard)
  @Post('login')
  signIn(
    @Request()
    req: {
      user: {
        email: string;
        id: string;
        name: string;
        logoUrl: string;
        brandName: string;
      };
    },
  ) {
    // The user will be available in the request object after successful authentication
    return this.authService.signIn(req.user);
  }
  @Post('signup')
  async signUp(
    @Request()
    req: {
      body: {
        email: string;
        name: string;
        password: string;
      };
    },
  ) {
    const { email, name, password } = req.body;
    return await this.authService.signUp(email, name, password);
  }
  @Post('verify-email')
  async verifyEmail(
    @Body() { email, token }: { email: string; token: string },
  ) {
    return await this.authService.verifyEmail(email, token);
  }
  @Get('send-verification-email')
  async sendVerificationEmail(@Query('email') email: string) {
    return await this.authService.sendVerificationEmail(email);
  }
}
