import { MessagePattern, Payload } from "@nestjs/microservices";
import { AuthService } from "./auth.service";
import { Controller } from "@nestjs/common";
import {
  RegisterUserDto,
  LoginUserDto,
  RefreshTokenDto,
} from "@collab-task-management/types";

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern("auth_register")
  async handleRegister(@Payload() data: RegisterUserDto) {
    const create = await this.authService.create(data);
    return create;
  }

  @MessagePattern("auth_login")
  async handleLogin(@Payload() data: LoginUserDto) {
    const { email, password } = data;
    return await this.authService.login({ email, password });
  }

  @MessagePattern("refresh")
  async refreshToken(@Payload() refreshToken: RefreshTokenDto) {
    return await this.authService.refresh(refreshToken);
  }
}
