import React from "react";
import { Card, Col, Row } from "antd";

const Dashboard = () => {
  const EMBED_URL = "http://localhost:3000/public/dashboard/96acfff5-33f1-480c-b1e4-83e2352b440e"; 
  return (
    <div style={{ padding: 20, background: "#F5F5F5", minHeight: "100vh" }}>
      <Row gutter={[16, 16]}>
        <Col span={24}>
        <Card
            title={
              <h2 style={{ marginBottom: 0, fontSize: "20px", fontWeight: 600 }}>
                📊 Báo cáo tổng quan doanh thu cửa hàng & tài khoản
              </h2>
            }>
            <iframe
              src={EMBED_URL}
              frameBorder="0"
              width="100%"
              height="700px"
              allowTransparency
              title="Metabase Dashboard"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
