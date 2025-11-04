import { ClientProxy } from '@nestjs/microservices'
import { lastValueFrom } from 'rxjs'
import {
  RegisterUserDto,
  LoginUserDto,
  RefreshTokenDto,
  GetAllUsersDto,
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
  Get,
  UseGuards,
} from '@nestjs/common'
import { JwtAuthGuard } from './jwt.auth.guard'
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy
  ) {}

  @Post('register')
  @ApiOperation({ summary: 'Registra um novo usuário' })
  @ApiResponse({ status: 201, description: 'Usuário criado com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  async createUser(@Body() registerUserDto: RegisterUserDto) {
    console.log('Gateway received request to create user')
    const newUser: RegisterUserDto = await lastValueFrom(
      this.authClient.send('auth_register', registerUserDto)
    )
    return newUser
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiOperation({ summary: 'Faz login e retorna os tokens (access e refresh)' })
  @ApiResponse({ status: 200, description: 'Login bem-sucedido' })
  @ApiResponse({ status: 401, description: 'Credenciais inválidas' })
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
  @ApiOperation({ summary: 'Gera um novo access token usando o refresh token' })
  @ApiResponse({ status: 200, description: 'Token atualizado com sucesso' })
  @ApiResponse({
    status: 401,
    description: 'Refresh token inválido ou expirado',
  })
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

  @Get('users')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lista todos os usuários (rota protegida)' })
  @ApiResponse({ status: 200, description: 'Lista de usuários retornada' })
  @ApiResponse({
    status: 401,
    description: 'Não autorizado (Token inválido ou ausente)',
  })
  async getAllUsers() {
    const response: GetAllUsersDto[] = await lastValueFrom(
      this.authClient.send('get-users', {})
    )

    return response
  }
}
