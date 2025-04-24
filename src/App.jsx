import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { Layout } from "antd";

import Sidebar from "./components/Sidebar";
import Foods from "./pages/Foods";
import Orders from "./pages/Orders";
import Statistics from "./pages/Statistics";
import AccountList from "./pages/AccountList";
import StoreList from "./pages/StoreList";
import BannerManagement from "./pages/BannerManagement";
import Dashboard from "./pages/Dashboards";
import NotFound from "./pages/NotFound";
import OnlineUsers from "./pages/OnlineUsers";
import CustomerSupports from "./pages/CustomerSupports";
import ShopDashboards from "./pages/ShopDashBoards";
import NotificationSender from "./pages/NotificationSenders";
import Login from "./pages/Login";

import ProtectedRoute from "./middleware/ProtectedRoute";
import { getUserInfo } from "./api/account";

function App() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const [redirectPath, setRedirectPath] = useState(null);

  useEffect(() => {
    const handleRedirect = async () => {
      if (location.pathname === "/") {
        try {
          const cachedUser = localStorage.getItem("userInfo");
          const user = cachedUser ? JSON.parse(cachedUser) : await getUserInfo();

          if (!cachedUser && user) {
            localStorage.setItem("userInfo", JSON.stringify(user));
          }

          if (user?.role?.includes("admin")) {
            setRedirectPath("/dashboards");
          } else if (user?.role?.includes("store")) {
            setRedirectPath("/shopdashboards");
          } else {
            setRedirectPath("/login");
          }
        } catch {
          setRedirectPath("/login");
        }
      }
    };
    handleRedirect();
  }, [location.pathname]);

  if (location.pathname === "/" && redirectPath === null) {
    return <div>Đang kiểm tra đăng nhập...</div>; // hoặc spinner
  }

  if (location.pathname === "/" && redirectPath) {
    return <Navigate to={redirectPath} />;
  }

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {location.pathname !== "/login" && (
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      )}

      <Layout
        style={{
          marginLeft: location.pathname !== "/login" ? (collapsed ? 80 : 200) : 0,
          transition: "margin-left 0.3s ease",
          padding: "15px",
        }}
      >
        <Layout.Content
          style={{
            background: "#f0f2f5",
            padding: "20px",
            minHeight: "100vh",
          }}
        >
          <Routes>
            <Route path="/login" element={<Login />} />

            {/* Protected Routes */}
            <Route path="/dashboards" element={<ProtectedRoute roles={["admin"]}><Dashboard /></ProtectedRoute>} />
            <Route path="/orders" element={<ProtectedRoute roles={["store"]}><Orders /></ProtectedRoute>} />
            <Route path="/foods" element={<ProtectedRoute roles={["store"]}><Foods /></ProtectedRoute>} />
            <Route path="/statistics" element={<ProtectedRoute roles={["store"]}><Statistics /></ProtectedRoute>} />
            <Route path="/accounts" element={<ProtectedRoute roles={["admin"]}><AccountList /></ProtectedRoute>} />
            <Route path="/storelist" element={<ProtectedRoute roles={["admin"]}><StoreList /></ProtectedRoute>} />
            <Route path="/bannermanagements" element={<ProtectedRoute roles={["admin"]}><BannerManagement /></ProtectedRoute>} />
            <Route path="/useronlines" element={<ProtectedRoute roles={["admin"]}><OnlineUsers /></ProtectedRoute>} />
            <Route path="/customersupports" element={<ProtectedRoute roles={["admin"]}><CustomerSupports /></ProtectedRoute>} />
            <Route path="/shopdashboards" element={<ProtectedRoute roles={["store"]}><ShopDashboards /></ProtectedRoute>} />
            <Route path="/notifications" element={<ProtectedRoute roles={["admin"]}><NotificationSender /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout.Content>
      </Layout>
    </Layout>
  );
}

function AppWrapper() {
  useEffect(() => {
    const BASE_URL = "http://localhost:3002";
    const script = document.createElement("script");
    script.src = `${BASE_URL}/packs/js/sdk.js`;
    script.defer = true;
    script.async = true;

    script.onload = () => {
      if (window.chatwootSDK) {
        window.chatwootSDK.run({
          websiteToken: "wMt6YXkaEMcuKX8BvmM5Zixr",
          baseUrl: BASE_URL,
        });
      }
    };

    document.body.appendChild(script);

    return () => {
      const chatBubble = document.querySelector("iframe[src*='chatwoot']");
      if (chatBubble) chatBubble.remove();
    };
  }, []);

  return (
    <Router>
      <App />
    </Router>
  );
}

export default AppWrapper;




// function AppWrapper() {
//   useEffect(() => {
//     const BASE_URL = "http://localhost:3002";
//     const script = document.createElement("script");
//     script.src = `${BASE_URL}/packs/js/sdk.js`;
//     script.defer = true;
//     script.async = true;

//     script.onload = () => {
//       if (window.chatwootSDK) {
//         window.chatwootSDK.run({
//           websiteToken: "wMt6YXkaEMcuKX8BvmM5Zixr",
//           baseUrl: BASE_URL,
//         });
//       }
//     };

//     document.body.appendChild(script);

//     return () => {
//       // Xóa widget khi unmount nếu cần
//       const chatBubble = document.querySelector("iframe[src*='chatwoot']");
//       if (chatBubble) chatBubble.remove();
//     };
//   }, []);

//   return (
//     <Router>
//       <App />
//     </Router>
//   );
// }