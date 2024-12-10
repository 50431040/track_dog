import http from "../http";
import {
  INormalEventListDTO,
  INormalEventTrend,
  IQueryNormalEventListParams,
  IQueryNormalEventTrendParams,
} from "../dto/NormalEvent";

// 查询事件列表
export const queryNormalEventList = (params: IQueryNormalEventListParams) => {
  return http.get<INormalEventListDTO>("/web/normal-event", { params });
};

// 查询事件趋势
export const queryNormalEventTrend = (params: IQueryNormalEventTrendParams) => {
  return http.get<INormalEventTrend[]>("/web/normal-event/trend", { params });
};
