import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import RegisterForm from "../page/auth/Register";
import GetUser from "../page/auth/GetUser";
import LoginForm from "../page/auth/LoginForm";
import SettingsDetail from "../page/setting/SettingsDetail";
// import ProfileDetail from "../page/auth/ProfileDetail";
import ForgotPassword from "../page/auth/ForgotPassword";

import Menu from "../components/menu/Menu";

import BookingPage from "../page/appointment-LichHen/DatLichhen";
import AppointmentList from "../page/appointment-LichHen/XemLichDatHen";
import AccountCustomer from "../page/customer-KhachHang/AccountCustomer";

import PaymentSuccess from "../page/Payment/PaymentSuccess";

const NavigatorBrowser: React.FC = () => {
  return (
    <Router>
      <Content />
    </Router>
  );
};

// Component chứa menu + điều hướng
const Content: React.FC = () => {
  const location = useLocation();

  // Các trang không hiển thị menu
  const hiddenMenuPaths = ["/login", "/register", "/forgot-password", "/profile", "/profile/account", "/profile/listbooking", "/profile/orders", "/profile/myorders", "/profile/address", "/profile/favorite", "/settings", "/booking", "/listbooking", "/payment-success", "/confirm-payment" ];
  const shouldShowMenu = !hiddenMenuPaths.includes(location.pathname);

  return (
    <>
      {/* Chỉ hiển thị Menu nếu không thuộc hiddenMenuPaths */}
      {shouldShowMenu && <Menu />}

      <Routes>
        {/* Các trang KHÔNG có trong Menu */}
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/booking" element={<BookingPage />} />
        <Route path="/listbooking" element={<AppointmentList />} />
        {/* <Route path="/profile" element={<AccountCustomer />} /> */}
        <Route path="/profile/*" element={<AccountCustomer />} />

        <Route path="/payment-success" element={<PaymentSuccess />}></Route>

        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/getuserid" element={<GetUser />} />
        {/* <Route path="/profile" element={<ProfileDetail />} /> */}
        <Route path="/settings" element={<SettingsDetail />} />
      </Routes>
    </>
  );
};

export default NavigatorBrowser;

