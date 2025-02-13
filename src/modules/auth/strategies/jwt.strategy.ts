import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { passportJwtSecret } from 'jwks-rsa';
import { envs } from 'src/config/envs';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      // audience: envs.AWS_COGNITO_CLIENT_ID,
      issuer: envs.AWS_COGNITO_AUTHORITY,
      algorithms: ['RS256'],
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `${envs.AWS_COGNITO_AUTHORITY}/.well-known/jwks.json`,
      }),
    });
  }

  async validate(payload: any) {
    const user = {
      id: payload.sub,
      email: payload.username,
      roles: ['user'],
      clientId: payload.client_id,
      scope: payload.scope,
    };

    console.log('Usuario construido en JwtStrategy:', user);
    return user; // Este objeto debería aparecer como request.user
  }
}
