import { IClickEvent } from "@/enum/event";
import { Processor, Process } from "@nestjs/bull";
import { Job } from "bull";
import { CLICK_EVENT_PROCESS, CLICK_EVENT_QUEUE } from "../queue.constants";
import { EventService } from "@/event/event.service";
import { Logger } from "@nestjs/common";
import { EventRecordService } from "@/event-record/event-record.service";
import { EventCustomService } from "@/event-custom/event-custom.service";
import { ClickEventService } from "@/click-event/click-event.service";

@Processor(CLICK_EVENT_QUEUE)
export class EventClickConsumer {
  constructor(
    private readonly eventService: EventService,
    private readonly eventRecordService: EventRecordService,
    private readonly eventCustomService: EventCustomService,
    private readonly clickEventService: ClickEventService,
  ) {}

  logger = new Logger(EventClickConsumer.name);

  @Process({
    name: CLICK_EVENT_PROCESS,
    concurrency: 1,
  })
  async handleClickEvent(job: Job<IClickEvent>) {
    const data = job.data;

    // 保存事件名
    const event = await this.clickEventService.saveClickEvent(data);
    if (!event) {
      this.logger.error("保存点击事件失败", data);
      return;
    }

    // 保存事件记录
    const eventRecord = await this.eventRecordService.saveEventRecord(
      event._id.toString(),
      data,
    );
    if (!eventRecord) {
      this.logger.error("保存事件记录失败", data);
      return;
    }

    // 保存事件自定义参数
    if (data.params) {
      await this.eventCustomService.saveEventCustomParam(
        event._id.toString(),
        eventRecord._id.toString(),
        data.params,
      );
    }
  }
}
