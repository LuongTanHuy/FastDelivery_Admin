import React, { useEffect, useState } from "react";
import { Card, Typography, Row, Col, List } from "antd";
import { HomeOutlined, MailOutlined, PhoneOutlined } from "@ant-design/icons";
import { getUserInfo } from "../api/account";
import { BASE_URL_IMAGE } from "../api/configs";

const { Title, Text } = Typography;

const notifications = [
  { id: 1, message: "\u{1F4E6} Đơn hàng mới từ Nguyễn Văn A", time: "10 phút trước" },
  { id: 2, message: "\u{1F4E6} Đơn hàng mới từ Nguyễn Văn A", time: "10 phút trước" },
  { id: 3, message: "\u{1F4E6} Đơn hàng mới từ Nguyễn Văn A", time: "10 phút trước" },
  { id: 4, message: "\u{1F4E6} Đơn hàng mới từ Nguyễn Văn A", time: "10 phút trước" },
  { id: 5, message: "\u{1F4E6} Đơn hàng mới từ Nguyễn Văn A", time: "10 phút trước" },
  { id: 6, message: "\u{1F4E6} Đơn hàng mới từ Nguyễn Văn A", time: "10 phút trước" },
  { id: 7, message: "\u{1F4E6} Đơn hàng mới từ Nguyễn Văn A", time: "10 phút trước" },
  { id: 8, message: "\u{1F4E6} Đơn hàng mới từ Nguyễn Văn A", time: "10 phút trước" },
  { id: 9, message: "\u{1F4E6} Đơn hàng mới từ Nguyễn Văn A", time: "10 phút trước" },
  { id: 10, message: "\u{1F4E6} Đơn hàng mới từ Nguyễn Văn A", time: "10 phút trước" },
  { id: 11, message: "\u{1F4E6} Đơn hàng mới từ Nguyễn Văn A", time: "10 phút trước" },
  { id: 12, message: "\u{1F4E6} Đơn hàng mới từ Nguyễn Văn A", time: "10 phút trước" },
];

const ShopDashboard = () => {
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getUserInfo();
        setUserInfo(data);
      } catch (error) {
        console.error("Lỗi khi lấy thông tin:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div style={{ padding: 24, background: "#f5f7fa", minHeight: "100vh" }}>
      <Row gutter={24}>
        {/* LEFT SIDE - Store Info */}
        <Col xs={24} md={14}>
          <Card
            style={{ borderRadius: 16, padding: 0, overflow: "hidden" }}
            bodyStyle={{ padding: 0 }}
          >
            <img
              src={userInfo?.image ? `${BASE_URL_IMAGE}${userInfo.image}` : "/default-banner.jpg"}
              alt="Shop Banner"
              style={{ width: "100%", height: "auto", maxHeight: 300, objectFit: "cover" }}
            />
            <div style={{ padding: 24 }}>
              <Title level={2} style={{ fontWeight: 800, marginBottom: 16 }}>
                Hương vị <span style={{ color: "#B51F1F" }}>món ăn</span> đích thực
              </Title>
              <Text style={{ display: "block", marginBottom: 16 }}>
                Thưởng thức những món ăn truyền thống và hiện đại tuyệt vời nhất
              </Text>
              <Row gutter={16}>
                {[{
                  icon: <HomeOutlined style={{ fontSize: 24, color: "#333" }} />,
                  title: "Địa Chỉ",
                  content: userInfo?.address
                }, {
                  icon: <MailOutlined style={{ fontSize: 24, color: "#333" }} />,
                  title: "Email",
                  content: userInfo?.email
                }, {
                  icon: <PhoneOutlined style={{ fontSize: 24, color: "#333" }} />,
                  title: "Số Điện Thoại",
                  content: userInfo?.phone
                }].map((item, index) => (
                  <Col span={8} key={index}>
                    <div
                      style={{
                        height: 180,
                        borderRadius: 12,
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        textAlign: "center",
                        display: "flex",
                        padding: 16,
                        background: "#FAFAFA",
                        border: "1px solidrgb(38, 38, 38)",
                      }}
                    >
                      {item.icon}
                      <div>
                        <Title level={5} style={{ marginTop: 8, marginBottom: 4 }}>{item.title}</Title>
                        <Text>{item.content}</Text>
                      </div>
                    </div>
                  </Col>
                ))}
              </Row>
             
            </div>
          </Card>
        </Col>

        {/* RIGHT SIDE - Notifications */}
        <Col xs={24} md={10}>
          <Card style={{ borderRadius: 16, height: "80%", display: "flex", flexDirection: "column" }}>
            <Title level={4} style={{ marginBottom: 24 }}>Thông Báo</Title>

            <div
              style={{
                maxHeight: 400,
                overflowY: "auto",
                paddingRight: 8,
                flex: 1,
              }}
            >
              <style>
                {`
                  /* Ẩn scrollbar */
                  ::-webkit-scrollbar {
                    width: 0;
                  }
                  ::-webkit-scrollbar-thumb {
                  }
                `}
              </style>

              <List
                itemLayout="horizontal"
                dataSource={notifications}
                renderItem={(item) => (
                  <List.Item style={{
                    borderRadius: 12,
                    boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
                    marginBottom: 16,
                    padding: 12,
                    background: "#FAFAFA",
                    border: "1px solidrgb(38, 38, 38)",

                  }}>
                    <List.Item.Meta
                      title={<Text strong>{item.message}</Text>}
                      description={<Text type="secondary">{item.time}</Text>}
                    />
                  </List.Item>
                )}
              />
            </div>
          </Card>
        </Col>


      </Row>
    </div>
  );
};

export default ShopDashboard;