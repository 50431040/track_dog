import { IInitialUserParams, ILoginParams, IUserInfoDTO } from "../dto/User";
import http from "../http";

// 查询是否存在初始用户
export const queryInitialUser = () => {
  return http.get<boolean>("web/user/initial");
};

// 创建初始用户
export const createInitialUser = (data: IInitialUserParams) => {
  return http.post<boolean>("web/user/initial", data);
};

// 登录
export const login = (data: ILoginParams) => {
  return http.post<IUserInfoDTO>("web/user/login", data);
};
