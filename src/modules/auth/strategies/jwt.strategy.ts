import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { passportJwtSecret } from 'jwks-rsa';
import { envs } from 'src/config/envs';
import { Role } from 'src/common/enums/role.enum';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      // _audience: envs.AWS_COGNITO_CLIENT_ID,
      issuer: envs.AWS_COGNITO_AUTHORITY,
      algorithms: ['RS256'],
      secretOrKeyProvider: passportJwtSecret({
        cache: false,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `${envs.AWS_COGNITO_AUTHORITY}/.well-known/jwks.json`,
      }),
    });
  }

  async validate(payload: any) {
    const userRole = payload['custom:role'] || Role.CLIENT;

    if (!Object.values(Role).includes(userRole as Role)) {
      throw new UnauthorizedException('Rol no válido');
    }

    const user = {
      id: payload.sub,
      email: payload.email,
      roles: [userRole as Role],
    };

    console.log({ user });

    return user;
  }
}
