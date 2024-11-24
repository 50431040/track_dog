import { IUserInfoDTO } from "../dto/User";
import http from "../http";

// 查询是否存在初始用户
export const queryInitialUser = () => {
  return http.get<IUserInfoDTO>("/user/initial");
};
