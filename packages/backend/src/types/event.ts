import { ApplicationRepository } from "@/schema/application.schema";

export interface EventEntryParams {
  ip: string;
  // 上报信息
  data: any;
  application?: ApplicationRepository;
}
