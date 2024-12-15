import { Module } from "@nestjs/common";
import { DeviceService } from "./device.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DeviceRepository } from "@/schema/device.schema";

@Module({
  providers: [DeviceService],
  exports: [DeviceService],
  imports: [TypeOrmModule.forFeature([DeviceRepository])],
})
export class DeviceModule {}
