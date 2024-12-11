import { INormalEvent } from "@/enum/event";
import { Processor, Process } from "@nestjs/bull";
import { Job } from "bull";
import { NORMAL_EVENT_PROCESS, NORMAL_EVENT_QUEUE } from "../queue.constants";
import { EventService } from "@/event/event.service";
import { Logger } from "@nestjs/common";
import { EventRecordService } from "@/event-record/event-record.service";
import { EventCustomService } from "@/event-custom/event-custom.service";
import { NormalEventService } from "@/normal-event/normal-event.service";

@Processor(NORMAL_EVENT_QUEUE)
export class NormalEventConsumer {
  constructor(
    private readonly eventService: EventService,
    private readonly eventRecordService: EventRecordService,
    private readonly eventCustomService: EventCustomService,
    private readonly normalEventService: NormalEventService,
  ) {}

  logger = new Logger(NormalEventConsumer.name);

  @Process({
    name: NORMAL_EVENT_PROCESS,
    concurrency: 1,
  })
  async handleNormalEvent(job: Job<INormalEvent>) {
    const data = job.data;

    // 保存事件名
    const event = await this.normalEventService.saveNormalEvent(data);
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
    }
  }
}
