import { EventUploadType, EventType } from "@/enum/event";
import { EventEntryParams } from "@/types/event";
import { Injectable, Logger } from "@nestjs/common";
import { Platform } from "@track_dog/common";

@Injectable()
export class EventService {
  constructor() {}

  logger = new Logger(EventService.name);

  // 清洗事件
  cleanEvent(data: EventEntryParams) {
    const { ip, data: eventDetail, application } = data;

    if (application.platform === Platform.Flutter) {
      return this.cleanFlutterEvent(eventDetail);
    }

    this.logger.error("不支持的平台", application.platform);
    return [];
  }

  // 清洗Flutter平台的事件（包括点击事件和页面相关事件）
  cleanFlutterEvent(data: any) {
    if (!data.track_id || !data.device_id || !data.app_version) {
      return [];
    }

    const dataList = data.data_list;
    if (!dataList || !Array.isArray(dataList) || dataList.length === 0) {
      return [];
    }

    const eventList = [];
    const normalEventCommonData = {
      appId: data.appId,
      deviceId: data.device_id,
      userId: data.user_id || "",
      launchId: data.track_id,
      triggerId: data.signature,
      sdkVersion: data.sdk_version || "",
      version: data.app_version || "",
    };
    for (let i = 0; i < dataList.length; i++) {
      const item = dataList[i];
      const { type, key, time, params } = item;

      if (!type || !key || !time || !params) {
        continue;
      }

      // 客户端上报的type
      if (type === EventType.Click || type === EventType.Custom) {
        const result = this.cleanFlutterNormalEvent(item);
        if (result) {
          eventList.push({
            ...normalEventCommonData,
            ...result,
          });
        }
        continue;
      }

      if (type === EventType.PageView) {
        const result = this.cleanFlutterViewEvent(item);
        if (result) {
          eventList.push(result);
        }
      }
    }

    return eventList;
  }

  // 清洗普通事件
  cleanFlutterNormalEvent(data: any) {
    const { type, time, key, params } = data;
    // 手动触发
    const isCustom = type === EventType.Custom;

    // params必须为对象
    if (!time || !params || typeof params !== "object") {
      return;
    }

    if (isCustom && !key) {
      return;
    }

    let name: string = key;
    // 自动上报时，name为texts
    if (!isCustom) {
      if (
        !params.texts ||
        !Array.isArray(params.texts) ||
        params.texts.length === 0
      ) {
        return;
      }
      // TODO 可能存在多个文本
      name = params.texts[0];
    }

    return {
      type: isCustom
        ? EventUploadType.UploadManual
        : EventUploadType.UploadAuto,
      name,
      triggerTime: time,
      params: isCustom ? params : null,
    };
  }

  // 页面浏览事件
  cleanFlutterViewEvent(data: any) {
    // const { texts } = data;
    return {};
  }
}
