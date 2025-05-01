import React, { useState, useEffect } from "react";
import { Table, Tag, Image, Input, Space, Select, message } from "antd";
import Button from "antd/lib/button";
import "../css/Order.css";
import { getOrderItemsByStatus, updateStatusOrder } from "../api/Order";
import { BASE_URL_IMAGE } from "../api/configs";
// import { connectWebSocket } from "../api/chatClient";

const { Search } = Input;
const { Option } = Select;

function Orders() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const isPaidOrShipping = ["Đã Thanh Toán", "Đang Giao", "Đã Hủy"].includes(statusFilter);


   useEffect(() => {
      // fetchOrders();
      // const disconnect = connectWebSocket((msg) => {
      //   handleNewOrder(msg);
      // });
  
      // return () => {
      //   if (disconnect && typeof disconnect === "function") {
      //     disconnect();
      //   }
      // };
    }, [statusFilter]);

      // const handleNewOrder = (value) => {
      //     fetchOrders();
      //   switch (value) {
      //     case "You have a new order":
      //       message.success("🛒 Bạn có đơn hàng mới!");
      //       break;
      //     case "Your order has been delivered":
      //       message.success("🛒 Đã có đơn hàng được giao bạn hãy kiểm tra đi!");
      //       break;
      //     case "Your order has been canceled":
      //       message.success("🛒 Opps có đơn bị hủy!");
      //       break;
      //   }
      
      // };

  const fetchOrders = async () => {
    try {
      const status =
        statusFilter === "Đã Thanh Toán"
          ? 3
          : statusFilter === "Duyệt Đơn Hàng"
          ? 1
          : statusFilter === "Đang Giao"
          ? 2
          : statusFilter === "Đã Hủy"
          ? 4
          : null;

      const data = await getOrderItemsByStatus(status ?? 1);

      const mapped = data.map((item, index) => {
        const orders = item.orders || [];
        const paymentInfo = item.paymentInfo || {};
        const account = item.orders[0].accountDTO || {};
        const shipper = [];
        console.log(`Đơn hàng #${index} - orderDTO:`, data);

        return {
          paymentId: item.paymentId,
          orders,
          paymentInfo,
          account,
          shipper,
        };
      });

      setOrders(mapped);
      setFilteredOrders(mapped);
    } catch (err) {
      console.error("Lỗi tải đơn hàng:", err);
      message.error("Không thể tải danh sách đơn hàng!");
    }
  };

  // const convertStatus = (statusCode) => {
  //   switch (Number(statusCode)) {
  //     case 1:
  //       return "Duyệt Đơn Hàng";
  //     case 3:
  //       return "Đã Thanh Toán";
  //     case 2:
  //       return "Đang Giao";
  //     case 4:
  //       return "Đã Hủy";
  //     default:
  //       return "Không xác định";
  //   }
  // };

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

  const columns = [
    {
      title: "Thông Tin Người Mua",
      dataIndex: "customer",
      key: "customer",
      render: (_, record) => (
        <div>
          <strong>{record.account.username}</strong>
          <br />
          {record.account.address}
          <br />
          📞 {record.account.phone}
        </div>
      ),
    },
    {
      title: "Thông Tin Sản Phẩm",
      dataIndex: "product",
      key: "product",
      render: (_, record) => (
        <div
          className="product-scroll-container"
          style={{
            maxHeight: '200px',
            overflowY: 'auto',
            padding: '8px',
          }}
        >
          {record.orders.map((item, index) => (
            <div
              key={index}
              style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: '8px' }}
            >
              <Image
                width={50}
                src={item.productDTO.image ? `${BASE_URL_IMAGE}${item.productDTO.image}` : "https://via.placeholder.com/50"}
                fallback="https://via.placeholder.com/50"
              />
              <div>
                <strong>{item.productDTO.name}</strong>
                <br />
                Số lượng: {item.quantity}
                <br />
                Giá: {item.price?.toLocaleString()} đ
                <br />
                Ngày tạo: {item.createdAt?.slice(0, 10)}
              </div>
            </div>
          ))}
        </div>
      ),
    },
    ...(isPaidOrShipping
      ? [
          {
            title: "Thông Tin Shipper",
            dataIndex: "shipper",
            key: "shipper",
            render: (_, record) => (
              <div>
                <strong>{record.shipper}</strong>
                <br />
                📞 {record.shipper}
                <br />
                ✉️ {record.shipper}
                <br />
                {getShipperStatusTag(record.shipperStatus)}
              </div>
            ),
          },
        ]
      : [
          {
            title: "Xác nhận đơn hàng",
            dataIndex: "acceptOrder",
            key: "acceptOrder",
            render: (_, record) => (
              <div>
                <Button
                  type="primary"
                  onClick={() => {
                    updateStatusOrder(record.paymentId);
                    setStatusFilter("Đang Giao");
                    fetchOrders();
                  }}
                >
                  Xác nhận
                </Button>
              </div>
            ),
          },
        ]),
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
          <Option value="Duyệt Đơn Hàng">Duyệt Đơn Hàng</Option>
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