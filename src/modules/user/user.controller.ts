import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { SignUpUserDto } from './dto/signup-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RecoverUserPasswordDto } from './dto/recover-user-password.dto';
import { SignInUserDto } from './dto/signin-user-dto';
import { AwsCognitoService } from './aws-cognito.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  signup(@Body() createUserDto: SignUpUserDto) {
    return this.userService.signup(createUserDto);
  }

  @Post('signin')
  signin(@Body() signinDto: SignInUserDto) {
    return this.userService.signin(signinDto);
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
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.userService.remove(+id);
  }
}
