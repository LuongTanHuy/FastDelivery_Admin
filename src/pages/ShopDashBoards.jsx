import React, { useEffect, useState } from "react";
import { Card, Typography, Row, Col, List } from "antd";
import { HomeOutlined, MailOutlined, PhoneOutlined } from "@ant-design/icons";
import { getUserInfo } from "../api/account";
import { BASE_URL_IMAGE } from "../api/configs";

const { Title, Text } = Typography;

const notifications = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  message: "📦 Đơn hàng mới từ Nguyễn Văn A",
  time: "10 phút trước",
}));

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
    <div style={{ padding: 24, background: "#f5f7fa", minHeight: "100vh", paddingLeft: 80 }}>
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={14}>
          <Card bodyStyle={{ padding: 0 }} style={{ borderRadius: 16, overflow: "hidden" }}>
            <img
              src={userInfo?.image ? `${BASE_URL_IMAGE}${userInfo.image}` : "/default-banner.jpg"}
              alt="Shop Banner"
              style={{ width: "100%", maxHeight: 300, objectFit: "cover" }}
            />
            <div style={{ padding: 24 }}>
              <Title level={2} style={{ fontWeight: 800 }}>Hương vị <span style={{ color: "#B51F1F" }}>món ăn</span> đích thực</Title>
              <Text>Thưởng thức những món ăn truyền thống và hiện đại tuyệt vời nhất</Text>
              <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
                {[{
                  icon: <HomeOutlined style={{ fontSize: 24 }} />, title: "Địa Chỉ", content: userInfo?.address
                }, {
                  icon: <MailOutlined style={{ fontSize: 24 }} />, title: "Email", content: userInfo?.email
                }, {
                  icon: <PhoneOutlined style={{ fontSize: 24 }} />, title: "Số Điện Thoại", content: userInfo?.phone
                }].map((item, idx) => (
                  <Col xs={24} md={8} key={idx}>
                    <Card style={{ textAlign: "center", height: "100%" }}>
                      {item.icon}
                      <Title level={5} style={{ marginTop: 12 }}>{item.title}</Title>
                      <Text>{item.content}</Text>
                    </Card>
                  </Col>
                ))}
              </Row>
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={10}>
          <Card style={{ borderRadius: 16, height: "100%" }}>
            <Title level={4}>Thông Báo</Title>
            <div style={{ maxHeight: 400, overflowY: "auto" }}>
              <List
                itemLayout="horizontal"
                dataSource={notifications}
                renderItem={(item) => (
                  <List.Item style={{ background: "#FAFAFA", borderRadius: 8, marginBottom: 12, padding: 12 }}>
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
