import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || '',
    });
  }

  validate(payload: {
    id: string;
    email: string;
    brandName: string;
    logoUrl: string;
  }) {
    return {
      userId: payload.id,
      email: payload.email,
      brandName: payload.brandName,
      logoUrl: payload.logoUrl,
    };
  }
}
