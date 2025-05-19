import axios from "axios";
import { AppointmentForm } from "../interface/AppointmentForm_interface";

// Khởi tạo axios instance
const api = axios.create({
  //baseURL: "https://massage-therapy-production.up.railway.app/api",
  baseURL: import.meta.env.VITE_URL_SERVER,
  withCredentials: true, // Đảm bảo gửi cookie tự động
});

// thêm lịch hẹn
export const createAppointment = (data: AppointmentForm) => {
  try {
    return api.post("/appointments/create", data);
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw error;
    } else {
      throw new Error("Khong the ket noi den server");
    }
  }
};

// Get danh sách lịch hẹn
export const getAppointmentAll = async () => {
  try {
    const response = await api.get("/appointments/");
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw error;
    } else {
      throw new Error("Khong the ket noi den server");
    }
  }
};

// Xóa lịch hẹn
export const deleteAppointment = async (id: number) => {
  try {
    const response = await api.delete(`/appointments/${id}`);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw error;
    } else {
      throw new Error("Khong the ket noi den server");
    }
  }
};

// cập nhật lịch hẹn
export const updateAppointment = async (id: number, data: AppointmentForm) => {
  try {
    const response = await api.put(`/appointments/${id}`, data);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw error;
    } else {
      throw new Error("Khong the ket noi den server");
    }
  }
};

// thay doi trang thai da dat lich
export const updateStatusScheduled = async (id: number) => {
  try {
    const response = await api.put(`/appointments/${id}/scheduled`);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw error;
    } else {
      throw new Error("Khong the ket noi den server");
    }
  }
};

// thay đổi trạng thái complete
export const updateStatusComplete = async (id: number) => {
  try {
    const response = await api.put(`/appointments/${id}/complete`);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw error;
    } else {
      throw new Error("Khong the ket noidden server");
    }
  }
};

// huy lich hen
// export const updateStatusCancel = async (id: number) => {
//   try {
//     const response = await api.put(`/appointments/${id}/cancel`);
//     return response.data;
//   } catch (error: unknown) {
//     if (axios.isAxiosError(error) && error.response) {
//       throw error;
//     } else {
//       throw new Error("Khong the ket noidden server");
//     }
//   }
// };

export const updateStatusCancel = async (id: number) => {
  try {
    console.log("⏳ Gửi yêu cầu hủy lịch với ID:", id); // 👈 Thêm log ở đây
    const response = await api.put(`/appointments/${id}/cancel`);
    console.log("✅ Kết quả huỷ:", response.data); // 👈 Log kết quả thành công
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      console.error("❌ Lỗi khi hủy lịch:", {
        status: error.response.status,
        data: error.response.data,
      }); // 👈 Log chi tiết lỗi trả về
      throw error;
    } else {
      console.error("❌ Không thể kết nối đến server");
      throw new Error("Khong the ket noidden server");
    }
  }
};

