import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { passportJwtSecret } from 'jwks-rsa';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { envs } from 'src/config/envs';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    console.log('JwtStrategy constructor');
    console.log(envs.AWS_COGNITO_AUTHORITY);

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      audience: envs.AWS_COGNITO_CLIENT_ID,
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
    console.log('Entering validate method');
    console.log('Payload:', payload);

    return { idUser: payload.sub, email: payload.email };
  }
}
