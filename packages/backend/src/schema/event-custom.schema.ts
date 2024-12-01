import { BaseCreateEntity } from "@/base/entity/base-create.entity";
import { Entity, Column, Index } from "typeorm";

// 事件自定义属性表
@Entity({ name: "event_custom" })
export class EventCustomRepository extends BaseCreateEntity {
  // 事件ID
  @Column({ length: 32 })
  @Index()
  eventId: string;

  // 事件记录ID
  @Column({ length: 32 })
  @Index()
  eventRecordId: string;

  // 名称
  @Column({ length: 100 })
  @Index()
  name: string;

  // 值
  @Column({ length: 5000 })
  value: string;
}
