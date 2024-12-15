import { Process, Processor } from "@nestjs/bull";
import { DEVICE_CLEAN_PROCESS, DEVICE_CLEAN_QUEUE } from "../queue.constants";
import { Job } from "bull";
import { EventEntryParams } from "@/types/event";
import { DeviceService } from "@/device/device.service";
import { QueueService } from "../queue.service";

@Processor(DEVICE_CLEAN_QUEUE)
export class DeviceCleanConsumer {
  constructor(
    private readonly deviceService: DeviceService,
    private readonly queueService: QueueService,
  ) {}

  @Process({
    name: DEVICE_CLEAN_PROCESS,
    concurrency: 10,
  })
  async handleDeviceClean(job: Job<EventEntryParams>) {
    const deviceInfo = await this.deviceService.cleanDevice(job.data);
    if (deviceInfo) {
      this.queueService.deviceHandleProducer(deviceInfo);
    }
  }
}
