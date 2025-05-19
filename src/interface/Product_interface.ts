// export interface ProductForm {
//     nameProduct: string;
//     description: string;
//     price: number;
//     categoryId: number;
//     imageUrl: string;
//     quantity: number;
// }

// export interface ProductResponse {
//     id: number;
//     nameProduct: string;
//     description: string;
//     price: number;
//     category: {
//         id: number;
//         name: string;
//     };
//     imageUrl: string;
//     quantity: number;
//     createdAt: string;
//     updatedAt: string;
//     // status: string;
//     productStatus: string;
// }

// export interface User {
//     id: number;
//     name: string;
//     email: string;
//     phone: string;
//     address?: string;
//     description: string;
//     imageUrl?: string;
//     status: string;
// }

// export interface Order {
//     id: number;
//     user: User;
//     orderDate: string;
//     totalAmount: number;
//     status: string;
//     shippingAddress: string;
//     shippingPhone: number;
//     notes: string;
//     orderItems: OrderItems[]; // ✅ Đúng kiểu
//     createdAt: string;
//     updatedAt: string;
// }

// export interface OrderItems {
//     id: number;
//     product: ProductResponse; // Sửa dòng này
//     quantity: number;
//     price: number;
//     subTotal: number;
// }

// export interface OrderRequest {
//     userId: number;
//     shippingAddress: string | null;
//     shippingPhone: string | null;
//     orderDate: string;
//     notes: string | null;
//     orderItems: {
//         productId: number;
//         quantity: number;
//     }[];
// }


export interface ProductForm {
    nameProduct: string;
    description: string;
    price: number;
    categoryId: number;
    imageUrl?: string;
    quantity: number;
}

export interface ProductResponse {
    id: number;
    nameProduct: string;
    description: string;
    price: number;
    category: CategoryPR;
    imageUrl?: string;
    quantity: number;
    createdAt: string;
    updatedAt: string;
    productStatus: string;
    isNew?: boolean;
}

export interface CategoryPR{
    id: number;
    name: string;
}
