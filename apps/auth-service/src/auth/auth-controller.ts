import {
  Controller,
  Post,
  Body,
  Inject,
  ValidationPipe,
  Get,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
  ) {}

  @Post('register')
  async registerUser(
    @Body(new ValidationPipe()) registerUserDto: RegisterUserDto,
  ) {
    console.log('Recebido POST /register', registerUserDto);
    return this.authClient.send({ cmd: 'auth.register' }, registerUserDto);
  }

  @Post('login')
  async login(@Body(new ValidationPipe()) loginUserDto: LoginUserDto) {
    console.log('Recebido POST /login', loginUserDto);
    return this.authClient.send({ cmd: 'auth.login' }, loginUserDto);
  }
}
