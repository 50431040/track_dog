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
