import { Module } from "@nestjs/common";
import { QueueService } from "./queue.service";
import { EventEntryConsumer } from "./consumer/event-entry.consumer";
import { BullModule } from "@nestjs/bull";
import {
  CLICK_EVENT_QUEUE,
  EVENT_CLEAN_QUEUE,
  EVENT_ENTRY_QUEUE,
} from "./queue.constants";
import { ApplicationModule } from "@/application/application.module";
import { EventModule } from "@/event/event.module";
import { EventCleanConsumer } from "./consumer/event-clean.consumer";
import { EventClickConsumer } from "./consumer/click-event.consumer";
import { EventRecordModule } from "@/event-record/event-record.module";
import { EventCustomModule } from "@/event-custom/event-custom.module";
import { ClickEventModule } from "@/click-event/click-event.module";

@Module({
  imports: [
    BullModule.registerQueue({
      name: EVENT_ENTRY_QUEUE,
    }),
    BullModule.registerQueue({
      name: EVENT_CLEAN_QUEUE,
    }),
    BullModule.registerQueue({
      name: CLICK_EVENT_QUEUE,
    }),
    ApplicationModule,
    EventModule,
    EventRecordModule,
    EventCustomModule,
    ClickEventModule,
  ],
  providers: [
    QueueService,
    EventEntryConsumer,
    EventCleanConsumer,
    EventClickConsumer,
  ],
  exports: [QueueService],
})
export class QueueModule {}
