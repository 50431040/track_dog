import { EventEntryParams } from "@/types/event";
import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, MongoRepository } from "typeorm";
import { DeviceRepository } from "@/schema/device.schema";
import { Platform } from "@track_dog/common";
import { DevicePlatform } from "@/enum/device";
import md5 from "md5";

@Injectable()
export class DeviceService {
  constructor(
    @InjectRepository(DeviceRepository)
    private readonly deviceRepository: MongoRepository<DeviceRepository>,
  ) {}

  logger = new Logger(DeviceService.name);

  async cleanDevice({ data, application }: EventEntryParams) {
    if (application.platform === Platform.Flutter) {
      return await this.cleanFlutterDevice(data);
    }

    this.logger.error("不支持的平台", application.platform);
  }

  // 清洗Flutter平台的设备
  async cleanFlutterDevice(data: any) {
    const { device_id, device_info } = data;
    if (!device_id) {
      return;
    }

    if (!device_info || typeof device_info !== "object") {
      return;
    }

    const { brand, name, model, version, platform, systemVersion, utsname } =
      device_info;
    const deviceInfo: DeepPartial<DeviceRepository> = {
      deviceId: device_id,
      appId: data.appId,
    };

    if (platform === DevicePlatform.Android) {
      if (!brand || !model || !version || !platform) {
        return;
      }

      deviceInfo.brand = brand;
      deviceInfo.model = model;
      deviceInfo.platform = platform;
      deviceInfo.systemVersion =
        typeof version === "object" ? version.release : JSON.stringify(version);
      return deviceInfo;
    }

    if (platform === DevicePlatform.IOS) {
      if (
        !name ||
        !utsname ||
        typeof utsname !== "object" ||
        !systemVersion ||
        !platform
      ) {
        return;
      }

      deviceInfo.brand = name;
      deviceInfo.model = utsname.machine;
      deviceInfo.platform = platform;
      deviceInfo.systemVersion = systemVersion;
      return deviceInfo;
    }

    this.logger.error("不支持的平台", platform);
  }

  async saveDevice(device: DeepPartial<DeviceRepository>) {
    device.uniqueId = md5(
      `${device.appId}-${device.deviceId}-${device.platform}-${device.brand}-${device.model}-${device.systemVersion}`,
    );
    const existDevice = await this.deviceRepository.findOne({
      where: {
        deviceId: device.deviceId,
      },
    });

    // 有可能不同客户端上传的deviceId相同？
    if (
      existDevice &&
      existDevice.appId === device.appId &&
      existDevice.uniqueId !== device.uniqueId
    ) {
      this.logger.warn(
        `同一个AppId下设备id相同: ${device.deviceId} ${existDevice.appId} ${existDevice.uniqueId} -> ${device.uniqueId}`,
      );
    }
    if (existDevice) {
      return;
    }

    const instance = this.deviceRepository.create(device);
    await this.deviceRepository.save(instance);
  }
}
