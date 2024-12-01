import { Module } from "@nestjs/common";
import { EventRecordService } from "./event-record.service";

@Module({
  providers: [EventRecordService],
})
export class EventRecordModule {}
