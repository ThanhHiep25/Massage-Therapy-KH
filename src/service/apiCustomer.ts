import axios from "axios";
import { CustomerData } from "../interface/CustomerData_interface";

// Khởi tạo axios instance
const api = axios.create({
  //baseURL: "https://massage-therapy-production.up.railway.app/api",
 baseURL: import.meta.env.VITE_URL_SERVER,
  withCredentials: true, // Đảm bảo gửi cookie tự động
});

// Customers - Khách Hàng -----------------------------------------------------------------------------------------------------------
// Lấy danh sách khách hàng
export const getCustomers = async () => {
    try {
      const response = await api.get("/auth/all");
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        throw error;
      } else {
        throw new Error("Failed to fetch customers.");
      }
    }
  };
  
  // Khách hàng đăng ký tài khoản
  export const addCustomer = async (data: CustomerData) => {
    try {
      const response = await api.post("/auth/register", data);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        throw error;
      } else {
        throw new Error("Failed to add customer.");
      }
    }
  };
  
  // Thêm khách hàng
  export const addCustomerNoOTP = async (data: CustomerData) => {
    try {
      const response = await api.post("/auth/create", data);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        throw error; // ⚡ Throw toàn bộ lỗi để giữ nguyên context
      } else {
        throw new Error("Failed to add customer.");
      }
    }
  };
  
  // Xoá khách hàng
  export const deleteCustomer = async (id: number) => {
    try {
      const response = await api.delete(`/auth/${id}`);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        throw error;
      } else {
        throw new Error("Failed to delete customer.");
      }
    }
  };
  
  // Khóa tài khoản
  export const blockCustomer = async (id: number) => {
    try {
      const response = await api.put(`/auth/${id}/block`);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        throw error;
      } else {
        throw new Error("Failed to block customer.");
      }
    }
  };
  
  // Cập nhật thông tin khách hàng
  export const updateCustomer = async (id: number, data: any) => {
    try {
      const response = await api.put(`/auth/${id}`, data);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        throw error;
      } else {
        throw new Error("Failed to update customer.");
      }
    }
  };
  
  // Activate customer
  export const activeCus = async (id: number) => {
    try {
      const response = await api.put(`/auth/${id}/activate`);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        throw error;
      } else {
        throw new Error("Failed to active customer.");
      }
    }
  };
  
  // Deactive customer
  
  export const deactiveCus = async (id: number) => {
    try {
      const response = await api.put(`/auth/${id}/deactivated`);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        throw error;
      } else {
        throw new Error("Failed to deactive customer.");
      }
    }
  };
  
  