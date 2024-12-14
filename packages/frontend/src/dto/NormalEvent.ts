export interface IQueryNormalEventListParams {
  appId: string;
  keyword?: string;
  page: number;
  pageSize: number;
  startTime?: string;
  endTime?: string;
}

export interface INormalEvent {
  _id: string;
  name: string;
  type: string;
  createTime: number;
  count: number;
  deviceCount: number;
}

export interface INormalEventListDTO {
  list: INormalEvent[];
  total: number;
}

export interface IQueryNormalEventTrendParams {
  appId: string;
  eventId: string;
  startTime: string;
  endTime: string;
}

export interface INormalEventTrend {
  date: string;
  count: number;
  deviceCount: number;
}

export type IQueryCustomParamsInfoParams = IQueryNormalEventTrendParams;

export interface ICustomParamsInfo {
  name: string;
  count: number;
  deviceCount: number;
  deviceCountRatio: string;
  countRatio: string;
}

export interface IQueryCustomParamsValueParams
  extends IQueryCustomParamsInfoParams {
  name: string;
}

export interface ICustomParamsValue {
  value: string;
  count: number;
  ratio: string;
}
