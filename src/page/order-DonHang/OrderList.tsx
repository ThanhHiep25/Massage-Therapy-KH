import { useEffect, useState } from "react";
import { getAllOrderById, updateOrder } from "../../service/apiOrder";
import { OrderResponse } from "../../interface/Order_interface";
import { motion } from "framer-motion";
import { CreditCard } from "lucide-react";
import { Pagination } from "@mui/material";
import PaymentOrderModal from "../Payment/PaymentOrderModal";
import dayjs from "dayjs";
import "dayjs/locale/vi"; // Đảm bảo dùng tiếng Việt
import { toast } from "react-toastify";
dayjs.locale("vi");

const pageSize = 8;

interface OrderListProps {
    filterByStatus?: string[]; // prop mới
}

const OrderList = ({ filterByStatus = [] }: OrderListProps) => {
    const [orders, setOrders] = useState<OrderResponse[]>([]); // Danh sách đơn hàng
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedOrder, setSelectedOrder] = useState<OrderResponse | null>(null); // Đơn hàng được chọn
    const [isModalOpen, setIsModalOpen] = useState(false); // Trạng thái mở modal

    const [editingShippingPhoneId, setEditingShippingPhoneId] = useState<number | null>(null);
    const [editShippingPhone, setEditShippingPhone] = useState("");

    const [editingShippingAddressId, setEditingShippingAddressId] = useState<number | null>(null);
    const [editShippingAddress, setEditShippingAddress] = useState("");

    const [editingShippingNoteId, setEditingShippingNoteId] = useState<number | null>(null);
    const [editShippingNote, setEditShippingNote] = useState("");

    const [phoneError, setPhoneError] = useState('');

    const validatePhoneNumber = (phone: string) => {
        const phoneRegex = /^0\d{9}$/;
        return phoneRegex.test(phone);
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {

            const userData = localStorage.getItem("user");
            if (!userData) return;

            const currentUser = JSON.parse(userData);
            const userId = currentUser?.id;
            const response = await getAllOrderById(userId);
            const now = new Date();
            const userOrders = response.filter(
                (order: OrderResponse) => order.user?.id === userId
            );

            const sortedOrders = userOrders.sort((a: OrderResponse, b: OrderResponse) =>
                new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
            );

            const markedOrders = sortedOrders.map((order: OrderResponse) => ({
                ...order,
                isNew: (now.getTime() - new Date(order.orderDate).getTime()) / 1000 < 60,
            }));

            setOrders(markedOrders);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách đơn hàng:", error);
        }
    };

    // Chuyển đổi hiển thị tên trang thái
    const translateOrderStatus = (status: string): string => {
        switch (status) {
            case "PENDING":
                return "Mới đặt";
            case "PROCESSING":
                return "Đang xử lý";
            case "SHIPPED":
                return "Đang vận chuyển";
            case "DELIVERED":
                return "Thành công";
            case "CANCELLED":
                return "Đã hủy";
            case "PAID":
                return "Đã thanh toán";
            case "REFUND":
                return "Đã hoàn tiền";
            default:
                return status;
        }
    };

    const filteredOrders = orders.filter((order) => {
        return filterByStatus.length === 0 || filterByStatus.includes(order.status);
    });

    // Phân trang
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const currentOrders = filteredOrders.slice(startIndex, endIndex);

    const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
        setCurrentPage(value);
    };

    const handleOpenModal = (order: OrderResponse) => {
        setSelectedOrder(order); // Lưu thông tin đơn hàng được chọn
        setIsModalOpen(true); // Mở modal
    };

    const handleCloseModal = () => {
        setSelectedOrder(null); // Xóa thông tin đơn hàng được chọn
        setIsModalOpen(false); // Đóng modal
    };

    // Hàm cập nhật sdt
    const handleSaveShippingPhone = async (orderId: number) => {
        const order = orders.find(o => o.id === orderId);
        if (!order) {
            console.warn("Không tìm thấy đơn hàng với id:", orderId);
            return;
        }

        // Kiểm tra số điện thoại hợp lệ
        if (!validatePhoneNumber(editShippingPhone)) {
            setPhoneError("Số điện thoại phải đủ 10 số và bắt đầu bằng số 0");
            return;
        }

        // Nếu số điện thoại hợp lệ, reset lỗi (nếu có)
        setPhoneError('');

        const updatedData = {
            userId: order.user?.id,
            guestName: order.guestName ?? "",
            shippingPhone: editShippingPhone,
            shippingAddress: order.shippingAddress ?? "",
            notes: order.notes ?? "",
            orderDate: order.orderDate ?? new Date().toISOString(),
            orderItems: order.orderItems.map(({ product, quantity }) => ({
                productId: product.id,
                quantity,
            })),
        };

        try {
            await updateOrder(orderId, updatedData);
            await fetchOrders();
            console.log("Cập nhật số điện thoại thành công cho orderId:", orderId);
            toast.success("Cập nhật số điện thoại thành công");
            return true;
        } catch (error) {
            console.error("Lỗi khi cập nhật số điện thoại:", error instanceof Error ? error.message : error);
        }
    };

    // Hàm cập nhật địa chỉ
    const handleSaveShippingAddress = async (orderId: number) => {
        const order = orders.find(o => o.id === orderId);
        if (!order) {
            console.warn("Không tìm thấy đơn hàng với id:", orderId);
            return;
        }

        const updatedData = {
            userId: order.user?.id,
            guestName: order.guestName ?? "",
            shippingPhone: order.shippingPhone ?? "",
            shippingAddress: editShippingAddress, // 👈 cập nhật địa chỉ mới
            notes: order.notes ?? "",
            orderDate: order.orderDate ?? new Date().toISOString(),
            orderItems: order.orderItems.map(({ product, quantity }) => ({
                productId: product.id,
                quantity,
            })),
        };

        try {

            await updateOrder(orderId, updatedData);
            await fetchOrders();
            console.log("Cập nhật địa chỉ giao hàng thành công cho orderId:", orderId);
            toast.success("Cập nhật địa chỉ giao hàng thành công");
            return true;
        } catch (error) {
            console.error("Lỗi khi cập nhật địa chỉ:", error instanceof Error ? error.message : error);
        }
    };

    // Hàm cập nhật ghi chú
    const handleSaveShippingNote = async (orderId: number) => {
        const order = orders.find(o => o.id === orderId);
        if (!order) {
            console.warn("Không tìm thấy đơn hàng với id:", orderId);
            return;
        }

        const updatedData = {
            userId: order.user?.id,
            guestName: order.guestName ?? "",
            shippingPhone: order.shippingPhone ?? "",
            shippingAddress: order.shippingAddress ?? "",
            notes: editShippingNote,
            orderDate: order.orderDate ?? new Date().toISOString(),
            orderItems: order.orderItems.map(({ product, quantity }) => ({
                productId: product.id,
                quantity,
            })),
        };

        try {
            await updateOrder(orderId, updatedData);
            await fetchOrders();
            console.log("Cập nhật ghi chú thành công cho orderId:", orderId);
            toast.success("Cập nhật ghi chú thành công");
            return true;
        } catch (error) {
            console.error("Lỗi khi cập nhật ghi chú:", error instanceof Error ? error.message : error);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="sm:p-6 sm:bg-white rounded-lg shadow-md"
        >
            {filteredOrders.length > 0 ? (
                <div className="grid overflow-auto h-[65vh] gap-6">
                    {currentOrders.map((order) => (
                        <div key={order.id} className="relative bg-[#fafafa] border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition duration-300">
                            {order.isNew && (
                                <span className="absolute top-4 left-4 px-3 py-1 text-xs font-semibold rounded-full bg-green-500 text-white">
                                    Mới ✨
                                </span>
                            )}
                            <div className="flex mt-4 flex-col md:flex-row md:justify-between gap-4">
                                {/* Thông tin đơn hàng */}
                                <div className="flex-1">
                                    <p className="font-semibold text-gray-800 mb-2">
                                        Thông tin khách hàng
                                    </p>
                                    <div className="text-sm text-gray-600 space-y-2">
                                        <p>
                                            Họ tên:{" "}
                                            <span className="font-medium text-gray-700">
                                                {order.user ? order.user.name : order.guestName || "Ẩn danh"}
                                            </span>
                                        </p>
                                        <p>
                                            SĐT:{" "}
                                            <span className="text-gray-700">
                                                {order.user?.phone || "Chưa cập nhật"}
                                            </span>
                                        </p>
                                        <p>
                                            Địa chỉ:{" "}
                                            <span className="text-gray-700">
                                                {order.user?.address || "Chưa cập nhật"}
                                            </span>
                                        </p>
                                        <p>
                                            Ngày đặt: {dayjs(order.orderDate).format("dddd, DD/MM/YYYY [lúc] HH:mm").replace(/^\w/, c => c.toUpperCase())}
                                        </p>

                                        <div className="space-y-1 text-sm">
                                            <p className="flex items-center justify-between">
                                                <span>
                                                    SĐT giao hàng:{" "}
                                                    {editingShippingPhoneId === order.id ? (
                                                        <input
                                                            value={editShippingPhone}
                                                            onChange={(e) => setEditShippingPhone(e.target.value)}
                                                            className="border px-2 py-1 ml-5 w-40"
                                                            placeholder="Nhập số điện thoại"
                                                        />
                                                    ) : (
                                                        <span className="text-gray-700 ml-1">
                                                            {order.shippingPhone || "Không có số điện thoại"}
                                                        </span>
                                                    )}
                                                </span>
                                                {editingShippingPhoneId === order.id ? (
                                                    <button
                                                        onClick={async () => {
                                                            const success = await handleSaveShippingPhone(order.id);
                                                            if (success) {
                                                                setEditingShippingPhoneId(null);
                                                            }
                                                        }}
                                                        className="text-green-600 ml-2 text-sm"
                                                    >
                                                        Lưu
                                                    </button>
                                                ) : (
                                                    <>
                                                        {
                                                            order.status === "PENDING" && (
                                                                <button
                                                                    onClick={() => {
                                                                        setEditingShippingPhoneId(order.id);
                                                                        setEditShippingPhone(order.shippingPhone || "");
                                                                    }}
                                                                    className="text-blue-600 ml-2 text-xs"
                                                                >
                                                                    Cập nhật
                                                                </button>
                                                            )
                                                        }
                                                    </>

                                                )}
                                            </p>
                                            {phoneError && <div style={{ color: 'red' }}>{phoneError}</div>}
                                        </div>

                                        <div className="space-y-1 text-sm mt-2">
                                            <p className="flex items-center justify-between">
                                                <span>
                                                    Địa chỉ giao hàng:{" "}
                                                    {editingShippingAddressId === order.id ? (
                                                        <input
                                                            value={editShippingAddress}
                                                            onChange={(e) => setEditShippingAddress(e.target.value)}
                                                            className="border px-2 py-1 ml-1 w-40"
                                                            placeholder="Nhập địa chỉ"
                                                        />
                                                    ) : (
                                                        <span className="text-gray-700 ml-1">
                                                            {order.shippingAddress || "Không có địa chỉ"}
                                                        </span>
                                                    )}
                                                </span>
                                                {editingShippingAddressId === order.id ? (
                                                    <button
                                                        onClick={() => {
                                                            handleSaveShippingAddress(order.id);
                                                            setEditingShippingAddressId(null);
                                                        }}
                                                        className="text-green-600 ml-2 text-sm"
                                                    >
                                                        Lưu
                                                    </button>
                                                ) : (
                                                    <>
                                                        {
                                                            order.status === "PENDING" && (
                                                                <button
                                                                    onClick={() => {
                                                                        setEditingShippingAddressId(order.id);
                                                                        setEditShippingAddress(order.shippingAddress || "");
                                                                    }}
                                                                    className="text-blue-600 ml-2 text-xs"
                                                                >
                                                                    Cập nhật
                                                                </button>
                                                            )
                                                        }
                                                    </>
                                                    // <button
                                                    //     onClick={() => {
                                                    //         setEditingShippingAddressId(order.id);
                                                    //         setEditShippingAddress(order.shippingAddress || "");
                                                    //     }}
                                                    //     className="text-blue-600 ml-2 text-xs"
                                                    // >
                                                    //     Cập nhật
                                                    // </button>
                                                )}
                                            </p>
                                        </div>

                                        <p className="flex items-center justify-between">
                                            <span>
                                                Ghi chú:{" "}
                                                {editingShippingNoteId === order.id ? (
                                                    <input
                                                        value={editShippingNote}
                                                        onChange={(e) => setEditShippingNote(e.target.value)}
                                                        className="border px-2 py-1 ml-1 w-40"
                                                        placeholder="Ghi chú thêm..."
                                                    />
                                                ) : (
                                                    <span className="text-gray-700 ml-1">
                                                        {order.notes || "Không có ghi chú"}
                                                    </span>
                                                )}
                                            </span>

                                            {editingShippingNoteId === order.id ? (
                                                <button
                                                    onClick={() => {
                                                        handleSaveShippingNote(order.id);
                                                        setEditingShippingNoteId(null);
                                                    }}
                                                    className="text-green-600 ml-2 text-sm"
                                                >
                                                    Lưu
                                                </button>
                                            ) : (

                                                <>
                                                    {
                                                        order.status === "PENDING" && (
                                                            <button
                                                                onClick={() => {
                                                                    setEditingShippingNoteId(order.id);
                                                                    setEditShippingNote(order.notes || "");
                                                                }}
                                                                className="text-blue-600 ml-2 text-xs"
                                                            >
                                                                Cập nhật
                                                            </button>
                                                        )
                                                    }
                                                </>
                                                // <button
                                                //     onClick={() => {
                                                //         setEditingShippingNoteId(order.id);
                                                //         setEditShippingNote(order.notes || "");
                                                //     }}
                                                //     className="text-blue-600 ml-2 text-xs"
                                                // >
                                                //     Cập nhật
                                                // </button>
                                            )}
                                        </p>

                                        <p>
                                            Trạng thái:{" "}
                                            <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-700">
                                                {translateOrderStatus(order.status)}
                                            </span>
                                        </p>
                                    </div>
                                </div>

                                {/* Sản phẩm */}
                                <div className="flex-1 bg-white rounded-xl p-4 border border-gray-100 max-h-[220px] overflow-auto">
                                    <p className="font-semibold text-gray-800 mb-1">
                                        Thông tin sản phẩm
                                    </p>
                                    <ul className="space-y-4">
                                        {order.orderItems.slice(0, 2).map((item) => (
                                            <li key={item.id} className="flex gap-4 items-center">
                                                <img
                                                    src={item.product.imageUrl}
                                                    alt={item.product.nameProduct}
                                                    className="w-20 h-20 object-cover rounded-md border"
                                                />
                                                <div className="text-sm flex-1">
                                                    <p className="font-bold text-gray-800">{item.product.nameProduct}</p>
                                                    <p className="text-gray-500">Đơn giá: {item.price.toLocaleString()} VND</p>
                                                    <p className="text-gray-500">Số lượng: {item.quantity}</p>
                                                    <p className="text-orange-500">Thành tiền: {item.subTotal.toLocaleString()} VND</p>
                                                </div>
                                            </li>

                                        ))}
                                    </ul>
                                    {order.orderItems.length > 2 && (
                                        <p className="text-xs text-gray-400 mt-2">
                                            Và {order.orderItems.length - 2} sản phẩm khác...
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="flex justify-between items-center mt-6">
                                <p className="sm:text-lg text-[14px] font-semibold text-green-600">
                                    Tổng: {order.totalAmount.toLocaleString()} VNĐ
                                </p>

                                {(order.status === "PENDING" || order.status === "PROCESSING") ? (
                                    <button
                                        className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white rounded-full shadow-md hover:bg-blue-700 transition"
                                        onClick={() => handleOpenModal(order)}
                                    >
                                        <CreditCard className="w-4 h-4" />
                                        Thanh toán
                                    </button>
                                ) : (
                                    <span className={`text-sm italic font-medium ${order.status === "PAID"
                                        ? "text-green-600"
                                        : order.status === "CANCELLED"
                                            ? "text-red-500"
                                            : order.status === "DELIVERED"
                                                ? "text-blue-500"
                                                : order.status === "REFUND"
                                                    ? "text-orange-500"
                                                    : order.status === "SHIPPED"
                                                        ? "text-purple-500"
                                                        : "text-gray-500"
                                        }`}>
                                        {
                                            order.status === "PAID" ? "Đã thanh toán"
                                                : order.status === "CANCELLED" ? "Đã hủy đơn hàng"
                                                    : order.status === "DELIVERED" ? "Đã giao thành công"
                                                        : order.status === "REFUND" ? "Đã hoàn tiền"
                                                            : order.status === "SHIPPED" ? "Đang vận chuyển"
                                                                : "Trạng thái: " + order.status
                                        }
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center mt-8 py-28 text-gray-500 text-lg">
                    Bạn chưa có đơn hàng nào.
                </div>
            )}

            {/* Phân trang */}
            {currentOrders.length > pageSize && (
                <div className="flex justify-center mt-6">
                    <Pagination
                        count={Math.ceil(filteredOrders.length / pageSize)}
                        page={currentPage}
                        onChange={handlePageChange}
                        color="primary"
                    />
                </div>
            )}


            {/* Modal Thanh Toán */}
            {isModalOpen && selectedOrder && (
                <PaymentOrderModal
                    open={isModalOpen}
                    onClose={handleCloseModal}
                    order={selectedOrder}
                />
            )}
        </motion.div>
    );
};

export default OrderList;
