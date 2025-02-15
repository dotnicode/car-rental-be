import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import { RecoverUserPasswordDto } from './dto/recover-password.dto';
import { SignInUserDto } from './dto/signin-user-dto';
import { SignUpUserDto } from './dto/signup-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from 'src/common/enums/role.enum';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  signup(@Body() signupUserDto: SignUpUserDto) {
    return this.userService.signup(signupUserDto);
  }

  @Post('signin')
  async signin(@Body() signInUserDto: SignInUserDto) {
    try {
      return await this.userService.signin(signInUserDto);
    } catch (error) {
      throw new HttpException(
        {
          error: true,
          message: error.message || 'An unexpected error occurred',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  @Post('recover-password')
  recoverPassword(@Body() recoverPasswordDto: RecoverUserPasswordDto) {
    return this.userService.recoverPassword(recoverPasswordDto);
  }

  @Post('logout')
  logout() {
    return this.userService.logout();
  }

  @Get()
  // @Roles(Role.ADMIN, Role.CLIENT)
  // @UseGuards(AuthGuard('jwt'), RolesGuard)
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.userService.findOne({ id });
  }

  @Patch(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.userService.remove(id);
  }
}
