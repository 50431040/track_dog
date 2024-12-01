import { Entity, Column, Index } from "typeorm";
import { BaseEntity } from "@/base/entity/base.entity";

// 普通事件表（点击、自定义事件）
@Entity({ name: "normal_event" })
@Index(["appId", "type", "name"], { unique: true })
export class NormalEventRepository extends BaseEntity {
  // 应用ID
  @Column({ length: 32 })
  @Index()
  appId: string;

  // 事件类型
  @Column({ length: 32 })
  @Index()
  type: string;

  // 事件名称
  @Column({ length: 100 })
  @Index()
  name: string;
}
