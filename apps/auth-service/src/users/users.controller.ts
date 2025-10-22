import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UsersService } from './users.service';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @MessagePattern({ cmd: 'auth.register' })
  async handleUserRegister(@Payload() data: any) {
    console.log('Auth Service: Mensagem recebida para registrar!', data);
    const user = await this.usersService.create(data);
    const { password_hash, ...result } = user
    return result;
  }
}