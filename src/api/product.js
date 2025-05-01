import { requestWithAuth } from "../api/token";

// Lấy danh sách sản phẩm
const getProducts = async (page = 0, size = 20) => {
  return await requestWithAuth("GET", `/product?page=${page}&size=${size}`);
};

// Tìm kiếm sản phẩm theo tên
const searchProduct = async (search) => {
  return await requestWithAuth("POST", "/product/search", { search });
};

// Lọc sản phẩm theo danh mục
const filterProduct = async (idCategory, page = 0, size = 20) => {
  return await requestWithAuth("POST", "/product/filter", { idCategory, page, size });
};

/**
 * @param {Object} payload - Dữ liệu sản phẩm
 * @param {number} payload.idCategory - ID danh mục sản phẩm
 * @param {string} payload.name - Tên sản phẩm
 * @param {number} payload.price - Giá sản phẩm
 * @param {File} payload.file - File hình ảnh sản phẩm (File object)
 */
const addProduct = async ({ idCategory, name, price, file }) => {
  const formData = new FormData();
  formData.append("idCategory", String(idCategory));
  formData.append("name", String(name));
  formData.append("price", String(price));
  formData.append("file", file);

  
  return await requestWithAuth("post", "/product/add", formData);
};

// Cập nhật sản phẩm
// const updateProduct = async (idProduct, idCategory, name, price, file) => {
//   const url = `/product/update`;
//   const formData = new FormData();
//   formData.append("idProduct", idProduct);
//   formData.append("idCategory", idCategory);
//   formData.append("name", name);
//   formData.append("price", price);
//   formData.append("file", file);

//   return await requestWithAuth("POST", url, formData, {
//     headers: { "Content-Type": "multipart/form-data" },
//   });
// };
// Cập nhật sản phẩm
const updateProduct = async (idProduct, idCategory, name, price, file) => {
  const formData = new FormData();
  formData.append("idProduct", idProduct);
  formData.append("idCategory", String(idCategory));
  formData.append("name", name);
  formData.append("price", price);
  formData.append("file", file);
  return await requestWithAuth("POST", "/product/update", formData);
};



/**
 * @param {number} idProduct - ID của sản phẩm cần thay đổi trạng thái
 * @returns {Promise<any>} - Kết quả từ server
 */
// product.js
const changeProductStatus = async (idProduct) => {
  return await requestWithAuth("GET", `/product/change-status/${idProduct}`);
};

export {
  getProducts,
  searchProduct,
  filterProduct,
  addProduct,
  updateProduct,
  changeProductStatus,
};
