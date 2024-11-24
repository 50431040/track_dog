import { IsEmail, IsNotEmpty, Length } from "class-validator";

// 初始用户DTO
export class InitialUserDTO {
  // 不能为空，长度限制16
  @IsNotEmpty({ message: "用户名不能为空" })
  @Length(1, 16, { message: "用户名长度不能超过16位" })
  name: string;

  // 不能为空，长度限制32
  @IsNotEmpty({ message: "密码不能为空" })
  @Length(32, 32, { message: "密码长度异常" })
  password: string;

  // 不能为空，长度限制100
  @IsNotEmpty({ message: "邮箱不能为空" })
  @Length(1, 100, { message: "邮箱长度不能超过100位" })
  @IsEmail({}, { message: "邮箱格式不正确" })
  email: string;
}
