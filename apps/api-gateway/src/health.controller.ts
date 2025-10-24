import { Controller, Get } from '@nestjs/common'

@Controller()
export class HealthController {
  @Get()
  getHello() {
    return 'Hello World'
  }
}
