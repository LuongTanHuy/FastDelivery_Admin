import React, { useState, useEffect, useCallback } from "react";
import { Table, Input, Image, Typography, message, Row, Col } from "antd";
import { BASE_URL_IMAGE } from "../api/configs";
import { getStores, searchStores } from "../api/Store";
import { SearchOutlined } from "@ant-design/icons";

const { Text } = Typography;

const StoreList = () => {
  const [stores, setStores] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [filteredStores, setFilteredStores] = useState([]);
  const [loading, setLoading] = useState(false);

  // Mapping dữ liệu server trả về thành dữ liệu UI cần
  const mapStoreData = (store) => ({
    id: store.id,
    image: store.image || "imagedefault.jpg",
    name: store.name || "Không rõ",
    address: store.address || "N/A",
    email: store.email || "N/A",
    phone: store.phone || "N/A",
    createdAt: store.createdAt || store.created_at
      ? new Date(store.createdAt || store.created_at).toLocaleDateString("vi-VN")
      : "Không xác định",
    listCategory: store.listCategory || store.categories || [],
    totalSold: store.totalOrdersSold || store.totalSold || 0,
    revenue: store.revenue || 0,
  });

  // Fetch tất cả store
  const fetchStoreList = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getStores();
      const mapped = data.map(mapStoreData);
      setStores(mapped);
      setFilteredStores(mapped);
    } catch (error) {
      console.error("Lỗi khi tải danh sách cửa hàng:", error);
      message.error("Không thể tải danh sách cửa hàng!");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStoreList();
  }, [fetchStoreList]);

  // Xử lý tìm kiếm
  const handleSearch = async (value) => {
    const keyword = value.trim();
    setSearchText(value);
    if (!keyword) {
      // Nếu không có từ khóa thì show lại danh sách gốc
      setFilteredStores(stores);
    } else {
      try {
        setLoading(true);
        const results = await searchStores(keyword);
        const mapped = results.map(mapStoreData);
        setFilteredStores(mapped);
      } catch (error) {
        console.error("Lỗi khi tìm kiếm cửa hàng:", error);
        message.error("Lỗi khi tìm kiếm cửa hàng!");
      } finally {
        setLoading(false);
      }
    }
  };

  // Cấu hình các cột cho bảng
  const columns = [
    {
      title: "Ảnh",
      dataIndex: "image",
      key: "image",
      align: "center",
      render: (src) => (
        <Image
          width={150}
          src={`${BASE_URL_IMAGE}${src}`}
          alt="store"
          fallback={`${BASE_URL_IMAGE}imagedefault.jpg`}
          style={{ objectFit: "cover", borderRadius: "8px" }}
        />
      ),
    },
    {
      title: "Thông tin",
      key: "info",
      render: (_, record) => (
        <div>
          <Text strong style={{ color: "#fff" }}>Tên cửa hàng: {record.name}</Text><br />
          <Text style={{ color: "#fff" }}>Địa chỉ: {record.address}</Text><br />
          <Text style={{ color: "#fff" }}>Email: {record.email}</Text><br />
          <Text style={{ color: "#fff" }}>Số điện thoại: {record.phone}</Text><br />
          <Text style={{ color: "#fff" }}>Ngày tạo: {record.createdAt}</Text>
        </div>
      ),
    },
    {
      title: "Danh mục kinh doanh",
      dataIndex: "listCategory",
      key: "listCategory",
      align: "center",
      render: (categories) => (
        <div style={{ whiteSpace: "pre-wrap", color: "#fff" }}>
          {categories.length > 0 ? categories.map((cat, index) => (
            <div key={index}>{cat}</div>
          )) : "Chưa có danh mục"}
        </div>
      ),
    },
    {
      title: "Tổng đã bán",
      dataIndex: "totalSold",
      key: "totalSold",
      align: "center",
      render: (totalSold) => (
        <Text style={{ color: "#fff" }}>{totalSold}</Text>
      )
    },
    {
      title: "Doanh thu",
      dataIndex: "revenue",
      key: "revenue",
      align: "center",
      render: (revenue) => (
        <Text style={{ color: "#fff" }}>{revenue.toLocaleString("vi-VN")} VND</Text>
      ),
    },
  ];

  return (
    <div style={{ padding: 20, backgroundColor: "#1a1a2e", color: "#fff", borderRadius: 10 }}>
      <h2 style={{ color: "#fff", textAlign: "center" }}>DANH SÁCH CỬA HÀNG</h2>

      <Row justify="start" style={{ marginBottom: 16 }}>
        <Col xs={24} sm={12} md={6}>
          <Input
            placeholder="Tìm kiếm cửa hàng..."
            onChange={(e) => handleSearch(e.target.value)}
            value={searchText}
            allowClear
            suffix={<SearchOutlined style={{ color: "#aaa" }} />}
          />
        </Col>
      </Row>

      <Table
        columns={columns}
        dataSource={filteredStores}
        rowKey="id"
        pagination={{ pageSize: 5 }}
        bordered
        loading={loading}
        scroll={{ x: 768 }}
      />
    </div>
  );
};

export default StoreList;
