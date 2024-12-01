export enum EventType {
  // 点击
  Click = "click",
  // 页面浏览
  PageView = "page_view",
  // 页面离开
  PageLeave = "page_leave",
  // 手动上报
  Custom = "custom_event",
}

// 事件上报类型
export enum EventUploadType {
  // 手动上报
  UploadManual = "manual",
  // 自动上报
  UploadAuto = "auto",
}

export interface INormalEvent {
  appId: string;
  deviceId: string;
  userId?: string;
  launchId: string;
  triggerId: string;
  sdkVersion?: string;
  version?: string;
  type: EventUploadType;
  name: string;
  triggerTime: number;
  params?: Record<string, any> | null;
}
