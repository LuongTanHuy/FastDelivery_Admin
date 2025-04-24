import React, { useState, useEffect, useCallback } from "react";
import { Table, Tag, Image, Input, Space, Select, message } from "antd";
import "../css/Order.css";
import { getOrderItemsByStatus } from "../api/Order";
import { BASE_URL_IMAGE } from "../api/configs";

const { Search } = Input;
const { Option } = Select;

function Orders() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const fetchOrders = useCallback(async () => {
    try {
      const status = statusFilter === "Đã Thanh Toán" ? 1
                   : statusFilter === "Chưa Thanh Toán" ? 0
                   : statusFilter === "Đang Giao" ? 2
                   : statusFilter === "Đã Hủy" ? 3
                   : null;

      const data = await getOrderItemsByStatus(status ?? 1);

      const mapped = data.map((item, index) => {
        const order = item.orderDTO || {};
        const account = order.accountDTO || {};
        const product = item.productDTO || {};

        return {
          id: index,
          customer: account.username || "N/A",
          address: account.address || "N/A",
          phone: account.phone || "N/A",
          product: product.name || "Sản phẩm",
          quantity: item.quantity,
          price: item.price,
          createdAt: order.createdAt?.slice(0, 10),
          image: product.image ? `${BASE_URL_IMAGE}${product.image}` : "",
          shipper: order.shipperName || "Không có",
          shipperPhone: order.shipperPhone || "N/A",
          shipperEmail: order.shipperEmail || "N/A",
          shipperStatus: order.shipperStatus || "Chưa nhận đơn",
          status: convertStatus(order.status),
        };
      });

      setOrders(mapped);
      setFilteredOrders(mapped);
    } catch (err) {
      console.error("Lỗi tải đơn hàng:", err);
      message.error("Không thể tải danh sách đơn hàng!");
    }
  }, [statusFilter]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const convertStatus = (statusCode) => {
    switch (Number(statusCode)) {
      case 0:
        return "Chưa Thanh Toán";
      case 1:
        return "Đã Thanh Toán";
      case 2:
        return "Đang Giao";
      case 3:
        return "Đã Hủy";
      default:
        return "Không xác định";
    }
  };

  const handleSearch = (value) => {
    setSearchText(value);
    const filteredData = orders.filter((order) =>
      order.customer.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredOrders(filteredData);
  };

  const handleFilterChange = (value) => {
    setStatusFilter(value);
  };

  const getShipperStatusTag = (status) => {
    switch (status) {
      case "Đã nhận đơn":
        return <Tag color="green">{status}</Tag>;
      case "Chưa nhận đơn":
        return <Tag color="orange">{status}</Tag>;
      case "Bị hủy đơn":
        return <Tag color="red">{status}</Tag>;
      default:
        return <Tag>{status}</Tag>;
    }
  };

  const formatCurrency = (value) =>
    new Intl.NumberFormat("vi-VN").format(value * 1000) + " VND";

  const columns = [
    {
      title: "Thông Tin Người Mua",
      dataIndex: "customer",
      key: "customer",
      render: (_, record) => (
        <div>
          <strong>{record.customer}</strong>
          <br />
          {record.address}
          <br />
          📞 {record.phone}
        </div>
      ),
    },
    {
      title: "Thông Tin Sản Phẩm",
      dataIndex: "product",
      key: "product",
      render: (_, record) => (
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Image width={50} src={record.image} fallback="https://via.placeholder.com/50" />
          <div>
            <strong>{record.product}</strong>
            <br />
            Số lượng: {record.quantity}
            <br />
            Giá: {formatCurrency(record.price)}
            <br />
            Ngày tạo: {record.createdAt}
          </div>
        </div>
      ),
    },
    {
      title: "Thông Tin Shipper",
      dataIndex: "shipper",
      key: "shipper",
      render: (_, record) => (
        <div>
          <strong>{record.shipper}</strong>
          <br />
          📞 {record.shipperPhone}
          <br />
          ✉️ {record.shipperEmail}
          <br />
          {getShipperStatusTag(record.shipperStatus)}
        </div>
      ),
    },
  ];

  return (
    <div className="orders-container">
      <h2 className="orders-title">QUẢN LÝ ĐƠN HÀNG</h2>

      <Space className="orders-filter">
        <Search
          placeholder="Tìm theo tên khách hàng..."
          onSearch={handleSearch}
          style={{ width: 250 }}
          value={searchText}
          onChange={(e) => handleSearch(e.target.value)}
        />
        <Select
          placeholder="Tình Trạng"
          style={{ width: 200 }}
          onChange={handleFilterChange}
          value={statusFilter}
          allowClear
        >
          <Option value="Chưa Thanh Toán">Chưa Thanh Toán</Option>
          <Option value="Đã Thanh Toán">Đã Thanh Toán</Option>
          <Option value="Đang Giao">Đang Giao</Option>
          <Option value="Đã Hủy">Đã Hủy</Option>
        </Select>
      </Space>

      <Table
        columns={columns}
        dataSource={filteredOrders}
        rowKey="id"
        pagination={{ pageSize: 3 }}
        bordered
      />
    </div>
  );
}

export default Orders;
