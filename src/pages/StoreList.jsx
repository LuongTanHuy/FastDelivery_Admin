import React, { useState, useEffect, useCallback } from "react";
import { Table, Input, Image, Typography, message } from "antd";
import { BASE_URL_IMAGE } from "../api/configs";
import { getStores, searchStores } from "../api/Store";
import { SearchOutlined } from "@ant-design/icons";

const { Text } = Typography;

const StoreList = () => {
  const [stores, setStores] = useState([]);
  const [searchText, setSearchText] = useState("");

  const [filteredStores, setFilteredStores] = useState([]);
  const [loading, setLoading] = useState(false);

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

  const handleSearch = async (value) => {
    const keyword = value.trim();
    setSearchText(value); 
    if (!keyword) {
      setFilteredStores(stores);
    } else {
      try {
        const results = await searchStores(keyword);
        const mapped = results.map(mapStoreData);
        setFilteredStores(mapped);
      } catch (error) {
        console.error("Lỗi khi tìm kiếm cửa hàng:", error);
        message.error("Lỗi khi tìm kiếm cửa hàng!");
      }
    }
  };
  

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
        />
      ),
    },
    {
      title: "Thông tin",
      key: "info",
      render: (_, record) => (
        <div style={{ color: "#fff" }}>
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
        <div style={{ whiteSpace: "pre-wrap" }}>
          {categories.map((cat) => (
            <div key={cat}>{cat}</div>
          ))}
        </div>
      ),
    },
    {
      title: "Tổng sản phẩm đã bán",
      dataIndex: "totalSold",
      key: "totalSold",
      align: "center",
    },
    {
      title: "Doanh thu",
      dataIndex: "revenue",
      key: "revenue",
      align: "center",
    },
  ];

  return (
    <div style={{ padding: 20, backgroundColor: "#1a1a2e", color: "#fff", borderRadius: 10 }}>
      <h2 style={{ color: "#fff" }}>DANH SÁCH CỬA HÀNG</h2>
      <Input
        placeholder="Tìm kiếm cửa hàng..."
        onChange={(e) => handleSearch(e.target.value)}
        value={searchText}
        style={{ marginBottom: 20, width: 300 }}
        suffix={<SearchOutlined style={{ color: "#aaa" }} />}
      />

      <Table
        columns={columns}
        dataSource={filteredStores}
        rowKey="id"
        pagination={{ pageSize: 3 }}
        bordered
        loading={loading}
        style={{ color: "#fff" }}
      />
    </div>
  );
};

export default StoreList;
