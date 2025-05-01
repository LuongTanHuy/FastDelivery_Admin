// // chatClient.js
// import { Client } from "@stomp/stompjs";
// import SockJS from "sockjs-client";
// // import { getIdStore } from "./token";
// import {IPS} from "../api/configs";
// const SOCKET_URL = "http://"+IPS+":8080/ws";
// let stompClient = null;
// const idStore = localStorage.getItem("idStore");

// export const connectWebSocket = (onMessageReceived) => {
// console.log("idStore"+idStore);

//   stompClient = new Client({
//     webSocketFactory: () => new SockJS(SOCKET_URL),
//     reconnectDelay: 5000,
//     debug: (str) => console.log('[STOMP]', str),

//     onConnect: () => {
//       console.log("✅ Kết nối WebSocket thành công");

//       // ✅ Sử dụng đường dẫn đúng để subscribe
//       const subscriptionPath = `/queue/store-${idStore}`;
//       stompClient.subscribe(subscriptionPath, (message) => {
//         onMessageReceived(message.body);
//       });
//     },

//     onStompError: (frame) => {
//       console.error("❌ Lỗi STOMP:", frame);
//     },

//     onWebSocketError: (event) => {
//       console.error("❌ Lỗi WebSocket:", event);
//     },

  
//   });
  
//   stompClient.activate();
  
//   return () => {
//       stompClient.deactivate();
//     };
  
// };

// // export const sendPrivateMessage = (sender, receiver, content) => {
// //   if (stompClient && stompClient.connected) {
// //     const message = {
// //       sender,
// //       receiver,
// //       content,
// //     };
// //     stompClient.publish({
// //       destination: "/app/chat", 
// //       body: JSON.stringify(message),
// //     });
// //     console.log("📤 Tin nhắn đã gửi:", message);
// //   } else {
// //     console.error("🚫 Không thể gửi tin nhắn, WebSocket chưa kết nối");
// //   }
// // };

// export const disconnectWebSocket = () => {
//   if (stompClient) {
//     stompClient.deactivate();
//     console.log("❎ WebSocket đã ngắt kết nối");
//   }
// };
