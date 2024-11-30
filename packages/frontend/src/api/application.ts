import {
  IQueryApplicationListParams,
  IApplicationListDTO,
  ICreateApplicationParams,
} from "../dto/Application";
import http from "../http";

// 查询应用列表
export const queryApplicationList = (data: IQueryApplicationListParams) => {
  return http.get<IApplicationListDTO>("web/application", {
    params: data,
  });
};

// 创建应用
export const createApplication = (data: ICreateApplicationParams) => {
  return http.post("web/application", data);
};
