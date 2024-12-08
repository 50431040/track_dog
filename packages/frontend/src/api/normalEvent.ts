import http from "../http";
import {
  INormalEventListDTO,
  IQueryNormalEventListParams,
} from "../dto/NormalEvent";

// 查询事件列表
export const queryNormalEventList = (params: IQueryNormalEventListParams) => {
  return http.get<INormalEventListDTO>("/web/normal-event", { params });
};
