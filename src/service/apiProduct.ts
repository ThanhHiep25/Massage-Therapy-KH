// import axios from "axios";
// import { ProductForm, Order, OrderRequest } from "../interface/Product_interface";
// // Khởi tạo axios instance
// const api = axios.create({
//   //baseURL: "https://massage-therapy-production.up.railway.app/api",
//   baseURL: import.meta.env.VITE_URL_SERVER,
//   withCredentials: true, // Đảm bảo gửi cookie tự động
// });

// // Thêm sản phẩm
// export const createProduct = (data: ProductForm) => {
//   try {
//     return api.post("/products/create", data);
//   } catch (error: unknown) {
//     if (axios.isAxiosError(error) && error.response) {
//       throw error;
//     } else {
//       throw new Error("Khong the ket noi den server");
//     }
//   }
// };

// // Lấy sản phẩm
// export const getProducts = async () => {
//   try {
//     const response = await api.get("/products");
//     return response.data;
//   } catch (error: unknown) {
//     if (axios.isAxiosError(error) && error.response) {
//       throw error;
//     } else {
//       throw new Error("Khong the ket noi den server");
//     }
//   }
// };

// // Xóa sản phẩm
// export const deleteProduct = async (id: number) => {
//   try {
//     const response = await api.delete(`/products/${id}`);
//     return response.data;
//   } catch (error: unknown) {
//     if (axios.isAxiosError(error) && error.response) {
//       throw error;
//     } else {
//       throw new Error("Khong the ket noi den server");
//     }
//   }
// };

// // Cập nhật sản phẩm
// export const updateProduct = async (id: number, data: ProductForm) => {
//   try {
//     const response = await api.put(`/products/${id}`, data);
//     return response.data;
//   } catch (error: unknown) {
//     if (axios.isAxiosError(error) && error.response) {
//       throw error;
//     } else {
//       throw new Error("Khong the ket noi den server");
//     }
//   }
// };

// // Activate the product

// export const activateProduct = async (id: number) => {
//   try {
//     const response = await api.put(`/products/${id}/activate/`);
//     return response.data;
//   } catch (error: unknown) {
//     if (axios.isAxiosError(error) && error.response) {
//       throw error;
//     } else {
//       throw new Error("Failed to activate product SPA.");
//     }
//   }
// };

// // Deactivate the product

// export const deactivateProduct = async (id: number) => {
//   try {
//     const response = await api.put(`/products/${id}/deactivate/`);
//     return response.data;
//   } catch (error: unknown) {
//     if (axios.isAxiosError(error) && error.response) {
//       throw error;
//     } else {
//       throw new Error("Failed to deactivate product SPA.");
//     }
//   }
// };

// /////////////////////////////////

// // Tạo đơn hàng mới
// // export const createOrder = (data: Order) => {
// //   try {
// //     return api.post("/orders", data);
// //   } catch (error: unknown) {
// //     if (axios.isAxiosError(error) && error.response) {
// //       throw error;
// //     } else {
// //       throw new Error("Khong the ket noi den server");
// //     }
// //   }
// // };

// export const createOrder = (data: OrderRequest) => {
//   try {
//     return api.post("/orders", data);
//   } catch (error: unknown) {
//     if (axios.isAxiosError(error) && error.response) {
//       throw error;
//     } else {
//       throw new Error("Không thể kết nối đến server");
//     }
//   }
// };

// // Lấy thông tin đơn hàng
// export const getOrder = async () => {
//   try {
//     const response = await api.get("/orders");
//     return response.data;
//   } catch (error: unknown) {
//     if (axios.isAxiosError(error) && error.response) {
//       throw error;
//     } else {
//       throw new Error("Khong the ket noi den server");
//     }
//   }
// };

// // Lấy thông tin đơn hàng theo id người dùng
// export const getOrderUser = async (userId: number) => {
//   try {
//     const response = await api.get(`/orders/users/${userId}`);
//     return response.data;
//   } catch (error: unknown) {
//     if (axios.isAxiosError(error) && error.response) {
//       throw error;
//     } else {
//       throw new Error("Không thể kết nối đến server");
//     }
//   }
// };


// // Xóa đơn hàng
// export const deleteOrder = async (id: number) => {
//   try {
//     const response = await api.delete(`/orders/${id}`);
//     return response.data;
//   } catch (error: unknown) {
//     if (axios.isAxiosError(error) && error.response) {
//       throw error;
//     } else {
//       throw new Error("Khong the ket noi den server");
//     }
//   }
// };

// // Cập nhật đơn hàng
// export const updateOrder = async (id: number, data: Order) => {
//   try {
//     const response = await api.put(`/orders/${id}/status`, data);
//     return response.data;
//   } catch (error: unknown) {
//     if (axios.isAxiosError(error) && error.response) {
//       throw error;
//     } else {
//       throw new Error("Khong the ket noi den server");
//     }
//   }
// };

import axios from "axios";
import { ProductForm } from "../interface/Product_interface";

// Khởi tạo axios instance
const api = axios.create({
  //baseURL: "https://massage-therapy-production.up.railway.app/api",
  baseURL: import.meta.env.VITE_URL_SERVER,
  withCredentials: true, // Đảm bảo gửi cookie tự động
});

// Thêm sản phẩm
export const createProduct = (data: ProductForm) => {
  try {
    return api.post("/products/create", data);
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw error;
    } else {
      throw new Error("Khong the ket noi den server");
    }
  }
};


// Lấy sản phẩm
export const getProducts = async () => {
  try {
    const response = await api.get("/products");
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw error;
    } else {
      throw new Error("Khong the ket noi den server");
    }
  }
};

// Lấy danh sách sản phẩm theo trạng thái activate
export const getProductsByStatus = async () => {
  try {
    const response = await api.get('/products/get-all/active');
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
export const deleteProduct = async (id: number) => {
  try {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw error;
    } else {
      throw new Error("Khong the ket noi den server");
    }
  }
};

// Cập nhật sản phẩm
export const updateProduct = async (id: number, data: ProductForm) => {
  try {
    const response = await api.put(`/products/${id}`, data);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw error;
    } else {
      throw new Error("Khong the ket noi den server");
    }
  }
};

// Lấy thông tin đơn hàng theo id người dùng
export const getOrderUser = async (userId: number) => {
  try {
    const response = await api.get(`/orders/users/${userId}`);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw error;
    } else {
      throw new Error("Không thể kết nối đến server");
    }
  }
};