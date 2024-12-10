import { ValidatePeriod } from "@/base/decorator/validate-period.decorator";
import { IsDateString, IsMongoId, IsNotEmpty, IsString } from "class-validator";

export class GetEventTrendDto {
  @IsString()
  @IsNotEmpty()
  @IsMongoId({ message: "应用ID格式不正确" })
  appId: string;

  @IsString()
  @IsNotEmpty()
  @IsMongoId({ message: "事件ID格式不正确" })
  eventId: string;

  @IsDateString()
  @ValidatePeriod()
  startTime: string;

  @IsDateString()
  endTime: string;
}
