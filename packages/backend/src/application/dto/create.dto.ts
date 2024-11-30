import { Platform } from "@track_dog/common";
import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsEnum,
  IsOptional,
} from "class-validator";

export class CreateApplicationDto {
  @IsString({ message: "应用名称不能为空" })
  @IsNotEmpty({ message: "应用名称不能为空" })
  @MaxLength(32, { message: "应用名称长度不能超过32位" })
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000, { message: "应用图标长度不能超过1000位" })
  icon: string;

  @IsNotEmpty({ message: "应用平台不能为空" })
  @IsEnum(Platform, { message: "应用平台格式不正确" })
  platform: Platform;
}
