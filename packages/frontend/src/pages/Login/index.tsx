import { Form, Input, Button, Space } from "@arco-design/web-react";
import { IconUser, IconLock } from "@arco-design/web-react/icon";
import styles from "./index.module.scss";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { login, queryInitialUser } from "../../api/user";
import md5 from "md5";
import { ILoginParams } from "../../dto/User";
import useUserStore from "../../store/useUserStore";

function Login() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const setUserInfo = useUserStore((state) => state.setUserInfo);

  // 检查是否存在初始用户
  const checkInitialUser = async () => {
    try {
      const response = await queryInitialUser();
      if (!response) {
        navigate("/register", { replace: true });
      }
    } catch (error) {
      console.error("Error checking initial user:", error);
    }
  };

  useEffect(() => {
    checkInitialUser();
  }, []);

  const handleSubmit = (values: Record<string, string>) => {
    const params: ILoginParams = {
      name: values.name,
      password: md5(values.password),
    };
    login(params).then((data) => {
      console.log("res:", data);
      setUserInfo(data);
      navigate("/", { replace: true });
    });
  };

  const formRules = {
    name: [
      { required: true, message: "请输入用户名" },
      { maxLength: 16, message: "最大长度为16" },
    ],
    password: [
      { required: true, message: "请输入密码" },
      { maxLength: 32, message: "最大长度为32" },
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
          TrackDog
        </h1>
        <Form
          autoComplete="off"
          style={{ width: "100%" }}
          onSubmit={handleSubmit}
          form={form}
        >
          <Form.Item label="用户名" field="name" rules={formRules.name}>
            <Input
              prefix={<IconUser />}
              placeholder="请输入用户名"
              size="large"
              style={{ borderRadius: "4px" }}
            />
          </Form.Item>
          <Form.Item label="密码" field="password" rules={formRules.password}>
            <Input.Password
              prefix={<IconLock />}
              placeholder="请输入密码"
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
                登录
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}

export default Login;
