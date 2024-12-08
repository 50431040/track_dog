import { Module } from "@nestjs/common";
import { WebNormalEventController } from "./web-normal-event.controller";
import { NormalEventModule } from "@/normal-event/normal-event.module";
import { ApplicationModule } from "@/application/application.module";
import { EventRecordModule } from "@/event-record/event-record.module";

@Module({
  controllers: [WebNormalEventController],
  imports: [NormalEventModule, ApplicationModule, EventRecordModule],
})
export class WebNormalEventModule {}
