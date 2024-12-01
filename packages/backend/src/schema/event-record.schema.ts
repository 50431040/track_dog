import { Entity, Column, Index } from "typeorm";
import { BaseCreateEntity } from "@/base/entity/base-create.entity";

// 事件记录表
@Entity({ name: "event_record" })
export class EventRecordRepository extends BaseCreateEntity {
  // 事件ID
  @Column({ length: 32 })
  @Index()
  eventId: string;

  // 设备ID
  @Column({ length: 1000 })
  @Index()
  deviceId: string;

  // 用户ID
  @Column({ length: 1000, nullable: true })
  @Index()
  userId: string;

  // 启动ID
  @Column({ length: 100 })
  @Index()
  launchId: string;

  // 触发ID（客户端生成）
  @Column({ length: 100 })
  triggerId: string;

  // 触发时间
  @Column({ nullable: true })
  @Index()
  triggerTime: number;

  // SDK版本
  @Column({ length: 100 })
  @Index()
  sdkVersion: string;

  // 客户端版本
  @Column({ length: 100, nullable: true })
  version: string;
}
