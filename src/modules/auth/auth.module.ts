import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RolesGuard } from './guards/roles.guard';
import { DebugGuard } from './debug.guard';

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
  providers: [JwtStrategy, RolesGuard, DebugGuard],
  exports: [PassportModule, RolesGuard, DebugGuard],
})
export class AuthModule {}
