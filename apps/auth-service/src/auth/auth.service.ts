import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ConfigService } from "@nestjs/config";
import { JwtPayload } from "jsonwebtoken";
import { JwtService } from "@nestjs/jwt";
import { User } from "./auth.entity";
import { Repository } from "typeorm";
import * as bcrypt from "bcrypt";
import {
  RegisterUserDto,
  LoginUserDto,
  RefreshTokenDto,
} from "@collab-task-management/types";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  async create(
    createUserDto: RegisterUserDto
  ): Promise<Omit<User, "password">> {
    const salt = await bcrypt.genSalt();
    const password_hash = await bcrypt.hash(createUserDto.password, salt);

    const newUser = this.userRepository.create({
      email: createUserDto.email,
      username: createUserDto.username,
      password: password_hash,
    });
    const savedUser = await this.userRepository.save(newUser);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...safeUser } = savedUser;
    return safeUser;
  }

  async login(
    loginUserDto: LoginUserDto
  ): Promise<{ token: string; refresh: string; user: Omit<User, "password"> }> {
    const user = await this.userRepository.findOne({
      where: {
        email: loginUserDto.email,
      },
    });
    if (!user) {
      throw new UnauthorizedException("Invalid credentials!");
    }
    const isPasswordCorrect = await bcrypt.compare(
      loginUserDto.password,
      user.password
    );
    if (!isPasswordCorrect) {
      throw new UnauthorizedException("Invalid credentials!");
    }
    const accessPayload = {
      sub: user.id,
      email: user.email,
    };
    const refreshPayload = {
      sub: user.id,
    };

    const jwtSecret = this.configService.get<string>("JWT_SECRET");
    const refreshSecret = this.configService.get<string>("JWT_REFRESH");

    const [token, refresh] = await Promise.all([
      this.jwtService.signAsync(accessPayload, {
        secret: jwtSecret,
      }),
      this.jwtService.signAsync(refreshPayload, {
        secret: refreshSecret,
      }),
    ]);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...newUser } = user;

    return {
      token,
      refresh,
      user: newUser,
    };
  }

  async refresh({ refreshToken }: RefreshTokenDto): Promise<{ token: string }> {
    interface RefreshTokenPayload extends JwtPayload {
      sub: string;
    }
    try {
      const payload = await this.jwtService.verifyAsync<RefreshTokenPayload>(
        refreshToken,
        {
          secret: this.configService.get<string>("JWT_REFRESH"),
        }
      );

      const user = await this.userRepository.findOne({
        where: {
          id: payload.sub,
        },
      });
      if (!user) {
        throw new UnauthorizedException("User not found");
      }

      const newAccessPayload = {
        sub: user.id,
        email: user.email,
      };

      const newAccessToken = await this.jwtService.signAsync(newAccessPayload, {
        secret: this.configService.get<string>("JWT_SECRET"),
        expiresIn: "15m",
      });

      return { token: newAccessToken };
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }
}
