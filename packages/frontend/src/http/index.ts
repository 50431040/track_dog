import axios from "axios";
import { Message } from "@arco-design/web-react";
import useUserStore from "../store/useUserStore";

const instance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  timeout: 10000,
});

instance.interceptors.request.use(
  (config) => {
    const { userInfo } = useUserStore.getState();
    if (userInfo?.token) {
      config.headers.Authorization = `Bearer ${userInfo.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

instance.interceptors.response.use(
  (response) => {
    if (response.status === 200 && response.data?.success) {
      return response.data;
    } else {
      Message.error(response.data.message);
      return Promise.reject(response.data);
    }
  },
  (error) => {
    Message.error("服务异常");
    return Promise.reject(error);
  },
);

const http = {
  get: <T>(url: string, config?: any): Promise<T> =>
    instance.get(url, config).then((res) => res as T),
  post: <T>(url: string, data?: any, config?: any): Promise<T> =>
    instance.post(url, data, config).then((res) => res as T),
  put: <T>(url: string, data?: any, config?: any): Promise<T> =>
    instance.put(url, data, config).then((res) => res as T),
  delete: <T>(url: string, config?: any): Promise<T> =>
    instance.delete(url, config).then((res) => res as T),
};

export default http;
