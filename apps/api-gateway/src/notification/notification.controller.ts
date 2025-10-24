import { Controller, Get, Post, Body, Param, Inject } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { lastValueFrom } from 'rxjs'

@Controller('tasks')
export class NotificationController {
  constructor(
    @Inject('NOTIFICATION_SERVICE') private readonly userClient: ClientProxy
  ) {}

  @Post(':id/comments')
  async createUser(@Body() createUserDto: any) {
    console.log('Gateway received request to create user')

    const pattern = 'create_user'
    const payload = createUserDto

    const newUser = await lastValueFrom(this.userClient.send(pattern, payload))
    return newUser
  }

  @Get(':id/comments?page&size')
  async getUser(@Param('id') id: string) {
    console.log('Gateway received request for user:', id)
    const pattern = 'get_user_by_id'
    const payload = { userId: id }
    const user = await lastValueFrom(this.userClient.send(pattern, payload))
    return user
  }
}
