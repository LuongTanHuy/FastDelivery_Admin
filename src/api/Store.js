import { requestWithAuth } from "./token";

// Lấy danh sách store (phân trang)
const getStores = async (page = 0, size = 20) => {
  try {
    const response = await requestWithAuth("GET", `/store/list?page=${page}&size=${size}`);
    return response;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách cửa hàng:", error);
    throw error;
  }
};

// Tìm kiếm store theo từ khóa
const searchStores = async (keyword) => {
  try {
    const response = await requestWithAuth("GET", `/store/search?search=${encodeURIComponent(keyword)}`);
    return response;
  } catch (error) {
    console.error("Lỗi khi tìm kiếm cửa hàng:", error);
    throw error;
  }
};

// Cập nhật thông tin store (form-data)
const updateStore = async ({ file, name, address, email, phone }) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("name", name);
    formData.append("address", address);
    formData.append("email", email);
    formData.append("phone", phone);

    const response = await requestWithAuth("POST", `/updateStore`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response;
  } catch (error) {
    console.error("❌ Lỗi khi cập nhật thông tin cửa hàng:", error);
    throw error;
  }
};

export { getStores, searchStores, updateStore };
