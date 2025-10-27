import { Module } from '@nestjs/common'
import { CommentController } from './comment.controller'

@Module({
  imports: [],
  controllers: [CommentController],
  providers: [],
})
export class NotificationModule {}
