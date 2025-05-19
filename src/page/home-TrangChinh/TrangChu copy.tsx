import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, X } from "lucide-react"; // Biểu tượng mũi tên
// import { ChatBubbleOutlineOutlined  } from "@mui/icons-material";
import { motion } from "framer-motion"; 
import { ServiceFull } from "../../interface/ServiceSPA_interface";

const TrangChu = () => {
    const navigate = useNavigate();
    // const images = ["/trilieu1.png", "/trilieu2.jpg"]; // Danh sách ảnh
    const images = ["/anh-spa.jpg", "/anh-spa-docsach.jpg", "/anh-spa-8.jpg", "/anh-spa-3.jpg", "/anh-spa-6.jpg"]; // Danh sách ảnh
    const [currentIndex, setCurrentIndex] = useState(0);
    const [fade, setFade] = useState(true); // Hiệu ứng fade-in

    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [endX, setEndX] = useState(0);
    const sliderRef = useRef(null);

    const [showModal, setShowModal] = useState(true);

    // const [selectedService, setSelectedService] = useState<ServiceFull | null>(null);
    const [selectedService] = useState<ServiceFull | null>(null); // State để lưu thông tin dịch vụ được chọn

    useEffect(() => {
        const interval = setInterval(() => {
            nextImage();
        }, 5000); // Chuyển ảnh mỗi 3 giây

        return () => clearInterval(interval);
    }, [currentIndex]);

    // Chuyển ảnh tiếp theo
    const nextImage = () => {
        setFade(false);
        setTimeout(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
            setFade(true);
        }, 400);
    };

    // Chuyển ảnh trước đó
    const prevImage = () => {
        setFade(false);
        setTimeout(() => {
            setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
            setFade(true);
        }, 400);
    };

    // Khi bắt đầu kéo chuột hoặc cảm ứng
    const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
        e.preventDefault(); // Ngăn chặn hành vi mặc định của trình duyệt (ví dụ: cuộn trang khi chạm)
        setIsDragging(true); // Bắt đầu trạng thái kéo
        const clientX = "touches" in e ? e.touches[0].clientX : e.clientX; // Lấy vị trí X của chuột hoặc cảm ứng
        setStartX(clientX); // Lưu vị trí bắt đầu
    };

    // Khi đang kéo
    const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isDragging) return; // Nếu không đang kéo thì không làm gì
        const clientX = "touches" in e ? e.touches[0].clientX : e.clientX; // Lấy vị trí X hiện tại của chuột hoặc cảm ứng
        setEndX(clientX); // Cập nhật vị trí hiện tại
    };

    // Khi thả chuột hoặc dừng cảm ứng
    const handleMouseUp = () => {
        setIsDragging(false); // Kết thúc trạng thái kéo
        const diff = startX - endX; // Tính khoảng cách kéo theo trục X
        if (diff > 50) nextImage(); // Kéo trái → ảnh tiếp theo
        if (diff < -50) prevImage(); // Kéo phải → ảnh trước đó
    };

    // Yêu cầu đăng nhập để được đặt lịch    
    const handleBookingClick = (service: unknown) => {
        const user = localStorage.getItem("user");
    
        if (!user) {
            alert("Vui lòng đăng nhập để đặt lịch.");
            navigate("/login");
            return;
        }
        const selectedService = service;
    
        // navigate("/booking", { state: { selectedService } });
        navigate("/booking", {
            state: {
              selectedService,
              fromHome: true, // <- Thêm flag này
            },
        });          
    };

    // Kiểm tra trạng thái modal
    // useEffect(() => {
    //     const modalClosed = localStorage.getItem("modalClosed");
    //     if (modalClosed === "true") {
    //         setShowModal(false);
    //     }
    // }, []);

    // Đóng modal và lưu trạng thái vào localStorage
    const handleCloseModal = () => {
        setShowModal(false);
        localStorage.setItem("modalClosed", "true");
    };

    // const handleCloseModal = () => {
    //     setShowModal(false);
    // };

    return (
        <div className="flex flex-col min-h-screen">
            {/* Hộp thông tin (modal) */}
            {showModal && (
                <motion.div
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
                    initial={{ opacity: 0 }} // Ban đầu là ẩn đi
                    animate={{ opacity: 1 }} // Khi xuất hiện
                    exit={{ opacity: 0 }} // Khi biến mất
                    transition={{ duration: 0.8, ease: "easeOut" }} // Thời gian chuyển động mềm mại
                >
                    <motion.div
                        className="relative w-[95%] max-w-3xl rounded-3xl overflow-hidden shadow-2xl border border-white/20"
                        initial={{ scale: 0.95, y: -50 }} // Khởi đầu nhỏ hơn và trên
                        animate={{ scale: 1, y: 0 }} // Xuất hiện bình thường với chuyển động mềm mại
                        exit={{ scale: 0.95, y: 50 }} // Khi thoát, thu nhỏ và trượt xuống
                        transition={{
                            duration: 0.8,
                            ease: "easeOut", // Chuyển động mượt mà
                            damping: 25, // Giảm xóc nhẹ
                            stiffness: 200, // Cứng nhẹ
                        }}
                    >
                        {/* Nút đóng */}
                        <button
                            className="absolute top-4 right-4 z-10 text-white/80 hover:text-red-300"
                            onClick={handleCloseModal}
                        >
                            <X className="w-6 h-6" />
                        </button>

                        <div className="relative">
                            <img
                                src="anh-booking-km.png"
                                alt="Spa Booking"
                                className="w-full h-auto object-cover"
                            />
                            <div className="absolute inset-0 bg-black/30 text-white px-6 flex flex-col justify-end">
                                <div className="text-center space-y-4 mb-6">
                                    <button 
                                        className="px-6 py-3 bg-white/90 text-indigo-600 font-semibold rounded-full shadow hover:bg-red-300 hover:text-white transition-all duration-300"
                                        // onClick={() => navigate("/booking")}
                                        onClick={() => handleBookingClick(selectedService)}
                                        >
                                        Book lịch ngay
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}

            {/* Ảnh */}
            <div
                className="relative w-full h-screen overflow-hidden cursor-grab active:cursor-grabbing"
                ref={sliderRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onTouchStart={handleMouseDown}
                onTouchMove={handleMouseMove}
                onTouchEnd={handleMouseUp}
            >
                <img
                    src={images[currentIndex]}
                    alt="Giới thiệu"
                    className={`absolute w-full h-full object-cover transition-opacity duration-700 ${
                        fade ? "opacity-100" : "opacity-0"
                    }`}
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <div className="text-white text-center space-y-4">
                        <h1 className="text-4xl md:text-6xl font-bold tracking-wide">
                            Trải nghiệm massage trị liệu đỉnh cao
                        </h1>
                        <p className="text-lg md:text-xl">
                            Thư giãn - Phục hồi - Tái tạo năng lượng
                        </p>
                    </div>
                </div>

                {/* Nút bấm chuyển ảnh */}
                <button className="absolute left-5 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-400 transition-all z-10" onClick={prevImage}>
                    <ChevronLeft size={50} />
                </button>
                <button className="absolute right-5 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-400 transition-all z-10" onClick={nextImage}>
                    <ChevronRight size={50} />
                </button>
            </div>
            
            <div className="container mx-auto px-6 py-12 grid md:grid-cols-2 gap-10">
                <div className="bg-gradient-to-br from-blue-100 to-blue-300 p-8 rounded-xl shadow-md">
                    <h4 className="text-xl font-semibold text-gray-800 mb-2 uppercase">
                        Đăng ký nhận ưu đãi
                    </h4>
                    <p className="text-sm text-gray-600 mb-4">
                        Nhận khuyến mãi và ưu đãi mới nhất từ Spa
                    </p>
                    <div className="flex gap-2">
                        <input
                        type="email"
                        placeholder="Email của bạn"
                        className="flex-1 px-4 py-2 rounded-lg border focus:outline-none"
                        />
                        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                        Đăng ký
                        </button>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-xl shadow-md">
                    <h4 className="text-xl font-semibold text-gray-800 mb-2 uppercase">
                        Đánh giá dịch vụ
                    </h4>
                    <p className="text-sm text-gray-600 mb-4">
                        Hãy để lại nhận xét về trải nghiệm của bạn
                    </p>
                    <div className="flex justify-start gap-2 text-2xl text-gray-300">
                        {[...Array(5)].map((_, index) => (
                        <button
                            key={index}
                            className="hover:text-yellow-400 transition"
                        >
                            ★
                        </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Nội dung giới thiệu */}
            <div className="container mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-center gap-6">
                {/* Văn bản bên trái */}
                <div className="flex justify-center text-left">
                    <div>
                        <h2 className="text-xl uppercase">About us</h2>
                        <h2 className="text-2xl font-semibold mb-2 uppercase">Chào mừng đến với chúng tôi</h2>
                        <p className="text-gray-700 max-w-xl">
                            Chúng tôi chuyên cung cấp các sản phẩm và dịch vụ chất lượng cao nhằm mang lại sự hài lòng tuyệt đối cho khách hàng.
                            Với đội ngũ chuyên gia giàu kinh nghiệm, chúng tôi cam kết đem đến giá trị tốt nhất cho bạn.
                            Chúng tôi chuyên cung cấp các sản phẩm và dịch vụ chất lượng cao nhằm mang lại sự hài lòng tuyệt đối cho khách hàng.
                            Với đội ngũ chuyên gia giàu kinh nghiệm, chúng tôi cam kết đem đến giá trị tốt nhất cho bạn.
                            Chúng tôi chuyên cung cấp các sản phẩm và dịch vụ chất lượng cao nhằm mang lại sự hài lòng tuyệt đối cho khách hàng.
                            Với đội ngũ chuyên gia giàu kinh nghiệm, chúng tôi cam kết đem đến giá trị tốt nhất cho bạn.
                        </p>
                    </div>
                </div>
                {/* Hình ảnh bên phải */}
                <div className="h-full flex justify-center items-center">
                    <img 
                        src="/massage-tri-lieu.jpg" 
                        alt="Giới thiệu" 
                        className="w-full max-w-[450px] rounded-lg shadow-lg"
                    />
                </div>
            </div>
            
            {/* Nội dung giới thiệu */}
            <div className="container mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-center gap-6">
                {/* Hình ảnh bên phải */}
                <div className="h-full flex justify-center items-center">
                    <img 
                        src="/anh-spa.jpg" 
                        alt="Giới thiệu" 
                        className="w-full max-w-[450px] rounded-lg shadow-lg"
                    />
                </div>

                {/* Văn bản bên trái */}
                <div className="flex justify-center text-left">
                    <div>
                        {/* <h2 className="text-xl uppercase">About us</h2> */}
                        <h2 className="text-2xl font-semibold mb-2 uppercase">Công dụng</h2>
                        <p className="text-gray-700 max-w-xl">
                            Chúng tôi chuyên cung cấp các sản phẩm và dịch vụ chất lượng cao nhằm mang lại sự hài lòng tuyệt đối cho khách hàng.
                            Với đội ngũ chuyên gia giàu kinh nghiệm, chúng tôi cam kết đem đến giá trị tốt nhất cho bạn.
                            Chúng tôi chuyên cung cấp các sản phẩm và dịch vụ chất lượng cao nhằm mang lại sự hài lòng tuyệt đối cho khách hàng.
                            Với đội ngũ chuyên gia giàu kinh nghiệm, chúng tôi cam kết đem đến giá trị tốt nhất cho bạn.
                            Chúng tôi chuyên cung cấp các sản phẩm và dịch vụ chất lượng cao nhằm mang lại sự hài lòng tuyệt đối cho khách hàng.
                            Với đội ngũ chuyên gia giàu kinh nghiệm, chúng tôi cam kết đem đến giá trị tốt nhất cho bạn.
                        </p>
                    </div>
                </div>
            </div>


            <div className="bg-blue-50 py-16">
                <div className="container mx-auto px-6">
                    <h2 className="text-3xl font-semibold text-center text-gray-800 mb-10 uppercase">
                    Vì sao chọn chúng tôi?
                    </h2>
                    <div className="grid md:grid-cols-3 gap-8">
                    <div className="text-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition">
                        <img src="anh-spa-6.jpg" alt="Chuyên gia" className="mx-auto mb-4 w-12 h-12" />
                        <h4 className="text-lg font-semibold mb-2">Chuyên gia tận tâm</h4>
                        <p className="text-gray-600 text-sm">
                        Đội ngũ trị liệu viên được đào tạo chuyên sâu và có nhiều năm kinh nghiệm.
                        </p>
                    </div>
                    <div className="text-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition">
                        <img src="anh-spa-6.jpg" alt="Không gian" className="mx-auto mb-4 w-12 h-12" />
                        <h4 className="text-lg font-semibold mb-2">Không gian thư giãn</h4>
                        <p className="text-gray-600 text-sm">
                        Không gian yên tĩnh, mùi hương dễ chịu, ánh sáng dịu nhẹ, mang lại cảm giác bình yên.
                        </p>
                    </div>
                    <div className="text-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition">
                        <img src="anh-spa-6.jpg" alt="Dịch vụ" className="mx-auto mb-4 w-12 h-12" />
                        <h4 className="text-lg font-semibold mb-2">Chất lượng hàng đầu</h4>
                        <p className="text-gray-600 text-sm">
                        Cam kết sử dụng sản phẩm thiên nhiên và liệu trình cá nhân hóa phù hợp cho từng khách hàng.
                        </p>
                    </div>
                    </div>
                </div>
            </div>
            
        </div>
    );
};

export default TrangChu;

