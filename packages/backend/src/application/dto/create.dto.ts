import { Platform } from "@track_dog/common";
import { IsString, IsNotEmpty, MaxLength, IsEnum } from "class-validator";

export class CreateApplicationDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(32)
  name: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  icon: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(32)
  @IsEnum(Platform)
  platform: Platform;
}
