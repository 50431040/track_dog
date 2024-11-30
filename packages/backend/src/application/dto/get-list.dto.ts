import {
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from "class-validator";
import { Transform } from "class-transformer";

export class GetApplicationListDto {
  @IsOptional()
  @IsString()
  @MaxLength(20)
  keyword: string = "";

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
}
