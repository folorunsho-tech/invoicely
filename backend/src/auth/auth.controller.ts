import { Controller, Post, Request, UseGuards } from '@nestjs/common';
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
      user: { email: string; id: string; brandName: string; logoUrl: string };
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
        brandName: string;
      };
    },
  ) {
    const { email, name, password, brandName } = req.body;
    return await this.authService.signUp(email, name, password, brandName);
  }
}
