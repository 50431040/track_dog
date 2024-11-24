import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema({
  collection: "web_user",
  timestamps: { createdAt: "createTime", updatedAt: "updateTime" },
})
export class WebUser extends Document {
  // 用户名
  @Prop({ required: true })
  name: string;

  // 密码
  @Prop({ required: true })
  password: string;

  // 是否为管理员
  @Prop({ default: false })
  isAdmin: boolean;

  // 头像
  @Prop()
  avatar?: string;

  // 邮箱
  @Prop({ required: true })
  email: string;

  // 创建者
  @Prop()
  creator?: string;

  // 是否删除
  @Prop({ default: false })
  isDelete: boolean;

  // 删除时间
  @Prop()
  deleteTime?: Date;
}

export const WebUserSchema = SchemaFactory.createForClass(WebUser);
