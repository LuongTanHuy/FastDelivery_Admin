import { API } from "../api/configs";

// Lưu tokens vào localStorage
const saveTokens = (accessToken, refreshToken) => {
  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("refreshToken", refreshToken);
};

// Lấy tokens từ localStorage
const getAccessToken = () => localStorage.getItem("accessToken");
const getRefreshToken = () => localStorage.getItem("refreshToken");

// Đăng nhập
const login = async (email, password) => {
  try {
    const response = await API.post("/auth/checkLogin", null, {
      params: { email, password },
    });

    if (response.data.accessToken) {
      saveTokens(response.data.accessToken, response.data.refreshToken);
    }

    return response.data;
  } catch (error) {
    console.error("Lỗi đăng nhập:", error.response?.data || error.message);
    return { error: "Sai tài khoản hoặc mật khẩu hoặc lỗi server" };
  }
};


// const login = async (email, password) => {
//   try {
//     const response = await API.post("/auth/checkLogin", null, {
//       params: { email, password },
//     });

//     if (response.data.accessToken) {
//       saveTokens(response.data.accessToken, response.data.refreshToken);
//     }

//     return response.data;
//   } catch (error) {
//     console.error("Lỗi đăng nhập:", error.response?.data || error.message);
//     return { error: "Sai tài khoản hoặc mật khẩu hoặc lỗi server" };
//   }
// };

// Làm mới token
const refreshAccessToken = async () => {
  try {
    const refreshToken = getRefreshToken();
    if (!refreshToken) throw new Error("Không tìm thấy refresh token");

    const response = await API.post("/refreshToken", { refreshToken });

    if (response.status === 200 && response.data.accessToken) {
      saveTokens(response.data.accessToken, refreshToken);
      return response.data.accessToken;
    }
  } catch (error) {
    console.error("Lỗi khi làm mới token:", error.response?.data || error.message);
    localStorage.clear(); // Xóa token khi refresh thất bại
    return null;
  }
};

// Gửi request có authentication
const requestWithAuth = async (method, url, data = null) => {
  try {
    let accessToken = getAccessToken();
    const headers = { Authorization: `${accessToken}` };

    const response = await API.request({ method, url, data, headers });
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      const newAccessToken = await refreshAccessToken();
      if (newAccessToken) {
        return requestWithAuth(method, url, data);
      } else {
        localStorage.clear();
        throw new Error("Phiên làm việc hết hạn. Vui lòng đăng nhập lại.");
      }
    }
    throw error;
  }
};


// Tự động làm mới token mỗi 15 phút
const startTokenRefreshInterval = () => {
  setInterval(async () => {
    await refreshAccessToken();
  }, 15 * 60 * 1000);
};

// lấy thông tin tài khoản
const getUserInfo = async () => {
  const token = localStorage.getItem("accessToken");
  try {
    const response = await fetch("http://localhost:8080/api/v2/web/account/information", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `${token}`,
      },
    });

    if (!response.ok) throw new Error(`Lỗi từ server: ${response.status}`);

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Lỗi khi lấy thông tin tài khoản:", error);
  }
};



export { login, refreshAccessToken, requestWithAuth, startTokenRefreshInterval, getUserInfo };
