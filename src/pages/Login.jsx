import React, { useState, memo } from "react";
import { useNavigate } from "react-router-dom";
import { login, getUserInfo } from "../api/account";
import { IoMail, IoEye, IoEyeOff } from "react-icons/io5";
import { FiLock } from "react-icons/fi";
import logo from "../assets/icons/logoApp.png";

const Login = () => {
  const [isPasswordShown, setIsPasswordShown] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const slogans = [
    "🚀 Giao hàng nhanh – Tận tay khách 🚚",
    "⚡ Đặt món là có – Không chờ không đợi!",
    "💨 Nhanh như chớp – Gọn như mơ!",
    "🍜 Món ngon tới liền – Ship thần tốc!",
    "💎 Chốt đơn lẹ – Giao liền tay!",
    "🛵 Ở đâu có đó – Ở xa vẫn tới!",
    "😎 Thèm gì có đó – Cứ để app lo!",
    "🔥 Nhanh hơn cả người yêu cũ trở mặt!"
  ];
  const randomSlogan = slogans[Math.floor(Math.random() * slogans.length)];

  const validateEmail = () => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = () => password.length >= 8;

  const handleLogin = async () => {
    if (!validateEmail() || !validatePassword()) {
      setErrorMessage("Vui lòng nhập đúng thông tin!");
      return;
    }
    try {
      setLoading(true);
      setErrorMessage("");
      const result = await login(email, password);
      if (result?.accessToken) {
        const userInfo = await getUserInfo();
        localStorage.setItem("userInfo", JSON.stringify(userInfo)); // ✅ Save to localStorage

        if (userInfo.role?.includes("admin")) navigate("/dashboards");
        else if (userInfo.role?.includes("store")) navigate("/shopdashboards");
        else setErrorMessage("Không xác định vai trò người dùng!");
      } else {
        setErrorMessage("Sai tài khoản hoặc mật khẩu hoặc đã bị khóa");
      }
    } catch (error) {
      setErrorMessage("Lỗi hệ thống! Vui lòng thử lại sau.");
      console.error("Lỗi login:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  const CardLogo = memo(() => (
    <div style={styles.leftPanel}>
      <img src={logo} alt="Logo App" />
      <div style={styles.marqueeCenterWrapper}>
        <p style={styles.marqueeText}>{randomSlogan}</p>
      </div>
    </div>
  ));

  return (
    <div style={styles.splitContainer}>
      <CardLogo />
      <div style={styles.formContainer}>
        <h2 style={styles.loginTitle}>Đăng nhập</h2>
        <div style={styles.containerInput}>
          <label style={styles.textTitleInput}>Email</label>
          <div style={styles.lineInput}>
            <span style={styles.inputIcon}><IoMail size={20} color="#8d9a9b" /></span>
            <input
              type="email"
              placeholder="Nhập email của bạn!"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={handleKeyDown}
              style={styles.textInput}
            />
          </div>
        </div>

        <div style={styles.containerInput}>
          <label style={styles.textTitleInput}>Mật khẩu</label>
          <div style={styles.lineInput}>
            <span style={styles.inputIcon}><FiLock size={20} color="#8d9a9b" /></span>
            <input
              type={isPasswordShown ? "text" : "password"}
              placeholder="Nhập mật khẩu!"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
              style={styles.textInput}
            />
            <button
              onClick={() => setIsPasswordShown(!isPasswordShown)}
              style={styles.iconShowPassword}
            >
              {isPasswordShown ? <IoEyeOff size={20} color="#8d9a9b" /> : <IoEye size={20} color="#8d9a9b" />}
            </button>
          </div>
        </div>

        {errorMessage && <div style={styles.errorText}>{errorMessage}</div>}

        <button onClick={handleLogin} style={styles.buttonSubmit} disabled={loading}>
          {loading ? "Đang tải..." : "Tiếp tục"}
        </button>
      </div>
    </div>
  );
};

const styles = {
  splitContainer: {
    display: "flex",
    minHeight: "100vh",
    backgroundColor: "#f5f6fa",
  },
  leftPanel: {
    flex: 1,
    backgroundColor: "#fff5d7",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
    position: "relative",
  },
  imageIllustration: {
    maxWidth: "90%",
    maxHeight: "300px",
    objectFit: "cover",
  },
  marqueeCenterWrapper: {
    position: "absolute",
    bottom: 20,
    left: "50%",
    transform: "translateX(-50%)",
    overflow: "hidden",
    whiteSpace: "nowrap",
    maxWidth: "100%",
    width: "470px",
  },
  marqueeText: {
    display: "inline-block",
    fontSize: "18px",
    fontWeight: "600",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    animation: "marquee 10s linear infinite",
    color: "#333",
    marginBottom: "80px",
  },
  formContainer: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 40,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    maxWidth: 500,
    margin: "auto",
    borderRadius: 12,
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  },
  loginTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#222",
  },
  textTitleInput: {
    color: "#555",
    fontSize: "16px",
    marginBottom: "6px",
    display: "block",
    textAlign: "left",
    width: "100%",
  },
  containerInput: {
    marginBottom: "15px",
    width: "100%",
  },
  lineInput: {
    display: "flex",
    alignItems: "center",
    border: "1px solid #ccc",
    borderRadius: "8px",
    padding: "14px",
    backgroundColor: "#fff",
    position: "relative",
  },
  textInput: {
    flex: 1,
    border: "none",
    outline: "none",
    fontSize: "16px",
    color: "#333",
    paddingLeft: "35px",
    height: "23px",
    alignItems: "center",
  },
  inputIcon: {
    position: "absolute",
    left: "10px",
    top: "50%",
    transform: "translateY(-50%)",
  },
  iconShowPassword: {
    border: "none",
    background: "none",
    cursor: "pointer",
    position: "absolute",
    right: "10px",
    top: "50%",
    transform: "translateY(-50%)",
  },
  buttonSubmit: {
    marginTop: "20px",
    backgroundColor: "#fac125cb",
    color: "#fff",
    padding: "12px 20px",
    fontSize: "16px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    width: "100%",
  },
  errorText: {
    color: "red",
    fontSize: "14px",
    marginTop: "-8px",
    marginBottom: "12px",
    textAlign: "center",
  }
};

const styleSheet = document.styleSheets[0];
const keyframes = `
  @keyframes marquee {
    0%   { transform: translateX(100%); }
    100% { transform: translateX(-100%); }
  }
`;
styleSheet.insertRule(keyframes, styleSheet.cssRules.length);

export default Login;