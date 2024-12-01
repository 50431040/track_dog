import { Process, Processor } from "@nestjs/bull";
import { EVENT_ENTRY_PROCESS, EVENT_ENTRY_QUEUE } from "../queue.constants";
import { Job } from "bull";
import { ApplicationService } from "@/application/application.service";
import { Logger } from "@nestjs/common";
import { QueueService } from "../queue.service";
import { EventEntryParams } from "@/types/event";

@Processor(EVENT_ENTRY_QUEUE)
export class EventEntryConsumer {
  constructor(
    private readonly applicationService: ApplicationService,
    private readonly eventService: QueueService,
  ) {}

  logger = new Logger(EventEntryConsumer.name);

  @Process({
    name: EVENT_ENTRY_PROCESS,
    concurrency: 10,
  })
  async handleEvent(job: Job<EventEntryParams>) {
    try {
      const { data } = job.data;

      if (!data || typeof data !== "object" || !data.appId) {
        this.logger.error("数据格式错误", data);
        return;
      }

      const application = await this.applicationService.getApplicationById(
        data.appId,
      );

      if (!application) {
        this.logger.error(`应用不存在: ${data.appId}`);
        return;
      }

      job.data.application = application;
      // 数据清洗
      await this.eventService.eventCleanProducer(job.data);
    } catch (error) {
      this.logger.error(error);
    }
  }
}
