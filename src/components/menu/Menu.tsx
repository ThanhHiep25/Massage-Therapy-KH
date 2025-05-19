import { useState, useEffect } from "react";
import {
    AccountCircleOutlined,
    LogoutOutlined,
    SettingsOutlined,
    Visibility,
    VisibilityOff,
    Person,
    Lock,
    LockOpen,

    ShoppingCart,
    Home,
    AutoAwesome,
    Spa,
    Article,
    ContactMail,
    ChatBubbleOutlineOutlined,
    ArrowUpwardOutlined,
    KeyboardArrowDown,
    Close,
    ShoppingBag,
    LocalShipping,
    Menu as MenuIcon,
} from "@mui/icons-material";
import { Avatar, Box } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hook/AuthContext";
import { loginUser, logout } from "../../service/apiService";
import { motion, AnimatePresence } from "framer-motion";
import Footer from "../footer/Footer";
import { Signature, User } from "lucide-react";

import TrangChu from "../../page/home-TrangChinh/TrangChu";
import GioiThieu from "../../page/aboutus-GioiThieu/GioiThieu";
import DichVu from "../../page/service-DichVu/DichVu";
import SanPham from "../../page/product-SanPham/SanPham";
import TinTuc from "../../page/news-TinTuc/TinTuc";
import LienHe from "../../page/contact-LienHe/LienHe";

import Chatbot from "../google/Chatbot";

import { getOrderUser } from "../../service/apiProduct"; // Lấy dữ liệu giỏ hàng từ API
import { OrderItemResponse } from "../../interface/Order_interface";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

// import OrderAdd from "../../page/order-DonHang/OrderAdd";
// import OrderList from "../../page/order-DonHang/OrderList";

// import ProductAdd from "../../page/product-SanPham/ProductAdd";
// import AddService from "../../page/service-DichVu/DichVuAdd";

interface Order {
    id: number;
    status: string;
}
export interface LocalOrderItem extends OrderItemResponse {
    userId: number;
    addedDate: string;
}

const Menu: React.FC = () => {
    const location = useLocation();
    const navigation = useNavigate();
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false); // Renamed from isMenuOpen for clarity
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // State for mobile menu
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const { login, user, logoutContext } = useAuth();

    const [formData, setFormData] = useState({ email: "", password: "" });
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [focused, setFocused] = useState({ email: false, password: false });
    const [showChat, setShowChat] = useState(false);

    const toggleUserMenu = () => setIsUserMenuOpen(prev => !prev);
    const toggleMobileMenu = () => setIsMobileMenuOpen(prev => !prev); // Toggle for mobile menu
    const toggleLoginForm = () => setIsLoginOpen(prev => !prev);
    const handleNavigation = (path: string) => {
        navigation(path);
        setIsMobileMenuOpen(false); // Close mobile menu on navigation
        setIsUserMenuOpen(false); // Close user menu on navigation
    }
    const [activePage, setActivePage] = useState("home");
    // const [dropDown, setDropDown] = useState(false); // Not used, can be removed

    // const handleDropDown = () => { // Not used, can be removed
    //     setDropDown(prev => !prev);
    // };

    const [hoveredMenu, setHoveredMenu] = useState<string | null>(null);
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const handleMouseEnter = (id: string) => {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        setHoveredMenu(id);
    };

    const handleMouseLeave = () => {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => setHoveredMenu(null), 300);
    };

    interface SubItem {
        id: string;
        label: string;
        path: string;
        icon: JSX.Element;
    }

    interface MenuItem {
        id: string;
        label: string;
        path: string;
        subItems?: SubItem[];
    }

    const menuItems: MenuItem[] = [
        { id: "home", label: "Trang chủ", path: "/trangchu" },
        { id: "about", label: "Giới thiệu", path: "/gioithieu" },
        { id: "services", label: "Dịch vụ", path: "/dichvu" },
        { id: "product", label: "Sản phẩm", path: "/sanpham" },
        { id: "news", label: "Tin tức", path: "/tintuc" },
        { id: "contact", label: "Liên hệ", path: "/lienhe" }
    ];

    const iconMap = {
        home: <Home fontSize="medium" className="text-green-500 relative mb-1" />,
        about: <AutoAwesome fontSize="medium" className="text-green-500 relative mb-1" />,
        services: <Spa fontSize="medium" className="text-green-500 relative mb-1" />,
        product: <ShoppingBag fontSize="medium" className="text-green-500 relative mb-1" />,
        news: <Article fontSize="medium" className="text-green-500 relative mb-1" />,
        contact: <ContactMail fontSize="medium" className="text-green-500 relative mb-1" />
    };

    const handleMenuClick = (id: string, path: string) => {
        setActivePage(id);
        if (id === "home") {
            window.history.pushState({}, "", "/");
        } else {
            window.history.pushState({}, "", path);
        }
        window.scrollTo(0, 0);
        setIsMobileMenuOpen(false); // Close mobile menu on click
    };

    useEffect(() => {
        const currentPath = window.location.pathname;
        const foundItem = menuItems.find(item => item.path === currentPath || (currentPath === "/" && item.id === "home"));
        if (foundItem) {
            setActivePage(foundItem.id);
        } else if (currentPath === "/") {
            setActivePage("home");
        }
    }, [location.pathname]);


    useEffect(() => {
        const handlePopState = () => {
            const currentPath = window.location.pathname;
            const foundItem = menuItems.find(item => item.path === currentPath || (currentPath === "/" && item.id === "home"));
            if (foundItem) {
                setActivePage(foundItem.id);
            } else if (currentPath === "/") {
                setActivePage("home");
            } else {
                // Fallback or set to a default if no match, e.g. not found page could be handled here
                setActivePage("home"); // Default to home if no specific match
            }
        };
        window.addEventListener("popstate", handlePopState);
        handlePopState(); // Initial check
        return () => window.removeEventListener("popstate", handlePopState);
    }, []);

    const [isScrolled, setIsScrolled] = useState(false);
    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 80);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleLogout = async () => {
        try {
            await logout();
            logoutContext();
            setIsUserMenuOpen(false);
            setIsMobileMenuOpen(false);
            setCartOrderCount(0);
            setCartItemCount(0);
            navigation("/"); // Navigate to home on logout
            setActivePage("home");
        } catch (error: unknown) {
            console.log("Logout error:", error instanceof Error ? error.message : error);
        }
    };

    const [showShop, setShowShop] = useState(false);
    const [showCart, setShowCart] = useState(false);
    const [cartOrderCount, setCartOrderCount] = useState(0);
    const [cartItemCount, setCartItemCount] = useState(0);

    const updateCartItemCount = () => {
        const userStr = localStorage.getItem("user");
        const cartStr = localStorage.getItem("orderItems");
        if (userStr && cartStr) {
            const currentUser = JSON.parse(userStr);
            const allItems = JSON.parse(cartStr) as LocalOrderItem[];
            const userItems = allItems.filter(item => item.userId === currentUser.id);
            setCartItemCount(userItems.length);
        } else {
            setCartItemCount(0);
        }
    };

    useEffect(() => {
        if (user?.id) updateCartItemCount();
        else setCartItemCount(0);
        window.addEventListener("storage", updateCartItemCount);
        return () => window.removeEventListener("storage", updateCartItemCount);
    }, [user]);

    useEffect(() => {
        const fetchOrders = async () => {
            const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
            const userId = currentUser?.id;
            if (!userId) return;
            try {
                const ordersData: Order[] = await getOrderUser(userId);
                const orderCount = ordersData.filter((order: Order) => order.status !== "Đã giao").length;
                setCartOrderCount(orderCount);
            } catch (err) {
                console.error("Lỗi khi lấy dữ liệu giỏ hàng:", err);
            }
        };
        if (user?.id) fetchOrders();
        else setCartOrderCount(0);
    }, [user]);

    useEffect(() => {
        if (!user) {
            const storedUser = localStorage.getItem("user");
            if (storedUser) login(JSON.parse(storedUser));
        }
    }, [user, login]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleFocus = (field: "email" | "password") => setFocused(prev => ({ ...prev, [field]: true }));
    const handleBlur = (field: "email" | "password") => setFocused(prev => ({ ...prev, [field]: formData[field] !== "" }));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await loginUser(formData);
            login(response.data.user);
            setMessage("");
            const loggedInUser = response.data.user;
            if (loggedInUser.id) {
                const ordersData = await getOrderUser(loggedInUser.id);
                const orderCount = ordersData.filter((order: Order) => order.status !== "Đã giao").length;
                setCartOrderCount(orderCount);
                updateCartItemCount();
            }
            setFormData({ email: "", password: "" });
            setFocused({ email: false, password: false });
            setIsLoginOpen(false);
        } catch (error: unknown) {


            if (axios.isAxiosError(error)) {
                const errorMessage = error.response?.data?.message || error.message;
                if (errorMessage === "Blocked") {
                    toast.warning("Tài khoản của bạn đã bị khóa!");
                } else if (errorMessage === "User not found") {
                    toast.error("Email không tồn tại!");
                } else if (errorMessage === "Invalid username or password!") {
                    toast.error("Sai email hoặc mật khẩu!");
                } else if (error.response?.data?.code === 1001) {
                    toast.error("Sai mật khẩu!");
                } else {
                    toast.error("Đã xảy ra lỗi, vui lòng thử lại!");
                }
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleViewCart = () => {
        if (!localStorage.getItem("user")) {
            setIsLoginOpen(true);
            return;
        }
        navigation("/profile/orders");
    };

    const handleViewOrders = () => {
        if (!localStorage.getItem("user")) {
            setIsLoginOpen(true);
            return;
        }
        navigation("/profile/myorders");
    };

    // if (isLoading) return <p>Đang tải...</p>; // This might be too broad, consider more specific loading states

    return (
        <div className="flex flex-col min-h-screen">
            <ToastContainer />
            {!showChat && (
                <div className="fixed bottom-6 right-4 md:right-[65px] z-50">
                    <button
                        className="p-3 md:p-5 bg-blue-600 text-white rounded-full shadow-lg transition-all hover:bg-blue-700 hover:scale-110"
                        title="Mở Chat"
                        onClick={() => setShowChat(true)}
                    >
                        <ChatBubbleOutlineOutlined className="w-6 h-6 md:w-8 md:h-8" />
                    </button>
                </div>
            )}

            <AnimatePresence>
                {showChat && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                        className="fixed  inset-0 md:bottom-0 md:right-4 md:left-auto md:top-auto w-full sm:m-5 sm:p-1 h-full md:w-[380px] md:h-[calc(100vh-100px)] md:max-h-[650px] lg:right-16 bg-white rounded-none md:rounded-xl shadow-2xl border border-gray-300 overflow-hidden z-50"
                    >
                        <button
                            className="absolute top-3 right-3 text-gray-600 md:text-white hover:text-red-500 z-10 bg-black/20 md:bg-transparent rounded-full p-1"
                            title="Đóng Chat"
                            onClick={() => setShowChat(false)}
                        >
                            <Close className="w-6 h-6" />
                        </button>
                        <Chatbot />
                    </motion.div>
                )}
            </AnimatePresence>

            {isScrolled && (
                <div className="fixed bottom-[76px] right-4 md:bottom-8 md:right-3 z-50">
                    <button
                        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                        className="p-2 bg-gray-500 text-white rounded-full shadow-lg transition-all hover:bg-pink-300 hover:scale-110"
                        title="Lên đầu trang"
                    >
                        <ArrowUpwardOutlined className="w-5 h-5" />
                    </button>
                </div>
            )}

            {/* Header */}
            <div
                className={`fixed -top-1.5 w-full p-3 sm:p-4 z-30 flex bg-transparent items-center justify-between transition-all duration-300  ${isScrolled
                    ? "bg-white border-b border-gray-300 dark:border-gray-700 shadow-lg"
                    : "translate-y-2 bg-white/20 " // Removed bounce animation for smoother feel
                    }`}
            >
                {/* Logo */}
                <div className="flex items-center justify-between sm:px-4 gap-3"
                    onClick={() => {
                        handleMenuClick("home", "/trangchu");
                        // setIsMobileMenuOpen(false); // handleMenuClick already does this
                    }}
                >
                    <Signature className="cursor-pointer size-10" />
                    <p className='h-[50px] w-[2px] bg-black'></p>
                    <h1 className={`text-2xl font-bold`}><span className='text-[16px]'>SPA</span> <br />Royal 🍃</h1>
                </div>

                {/* Desktop Menu */}
                <nav className="hidden lg:flex flex-grow justify-center items-center space-x-4 md:space-x-6 lg:space-x-8 xl:space-x-10 2xl:space-x-12">
                    {menuItems.map(({ id, label, path, subItems }) => (
                        <div
                            key={id}
                            onMouseEnter={() => handleMouseEnter(id)}
                            onMouseLeave={handleMouseLeave}
                            className="relative"
                        >
                            <motion.button
                                onClick={() => handleMenuClick(id, path)}
                                className="relative flex flex-col items-center uppercase text-xs xl:text-sm font-bold transition-all duration-300 group py-2"
                                whileHover={{
                                    scale: 1.05,
                                    textShadow: "0px 0px 8px rgba(34, 197, 94, 0.8)",
                                }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <div className="relative flex items-center space-x-1">
                                    <div className={`relative ${activePage === id ? 'text-green-500' : 'text-gray-700 group-hover:text-green-400'}`}>
                                        {iconMap[id as keyof typeof iconMap]}
                                    </div>
                                    <span className={`relative px-1 ${activePage === id ? 'text-green-500' : 'text-gray-700 group-hover:text-green-400'}`}>
                                        {label}
                                        {subItems && (
                                            <motion.span
                                                className="ml-1 text-gray-700 group-hover:text-green-400"
                                                animate={{ rotate: hoveredMenu === id ? 180 : 0 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                <KeyboardArrowDown style={{ fontSize: "24px" }} />
                                            </motion.span>
                                        )}
                                    </span>
                                </div>
                                {activePage === id && (
                                    <motion.div
                                        className="absolute bottom-[-2px] left-0 w-full h-[2px] bg-green-500"
                                        layoutId="underline"
                                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                    />
                                )}
                            </motion.button>
                            {subItems && hoveredMenu === id && (
                                <motion.ul
                                    className="absolute top-full bg-white shadow-lg rounded-md mt-2 w-64 overflow-hidden z-10" // bg-white for submenu
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    transition={{ duration: 0.2 }}
                                    onMouseEnter={() => handleMouseEnter(id)} // Keep submenu open
                                    onMouseLeave={handleMouseLeave}         // Allow leaving
                                >
                                    {subItems.map(sub => (
                                        <motion.div
                                            key={sub.id}
                                            className="hover:bg-gray-100 transition"
                                        >
                                            <a // Changed to <a> for standard practice, ensure correct routing if using React Router elsewhere for these
                                                href={sub.path} // Or use onClick with navigation if these are internal routes
                                                onClick={(e) => { e.preventDefault(); handleNavigation(sub.path); }}
                                                className="block text-gray-800 hover:text-red-600 transition"
                                            >
                                                <motion.div
                                                    className="flex items-center px-4 py-3 text-sm"
                                                    whileHover={{ x: 5 }}
                                                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                                                >
                                                    {sub.icon}
                                                    <span className="ml-2">{sub.label}</span>
                                                </motion.div>
                                            </a>
                                        </motion.div>
                                    ))}
                                </motion.ul>
                            )}
                        </div>
                    ))}
                </nav>

                {/* Right side icons and User section */}
                <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-3">
                    {/* Cart and Order Icons */}
                    <div className="flex items-center space-x-1 sm:space-x-2">
                        <div
                            className="relative p-1 sm:p-2"
                            onMouseEnter={() => setShowCart(true)}
                            onMouseLeave={() => setShowCart(false)}
                        >
                            <ShoppingCart
                                className="cursor-pointer hover:scale-110 transition-all duration-300 text-gray-700"
                                sx={{ fontSize: { xs: 24, sm: 26, md: 28 } }}
                                onClick={handleViewCart}
                            />
                            {cartItemCount > 0 && (
                                <div className="absolute -top-1 -right-1 bg-green-600 text-white text-[10px] sm:text-xs font-bold rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center">
                                    {cartItemCount}
                                </div>
                            )}
                            {showCart && (
                                <div className="absolute top-full right-0 mt-2 bg-white p-3 rounded-md shadow-lg flex items-center space-x-2 transition-all duration-300 min-w-[180px] sm:min-w-[200px] before:content-[''] before:absolute before:-top-2 before:right-2 before:border-8 before:border-transparent before:border-b-white z-10">
                                    {cartItemCount === 0 ? (
                                        <span className="text-sm sm:text-base">Giỏ hàng trống</span>
                                    ) : (
                                        <span className="text-sm sm:text-base">Có {cartItemCount} sản phẩm</span>
                                    )}
                                </div>
                            )}
                        </div>
                        <div
                            className="relative p-1 sm:p-2"
                            onMouseEnter={() => setShowShop(true)}
                            onMouseLeave={() => setShowShop(false)}
                        >
                            <LocalShipping
                                className="cursor-pointer hover:scale-110 transition-all duration-300 text-gray-700"
                                sx={{ fontSize: { xs: 24, sm: 26, md: 28 } }}
                                onClick={handleViewOrders}
                            />
                            {cartOrderCount > 0 && (
                                <div className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] sm:text-xs font-bold rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center">
                                    {cartOrderCount}
                                </div>
                            )}
                            {showShop && (
                                <div className="absolute top-full right-0 mt-2 bg-white p-3 rounded-md shadow-lg flex items-center space-x-2 transition-all duration-300 min-w-[180px] sm:min-w-[200px] before:content-[''] before:absolute before:-top-2 before:right-2 before:border-8 before:border-transparent before:border-b-white z-10">
                                    {cartOrderCount === 0 ? (
                                        <span className="text-sm sm:text-base">Chưa có đơn hàng</span>
                                    ) : (
                                        <span className="text-sm sm:text-base">Có {cartOrderCount} đơn hàng</span>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* User/Login Area */}
                    <div className="flex items-center">
                        {!user ? (
                            <button
                                onClick={toggleLoginForm}
                                className="hidden sm:flex items-center justify-center gap-1 sm:gap-2 px-2 py-1 sm:px-3 sm:py-2 text-blue-500 border border-blue-500 bg-white rounded-full hover:bg-blue-500 hover:text-white transition duration-300 text-xs sm:text-sm"
                            >
                                <User className="w-3 h-3 sm:w-4 sm:h-4 -mt-px" />
                                <span className="font-medium">Đăng nhập</span>
                            </button>
                        ) : (
                            <div className="relative">
                                <button className="flex items-center space-x-1 sm:space-x-2 hover:bg-gray-100 rounded-full px-1 py-1 sm:px-2 sm:py-1 transition"
                                    onClick={toggleUserMenu}>
                                    <Avatar alt={user?.name} src={user?.imageUrl} className="w-7 h-7 sm:w-8 sm:h-8 border-2 border-pink-400 shadow-sm" />
                                    <span className="hidden md:inline text-xs sm:text-sm font-medium text-gray-800">
                                        {user?.name || 'Guest'}
                                    </span>
                                    <KeyboardArrowDown className={`w-3 h-3 sm:w-4 sm:h-4 text-gray-500 transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                                </button>
                                {isUserMenuOpen && (
                                    <div className="absolute right-0 mt-2 w-48 sm:w-52 bg-white rounded-xl shadow-xl border z-50 overflow-hidden animate-fade-in">
                                        <ul className="divide-y text-xs sm:text-sm text-gray-700">
                                            <li>
                                                <button className="w-full flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-3 hover:bg-gray-50" onClick={() => handleNavigation('/profile')}>
                                                    <AccountCircleOutlined className="text-blue-500" /> Thông tin cá nhân
                                                </button>
                                            </li>
                                            <li>
                                                <button className="w-full flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-3 hover:bg-gray-50" onClick={() => handleNavigation('/settings')}>
                                                    <SettingsOutlined className="text-yellow-500" /> Cài đặt
                                                </button>
                                            </li>
                                            <li>
                                                <button className="w-full flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-3 text-red-600 hover:bg-red-50" onClick={handleLogout}>
                                                    <LogoutOutlined /> Đăng xuất
                                                </button>
                                            </li>
                                        </ul>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Hamburger Menu Button (mobile only) */}
                    <div className="lg:hidden">
                        <button onClick={toggleMobileMenu} className="p-1 sm:p-2 text-gray-700 hover:text-blue-500">
                            {isMobileMenuOpen ? <Close sx={{ fontSize: { xs: 26, sm: 30 } }} /> : <MenuIcon sx={{ fontSize: { xs: 26, sm: 30 } }} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Panel */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="fixed inset-0 top-0 left-0 w-full h-full bg-white z-40 p-5 flex flex-col lg:hidden" // z-40 to be above content but below modals
                    >
                        <div className="flex justify-between items-center mb-6 pb-4 border-b">
                            <div className="flex items-center justify-between sm:px-4 gap-3 cursor-pointer" onClick={() => {
                                handleMenuClick("home", "/trangchu");
                                // setIsMobileMenuOpen(false); // handleMenuClick already does this
                            }}>
                                <Signature className="cursor-pointer size-5" />
                                <p className='h-[30px] w-[2px] bg-black'></p>
                                <h1 className={`sm:text-2xl text-sm font-bold`}><span className='text-[12px]'>SPA</span> <br />Royal 🍃</h1>
                            </div>
                            <button
                                onClick={toggleMobileMenu}
                                className="p-2 text-gray-600 hover:text-red-500"
                            >
                                <Close sx={{ fontSize: 28 }} />
                            </button>
                        </div>

                        <nav className="flex flex-col space-y-2">
                            {menuItems.map(({ id, label, path }) => (
                                <button
                                    key={id}
                                    onClick={() => handleMenuClick(id, path)}
                                    className={`w-full text-left py-3 px-4 rounded-lg text-base font-medium transition-colors
                                        ${activePage === id
                                            ? "bg-green-50 text-green-600"
                                            : "text-gray-700 hover:bg-gray-100"
                                        }`}
                                >
                                    {label}
                                </button>
                            ))}
                        </nav>
                        {!user && (
                            <div className="mt-auto pt-6 border-t space-y-3">
                                <button
                                    onClick={() => { toggleLoginForm(); setIsMobileMenuOpen(false); }}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-3 text-blue-500 border border-blue-500 bg-white rounded-full hover:bg-blue-500 hover:text-white transition duration-300 font-medium"
                                >
                                    <User className="w-5 h-5 -mt-px" /> Đăng nhập
                                </button>
                                <button
                                    onClick={() => { handleNavigation('/register'); }}
                                    className="w-full px-4 py-3 text-white bg-blue-500 border border-blue-500 rounded-full hover:bg-blue-600 transition duration-300 font-medium"
                                >
                                    Đăng ký
                                </button>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Login Form Modal (remains the same, but ensure it's above mobile menu if open) */}
            {isLoginOpen && (
                <div className="fixed inset-0 flex items-center justify-center min-h-screen bg-black bg-opacity-50 z-50 p-4">
                    <div className="bg-white shadow-2xl rounded-2xl p-6 sm:p-10 w-full max-w-md sm:max-w-lg animate-fade-in relative">
                        <button onClick={toggleLoginForm} className="absolute text-2xl top-3 right-3 sm:top-4 sm:right-4 text-gray-500 hover:text-gray-800">
                            ✖
                        </button>
                        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-6">Đăng nhập</h2>
                        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                            <div className="relative">
                                <label className={`absolute left-3 sm:left-4 bg-white px-1 transition-all pointer-events-none ml-7 sm:ml-8 ${focused.email ? "-top-2.5 sm:-top-3 left-3 text-blue-500 text-xs sm:text-sm" : "top-3 sm:top-4 text-gray-500 text-sm sm:text-base"}`}>Email</label>
                                <Person className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-xl sm:text-2xl" />
                                <input name="email" placeholder="" onFocus={() => handleFocus("email")} onBlur={() => handleBlur("email")} onChange={handleChange} className="w-full pt-4 pb-2 sm:pt-5 sm:pb-3 pl-10 sm:pl-12 pr-4 sm:pr-5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none text-sm sm:text-base" />
                            </div>
                            <div className="relative">
                                <label className={`absolute left-3 sm:left-4 bg-white px-1 transition-all pointer-events-none ml-7 sm:ml-8 ${focused.password ? "-top-2.5 sm:-top-3 left-3 text-blue-500 text-xs sm:text-sm" : "top-3 sm:top-4 text-gray-500 text-sm sm:text-base"}`}>Mật khẩu</label>
                                <div className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-xl sm:text-2xl">
                                    {formData.password ? <LockOpen /> : <Lock />}
                                </div>
                                <input name="password" placeholder="" type={showPassword ? "text" : "password"} onFocus={() => handleFocus("password")} onBlur={() => handleBlur("password")} onChange={handleChange} className="w-full pt-4 pb-2 sm:pt-5 sm:pb-3 pl-10 sm:pl-12 pr-10 sm:pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none text-sm sm:text-base" required />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-3 sm:right-4 flex items-center text-gray-500 text-xl sm:text-2xl">
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </button>
                            </div>
                            <div className="flex items-center justify-between">
                                <a onClick={() => { navigation("/forgot-password"); setIsLoginOpen(false); }} className="text-blue-500 hover:underline cursor-pointer text-sm sm:text-base">Quên mật khẩu?</a>
                            </div>
                            <button type="submit" disabled={isLoading || !formData.email || !formData.password} className={`w-full py-2.5 sm:py-3 font-bold rounded-lg transition duration-300 text-sm sm:text-base ${isLoading || !formData.email || !formData.password ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600 text-white"}`}>
                                {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
                            </button>
                        </form>
                        {message && <p className="text-red-500 text-center mt-3 sm:mt-4 text-sm">{message}</p>}
                        <p className="text-center text-gray-600 mt-4 sm:mt-6 text-sm sm:text-base">
                            Chưa có tài khoản?{" "}
                            <span onClick={() => { navigation("/register"); setIsLoginOpen(false); }} className="text-blue-500 font-semibold cursor-pointer hover:underline">
                                Đăng ký ngay
                            </span>
                        </p>
                    </div>
                </div>
            )}

            {/* Main Content Area - Pushed down by fixed header */}
            {/* Height of header: p-4 (1rem top/bottom) + h-12 (3rem) = 5rem (80px). So mt-20 (5rem) is correct. */}
            <main className={`flex-grow ${activePage !== "home" ? "pt-[72px] sm:pt-[80px]" : "pt-[60px] sm:pt-[68px]"}`}> {/* Adjusted padding top */}
                {activePage === "home" ? (
                    <TrangChu />
                ) : (
                    <div className="mt-2"> {/* Additional margin for non-home pages if needed, or remove if pt above is sufficient */}
                        {activePage === "about" && <GioiThieu />}
                        {activePage === "services" && <DichVu />}
                        {activePage === "product" && <SanPham />}
                        {activePage === "news" && <TinTuc />}
                        {activePage === "contact" && <LienHe />}
                    </div>
                )}
            </main>

            <Box sx={{ mt: 'auto' }}> {/* Ensure Footer is at the bottom */}
                <Footer />
            </Box>
        </div>
    );
};

export default Menu;