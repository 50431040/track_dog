import { Prop, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { ToJSONSchema } from "src/base/decorator/json.decorator";

@ToJSONSchema({
  collection: "web_user",
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

  // 创建时间
  @Prop({ default: Date.now, index: true })
  createTime: Date;

  // 更新时间
  @Prop({ default: Date.now, index: true })
  updateTime: Date;

  // 删除时间
  @Prop({ index: true })
  deleteTime?: Date;
}

export const WebUserSchema = SchemaFactory.createForClass(WebUser);
