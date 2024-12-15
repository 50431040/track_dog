import { DeviceService } from "@/device/device.service";
import { DEVICE_HANDLE_PROCESS, DEVICE_HANDLE_QUEUE } from "../queue.constants";
import { Process, Processor } from "@nestjs/bull";
import { DeepPartial } from "typeorm";
import { DeviceRepository } from "@/schema/device.schema";
import { Job } from "bull";

@Processor(DEVICE_HANDLE_QUEUE)
export class DeviceHandleConsumer {
  constructor(private readonly deviceService: DeviceService) {}

  @Process({
    name: DEVICE_HANDLE_PROCESS,
    concurrency: 1,
  })
  async handleDeviceHandle(job: Job<DeepPartial<DeviceRepository>>) {
    await this.deviceService.saveDevice(job.data);
  }
}
