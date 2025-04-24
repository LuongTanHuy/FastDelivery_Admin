import React from "react";
import { Card, Col, Row } from "antd";

const Statistics = () => {
  const EMBED_URL = "http://localhost:3000/public/dashboard/0ea431fe-86ab-489c-9541-7f89b6aad27b";

  return (
    <div style={{ padding: 20, background: "#F5F5F5", minHeight: "100vh" }}>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card
            title={
              <h2 style={{ marginBottom: 0, fontSize: "20px", fontWeight: 600 }}>
                Thống kê
              </h2>
            }
          >
            <iframe
              src={EMBED_URL}
              frameBorder="0"
              width="100%"
              height="700px"
              allowTransparency
              title="Metabase Dashboard"
              style={{ borderRadius: 8 }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Statistics;
