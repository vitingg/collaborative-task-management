import { Controller } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { RegisterUserDto, LoginUserDto } from "@collab-task-management/types";
import type { AuthService } from "./auth.service";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern("auth.register")
  async handleRegister(@Payload() data: RegisterUserDto) {
    console.log("Register Payload: ", data);
    try {
      const newUser = await this.authService.create(data);
      return newUser;
    } catch (error) {
      console.error("Error on create user: ", error);
      throw error;
    }
  }

  @MessagePattern("auth.login")
  handleLogin(@Payload() data: LoginUserDto) {
    console.log("Login Payload: ", data);
    return { message: "Success login!", accessToken: "..." };
  }
}
