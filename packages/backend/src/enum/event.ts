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

// 点击事件类型
export enum EventClickType {
  // 手动上报
  ClickManual = "manual",
  // 自动上报
  ClickAuto = "auto",
}

export interface IClickEvent {
  appId: string;
  deviceId: string;
  userId?: string;
  launchId: string;
  triggerId: string;
  sdkVersion?: string;
  version?: string;
  type: EventClickType;
  name: string;
  triggerTime: number;
  params?: Record<string, any> | null;
}
