import http from "../http";
import {
  ICustomParamsInfo,
  INormalEventListDTO,
  INormalEventTrend,
  IQueryCustomParamsInfoParams,
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

// 查询事件自定义参数信息
export const queryCustomParamsInfo = (params: IQueryCustomParamsInfoParams) => {
  return http.get<ICustomParamsInfo[]>("/web/normal-event/custom", {
    params,
  });
};
