import { Form, Input, Button, Space } from "@arco-design/web-react";
import { IconUser, IconLock, IconEmail } from "@arco-design/web-react/icon";
import styles from "./index.module.scss";

function Register() {
  const [form] = Form.useForm();

  const validateConfirmPassword = (
    value: string | undefined,
    callback: (error?: React.ReactNode) => void,
  ) => {
    if (!value) {
      callback("请输入确认密码");
    } else if (value !== form.getFieldValue("password")) {
      callback("两次输入的密码不一致");
    } else {
      callback();
    }
  };

  const handleSubmit = (values: any) => {
    console.log("Form values:", values);
    // TODO: 处理表单提交逻辑
  };

  const formRules = {
    username: [
      { required: true, message: "请输入用户名" },
      { maxLength: 16, message: "用户名不能超过16个字" },
    ],
    password: [
      { required: true, message: "请输入初始密码" },
      { maxLength: 32, message: "初始密码不能超过32个字符" },
    ],
    confirmPassword: [
      { required: true, message: "请输入确认密码" },
      { maxLength: 32, message: "确认初始密码不能超过32个字符" },
      { validator: validateConfirmPassword },
    ],
    email: [
      { type: "email", message: "请输入有效的邮箱地址" },
      { required: true, message: "邮箱是必填项" },
    ],
  };

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <h1
          style={{
            textAlign: "center",
            marginBottom: "40px",
            fontSize: "32px",
            fontWeight: "bold",
            color: "#165DFF",
            textShadow: "0 2px 4px rgba(22, 93, 255, 0.2)",
          }}
        >
          初始设置
        </h1>
        <Form
          autoComplete="off"
          style={{ width: "100%" }}
          onSubmit={handleSubmit}
          form={form}
        >
          <Form.Item label="用户名" field="username" rules={formRules.username}>
            <Input
              prefix={<IconUser />}
              placeholder="请输入用户名"
              size="large"
              style={{ borderRadius: "4px" }}
            />
          </Form.Item>
          <Form.Item
            label="初始密码"
            field="password"
            rules={formRules.password}
          >
            <Input.Password
              prefix={<IconLock />}
              placeholder="请输入初始密码"
              size="large"
              style={{ borderRadius: "4px" }}
            />
          </Form.Item>
          <Form.Item
            label="确认密码"
            field="confirmPassword"
            rules={formRules.confirmPassword}
          >
            <Input.Password
              prefix={<IconLock />}
              placeholder="请确认初始密码"
              size="large"
              style={{ borderRadius: "4px" }}
            />
          </Form.Item>
          <Form.Item label="邮箱" field="email" rules={formRules.email}>
            <Input
              prefix={<IconEmail />}
              placeholder="请输入邮箱"
              size="large"
              style={{ borderRadius: "4px" }}
            />
          </Form.Item>
          <Form.Item style={{ justifyContent: "center" }}>
            <Space
              direction="vertical"
              style={{ width: "100%", marginTop: "20px" }}
            >
              <Button
                type="primary"
                htmlType="submit"
                long
                size="large"
                style={{
                  borderRadius: "4px",
                  height: "44px",
                  fontSize: "16px",
                  boxShadow: "0 2px 8px rgba(22, 93, 255, 0.3)",
                }}
              >
                注册
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}

export default Register;
