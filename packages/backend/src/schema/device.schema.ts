import { BaseCreateEntity } from "@/base/entity/base-create.entity";
import { Column, Entity, In, Index } from "typeorm";

@Entity({ name: "device" })
export class DeviceRepository extends BaseCreateEntity {
  // 应用ID
  @Column({ length: 32 })
  @Index()
  appId: string;

  // 设备ID
  @Column({ length: 1000 })
  deviceId: string;

  // 用户ID
  @Column({ length: 1000, nullable: true })
  userId: string;

  // 操作平台
  @Column({ length: 100 })
  platform: string;

  // 品牌
  @Column({ length: 100 })
  brand: string;

  // 型号
  @Column({ length: 100 })
  model: string;

  // 系统版本
  @Column({ length: 100 })
  systemVersion: string;

  // 唯一标识
  @Column({ length: 32 })
  @Index({ unique: true })
  uniqueId: string;
}
