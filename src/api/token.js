import { API } from "../api/configs";

// Lưu tokens vào localStorage
const saveTokens = (accessToken, refreshToken) => {
  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("refreshToken", refreshToken);
};
const saveIdStore = (idStore) => {
  localStorage.setItem("idStore", idStore);
};

// Lấy tokens từ localStorage
const getAccessToken = () => localStorage.getItem("accessToken");
const getRefreshToken = () => localStorage.getItem("refreshToken");
const getIdStore = () => localStorage.getItem("idStore");

// Làm mới token
const refreshAccessToken = async () => {
  try {
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      console.error("Không tìm thấy refresh token!");
      return null;
    }

    const response = await API.post("/refreshToken", { refreshToken });

    if (response.status === 200 && response.data.accessToken) {
      saveTokens(response.data.accessToken, refreshToken);
      return response.data.accessToken;
    }
  } catch (error) {
    console.error("Lỗi khi làm mới token:", error.response?.data || error.message);
    localStorage.removeItem("accessToken"); 
    return null;
  }
};


// Gửi request có authentication
const requestWithAuth = async (method, url, data = null, config = {}) => {
  try {
    const accessToken = getAccessToken();
    if (!accessToken) throw new Error("Không có token!");

    const isFormData = data instanceof FormData;

    const headers = {
      Authorization: accessToken,
      ...(!isFormData ? { "Content-Type": "application/json" } : {}),
      ...config.headers,
    };

    const response = await API.request({
      method,
      url,
      data,
      headers,
      ...config,
    });

    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      const newAccessToken = await refreshAccessToken();
      if (newAccessToken) return requestWithAuth(method, url, data, config);

      localStorage.clear();
      throw new Error("Phiên làm việc hết hạn. Vui lòng đăng nhập lại.");
    }
    throw error;
  }
};



// Tự động làm mới token mỗi 15 phút
const startTokenRefreshInterval = () => {
  setInterval(async () => {
    console.log("Làm mới access token...");
    await refreshAccessToken();
  }, 15 * 60 * 1000);
};

export { getIdStore,saveIdStore, saveTokens, getAccessToken, getRefreshToken, refreshAccessToken, requestWithAuth, startTokenRefreshInterval };
