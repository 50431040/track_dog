import { Form, Input, Button, Space } from "@arco-design/web-react";
import { IconUser, IconLock } from "@arco-design/web-react/icon";
import styles from "./index.module.scss";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { queryInitialUser } from "../../api/user";

function Login() {
  useEffect(() => {
    const checkInitialUser = async () => {
      try {
        const response = await queryInitialUser();
        if (!response?.id) {
          navigate("/register");
        }
      } catch (error) {
        console.error("Error checking initial user:", error);
      }
    };

    checkInitialUser();
  }, []);

  const navigate = useNavigate();

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
        <Form autoComplete="off" style={{ width: "100%" }}>
          <Form.Item label="用户名" field="username">
            <Input
              prefix={<IconUser />}
              placeholder="请输入用户名"
              size="large"
              style={{ borderRadius: "4px" }}
            />
          </Form.Item>
          <Form.Item label="密码" field="password">
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
