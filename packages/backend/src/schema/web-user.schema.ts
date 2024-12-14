import { BaseEntity } from "@/base/entity/base.entity";
import { Column, Entity, Index } from "typeorm";

@Entity({ name: "web_user" })
export class WebUserRepository extends BaseEntity {
  // 用户名
  @Column({ nullable: false, length: 32 })
  @Index({ unique: true })
  name: string;

  // 密码
  @Column({ nullable: false, length: 32 })
  password: string;

  // 是否为管理员
  @Column({ default: false })
  isAdmin: boolean;

  // 头像
  @Column({ nullable: true, length: 100 })
  avatar?: string;

  // 邮箱
  @Column({ nullable: false, length: 100 })
  email: string;

  // 创建者
  @Column({ nullable: true })
  creator?: string;

  // 是否删除
  @Column({ default: false })
  isDelete: boolean = false;

  // 删除时间
  @Column()
  deleteTime?: Date;

  get id(): string {
    return this._id.toString();
  }
}
