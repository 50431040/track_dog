import { Module } from "@nestjs/common";
import { EventRecordService } from "./event-record.service";
import { EventRecordRepository } from "@/schema/event-record.schema";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [TypeOrmModule.forFeature([EventRecordRepository])],
  providers: [EventRecordService],
  exports: [EventRecordService],
})
export class EventRecordModule {}
