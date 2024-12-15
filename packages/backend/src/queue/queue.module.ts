import { Module } from "@nestjs/common";
import { QueueService } from "./queue.service";
import { EventEntryConsumer } from "./consumer/event-entry.consumer";
import { BullModule } from "@nestjs/bull";
import {
  NORMAL_EVENT_QUEUE,
  EVENT_CLEAN_QUEUE,
  EVENT_ENTRY_QUEUE,
  DEVICE_CLEAN_QUEUE,
} from "./queue.constants";
import { ApplicationModule } from "@/application/application.module";
import { EventModule } from "@/event/event.module";
import { EventCleanConsumer } from "./consumer/event-clean.consumer";
import { NormalEventConsumer } from "./consumer/normal-event.consumer";
import { EventRecordModule } from "@/event-record/event-record.module";
import { EventCustomModule } from "@/event-custom/event-custom.module";
import { NormalEventModule } from "@/normal-event/normal-event.module";
import { DeviceModule } from "@/device/device.module";

@Module({
  imports: [
    BullModule.registerQueue({
      name: EVENT_ENTRY_QUEUE,
    }),
    BullModule.registerQueue({
      name: EVENT_CLEAN_QUEUE,
    }),
    BullModule.registerQueue({
      name: NORMAL_EVENT_QUEUE,
    }),
    BullModule.registerQueue({
      name: DEVICE_CLEAN_QUEUE,
    }),
    ApplicationModule,
    EventModule,
    EventRecordModule,
    EventCustomModule,
    NormalEventModule,
    DeviceModule,
  ],
  providers: [
    QueueService,
    EventEntryConsumer,
    EventCleanConsumer,
    NormalEventConsumer,
  ],
  exports: [QueueService],
})
export class QueueModule {}
