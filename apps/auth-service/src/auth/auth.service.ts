import { InjectRepository } from "@nestjs/typeorm";
import { RegisterUserDto } from "@collab-task-management/types";
import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { User } from "./auth.entity";
import * as bcrypt from "bcrypt";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async create(createUserDto: RegisterUserDto): Promise<User> {
    const salt = await bcrypt.genSalt();
    const password_hash = await bcrypt.hash(createUserDto.password, salt);

    const newUser = this.userRepository.create({
      email: createUserDto.email,
      username: createUserDto.username,
      password: password_hash,
    });

    return this.userRepository.save(newUser);
  }
}
