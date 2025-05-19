import { useNavigate } from "react-router-dom";
import { Box } from "@mui/material";
import { Phone, Email, AccessTime, Room } from "@mui/icons-material";

const Footer = () => {
    const navigate = useNavigate();

    // Hàm điều hướng và cuộn lên đầu
    const handleNavigate = (path: string) => {
        navigate(path);
        window.scrollTo(0, 0);
    };

    return (
        <footer className="w-full bg-gradient-to-br from-[#1b4332] via-[#2d6a4f] to-[#40916c] text-white py-4 px-4 text-sm">            
            <div className="max-w-screen-2xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Thông tin liên hệ */}
                <div>
                    <h3 className="text-lg font-semibold mb-4 tracking-wide border-b border-white/30 pb-2">Thông tin liên hệ</h3>
                    <ul className="space-y-3 text-white/90">
                        <li className="flex items-start">
                            <Phone fontSize="small" className="mr-2 mt-1 text-[#ffd6a5]" />
                            Hotline: 012 345 6789
                        </li>
                        <li className="flex items-start">
                            <Email fontSize="small" className="mr-2 mt-1 text-[#ffd6a5]" />
                            contact.jaloo.1@gmail.com
                        </li>
                        <li className="flex items-start">
                            <AccessTime fontSize="small" className="mr-2 mt-1 text-[#ffd6a5]" />
                            09:00 - 21:00 (Hằng ngày)
                        </li>
                        <li className="flex items-start">
                            <Room fontSize="small" className="mr-2 mt-1 text-[#ffd6a5]" />
                            123 Đường Spa, Quận Relax, Thành phố Chill
                        </li>
                    </ul>
                </div>

                {/* Về Spa */}
                <div>
                    <h3 className="text-lg font-semibold mb-4 tracking-wide border-b border-white/30 pb-2">Về Spa</h3>
                    <ul className="space-y-2 text-white/90">
                        <li className="hover:text-blue-400 cursor-pointer" onClick={() => handleNavigate("/gioithieu")}>Giới thiệu</li>
                        <li className="hover:text-blue-400 cursor-pointer" onClick={() => handleNavigate("/dichvu")}>Dịch vụ Spa</li>
                        <li className="hover:text-blue-400 cursor-pointer" onClick={() => handleNavigate("/lienhe")}>Liên hệ</li>
                        <li className="hover:text-blue-400 cursor-pointer" onClick={() => handleNavigate("/sanpham")}>Sản phẩm</li>
                    </ul>
                </div>

                {/* Hỗ trợ + Đăng ký */}
                <div>
                    <h3 className="text-lg font-semibold mb-4 tracking-wide border-b border-white/30 pb-2">Hỗ trợ</h3>
                    <ul className="space-y-2 text-white/90 mb-6">
                        <li className="hover:text-blue-400 cursor-pointer" onClick={() => handleNavigate("/lichsumuahang")}>Lịch sử mua hàng</li>
                        <li className="hover:text-blue-400 cursor-pointer" onClick={() => handleNavigate("/lichsudatlich")}>Lịch sử đặt lịch</li>
                        <li className="hover:text-blue-400 cursor-pointer" onClick={() => handleNavigate("/huongdanmuahang")}>Hướng dẫn mua online</li>
                        <li className="hover:text-blue-400 cursor-pointer" onClick={() => handleNavigate("/huongdandatlich")}>Hướng dẫn đặt lịch</li>
                    </ul>

                    <h3 className="text-lg font-semibold mb-2">Nhận ưu đãi</h3>
                    <div className="flex rounded-full overflow-hidden bg-white text-black max-w-sm shadow-md">
                        <input
                            type="email"
                            placeholder="Email của bạn"
                            className="flex-1 px-3 py-1 outline-none"
                        />
                        <button className="bg-orange-500 text-white px-3 font-medium whitespace-nowrap hover:bg-orange-600 transition-all">
                            Đăng ký
                        </button>
                    </div>
                </div>

                {/* Google Map */}
                <div>
                    <h3 className="text-lg font-semibold mb-4 tracking-wide border-b border-white/30 pb-2">Bản đồ</h3>
                    {/* MAP */}
                    <Box
                        sx={{
                            mt: 2,
                            height: 220,
                            borderRadius: 2,
                            overflow: "hidden",
                            boxShadow: 1,
                            width: "100%",
                        }}
                    >
                        <iframe
                            title="IUH - Trường Đại học Công nghiệp TP.HCM"
                            src="https://www.google.com/maps?q=Trường+Đại+học+Công+nghiệp+TP.HCM&output=embed"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen //	Cho phép phóng to toàn màn hình
                            loading="lazy"  // 	Tối ưu hiệu suất bằng cách tải khi cần
                            referrerPolicy="no-referrer-when-downgrade"  // 	Bảo vệ thông tin referrer khi điều hướng đến trang khác
                        />
                    </Box>
                </div>
            </div>

            {/* Footer Bottom */}
            <div className="mt-4 text-center text-sm text-white/70 border-t border-white/20 pt-4">
                {/* © 2025 CRM Massage - Lan tỏa sự thư giãn & phục hồi năng lượng. */}
                Copyright © 2025 CRM Massage. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;
