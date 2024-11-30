import { Entity, Column, Index } from "typeorm";
import { BaseEntity } from "@/base/entity/base.entity";

@Entity({ name: "application" })
@Index(["name", "platform"], { unique: true })
export class ApplicationRepository extends BaseEntity {
  // 应用名称
  @Column({ length: 32 })
  @Index()
  name: string;

  // 图标
  @Column({ length: 1000 })
  icon: string;

  // 平台
  @Column({ length: 32 })
  platform: string;

  // 创建人
  @Column()
  creator: string;
}
