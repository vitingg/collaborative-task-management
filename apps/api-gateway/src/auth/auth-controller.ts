import { Controller, Post, Body, Inject, ValidationPipe } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { RegisterUserDto } from './dto/register-user.dto'

@Controller('auth')
export class AuthController {
  constructor(@Inject('AUTH_SERVICE') private readonly authClient: ClientProxy) {}

  @Post('register')
  async registerUser(@Body(new ValidationPipe()) registerUserDto: RegisterUserDto) {
    console.log('Gateway: Recebido POST /register', registerUserDto);
    return this.authClient.send({ cmd: 'auth.register' }, registerUserDto);
  }
}