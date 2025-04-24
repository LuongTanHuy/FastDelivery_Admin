import React, { useEffect, useState } from "react";
import { Layout, Typography, Button, Menu, Image, Tooltip } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import {
  BarChartOutlined, ShoppingCartOutlined, ShopOutlined,
  UserAddOutlined, FundProjectionScreenOutlined, HomeOutlined,
  MenuUnfoldOutlined, MenuFoldOutlined, UsergroupAddOutlined,
  CustomerServiceOutlined, NotificationOutlined, ProductOutlined
} from "@ant-design/icons";
import { BASE_URL_IMAGE } from "../api/configs";
import defaultAvatar from "../assets/avatar/woman1.jpg";

const { Sider } = Layout;
const { Text } = Typography;

const Sidebar = ({ collapsed, setCollapsed }) => {
  const [user, setUser] = useState(null);
  const [selectedKey, setSelectedKey] = useState("shopdashboards");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const userData = localStorage.getItem("userInfo");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  useEffect(() => {
    const currentPath = location.pathname.split("/")[1];
    setSelectedKey(currentPath || "shopdashboards");
  }, [location]);

  const isShop = user?.role?.includes("store");
  const isAdmin = user?.role?.includes("admin");

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      style={{
        background: "#0D1B2A",
        height: "100vh",
        position: "fixed",
        left: 0,
        top: 0,
        bottom: 0,
        paddingTop: 20,
      }}
    >
      {/* Nút Toggle Sidebar */}
      <Button
        type="text"
        onClick={() => setCollapsed(!collapsed)}
        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        style={{
          color: "white",
          marginLeft: "10px",
          marginBottom: "10px",
          fontSize: "18px",
        }}
      />

      <div style={{ marginBottom: 20, display: "flex", flexDirection: "column", alignItems: "center" }}>
        {user && (
          <>
            <Tooltip title={user?.username || "Người dùng"} placement="right">
              <Image
                width={collapsed ? 40 : 64}
                src={user?.image ? `${BASE_URL_IMAGE}${user.image}` : defaultAvatar}
                preview={false}
                style={{
                  borderRadius: "50%",
                  width: collapsed ? 40 : 64,
                  height: collapsed ? 40 : 64,
                  objectFit: "cover",
                  border: "2px solid white",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                }}
              />
            </Tooltip>

            {!collapsed && (
              <div style={{ marginTop: 10, textAlign: "center" }}>
                <Text style={{ color: "white", fontSize: 16, fontWeight: 600 }}>
                  {user.username}
                </Text>
              </div>
            )}

            {!collapsed && (
              <Button
                type="primary"
                danger
                size="small"
                onClick={() => {
                  localStorage.clear();
                  navigate("/login");
                }}
                style={{
                  marginTop: 10,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "80%",
                }}
              >
                Đăng xuất
              </Button>
            )}
          </>
        )}
      </div>

      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[selectedKey]}
        onClick={({ key }) => {
          setSelectedKey(key);
          navigate(`/${key}`);
        }}
        style={{ background: "#0D1B2A" }}
      >
        {isShop && (
          <>
            <Menu.Item key="shopdashboards" icon={<ShopOutlined />}>Trang chủ</Menu.Item>
            <Menu.Item key="statistics" icon={<BarChartOutlined />}>Thống Kê</Menu.Item>
            <Menu.Item key="foods" icon={<ProductOutlined />}>Món Ăn</Menu.Item>
            <Menu.Item key="orders" icon={<ShoppingCartOutlined />}>Đơn Hàng</Menu.Item>
          </>
        )}
        {isAdmin && (
          <>
            <Menu.Item key="dashboards" icon={<HomeOutlined />}>Dashboard</Menu.Item>
            <Menu.Item key="storelist" icon={<ShopOutlined />}>Danh sách cửa hàng</Menu.Item>
            <Menu.Item key="accounts" icon={<UserAddOutlined />}>Tài khoản</Menu.Item>
            <Menu.Item key="bannermanagements" icon={<FundProjectionScreenOutlined />}>Banner</Menu.Item>
            <Menu.Item key="useronlines" icon={<UsergroupAddOutlined />}>Danh sách người dùng</Menu.Item>
            <Menu.Item key="customersupports" icon={<CustomerServiceOutlined />}>Chăm sóc khách hàng</Menu.Item>
            <Menu.Item key="notifications" icon={<NotificationOutlined />}>Thông báo</Menu.Item>
          </>
        )}
      </Menu>
    </Sider>
  );
};

export default Sidebar;
