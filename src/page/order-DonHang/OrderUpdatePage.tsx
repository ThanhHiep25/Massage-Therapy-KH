import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Order } from "../../interface/Order_interface";
import { updateOrder } from "../../service/apiOrder"; 
import { toast } from "react-toastify"; 

const OrderUpdatePage: React.FC = () => {
    const { orderId } = useParams<{ orderId: string }>(); // Lấy orderId từ params URL
    const [orderData, setOrderData] = useState<Order | null>(null);
    const [address, setAddress] = useState<string>("");
    const [phone, setPhone] = useState<string>("");
    const [notes, setNotes] = useState<string>("");

    // Lấy dữ liệu đơn hàng từ API khi trang được load
    useEffect(() => {
        if (orderId) {
            const fetchOrderData = async () => {
                try {
                    // Gọi API để lấy dữ liệu đơn hàng theo orderId
                    const response = await fetch(`/api/orders/${orderId}`);
                    const data = await response.json();
                    setOrderData(data);

                    // Cập nhật các trường dữ liệu
                    setAddress(data.shippingAddress);
                    setPhone(data.shippingPhone);
                    setNotes(data.notes);
                } catch (error) {
                    console.error("Lỗi khi lấy dữ liệu đơn hàng:", error);
                    toast.error("Không thể lấy dữ liệu đơn hàng.");
                }
            };

            fetchOrderData();
        }
    }, [orderId]);

    const handleUpdateOrder = async () => {
        if (!orderData || !orderId) return; // Đảm bảo orderData và orderId có giá trị

        // Ép kiểu orderId thành number nếu là string
        const id = Number(orderId);
        if (isNaN(id)) {
            toast.error("ID đơn hàng không hợp lệ.");
            return;
        }

        const updatedOrder: Order = {
            ...orderData, // Giữ lại thông tin đơn hàng cũ
            shippingAddress: address,
            shippingPhone: phone,
            notes: notes,
        };

        try {
            // Gửi yêu cầu cập nhật đơn hàng lên API
            await updateOrder(id, updatedOrder);
            toast.success("Cập nhật đơn hàng thành công!");
        } catch (error) {
            console.error("Lỗi khi cập nhật đơn hàng:", error);
            toast.error("Cập nhật thất bại.");
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-6 space-y-6">
            <h2 className="text-2xl font-semibold">Cập nhật thông tin đơn hàng</h2>

            {/* Thông tin giao hàng */}
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 space-y-4">
                <div>
                    <label className="block font-medium mb-1">Địa chỉ giao hàng</label>
                    <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full p-3 rounded border focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="Nhập địa chỉ..."
                    />
                </div>

                <div>
                    <label className="block font-medium mb-1">Số điện thoại</label>
                    <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full p-3 rounded border focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="Nhập số điện thoại..."
                    />
                </div>

                <div>
                    <label className="block font-medium mb-1">Ghi chú</label>
                    <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows={3}
                        className="w-full p-3 rounded border focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="Ghi chú thêm (nếu có)..."
                    />
                </div>
            </div>

            {/* Nút cập nhật */}
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 flex justify-center items-center">
                <button
                    onClick={handleUpdateOrder}
                    className="bg-blue-500 text-white font-semibold py-3 px-6 rounded-xl hover:bg-blue-600 transition"
                >
                    Cập nhật đơn hàng
                </button>
            </div>
        </div>
    );
};

export default OrderUpdatePage;
