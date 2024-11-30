import {
  IQueryApplicationListParams,
  IApplicationListDTO,
} from "../dto/Application";
import http from "../http";

// 查询应用列表
export const queryApplicationList = (data: IQueryApplicationListParams) => {
  return http.get<IApplicationListDTO>("web/application", data);
};
