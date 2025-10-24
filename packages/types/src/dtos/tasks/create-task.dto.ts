import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsDateString,
  IsUUID,
  IsArray,
} from "class-validator";
import { Priority, Status } from "../../entities/task.enums";

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString()
  @IsOptional()
  deadline?: Date;

  @IsEnum(Priority)
  @IsOptional()
  priority?: Priority;

  @IsEnum(Status)
  @IsOptional()
  status?: Status;

  @IsUUID()
  @IsNotEmpty()
  authorId: string;

  @IsArray()
  @IsUUID("all", { each: true })
  @IsOptional()
  assigneesIds?: string[];
}
