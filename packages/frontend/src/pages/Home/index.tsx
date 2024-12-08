import {
  Avatar,
  Divider,
  Dropdown,
  Layout,
  Menu,
  Select,
} from "@arco-design/web-react";
import { IconApps, IconHome, IconUser } from "@arco-design/web-react/icon";
import styles from "./index.module.scss";
import useUserStore from "../../store/useUserStore";
import { Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { queryApplicationList } from "../../api/application";
import useGlobalStore from "../../store/useGlobalStore";

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
  // 普通事件
  {
    id: "normal-event",
    name: "事件管理",
    icon: <IconApps />,
    path: "/normal-event",
  },
];
function Home() {
  const userInfo = useUserStore((state) => state.userInfo);
  const navigate = useNavigate();
  const [defaultSelectedKeys] = useState<string[]>(() => {
    const id = menuList.find((item) => location.href.includes(item.path))?.id;
    if (location.hash === "#/") {
      return [menuList[0].id];
    } else {
      return id ? [id] : [menuList[0].id];
    }
  });
  const selectedApplication = useGlobalStore(
    (state) => state.selectedApplication,
  );
  const updateSelectedApplication = useGlobalStore(
    (state) => state.updateSelectedApplication,
  );
  const applicationList = useGlobalStore((state) => state.applicationList);
  const updateApplicationList = useGlobalStore(
    (state) => state.updateApplicationList,
  );

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

  const initApplicationList = async () => {
    const application = await queryApplicationList({ page: 1, pageSize: 20 });
    updateApplicationList(application.list);

    // 默认选中第一个
    if (application.list.length > 0 && !selectedApplication) {
      updateSelectedApplication(application.list[0]);
    }
  };

  const handleApplicationChange = (value: string) => {
    const application = applicationList.find((item) => item._id === value);
    if (application) {
      updateSelectedApplication(application);
    }
  };

  useEffect(() => {
    initApplicationList();
  }, []);

  return (
    <Layout className={styles.wrap}>
      <Sider breakpoint="lg" width={220} collapsible>
        {/* logo */}
        <div className="logo" />
        <Menu
          defaultSelectedKeys={defaultSelectedKeys}
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
          <div>
            {/* 应用切换 */}
            {selectedApplication ? (
              <Select
                options={applicationList.map((item) => ({
                  label: item.name,
                  value: item._id,
                }))}
                value={selectedApplication?._id}
                onChange={handleApplicationChange}
                style={{ width: 140 }}
              />
            ) : null}
          </div>
          <div>
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
          </div>
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
