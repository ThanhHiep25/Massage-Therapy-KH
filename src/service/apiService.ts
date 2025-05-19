

import axios from "axios";
import { RegisterUserData } from "../interface/RegisterUserData_interface";
import { LoginUserData } from "../interface/LoginUserData_interface";
import { VerifyOtpData } from "../interface/VerifyOtpData_interface";
import { CategoryForm, ServiceSPAForm } from "../interface/ServiceSPA_interface";

// Khởi tạo axios instance
const api = axios.create({
  //baseURL: "https://massage-therapy-production.up.railway.app/api",
  baseURL: import.meta.env.VITE_URL_SERVER,
  withCredentials: true, // Đảm bảo gửi cookie tự động
});

// Auth - Đăng nhập, Đăng ký, Đăng xuất -----------------------------------------------------------------------------------------------------------
// Đăng ký người dùng
export const registerUser =  async(data: RegisterUserData) =>{
  try {
    const response = await api.post("/auth/register", data);   
      return response.data;
  }
  catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw error;
    } else {
      throw new Error("Failed to register user.");
    }
  }
}

export const verifyOtp = (data: VerifyOtpData) => 
  api.post("/auth/verify-otp", data);

// Đăng nhập người dùng
export const loginUser = (data: LoginUserData) => api.post("/auth/login", data);

// Lấy thông tin người dùng từ ID
export const getUserById = async (id: number) => {
  try {
    const response = await api.get(`/auth/users/${id}`, {
      // Không cần thêm header 'Authorization' nếu backend kiểm tra cookie trực tiếp
    });
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw error;
    } else {
      throw new Error("Failed to fetch user data.");
    }
  }
};

export const logout = async () => {
  const response = await api.post("/auth/logout", {});
  return response.data;
};

// Gửi email xác nhận đổi mật khẩu
export const sendResetPassword = async (email: string) => {
  try {
    const response = await api.post("/auth/forgot-password", { email });
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw error;
    } else {
      throw new Error("Failed to send OTP.");
    }
  }
};

// Đặt lại mật khẩu
export const resetPassword = async (
  email: string,
  otp: string,
  newPassword: string
) => {
  try {
    const response = await api.post("/auth/reset-password", {
      email,
      otp,
      newPassword,
    });
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw error;
    } else {
      throw new Error("Failed to reset password.");
    }
  }
};

//Role - Quyền -----------------------------------------------------------------------------------------------------------
// Lấy danh sách quyền
export const getRoles = async () => {
  try {
    const response = await api.get("/roles");
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw error;
    } else {
      throw new Error("Failed to fetch roles.");
    }
  }
};


// Dịch vụ SPA ----------------------------------------------------------------

export const getServiceSPA = async () => {
  try {
    const response = await api.get("/service-spa");
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw error;
    } else {
      throw new Error("Failed to fetch service SPA.");
    }
  }
};

// lấy danh sách theo trạng thái activate
export const getServiceSPAByStatus = async () => {
  try {
    const response = await api.get('/service-spa/get-all/active');
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw error;
    } else {
      throw new Error("Failed to fetch service SPA.");
    }
  }
};

export const addServiceSPA = async (data: ServiceSPAForm) => {
  try {
    const response = await api.post("/service-spa", data);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw error;
    } else {
      throw new Error("Không thể kết nối đến server.");
    }
  }
};


export const deleteServiceSPA = async (id: number) => {
  try {
    const response = await api.delete(`/service-spa/${id}`);
    console.log("API Response:", response.data);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw error;
    } else {
      throw new Error("Không thể kết nối server");
    }
  }
};

export const updateServiceSPA = async (id: number, data: ServiceSPAForm) => {
  try {
    const response = await api.put(`/service-spa/${id}`, data);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw error;
    } else {
      throw new Error("Failed to update service SPA.");
    }
  }
};

// Activate the service

export const activateServiceSPA = async (id: number) => {
  try {
    const response = await api.put(`/service-spa/activate/${id}`);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw error;
    } else {
      throw new Error("Failed to activate service SPA.");
    }
  }
};

// Deactivate the service

export const deactivateServiceSPA = async (id: number) => {
  try {
    const response = await api.put(`/service-spa/deactivate/${id}`);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw error;
    } else {
      throw new Error("Failed to deactivate service SPA.");
    }
  }
};


// Category - Danh mục ----------------------------------------------------------------

export const getCategories = async () => {
  try {
    const response = await api.get("/categories");
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw error;
    } else {
      throw new Error("Failed to fetch categories.");
    }
  }
};

export const addCategory = async (data: CategoryForm) => {
  try {
    const response = await api.post("/categories",  data );
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw error;
    } else {
      throw new Error("Failed to add category.");
    }
  }
};