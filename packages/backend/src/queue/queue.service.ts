import { InjectQueue } from "@nestjs/bull";
import { Injectable } from "@nestjs/common";
import { Queue } from "bull";
import {
  NORMAL_EVENT_PROCESS,
  NORMAL_EVENT_QUEUE,
  EVENT_CLEAN_PROCESS,
  EVENT_CLEAN_QUEUE,
  EVENT_ENTRY_PROCESS,
  EVENT_ENTRY_QUEUE,
  DEVICE_CLEAN_QUEUE,
  DEVICE_CLEAN_PROCESS,
} from "./queue.constants";
import { EventEntryParams } from "@/types/event";
import { INormalEvent } from "@/enum/event";

@Injectable()
export class QueueService {
  constructor(
    @InjectQueue(EVENT_ENTRY_QUEUE)
    private readonly eventEntryQueue: Queue,
    @InjectQueue(EVENT_CLEAN_QUEUE)
    private readonly eventCleanQueue: Queue,
    @InjectQueue(NORMAL_EVENT_QUEUE)
    private readonly normalEventQueue: Queue,
    @InjectQueue(DEVICE_CLEAN_QUEUE)
    private readonly deviceCleanQueue: Queue,
  ) {}

  // 事件入口生产者
  eventEntryProducer(params: EventEntryParams) {
    return this.eventEntryQueue.add(EVENT_ENTRY_PROCESS, params, {
      removeOnComplete: true,
      removeOnFail: true,
    });
  }

  // 事件清洗生产者
  eventCleanProducer(params: EventEntryParams) {
    return this.eventCleanQueue.add(EVENT_CLEAN_PROCESS, params, {
      removeOnComplete: true,
      removeOnFail: true,
    });
  }

  // 事件生产者
  normalEventProducer(params: INormalEvent) {
    return this.normalEventQueue.add(NORMAL_EVENT_PROCESS, params, {
      removeOnComplete: true,
      removeOnFail: true,
    });
  }

  // 设备信息清洗生产者
  deviceCleanProducer(params: EventEntryParams) {
    return this.deviceCleanQueue.add(DEVICE_CLEAN_PROCESS, params, {
      removeOnComplete: true,
      removeOnFail: true,
    });
  }

  // 页面浏览事件生产者
  pageViewEventProducer() {}
}
