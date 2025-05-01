import React, { useState, useEffect } from "react";
import { Table, Input, Tag, Button, Image, message, Row, Col } from "antd";
import { LockOutlined, UnlockOutlined } from "@ant-design/icons";
import "antd/dist/reset.css";
import { getAllAccounts, searchAccounts } from "../api/ListAccount";
import { BASE_URL_IMAGE } from "../api/configs";

const { Search } = Input;

const AccountList = () => {
  const [searchText, setSearchText] = useState("");
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const data = await getAllAccounts();
      const mapped = data.map((acc) => ({
        id: acc.id,
        name: acc.username || "Không rõ",
        email: acc.email || "Chưa có",
        phone: acc.phone || "N/A",
        image: acc.image || "imagedefault.jpg",
        joinDate: acc.created_at ? new Date(acc.created_at).toLocaleDateString("vi-VN") : "Không xác định",
        address: acc.address || "Không có địa chỉ",
        role: acc.role || "user",
        status: acc.permission ? "active" : "inactive",
        totalOrders: acc.totalOrderBought || 0,
        deliveredOrders: acc.totalOrderDelivered || 0,
      }));
      setAccounts(mapped);
    } catch (error) {
      message.error("Không thể tải danh sách tài khoản!");
    }
  };

  const handleSearch = async (e) => {
    const value = e.target.value;
    setSearchText(value);
    const regex = /^[a-zA-Z0-9\sÀ-ỹ]*$/;

    if (!regex.test(value)) {
      message.error("Từ khóa tìm kiếm không hợp lệ!");
      return;
    }

    try {
      if (value.trim() === "") {
        fetchAccounts();
      } else {
        const results = await searchAccounts(value);
        const mapped = results.map((acc) => ({
          id: acc.id,
          name: acc.username || "Không rõ",
          email: acc.email || "Chưa có",
          phone: acc.phone || "N/A",
          image: acc.image || "imagedefault.jpg",
          joinDate: acc.created_at ? new Date(acc.created_at).toLocaleDateString("vi-VN") : "Không xác định",
          address: acc.address || "Không có địa chỉ",
          role: acc.role || "user",
          status: acc.permission ? "active" : "inactive",
          totalOrders: acc.totalOrderBought || 0,
          deliveredOrders: acc.totalOrderDelivered || 0,
        }));
        setAccounts(mapped);
      }
    } catch (error) {
      message.error("Lỗi khi tìm kiếm tài khoản");
    }
  };

  const toggleStatus = (id) => {
    setAccounts((prev) =>
      prev.map((acc) =>
        acc.id === id ? { ...acc, status: acc.status === "active" ? "inactive" : "active" } : acc
      )
    );
  };

  const columns = [
    {
      title: "Ảnh",
      dataIndex: "image",
      key: "image",
      align: "center",
      render: (src) => <Image width={50} src={`${BASE_URL_IMAGE}${src}`} fallback={`${BASE_URL_IMAGE}imagedefault.jpg`} />,
    },
    {
      title: "Thông tin",
      dataIndex: "info",
      key: "info",
      render: (_, record) => (
        <div>
          <strong>Tài Khoản: {record.name}</strong>
          <br /> Email: {record.email}
          <br /> Điện Thoại: {record.phone}
          <br /> Ngày Tham Gia: {record.joinDate}
          <br /> Địa Chỉ: {record.address}
        </div>
      ),
    },
    {
      title: "Đối tượng",
      dataIndex: "role",
      key: "role",
      align: "center",
      render: (role) => <Tag color={role === "user" ? "blue" : role === "admin" ? "red" : "green"}>{role}</Tag>,
    },
    {
      title: "Tổng đơn hàng đã mua",
      dataIndex: "totalOrders",
      key: "totalOrders",
      align: "center",
    },
    {
      title: "Tổng đơn hàng đã giao",
      dataIndex: "deliveredOrders",
      key: "deliveredOrders",
      align: "center",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (_, record) => (
        <Button
          type="primary"
          icon={record.status === "active" ? <UnlockOutlined /> : <LockOutlined />}
          onClick={() => toggleStatus(record.id)}
          style={{
            fontSize: "18px",
            width: "80px",
            height: "35px",
            backgroundColor: "white",
            borderColor: record.status === "active" ? "green" : "red",
            color: record.status === "active" ? "green" : "red",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            margin: "0 auto",
            borderRadius: "5px",
          }}
        ></Button>
      ),
    },
  ];

  return (
    <div style={{ padding: 20, backgroundColor: "#1e1e2e", color: "white", borderRadius: 10 }}>
      <h2 style={{ color: "white", fontWeight: "bold", textAlign: "center" }}>DANH SÁCH TÀI KHOẢN</h2>

      <Row justify="start" style={{ marginBottom: 16 }}>
        <Col xs={24} sm={12} md={6}>
          <Search
            placeholder="Tìm kiếm..."
            onChange={handleSearch}
            value={searchText}
            style={{ width: "100%" }}
          />
        </Col>
      </Row>

      {accounts.length === 0 ? (
        <p style={{ color: "white", textAlign: "center" }}>Không có tài khoản nào phù hợp.</p>
      ) : (
        <Table
          columns={columns}
          dataSource={accounts}
          rowKey="id"
          pagination={{ pageSize: 4 }}
          bordered
          scroll={{ x: 768 }}
        />
      )}
    </div>
  );
};

export default AccountList;
