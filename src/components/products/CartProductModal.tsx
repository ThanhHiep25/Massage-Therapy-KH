import React, { useState } from 'react';
import { ProductResponse } from '../../interface/Product_interface';
import { useNavigate } from "react-router-dom";

interface CartProductModalProps {
    product: ProductResponse | null;
    onClose: () => void;
    onSuccessAddToCart: () => void; // ✅ thêm dòng này
}

const CartProductModal: React.FC<CartProductModalProps> = ({ product, onClose, onSuccessAddToCart }) => {
    const [quantity, setQuantity] = useState(1);
    const navigate = useNavigate();

    if (!product) {
        return null;
    }

    type OrderItem = ProductResponse & {
        quantity: number;
        userId: string;
        userName: string;
        addedDate: string; // Thêm field ngày thêm vào
    };
    
    const handleOrder = () => {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const userId = user?.id;
    
        if (!userId) {
            alert('Vui lòng đăng nhập để thêm vào giỏ hàng!');
            return;
        }
    
        const existingOrders: OrderItem[] = JSON.parse(localStorage.getItem('orderItems') || '[]');
    
        const existingIndex = existingOrders.findIndex(
            (item) => item.id === product.id && item.userId === user.id
        );

        if (existingIndex !== -1) {
            // Nếu sản phẩm đã có, tăng số lượng
            existingOrders[existingIndex].quantity += quantity;
        } else {
            // Nếu là sản phẩm mới, thêm ngày thêm
            const orderItem: OrderItem = {
                ...product,
                quantity,
                userId: user.id,
                userName: user.name,
                addedDate: new Date().toISOString(), // Lưu ISO format để dễ xử lý
            };
            existingOrders.push(orderItem);
        }

        localStorage.setItem('orderItems', JSON.stringify(existingOrders));

        // Tự kích hoạt sự kiện "storage" để cập nhật icon giỏ hàng
        window.dispatchEvent(new Event("storage"));

        onClose(); // đóng modal
        onSuccessAddToCart(); // callback cho cha biết để hiện confirm
    };

    const handleBuynow = () => {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const userId = user?.id;

        if (!userId) {
            alert('Vui lòng đăng nhập để thêm vào giỏ hàng!');
            return;
        }

        const existingOrders: OrderItem[] = JSON.parse(localStorage.getItem('orderItems') || '[]');

        const existingIndex = existingOrders.findIndex(
            (item) => item.id === product.id && item.userId === user.id
        );

        let addedDate = new Date().toISOString();

        if (existingIndex !== -1) {
            existingOrders[existingIndex].quantity += quantity;
            addedDate = existingOrders[existingIndex].addedDate; // dùng ngày cũ nếu đã có
        } else {
            const orderItem: OrderItem = {
                ...product,
                quantity,
                userId: user.id,
                userName: user.name,
                addedDate,
            };
            existingOrders.push(orderItem);
        }

        localStorage.setItem('orderItems', JSON.stringify(existingOrders));

        // Ghi nhớ ngày cần chọn
        localStorage.setItem("selectedOrderDate", new Date(addedDate).toLocaleDateString("vi-VN"));

        alert('Sản phẩm đã được thêm vào giỏ hàng!');
        onClose();

        // Chuyển trang
        navigate("/profile/orders");
    };


    const handleIncrease = () => {
        if (quantity < product.quantity) {
            setQuantity((prev) => prev + 1);
        }
    };
    
    const handleDecrease = () => {
        if (quantity > 1) {
            setQuantity((prev) => prev - 1);
        }
    };    

    const totalPrice = product.price * quantity;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="relative bg-white rounded-xl shadow-lg p-6 w-full max-w-xl">
                {/* Header */}
                <div className="flex justify-between items-center border-b pb-4 mb-4">
                    <h2 className="text-2xl font-bold text-gray-800">Thêm vào giỏ hàng</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-red-500 text-xl transition duration-200"
                    >
                        ✕
                    </button>
                </div>

                {/* Product Display */}
                <div className="flex flex-col md:flex-row items-center gap-6 mb-6">
                    <img
                        src={product.imageUrl}
                        alt={product.nameProduct}
                        className="w-40 h-40 object-cover rounded-md shadow-md"
                    />
                    <div className="flex-1 text-center md:text-left">
                        <h3 className="text-xl font-semibold text-gray-800">{product.nameProduct}</h3>
                        <p className="text-sm text-gray-500 mt-1">Kho còn: <strong>{product.quantity}</strong> sản phẩm</p>
                        <p className="text-blue-500 font-semibold text-base mt-2">
                            Giá: {product.price.toLocaleString()} VNĐ
                        </p>

                        {/* Quantity Selector */}
                        <div className="my-3">
                            <div className="flex justify-center md:justify-start items-center gap-3">
                                <button
                                    type="button"
                                    onClick={handleDecrease}
                                    disabled={quantity <= 1}
                                    className={`w-8 h-8 rounded-full text-sm shadow-md transition duration-200 ${
                                        quantity <= 1
                                            ? 'bg-gray-300 text-gray-400 cursor-not-allowed'
                                            : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                                    }`}
                                >
                                    -
                                </button>
                                <span className="text-base font-semibold">{quantity}</span>
                                <button
                                    type="button"
                                    onClick={handleIncrease}
                                    disabled={quantity >= product.quantity}
                                    className={`w-8 h-8 rounded-full text-sm shadow-md transition duration-200 ${
                                        quantity >= product.quantity
                                            ? 'bg-gray-300 text-gray-400 cursor-not-allowed'
                                            : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                                    }`}
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        <p className="text-green-500 font-semibold text-base">
                            Tổng tiền: {totalPrice.toLocaleString()} VNĐ
                        </p>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-4">
                    <button
                        type="button"
                        onClick={handleOrder}
                        className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-lg shadow-md transition duration-200"
                    >
                        Thêm vào giỏ hàng
                    </button>
                    <button
                        type="button"
                        onClick={handleBuynow}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-lg shadow-md transition duration-200"
                    >
                        Mua ngay
                    </button>
                </div>
            </div>
        </div>

    );
};

export default CartProductModal;