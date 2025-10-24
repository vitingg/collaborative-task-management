import { Controller, Get, Post, Body, Param, Inject } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { lastValueFrom } from 'rxjs'
import { RegisterUserDto } from '@collab-task-management/types'

@Controller('auth')
export class AuthController {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy
  ) {}

  @Post('register')
  async createUser(@Body() registerUserDto: RegisterUserDto) {
    console.log('Gateway received request to create user')

    const pattern = 'auth_register'
    const payload = registerUserDto

    const newUser: RegisterUserDto = await lastValueFrom(
      this.authClient.send(pattern, payload)
    )
    return newUser
  }

  @Get(':id')
  async getUser(@Param('id') id: string) {
    console.log('Gateway received request for user:', id)
    const pattern = 'get_user_by_id'
    const payload = { userId: id }
    const user: RegisterUserDto = await lastValueFrom(
      this.authClient.send(pattern, payload)
    )
    return user
  }
}
