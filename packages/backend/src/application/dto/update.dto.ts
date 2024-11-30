import { IsMongoId, IsNotEmpty, IsString } from "class-validator";
import { CreateApplicationDto } from "./create.dto";

export class UpdateApplicationDto extends CreateApplicationDto {
  @IsString()
  @IsNotEmpty()
  @IsMongoId()
  _id: string;
}
