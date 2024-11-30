import { Platform } from "@track_dog/common";

export interface IQueryApplicationListParams {
  keyword?: string;
  page?: number;
  pageSize?: number;
}

export interface IApplication {
  _id: string;
  name: string;
  icon: string;
  platform: string;
  createTime: number;
}

export interface IApplicationListDTO {
  list: IApplication[];
  total: number;
}

export interface ICreateApplicationParams {
  name: string;
  icon: string;
  platform: Platform;
}
