import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ServiceFull } from "../../interface/ServiceSPA_interface";

const TrangChu = () => {
    const navigate = useNavigate();
    const images = ["/anh-spa.jpg", "/anh-spa-docsach.jpg", "/anh-spa-8.jpg", "/anh-spa-3.jpg", "/anh-spa-6.jpg"];
    const [currentIndex, setCurrentIndex] = useState(0);
    // const [fade, setFade] = useState(true); // Fade state handled by Framer Motion

    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [endX, setEndX] = useState(0);
    const sliderRef = useRef<HTMLDivElement>(null);

    const [showModal, setShowModal] = useState(true);
    const [selectedService] = useState<ServiceFull | null>(null);

    useEffect(() => {
        const interval = setInterval(() => {
            nextImage();
        }, 5000);
        return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentIndex]);

    const nextImage = () => {
        // setFade(false); // Not needed
        // setTimeout(() => { // Not needed
            setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
            // setFade(true); // Not needed
        // }, 400); // Not needed
    };

    const prevImage = () => {
        // setFade(false); // Not needed
        // setTimeout(() => { // Not needed
            setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
            // setFade(true); // Not needed
        // }, 400); // Not needed
    };

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
        const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
        setStartX(clientX);
        setEndX(clientX);
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
        if (!isDragging) return;
        const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
        setEndX(clientX);
    };

    const handleMouseUp = () => {
        if (!isDragging) return;
        setIsDragging(false);
        const diff = startX - endX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) nextImage();
            else prevImage();
        }
    };

    const handleBookingClick = (service: unknown) => {
        const user = localStorage.getItem("user");
        if (!user) {
            alert("Vui lòng đăng nhập để đặt lịch.");
            navigate("/login");
            return;
        }
         const selectedService = service; // Shadowing state, using state below
        navigate("/booking", {
            state: {
              selectedService,
              fromHome: true,
            },
        });
        setShowModal(false); // Close modal on booking click
        localStorage.setItem("modalClosed", "true"); // And keep it closed
    };

    // Re-enabled this useEffect to check modal status on mount
    // useEffect(() => {
    //     const modalClosed = localStorage.getItem("modalClosed");
    //     if (modalClosed === "true") {
    //         setShowModal(false);
    //     }
    // }, []);

    const handleCloseModal = () => {
        setShowModal(false);
        localStorage.setItem("modalClosed", "true");
    };

    return (
        <div className="flex flex-col min-h-screen bg-white" style={{ overflow: "hidden",marginTop: "-70px" }}> {/* Added a default bg */}
            {/* Hộp thông tin (modal) */}
            <AnimatePresence>
                {showModal && (
                    <motion.div
                        className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50 p-3 sm:p-4" // Slightly darker backdrop, more blur
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4, ease: "circOut" }} // Faster, smoother transition
                    >
                        <motion.div
                            className="relative w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-white" // Added bg-white for modal content
                            initial={{ scale: 0.9, y: -20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 15 }}
                            transition={{
                                type: "spring",
                                stiffness: 300,
                                damping: 25,
                                duration: 0.4,
                            }}
                        >
                            <button
                                className="absolute top-2 right-2 sm:top-2.5 sm:right-2.5 md:top-3 md:right-3 z-20 text-gray-200 hover:text-white p-1.5 bg-black/30 hover:bg-black/50 rounded-full transition-all" // Z-index increased, refined style
                                onClick={handleCloseModal}
                                aria-label="Đóng modal"
                            >
                                <X className="w-4 h-4 sm:w-5 sm:h-5" />
                            </button>

                            <div className="relative">
                                <img
                                    src="anh-booking-km.png"
                                    alt="Spa Booking"
                                    className="w-full h-auto max-h-[50vh] sm:max-h-[60vh] md:max-h-[65vh] object-cover" // Adjusted max heights
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent text-white p-3 sm:p-4 md:p-5 flex flex-col justify-end items-center">
                                    <div className="text-center space-y-2 sm:space-y-3 mb-2 sm:mb-3 md:mb-4">
                                        {/* <h3 className="text-base sm:text-lg md:text-xl font-semibold drop-shadow-md">Ưu Đãi Chào Hè!</h3> */}
                                        <button
                                            className="px-4 py-2 sm:px-5 sm:py-2.5 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold rounded-full shadow-lg hover:from-pink-600 hover:to-rose-600 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-opacity-75 transform hover:scale-105 transition-all duration-300 text-xs sm:text-sm md:text-base"
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
            </AnimatePresence>

            {/* Ảnh Slider */}
            <div
                className="relative w-full h-[55vh] sm:h-[65vh] md:h-[80vh] lg:h-screen overflow-hidden cursor-grab active:cursor-grabbing"
                ref={sliderRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onTouchStart={handleMouseDown}
                onTouchMove={handleMouseMove}
                onTouchEnd={handleMouseUp}
            >
                <AnimatePresence initial={false} mode="wait">
                    <motion.img
                        key={currentIndex}
                        src={images[currentIndex]}
                        alt="Giới thiệu Spa"
                        initial={{ opacity: 0.5, x: currentIndex > 0 ? 50 : -50 }} 
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0.5, x: currentIndex > 0 ? -50 : 50 }} 
                        transition={{ duration: 0.6, ease: [0.42, 0, 0.58, 1] }} 
                        className="absolute w-full h-full object-cover"
                    />
                </AnimatePresence>
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center p-4 text-center">
                    <motion.div
                        key={currentIndex + "_text"} 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
                        className="text-white space-y-2 sm:space-y-3 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl"
                    >
                        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tight text-shadow">
                            Trải nghiệm massage trị liệu đỉnh cao
                        </h1>
                        <p className="text-xs sm:text-sm md:text-base lg:text-lg text-shadow-sm">
                            Thư giãn - Phục hồi - Tái tạo năng lượng
                        </p>
                    </motion.div>
                </div>

                <button
                    className="absolute left-1.5 sm:left-2 md:left-3 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white p-1 sm:p-1.5 rounded-full hover:bg-black/40 focus:outline-none focus:ring-1 focus:ring-white/60 transition-all z-10"
                    onClick={prevImage}
                    aria-label="Ảnh trước"
                >
                    <ChevronLeft size={24} className="sm:w-6 sm:h-6 md:w-8 md:h-8 lg:w-10 lg:h-10" />
                </button>
                <button
                    className="absolute right-1.5 sm:right-2 md:right-3 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white p-1 sm:p-1.5 rounded-full hover:bg-black/40 focus:outline-none focus:ring-1 focus:ring-white/60 transition-all z-10"
                    onClick={nextImage}
                    aria-label="Ảnh tiếp theo"
                >
                    <ChevronRight size={24} className="sm:w-6 sm:h-6 md:w-8 md:h-8 lg:w-10 lg:h-10" />
                </button>
            </div>

            {/* Đăng ký & Đánh giá Section */}
            <section className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 md:py-10 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
                <div className="bg-gradient-to-tr from-blue-100 via-indigo-50 to-purple-100 p-5 sm:p-6 md:p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <h4 className="text-sm sm:text-base md:text-lg font-semibold text-gray-800 mb-1.5 sm:mb-2 uppercase tracking-wide">
                        Đăng ký nhận ưu đãi
                    </h4>
                    <p className="text-[11px] sm:text-xs md:text-sm text-gray-600 mb-2.5 sm:mb-3">
                        Nhận khuyến mãi và ưu đãi mới nhất từ Spa
                    </p>
                    <div className="flex flex-col sm:flex-row gap-1.5 sm:gap-2">
                        <input
                            type="email"
                            placeholder="Email của bạn"
                            className="flex-1 px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-xs sm:text-sm transition-shadow"
                        />
                        <button className="bg-indigo-600 text-white px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 transition-colors text-xs sm:text-sm font-medium">
                            Đăng ký
                        </button>
                    </div>
                </div>

                <div className="bg-white p-5 sm:p-6 md:p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <h4 className="text-sm sm:text-base md:text-lg font-semibold text-gray-800 mb-1.5 sm:mb-2 uppercase tracking-wide">
                        Đánh giá dịch vụ
                    </h4>
                    <p className="text-[11px] sm:text-xs md:text-sm text-gray-600 mb-2.5 sm:mb-3">
                        Hãy để lại nhận xét về trải nghiệm của bạn
                    </p>
                    <div className="flex justify-start gap-0.5 sm:gap-1 text-xl sm:text-2xl md:text-3xl text-gray-300">
                        {[...Array(5)].map((_, index) => (
                            <button
                                key={index}
                                className="hover:text-amber-400 focus:text-amber-400 focus:outline-none transition p-0.5" // Added small padding
                                aria-label={`Đánh giá ${index + 1} sao`}
                            >
                                ★
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Nội dung giới thiệu - About Us */}
            <section className="mx-auto px-4 sm:px-6 py-6 sm:py-8 md:py-10 flex flex-col md:flex-row items-center gap-4 sm:gap-6 md:gap-8 lg:gap-10">
                <div className="flex-1 md:order-1 text-center md:text-left w-full md:w-auto">

                    <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold my-1 sm:my-1.5 uppercase text-gray-800">Chào mừng đến với chúng tôi</h2>
                    <p className="text-gray-700 text-xs sm:text-sm md:text-base leading-relaxed max-w-md sm:max-w-lg md:max-w-xl mx-auto md:mx-0 text-justify">
                        Chúng tôi chuyên cung cấp các sản phẩm và dịch vụ chất lượng cao nhằm mang lại sự hài lòng tuyệt đối cho khách hàng.
                        Với đội ngũ chuyên gia giàu kinh nghiệm, chúng tôi cam kết đem đến giá trị tốt nhất cho bạn.
                        Chúng tôi chuyên cung cấp các sản phẩm và dịch vụ chất lượng cao nhằm mang lại sự hài lòng tuyệt đối cho khách hàng.
                        Với đội ngũ chuyên gia giàu kinh nghiệm, chúng tôi cam kết đem đến giá trị tốt nhất cho bạn.
                        Chúng tôi chuyên cung cấp các sản phẩm và dịch vụ chất lượng cao nhằm mang lại sự hài lòng tuyệt đối cho khách hàng.
                        Với đội ngũ chuyên gia giàu kinh nghiệm, chúng tôi cam kết đem đến giá trị tốt nhất cho bạn.
                    </p>
                </div>
                <div className="flex-1 md:order-2 w-full max-w-[260px] sm:max-w-xs md:max-w-sm lg:max-w-[400px] xl:max-w-[450px] mt-4 md:mt-0 mx-auto md:mx-0">
                    <img
                        src="/massage-tri-lieu.jpg"
                        alt="Giới thiệu"
                        className="w-full h-auto rounded-lg shadow-xl aspect-[4/3] object-cover" // Added aspect ratio
                    />
                </div>
            </section>

            {/* Nội dung giới thiệu - Công dụng */}
            <section className=" mx-auto px-4 sm:px-6 py-6 sm:py-8 md:py-10 flex flex-col md:flex-row-reverse items-center gap-4 sm:gap-6 md:gap-8 lg:gap-10"> {/* Reversed order */}
                <div className="flex-1 text-center md:text-left w-full md:w-auto">
                    {/* <h3 className="text-xs sm:text-sm md:text-base font-semibold uppercase text-pink-600 tracking-wider mb-0.5">Lợi ích</h3> */}
                    <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold my-1 sm:my-1.5 uppercase text-gray-800">Công dụng</h2>
                    <p className="text-gray-700 text-xs sm:text-sm md:text-base leading-relaxed max-w-md sm:max-w-lg md:max-w-xl mx-auto md:mx-0 text-justify">
                        Chúng tôi chuyên cung cấp các sản phẩm và dịch vụ chất lượng cao nhằm mang lại sự hài lòng tuyệt đối cho khách hàng.
                        Với đội ngũ chuyên gia giàu kinh nghiệm, chúng tôi cam kết đem đến giá trị tốt nhất cho bạn.
                        Chúng tôi chuyên cung cấp các sản phẩm và dịch vụ chất lượng cao nhằm mang lại sự hài lòng tuyệt đối cho khách hàng.
                        Với đội ngũ chuyên gia giàu kinh nghiệm, chúng tôi cam kết đem đến giá trị tốt nhất cho bạn.
                        Chúng tôi chuyên cung cấp các sản phẩm và dịch vụ chất lượng cao nhằm mang lại sự hài lòng tuyệt đối cho khách hàng.
                        Với đội ngũ chuyên gia giàu kinh nghiệm, chúng tôi cam kết đem đến giá trị tốt nhất cho bạn.
                    </p>
                </div>
                <div className="flex-1 w-full max-w-[260px] sm:max-w-xs md:max-w-sm lg:max-w-[400px] xl:max-w-[450px] mt-4 md:mt-0 mx-auto md:mx-0">
                     <img
                        src="/anh-spa.jpg"
                        alt="Công dụng Spa"
                        className="w-full h-auto rounded-lg shadow-xl aspect-[4/3] object-cover"
                    />
                </div>
            </section>


            {/* Vì sao chọn chúng tôi Section */}
            <section className="bg-gradient-to-b from-indigo-50 via-purple-50 to-pink-50 py-10 sm:py-12 md:py-14">
                <div className="container mx-auto px-4 sm:px-6">
                    <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-center text-gray-800 mb-6 sm:mb-8 md:mb-10 uppercase">
                        Vì sao chọn chúng tôi?
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
                        {[
                            { title: "Chuyên gia tận tâm", desc: "Đội ngũ trị liệu viên được đào tạo chuyên sâu và có nhiều năm kinh nghiệm.", img: "/anh-spa-6.jpg" },
                            { title: "Không gian thư giãn", desc: "Không gian yên tĩnh, mùi hương dễ chịu, ánh sáng dịu nhẹ, mang lại cảm giác bình yên.", img: "/anh-spa-6.jpg" },
                            { title: "Chất lượng hàng đầu", desc: "Cam kết sử dụng sản phẩm thiên nhiên và liệu trình cá nhân hóa phù hợp cho từng khách hàng.", img: "/anh-spa-6.jpg" },
                        ].map((item, index) => (
                            <div key={index} className="text-center p-5 sm:p-6 bg-white rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1.5 focus-within:ring-2 focus-within:ring-pink-400 focus-within:ring-offset-2 transition-all duration-300 ease-out">
                                <img src={item.img} alt={item.title} className="mx-auto mb-3 sm:mb-4 w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-pink-300 shadow-md" />
                                <h4 className="text-sm sm:text-base md:text-lg font-semibold mb-1 sm:mb-1.5 text-gray-800">{item.title}</h4>
                                <p className="text-gray-600 text-[11px] sm:text-xs md:text-sm leading-relaxed">
                                    {item.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

        </div>
    );
};

export default TrangChu;