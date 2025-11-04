import { IsEmail, IsString, IsUUID } from "class-validator";

export class GetAllUsersDto {
  @IsString()
  @IsUUID()
  id: string;

  @IsString()
  username: string;

  @IsEmail()
  email: string;
}
