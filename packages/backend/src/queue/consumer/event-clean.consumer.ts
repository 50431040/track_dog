import { Process, Processor } from "@nestjs/bull";
import { EVENT_CLEAN_PROCESS, EVENT_CLEAN_QUEUE } from "../queue.constants";
import { Job } from "bull";
import { EventEntryParams } from "@/types/event";
import { EventService } from "@/event/event.service";
import { QueueService } from "../queue.service";
import { EventClickType, EventType, IClickEvent } from "@/enum/event";

@Processor(EVENT_CLEAN_QUEUE)
export class EventCleanConsumer {
  constructor(
    private readonly eventService: EventService,
    private readonly queueService: QueueService,
  ) {}

  @Process({
    name: EVENT_CLEAN_PROCESS,
    concurrency: 10,
  })
  async handleEventClean(job: Job<EventEntryParams>) {
    // 清洗后的事件列表
    const eventList = this.eventService.cleanEvent(job.data);

    // 分类处理事件（分大类）
    for (const event of eventList) {
      switch (event.type) {
        case EventClickType.ClickManual:
        case EventClickType.ClickAuto:
          this.queueService.clickEventProducer(event as IClickEvent);
          break;
        default:
          break;
      }
    }
  }
}
