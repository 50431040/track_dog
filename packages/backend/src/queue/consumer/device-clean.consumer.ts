import { Process, Processor } from "@nestjs/bull";
import { DEVICE_CLEAN_PROCESS, DEVICE_CLEAN_QUEUE } from "../queue.constants";
import { Job } from "bull";
import { EventEntryParams } from "@/types/event";
import { DeviceService } from "@/device/device.service";

@Processor(DEVICE_CLEAN_QUEUE)
export class DeviceCleanConsumer {
  constructor(private readonly deviceService: DeviceService) {}

  @Process(DEVICE_CLEAN_PROCESS)
  async handleDeviceClean(job: Job<EventEntryParams>) {
    const { application, data } = job.data;
    console.log(application, data);
    await this.deviceService.cleanDevice(data);
  }
}
