import { requestWithAuth } from "../api/token";
import axios from "axios";
import {BASE_URL_API} from "./configs"

// lấy danh sách đơn hàng theo trạng thái
const getOrderItemsByStatus = async (statusOrder) => {
  try {
    const response = await requestWithAuth(
      "get",
      `/order`,
      null,
      {
        params: {
          statusOrder: statusOrder,
        },
      }
    );
    return response;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách Order:", error.message);
    throw error;
  }
};

const updateStatusOrder = async (idOrder) => {
  console.log("updateStatusOrder: " + idOrder);
  try {
    const response = await axios.put(
      `${BASE_URL_API}/order/acceptOrder?idOrder=${idOrder}&status=2`,
      {},
      {
        headers: {
          'Content-Type': 'application/json'
        },
      }
    );

    return response;
  } catch (error) {
    console.info("updateStatusError: " + error);
    throw error;
  }
};

export {getOrderItemsByStatus,updateStatusOrder};
