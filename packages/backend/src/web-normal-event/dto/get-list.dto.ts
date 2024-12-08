import { ValidatePeriod } from "@/base/decorator/validate-period.decorator";
import { Transform } from "class-transformer";
import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  Validate,
} from "class-validator";

export class GetNormalEventListDto {
  @IsString()
  @IsNotEmpty()
  appId: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  keyword?: string = "";

  @IsOptional()
  @IsInt()
  @Min(1)
  @Transform(({ value }) => parseInt(value, 10))
  page: number = 1;

  @IsOptional()
  @IsInt()
  @Transform(({ value }) => parseInt(value, 10))
  @Max(20)
  pageSize: number = 10;

  @IsOptional()
  @IsDateString()
  @ValidatePeriod()
  startTime?: string;

  @IsOptional()
  @IsDateString()
  endTime?: string;
}
