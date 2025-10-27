import { Controller, Get, Post, Body, Param, Inject } from '@nestjs/common'
import { CreateCommentDto } from '@collab-task-management/types'
import { ClientProxy } from '@nestjs/microservices'
import { lastValueFrom } from 'rxjs'

@Controller('tasks')
export class CommentController {
  constructor(
    @Inject('COMMENTARY_SERVICE') private readonly userClient: ClientProxy
  ) {}

  @Post(':id/comments')
  async createUser(
    @Param(':id') id: string,
    @Body() createComment: CreateCommentDto
  ) {
    console.log('Gateway received request to create user')
    const newUser = await lastValueFrom(
      this.userClient.send('task-comment-created', createComment)
    )
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
