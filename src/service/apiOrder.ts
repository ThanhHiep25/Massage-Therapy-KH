import axios from "axios";
import { Order } from "../interface/Order_interface";

// Khởi tạo axios instance
const api = axios.create({
  //baseURL: "https://massage-therapy-production.up.railway.app/api",
  baseURL: import.meta.env.VITE_URL_SERVER,
  withCredentials: true, // Đảm bảo gửi cookie tự động
});

// Thêm sản phẩm
export const createOrder = (data: Order) => {
  try {
    return api.post("/orders/create", data);
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw error;
    } else {
      throw new Error("Khong the ket noi den server");
    }
  }
};

// Lấy sản phẩm
export const getAllOrders = async () => {
  try {
    const response = await api.get("/orders");
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw error;
    } else {
      throw new Error("Khong the ket noi den server");
    }
  }
};

// Xóa sản phẩm
export const deleteOrder = async (id: number) => {
  try {
    const response = await api.delete(`/orders/${id}`);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw error;
    } else {
      throw new Error("Khong the ket noi den server");
    }
  }
};

// Cập nhật thông tin đơn hàng
export const updateOrder = async (id: number, data: Order) => {
  try {
    const response = await api.put(`/orders/${id}`, data);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw error;
    } else {
      throw new Error("Khong the ket noi den server");
    }
  }
};
