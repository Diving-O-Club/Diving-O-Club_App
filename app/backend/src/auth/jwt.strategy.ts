import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';

/**
 * Passport JWT strategy. Extracts the token from the "access_token" HttpOnly
 * cookie and, once verified, exposes `{ idUser, email }` on the request.
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          const token = req?.cookies?.['access_token'] as string | undefined;
          return token ?? null;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET ?? 'diving-o-club-secret',
    });
  }

  /** Map the verified JWT payload to the request user object. */
  validate(payload: { sub: number; email: string }) {
    return { idUser: payload.sub, email: payload.email };
  }
}
