import { ClientProxy } from '@nestjs/microservices'
import { lastValueFrom } from 'rxjs'
import {
  RegisterUserDto,
  LoginUserDto,
  RefreshTokenDto,
} from '@collab-task-management/types'
import {
  Controller,
  Post,
  Body,
  Inject,
  HttpCode,
  HttpStatus,
  HttpException,
  InternalServerErrorException,
} from '@nestjs/common'

@Controller('auth')
export class AuthController {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy
  ) {}

  @Post('register')
  async createUser(@Body() registerUserDto: RegisterUserDto) {
    console.log('Gateway received request to create user')
    const newUser: RegisterUserDto = await lastValueFrom(
      this.authClient.send('auth_register', registerUserDto)
    )
    return newUser
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async loginUser(@Body() data: LoginUserDto) {
    try {
      const login: LoginUserDto = await lastValueFrom(
        this.authClient.send('auth_login', data)
      )
      return login
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Invalid Credentials...',
        },
        HttpStatus.FORBIDDEN,
        {
          cause: error,
        }
      )
    }
  }

  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  async refreshToken(@Body() refreshToken: RefreshTokenDto) {
    try {
      const payload: string = await lastValueFrom(
        this.authClient.send('refresh', refreshToken)
      )

      return payload
    } catch (error) {
      console.error('Error communicating with auth service:', error)
      throw new InternalServerErrorException('Error processing request')
    }
  }
}
