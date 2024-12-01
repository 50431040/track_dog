import { InjectQueue } from "@nestjs/bull";
import { Injectable } from "@nestjs/common";
import { Queue } from "bull";
import {
  CLICK_EVENT_PROCESS,
  CLICK_EVENT_QUEUE,
  EVENT_CLEAN_PROCESS,
  EVENT_CLEAN_QUEUE,
  EVENT_ENTRY_PROCESS,
  EVENT_ENTRY_QUEUE,
} from "./queue.constants";
import { EventEntryParams } from "@/types/event";
import { IClickEvent } from "@/enum/event";

@Injectable()
export class QueueService {
  constructor(
    @InjectQueue(EVENT_ENTRY_QUEUE)
    private readonly eventEntryQueue: Queue,
    @InjectQueue(EVENT_CLEAN_QUEUE)
    private readonly eventCleanQueue: Queue,
    @InjectQueue(CLICK_EVENT_QUEUE)
    private readonly clickEventQueue: Queue,
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

  // 点击事件生产者
  clickEventProducer(params: IClickEvent) {
    return this.clickEventQueue.add(CLICK_EVENT_PROCESS, params, {
      removeOnComplete: true,
      removeOnFail: true,
    });
  }

  // 页面浏览事件生产者
  pageViewEventProducer() {}
}
