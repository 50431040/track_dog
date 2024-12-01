import { Module } from "@nestjs/common";
import { EventCustomService } from "./event-custom.service";

@Module({
  providers: [EventCustomService],
})
export class EventCustomModule {}
