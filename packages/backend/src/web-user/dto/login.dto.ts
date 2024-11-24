import { IsNotEmpty, Length } from "class-validator";

// 登录DTO
export class LoginDTO {
  // 不能为空
  @IsNotEmpty({ message: "用户名不能为空" })
  @Length(1, 16, { message: "用户名长度不能超过16位" })
  name: string;

  // 不能为空
  @IsNotEmpty({ message: "密码不能为空" })
  @Length(32, 32, { message: "密码长度异常" })
  password: string;
}
