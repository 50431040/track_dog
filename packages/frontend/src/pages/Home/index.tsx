import {
  Avatar,
  Divider,
  Dropdown,
  Layout,
  Menu,
  Message,
} from "@arco-design/web-react";
import { IconApps, IconHome, IconUser } from "@arco-design/web-react/icon";
import styles from "./index.module.scss";
import useUserStore from "../../store/useUserStore";
import { Outlet, useNavigate } from "react-router-dom";

const MenuItem = Menu.Item;
const Sider = Layout.Sider;
const Header = Layout.Header;
const Footer = Layout.Footer;
const Content = Layout.Content;

const menuList = [
  // 大盘数据
  {
    id: "data",
    name: "大盘数据",
    icon: <IconHome />,
    path: "/overview",
  },
  // 用户管理
  {
    id: "user",
    name: "用户管理",
    icon: <IconUser />,
    path: "/user-manager",
  },
  // 应用管理
  {
    id: "application",
    name: "应用管理",
    icon: <IconApps />,
    path: "/application-manager",
  },
];
function Home() {
  const userInfo = useUserStore((state) => state.userInfo);
  const navigate = useNavigate();

  const onLogout = () => {
    // TODO
  };

  // 点击菜单项
  const onMenuClick = (key: string) => {
    const menuItem = menuList.find((item) => item.id === key);
    if (menuItem) {
      navigate(menuItem.path);
    }
  };

  return (
    <Layout className={styles.wrap}>
      <Sider breakpoint="lg" width={220} collapsible>
        {/* logo */}
        <div className="logo" />
        <Menu
          defaultSelectedKeys={[menuList[0].id]}
          onClickMenuItem={onMenuClick}
          style={{ width: "100%" }}
        >
          {menuList.map((item) => (
            <MenuItem key={item.id}>
              {item.icon}
              {item.name}
            </MenuItem>
          ))}
        </Menu>
      </Sider>
      <Layout>
        <Header className={styles.header}>
          {/* 右侧展示头像，hover显示下拉菜单 */}
          <Dropdown
            trigger="hover"
            position="br"
            droplist={
              <Menu>
                <MenuItem key={"logout"} onClick={onLogout}>
                  退出登录
                </MenuItem>
              </Menu>
            }
          >
            <Avatar
              size={36}
              shape="square"
              style={{ backgroundColor: "#3370ff", cursor: "pointer" }}
            >
              {userInfo?.name}
            </Avatar>
          </Dropdown>
        </Header>
        <Divider style={{ margin: "12px 0px" }} />
        <Layout style={{ padding: "0 24px" }}>
          <Content>
            {/* 动态内容 */}
            <Outlet />
          </Content>
          <Footer>
            <div className={styles.copyright}>
              Copyright © 2024 TrackDog. All rights reserved.
            </div>
          </Footer>
        </Layout>
      </Layout>
    </Layout>
  );
}

export default Home;
