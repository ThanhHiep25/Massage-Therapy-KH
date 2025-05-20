import { useState } from "react";
import { useAuth } from "../../hook/AuthContext"; // hook lấy user đăng nhập
import ProfileDetail from "../auth/ProfileDetail";
import AppointmentList from "../appointment-LichHen/XemLichDatHen";
import { useLocation, useNavigate } from "react-router-dom";
import InvoiceList from "../appointment-LichHen/DichVuChoDatHen";
import OrderCartView from "../shoppingcart-GioHang/GioHang";
import OrderList from "../order-DonHang/OrderList";
import { Close } from "@mui/icons-material";
import { Menu } from "lucide-react";


const tabs = [
  {key: "home", label: "Trang chủ"},
  { key: "account", label: "Thông tin tài khoản" },
  { key: "profile", label: "Quản lý tài khoản" },
  { key: "listbooking", label: "Lịch hẹn của tôi" },
  { key: "orders", label: "Giỏ hàng của tôi" },
  { key: "myorders", label: "Đơn hàng của tôi" }
];

const genderMap: Record<string, string> = {
  male: "Nam",
  female: "Nữ",
  other: "Không xác định",
};

const formatDate = (dateString: string | undefined): string => {
  if (!dateString) return "Chưa cập nhật";
  const [year, month, day] = dateString.split("-");
  return `${day}-${month}-${year}`;
};

const AccountCustomer: React.FC = () => {
  const location = useLocation();
  const pathParts = location.pathname.split("/");
  const tab = pathParts[2] || "profile"; // lấy phần sau "/profile/"
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);


  const navigate = useNavigate();

  const { user } = useAuth(); // Lấy user từ context
  // const [bookingTab, setBookingTab] = useState("appointment"); // Tabs phụ cho Booking

  const [bookingTab, setBookingTab] = useState(() => {      // Tabs phụ cho Booking
    return location.state?.initialTab || "appointment";
  });

  const [invoiceTab, setInvoiceTab] = useState("productcart");

  const [orderProductTab, setorderProductTab] = useState("orderall");
  const toggleMobileMenu = () => setIsMobileMenuOpen(prev => !prev);


  const setActiveTab = (tabKey: string) => {
    if (tabKey === "home") {
      navigate(`/`);
      setIsMobileMenuOpen(false);
    }else if (tabKey === "profile") {
      navigate(`/profile`); // Không có thêm /profile
      setIsMobileMenuOpen(false);
    } else {
      navigate(`/profile/${tabKey}`);
      setIsMobileMenuOpen(false);
    }
  };

  const renderContent = () => {
    switch (tab) {
      case "home":
        return (
          <div>
            <h2 className="text-xl font-semibold mb-6">Trang chủ</h2>
            <p>Trang chủ</p>
          </div>
        )
      case "account":
        return (
          <div>
            <h2 className="text-xl font-semibold mb-6">Thông tin tài khoản</h2>
            <div className="flex items-center mb-6 border-b-4 pb-6">
              <img
                src={user?.imageUrl || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                alt="Avatar"
                className="w-24 h-24 rounded-full border-4 border-white shadow-md"
              />
              <div className="ml-4">
                <p className="text-xl font-bold">{user?.name}</p>
                <p className="text-base text-gray-500">{user?.email}</p>
                <button
                  onClick={() => setActiveTab("profile")}
                  className="mt-1 text-sm text-blue-500 hover:underline hover:text-blue-700 transition-colors"
                >
                  Chỉnh sửa
                </button>
              </div>
            </div>

            <table className="w-full border-separate border-spacing-y-4">
              <tbody>
                <tr>
                  <td className="font-medium pr-4 w-1/3">Họ tên:</td>
                  <td>{user?.name || "Chưa cập nhật"}</td>
                </tr>
                <tr>
                  <td className="font-medium pr-4 w-1/3">Email:</td>
                  <td>{user?.email || "Chưa cập nhật"}</td>
                </tr>
                <tr>
                  <td className="font-medium pr-4 w-1/3">Số điện thoại:</td>
                  <td>{user?.phone || "Chưa cập nhật"}</td>
                </tr>
                <tr>
                  <td className="font-medium pr-4 w-1/3">Giới tính:</td>
                  <td>{genderMap[user?.gender || "other"]}</td>
                </tr>
                <tr>
                  <td className="font-medium pr-4 w-1/3">Ngày sinh:</td>
                  <td>{formatDate(user?.dateOfBirth)}</td>
                </tr>
                <tr>
                  <td className="font-medium pr-4">Địa chỉ:</td>
                  <td>{user?.address || "Chưa cập nhật"}</td>
                </tr>
              </tbody>
            </table>
          </div>
        );

      case "profile":
        return (
          <div>
            <h2 className="text-xl font-semibold mb-2">Quản lý tài khoản</h2>
            <ProfileDetail />
          </div>
        );

      case "listbooking":
        return (
          <div>
            <h2 className="text-xl font-semibold mb-2">Danh sách lịch hẹn</h2>
            {/* Tabs phụ trong Booking */}
            <div className="flex space-x-6 border-b border-gray-200 mb-4">
              {[
                { label: "Dịch vụ chờ đặt lịch hẹn", key: "bookingdelay" },
                { label: "Lịch hẹn", key: "appointment" },
                { label: "Lịch sử", key: "history" },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setBookingTab(tab.key)}
                  className={`pb-1 text-sm font-medium transition-colors ${bookingTab === tab.key
                    ? "text-orange-600 border-b-2 border-orange-600"
                    : "text-gray-600 border-b-2 border-transparent hover:text-orange-500"
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {bookingTab === "bookingdelay" && (
              <InvoiceList filterByStatus={["PENDING"]} currentUserId={user?.id} />
            )}

            {bookingTab === "appointment" && (
              <AppointmentList filterByStatus={["PENDING", "SCHEDULED"]} />
            )}

            {bookingTab === "history" && (
              <AppointmentList filterByStatus={["CANCELLED", "COMPLETED", "PAID"]} />
            )}

          </div>
        );

      case "orders":
        return (
          <div>
            <h2 className="text-xl font-semibold mb-2">Danh sách giỏ hàng</h2>
            <div className="flex space-x-6 border-b border-gray-200 mb-4">
              {[
                // { label: "Dịch vụ chờ đặt lịch hẹn", key: "bookingdelay" },
                { label: "Giỏ hàng sản phẩm", key: "productcart" },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setInvoiceTab(tab.key)}
                  className={`pb-1 text-sm font-medium transition-colors ${invoiceTab === tab.key
                    ? "text-orange-600 border-b-2 border-orange-600"
                    : "text-gray-600 border-b-2 border-transparent hover:text-orange-500"
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            {/* {invoiceTab === "bookingdelay" && (
                <InvoiceList filterByStatus={["PENDING"]} currentUserId={user?.id} />
              )} */}
            {invoiceTab === "productcart" && (
              <OrderCartView />
            )}
          </div>
        );
      case "myorders":
        return (
          <div >
            <h2 className="text-xl font-semibold mb-2">Danh sách đơn hàng</h2>
            <div className="flex space-x-6 border-b  border-gray-200 mb-4">
              {[
                { label: "Tất cả", key: "orderall" },
                { label: "Mới đặt", key: "orderpending", status: ["PENDING"] },
                // { label: "Đang xử lý", key: "orderprocessing", status: ["PROCESSING"] },
                // { label: "Đang vận chuyển", key: "ordershipping", status: ["SHIPPED"] },
                { label: "Thành công", key: "orderdelivered", status: ["DELIVERED"] },
                { label: "Đã hủy", key: "ordercanceled", status: ["CANCELLED"] },
                { label: "Đã thanh toán", key: "orderpaid", status: ["PAID"] },
                //  { label: "Đã hoàn tiền", key: "orderrefund", status: ["REFUND"] },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setorderProductTab(tab.key)}
                  className={`pb-1 text-sm font-medium transition-colors ${orderProductTab === tab.key
                    ? "text-orange-600 border-b-2 border-orange-600"
                    : "text-gray-600 border-b-2 border-transparent hover:text-orange-500"
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {orderProductTab === "orderall" && <OrderList />}
            {orderProductTab === "orderpending" && <OrderList filterByStatus={["PENDING"]} />}
            {orderProductTab === "orderprocessing" && <OrderList filterByStatus={["PROCESSING"]} />}
            {orderProductTab === "ordershipping" && <OrderList filterByStatus={["SHIPPED"]} />}
            {orderProductTab === "orderdelivered" && <OrderList filterByStatus={["DELIVERED"]} />}
            {orderProductTab === "ordercanceled" && <OrderList filterByStatus={["CANCELLED"]} />}
            {orderProductTab === "orderpaid" && <OrderList filterByStatus={["PAID"]} />}
            {orderProductTab === "orderrefund" && <OrderList filterByStatus={["REFUND"]} />}
          </div>
        );
      default:
        return <div>Chọn mục ở bên trái để xem thông tin.</div>;
    }
  };

  return (
    <div className="flex  justify-center py-10 px-4 min-h-screen" style={{ background:"url('../../../public/dua.jpg')"}}>
      <div className="flex sm:flex-row flex-col w-full max-w-7xl gap-4 sm:mt-10">
        {/* Hamburger Menu Button (mobile only) */}
        <div className="lg:hidden">
          <button onClick={toggleMobileMenu} className="p-1 sm:p-2 text-white hover:text-blue-500">
            {isMobileMenuOpen ? <Close sx={{ fontSize: { xs: 26, sm: 30 } }} /> : <Menu />}
          </button>
        </div>
        {isMobileMenuOpen && (
          <div className="sm:w-1/4">
            <div className="bg-white rounded-xl shadow p-4 space-y-5">
              {/* <div className="flex flex-col items-center text-center mb-4">
              <img
                src={user?.imageUrl || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                alt="Avatar"
                className="w-16 h-16 mb-3 rounded-full border-4 border-white shadow-md"
              />
              <div className="font-semibold text-gray-800">
                {user?.name ? `Chào ${user.name}` : "Tài khoản"}
              </div>
              <div
                className="text-sm mt-1 text-gray-500 cursor-pointer hover:underline hover:text-blue-700"
                onClick={() => setActiveTab("profile")}
              >
                Chỉnh sửa tài khoản
              </div>
            </div> */}

              {tabs.map((tabItem) => (
                <button
                  key={tabItem.key}
                  onClick={() => setActiveTab(tabItem.key)}
                  className={`block w-full text-left px-3 py-2 rounded hover:bg-green-100 ${tab === tabItem.key ? "bg-green-100 font-medium" : ""
                    }`}
                >
                  {tabItem.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Desktop sidebar */}
        <div className="hidden lg:block sm:w-1/4">
          <div className="bg-white rounded-xl shadow p-4 space-y-5">
            {/* <div className="flex flex-col items-center text-center mb-4">
              <img
                src={user?.imageUrl || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                alt="Avatar"
                className="w-16 h-16 mb-3 rounded-full border-4 border-white shadow-md"
              />
              <div className="font-semibold text-gray-800">
                {user?.name ? `Chào ${user.name}` : "Tài khoản"}
              </div>
              <div
                className="text-sm mt-1 text-gray-500 cursor-pointer hover:underline hover:text-blue-700"
                onClick={() => setActiveTab("profile")}
              >
                Chỉnh sửa tài khoản
              </div>
            </div> */}

            {tabs.map((tabItem) => (
              <button
                key={tabItem.key}
                onClick={() => setActiveTab(tabItem.key)}
                className={`block w-full text-left px-3 py-2 rounded hover:bg-green-100 ${tab === tabItem.key ? "bg-green-100 font-medium" : ""
                  }`}
              >
                {tabItem.label}
              </button>
            ))}
          </div>
        </div>

        {/* Sidebar */}


        {/* Nội dung */}
        <div className="sm:w-3/4 w-full">
          <div className="bg-white rounded-xl sm:shadow sm:p-6 p-2  min-h-[510px]">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountCustomer;
