import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { CustomerDataFull } from "../../interface/CustomerData_interface";
import { toast, ToastContainer } from "react-toastify";
import { motion } from "framer-motion";
import { createOrder } from "../../service/apiOrder";
import { Order, OrderItemResponse } from "../../interface/Order_interface";
import { useAuth } from "../../hook/AuthContext"; // hook lấy user đăng nhập
import { Dialog, DialogTitle, DialogContent, IconButton } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CloseIcon from "@mui/icons-material/Close";

// Khai báo riêng cho localStorage
interface LocalOrderItem extends OrderItemResponse {
    userId: number;
    addedDate: string; // ISO string
}

const OrderCartView = () => {
    const [customer, setCustomer] = useState<CustomerDataFull | null>(null);
    const [orderItems, setOrderItems] = useState<OrderItemResponse[]>([]);
    const [address, setAddress] = useState<string>("");
    const [phone, setPhone] = useState<string>("");
    const [notes, setNotes] = useState<string>("");

    const { user } = useAuth(); // Lấy user từ context
    const [selectedDates, setSelectedDates] = useState<string[]>([]);

    const [open, setOpen] = useState(false); // Dialog chọn địa chỉ
    const [showAddAddress, setShowAddAddress] = useState(false); // Dialog thêm địa chỉ

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleAddAddressOpen = () => setShowAddAddress(true);
    const handleAddAddressClose = () => setShowAddAddress(false);

    const [tempAddress, setTempAddress] = useState<{
        address: string;
        phone: string;
        notes: string;
    } | null>(null);

    const [selectedShippingInfo, setSelectedShippingInfo] = useState<{
        address: string;
        phone: string;
        notes: string;
    } | null>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser) as unknown as CustomerDataFull;
            setCustomer(parsedUser);
    
            const rawOrderItems = localStorage.getItem("orderItems");
            const allOrderItems = JSON.parse(rawOrderItems || "[]") as unknown as LocalOrderItem[];
            const userOrderItems = allOrderItems.filter(item => item.userId === parsedUser.id);
            setOrderItems(userOrderItems);
        }
    }, []);

    useEffect(() => {
        const storedDate = localStorage.getItem("selectedOrderDate");
        if (storedDate) {
            setSelectedDates(prev => [...prev, storedDate]);
            localStorage.removeItem("selectedOrderDate"); // dọn sau khi dùng
        }
    }, []);

    const handleIncreaseQuantity = (index: number) => {
        const updatedItems = [...orderItems];
        updatedItems[index].quantity += 1;
        setOrderItems(updatedItems);
    
        const raw = localStorage.getItem("orderItems");
        const allOrderItems = JSON.parse(raw || "[]") as unknown as LocalOrderItem[];
        const newAllOrderItems = allOrderItems.map(item => {
            if (item.userId === customer?.id && item.id === updatedItems[index].id) {
                return { ...item, quantity: updatedItems[index].quantity };
            }
            return item;
        });
        localStorage.setItem("orderItems", JSON.stringify(newAllOrderItems));
    };
    
    const handleDecreaseQuantity = (index: number) => {
        const updatedItems = [...orderItems];
        if (updatedItems[index].quantity > 1) {
            updatedItems[index].quantity -= 1;
            setOrderItems(updatedItems);
    
            const raw = localStorage.getItem("orderItems");
            const allOrderItems = JSON.parse(raw || "[]") as unknown as LocalOrderItem[];
            const newAllOrderItems = allOrderItems.map(item => {
                if (item.userId === customer?.id && item.id === updatedItems[index].id) {
                    return { ...item, quantity: updatedItems[index].quantity };
                }
                return item;
            });
            localStorage.setItem("orderItems", JSON.stringify(newAllOrderItems));
        }
    };    
    
    const handleRemoveItem = (index: number, name: string) => {
        if (!window.confirm(`Bạn muốn xóa ${name} không?`)) return;
    
        const removedItemId = orderItems[index].id;
        const updatedItems = orderItems.filter((_, i) => i !== index);
        setOrderItems(updatedItems);
    
        const raw = localStorage.getItem("orderItems");
        const allOrderItems = JSON.parse(raw || "[]") as unknown as LocalOrderItem[];
        const newAllOrderItems = allOrderItems.filter(item =>
            !(item.userId === customer?.id && item.id === removedItemId)
        );
    
        localStorage.setItem("orderItems", JSON.stringify(newAllOrderItems));
        toast.success(`Xóa ${name} thành công.`);
    };

    const handleSubmitOrder = async () => {
        const itemsToOrder = (orderItems as LocalOrderItem[]).filter((item) =>
            selectedDates.includes(new Date(item.addedDate).toLocaleDateString("vi-VN"))
        );

        if (itemsToOrder.length === 0) {
            toast.warning("Giỏ hàng trống, không thể đặt hàng.");
            return;
        }

        const orderData: Order = {
            userId: customer?.id,
            guestName: "",
            shippingAddress: address || "",
            shippingPhone: phone || customer?.phone || "",
            notes: notes || "Không có",
            orderItems: itemsToOrder.map(item => ({
                productId: item.id,
                quantity: item.quantity,
            })),
        };

        try {
            await createOrder(orderData);
            toast.success("Đặt hàng thành công.");

            // Xoá những mục đã đặt khỏi localStorage
            const raw = localStorage.getItem("orderItems");
            const allOrderItems = JSON.parse(raw || "[]") as unknown as LocalOrderItem[];
            const remaining = allOrderItems.filter(
                item => !selectedDates.includes(new Date(item.addedDate).toLocaleDateString("vi-VN"))
            );
            localStorage.setItem("orderItems", JSON.stringify(remaining));

            setOrderItems(remaining);            
            setAddress("");
            setPhone("");
            setNotes("");
            setSelectedDates([]);
        } catch (error) {
            console.error("Lỗi khi đặt hàng:", error);
            toast.error("Lỗi khi đặt hàng.");
        }
    };

    // Nút chọn tất cả
    const handleToggleAllDates = () => {
        const allDates = Array.from(
            new Set(
                (orderItems as LocalOrderItem[]).map(item =>
                    new Date(item.addedDate).toLocaleDateString("vi-VN")
                )
            )
        );

        if (selectedDates.length === allDates.length) {
            setSelectedDates([]); // bỏ chọn tất cả
        } else {
            setSelectedDates(allDates); // chọn tất cả
        }
    };

    const groupItemsByDate = (items: LocalOrderItem[]) => {
        const groups: Record<string, LocalOrderItem[]> = {};

        items.forEach((item) => {
            const dateKey = new Date(item.addedDate).toLocaleDateString("vi-VN");
            if (!groups[dateKey]) groups[dateKey] = [];
            groups[dateKey].push(item);
        });

        return groups;
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="max-w-5xl mx-auto overflow-auto h-[65vh] space-y-6"
            >
            <ToastContainer />

            {orderItems.length === 0 ? (
                <div className="w-full bg-white rounded-2xl shadow-lg border border-gray-200 text-center text-gray-500 text-lg font-medium flex items-center justify-center gap-2 min-h-[370px]">
                    🛒 Không có sản phẩm trong giỏ hàng
                </div>
            ) : (
            <>
                {/* Hiển thị địa chỉ + icon */}
                <div className="flex flex-col sm:items-center text-center">
                    <div className="flex items-center text-base font-semibold text-gray-800">
                        🛒 Giỏ hàng
                        <span className="text-base font-bold ml-1">
                            {/* ({Object.keys(groupItemsByDate(orderItems as LocalOrderItem[])).length}) */}
                            ({(orderItems as LocalOrderItem[]).length})
                        </span>
                    </div>

                    <button
                        onClick={handleOpen}
                        className="flex items-center mt-2 text-sm text-gray-700 hover:underline"
                        >
                        <LocationOnIcon className="text-yellow-500" />
                        <span>
                            {selectedShippingInfo?.address || user?.address || "Chưa cập nhật"}
                        </span>
                    </button>
                </div>

                {/* Modal Thông tin khách hàng */}
                <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
                    <DialogTitle>
                        <p className="text-center font-bold">Chọn địa chỉ</p>
                        <IconButton
                            aria-label="close"
                            onClick={handleClose}
                            sx={{
                            position: "absolute",
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                            }}
                        >
                            <CloseIcon />
                        </IconButton>
                    </DialogTitle>

                    <DialogContent dividers>
                        <div className="space-y-4">
                            <div className="border rounded-xl p-4 flex flex-col hover:border-blue-400 transition-all">
                                <div className="flex items-start">
                                    <div className="flex-1 space-y-1">
                                        <p className="font-semibold text-gray-800">{user?.name || "Chưa cập nhật"}</p>
                                        <p className="text-base text-gray-700">Số điện thoại: {user?.phone || "Chưa cập nhật"}</p>
                                        <p className="text-base text-gray-600">Địa chỉ: {user?.address || "Chưa cập nhật"}</p>
                                    </div>

                                    <input
                                        type="radio"
                                        name="selectedAddress"
                                        checked={true}
                                        onChange={() => {}}
                                        className="mt-1 w-5 h-5 accent-blue-500"
                                    />
                                </div>

                                <div className="flex justify-end">
                                    <button
                                        onClick={() => {
                                            setSelectedShippingInfo({
                                                address: user?.address || "",
                                                phone: user?.phone || "",
                                                notes: "",
                                            });
                                            handleClose(); // đóng dialog
                                        }}
                                        className="text-blue-600 hover:underline text-sm font-medium"
                                    >
                                        Chọn
                                    </button>
                                </div>
                            </div>

                            {tempAddress && (
                                <div className="border rounded-xl p-4 flex flex-col gap-4 hover:border-blue-400 transition-all">
                                    <div className="flex items-start gap-4">
                                        <div className="flex-1 space-y-1">
                                            <p className="font-semibold text-gray-800">{user?.name || "Khách hàng"}</p>
                                            <p className="text-base text-gray-700">SĐT: {tempAddress.phone}</p>
                                            <p className="text-base text-gray-600">Địa chỉ: {tempAddress.address}</p>
                                            <p className="text-sm text-gray-500">Ghi chú: {tempAddress.notes || "Không có"}</p>
                                        </div>

                                        <input
                                            type="radio"
                                            name="selectedAddress"
                                            checked={true}
                                            onChange={() => {
                                                setAddress(tempAddress.address);
                                                setPhone(tempAddress.phone);
                                                setNotes(tempAddress.notes);
                                            }}
                                            className="mt-1 w-5 h-5 accent-blue-500"
                                        />
                                    </div>

                                    <div className="flex justify-end">
                                        <button
                                            onClick={() => {
                                                setSelectedShippingInfo(tempAddress);
                                                handleClose(); // đóng dialog
                                            }}
                                            className="text-blue-600 hover:underline text-sm font-medium"
                                        >
                                            Chọn
                                        </button>
                                    </div>
                                </div>
                            )}
                            <div className="flex justify-center mt-4">
                                <button
                                    onClick={handleAddAddressOpen}
                                    className="bg-red-100 text-red-600 font-semibold px-6 py-2 rounded-lg hover:bg-red-200 transition-all"
                                >
                                    Thêm địa chỉ
                                </button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>

                <Dialog open={showAddAddress} onClose={handleAddAddressClose} fullWidth maxWidth="sm">
                    <DialogTitle>
                        <div className="flex items-center">
                            <button
                                onClick={() => {
                                    handleAddAddressClose();
                                    setOpen(true); // Quay lại dialog chính nếu cần
                                }}
                                className="mr-2 text-blue-600 font-bold"
                            >
                                ←
                            </button>
                            <span className="flex-grow text-center font-bold">Thêm địa chỉ mới</span>
                        </div>
                        <IconButton
                            aria-label="close"
                            onClick={handleAddAddressClose}
                            sx={{
                                position: "absolute",
                                right: 8,
                                top: 8,
                                color: (theme) => theme.palette.grey[500],
                            }}
                        >
                            <CloseIcon />
                        </IconButton>
                    </DialogTitle>

                    <DialogContent dividers>
                        <div className="space-y-4 mt-2">
                            <div className="grid md:grid-cols-2 gap-4">
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
                                    <label className="block font-medium mb-1">Số điện thoại nhận hàng</label>
                                    <input
                                        type="tel"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        className="w-full p-3 rounded border focus:outline-none focus:ring-2 focus:ring-blue-400"
                                        placeholder="Nhập số điện thoại..."
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block font-medium mb-1">Ghi chú (Không bắt buộc)</label>
                                <textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    rows={3}
                                    className="w-full p-3 rounded border focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    placeholder="Ghi chú thêm (nếu có)..."
                                />
                            </div>
                            <div className="flex justify-end pt-4">
                                <button
                                    onClick={() => {
                                        setTempAddress({
                                            address,
                                            phone,
                                            notes,
                                        });
                                        setShowAddAddress(false);
                                        setOpen(true); // Mở lại dialog chọn địa chỉ
                                    }}
                                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg transition-all"
                                >
                                    Lưu
                                </button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>

                {/* Sản phẩm trong giỏ */}
                <div className="bg-white sm:p-6 rounded-2xl shadow-lg border border-gray-200">
                    {Object.entries(groupItemsByDate(orderItems as LocalOrderItem[])).map(([date, items]) => (
                        <div key={date} className="mb-6 border border-gray-200 rounded-xl p-4">
                            <div className="flex items-center justify-between mb-2">
                                <label className="flex items-center gap-2 text-sm text-gray-600">
                                    <input
                                    type="checkbox"
                                    checked={selectedDates.includes(date)}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                        setSelectedDates([...selectedDates, date]);
                                        } else {
                                        setSelectedDates(selectedDates.filter((d) => d !== date));
                                        }
                                    }}
                                    className="w-5 h-5 rounded-full border border-gray-300 text-white bg-white checked:bg-red-200 checked:border-red-400 checked:text-white focus:ring-0 appearance-none relative checked:after:content-['✓'] checked:after:text-[12px] checked:after:text-white checked:after:absolute checked:after:inset-0 checked:after:flex checked:after:items-center checked:after:justify-center"
                                    />
                                    Chọn
                                </label>

                                <p className="sm:text-base text-sm font-medium text-gray-700">
                                    Ngày thêm: {date}
                                </p>
                            </div>


                            {items.map((item) => (
                                <div key={item.id + item.addedDate} className="flex sm:flex-col md:flex-row md:items-start sm:gap-4 gap-2 border-b pb-4 mb-4">
                                    <img
                                        src={item.imageUrl}
                                        alt={item.nameProduct}
                                        className="w-24 h-24 object-cover rounded-xl border"
                                    />
                                    <div className="sm:flex-1">
                                        <p className="font-semibold text-gray-800">{item.nameProduct}</p>
                                        <p className=" text-sm text-gray-600 mt-1 sm:line-clamp-none line-clamp-1">{item.description}</p>

                                        <div className="flex items-center gap-2 sm:mt-2 text-sm">
                                            <span>Số lượng:</span>
                                            <button
                                                onClick={() => handleDecreaseQuantity(orderItems.findIndex(i => i.id === item.id))}
                                                className="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-full"
                                                disabled={item.quantity <= 1}> -
                                            </button>
                                            <span>{item.quantity}</span>
                                            <button
                                                onClick={() => handleIncreaseQuantity(orderItems.findIndex(i => i.id === item.id))}
                                                className="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-full"> +
                                            </button>
                                        </div>

                                        <p className="mt-2 text-orange-600 text-sm font-medium">
                                            Thành tiền: {(item.price * item.quantity).toLocaleString()} VNĐ
                                        </p>
                                    </div>
                                    <button className="text-red-500 text-sm hover:underline self-end"
                                        onClick={() =>handleRemoveItem(orderItems.findIndex(i => i.id === item.id), item.nameProduct)}>
                                        <Trash2 size={16} className="inline-block mr-1" /> Xóa
                                    </button>
                                </div>
                            ))}

                        </div>
                    ))}
                </div>

                {/* Tổng tiền và nút mua */}
                <div className="bg-white flex-wrap p-6 rounded-2xl shadow-lg border border-gray-200 flex justify-between items-center">
                    <label className="flex items-center gap-2">
                        <input
                        type="checkbox"
                        checked={
                            selectedDates.length ===
                            new Set(
                            (orderItems as LocalOrderItem[]).map(item =>
                                new Date(item.addedDate).toLocaleDateString("vi-VN")
                            )
                            ).size
                        }
                        onChange={handleToggleAllDates}              
                        className="w-5 h-5 rounded-full border border-gray-300 bg-white checked:bg-red-200 checked:border-red-400 appearance-none relative checked:after:content-['✓'] checked:after:text-[12px] checked:after:text-white checked:after:absolute checked:after:inset-0 checked:after:flex checked:after:items-center checked:after:justify-center"
                        />
                        <span className="text-gray-700 text-sm">Chọn tất cả</span>
                    </label>

                    <div className="flex items-center gap-4 ml-auto">
                        <div className="sm:text-lg text-[16px] font-semibold text-gray-700">
                            Tổng tiền:{" "}
                            <span className="text-orange-600">
                                {(orderItems as LocalOrderItem[])
                                .filter(item => selectedDates.includes(new Date(item.addedDate).toLocaleDateString("vi-VN")))
                                .reduce((total, item) => total + item.price * item.quantity, 0)
                                .toLocaleString()} VNĐ
                            </span>
                        </div>

                        <button
                            onClick={handleSubmitOrder}
                            className={`flex items-center gap-2 sm:text-[16px] text-sm font-bold py-3 px-6 rounded-2xl shadow-lg transition duration-300 ${
                                selectedDates.length === 0
                                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                : "bg-orange-500 hover:bg-orange-600 text-white"
                            }`}>
                            Mua hàng
                            {/* <span className="bg-white text-orange-600 font-bold rounded-full px-2 py-0.5 text-sm">
                                {selectedDates.length}
                                {(orderItems as LocalOrderItem[]).length}
                            </span> */}
                        </button>
                    </div>
                </div>
            </>
            )}
        </motion.div>
    );
};

export default OrderCartView;
