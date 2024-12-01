import { Entity, Column, Index } from "typeorm";
import { BaseEntity } from "@/base/entity/base.entity";

// 事件表
@Entity({ name: "click_event" })
@Index(["appId", "type", "name"], { unique: true })
export class ClickEventRepository extends BaseEntity {
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
