import { useState, useEffect } from "react";
import { Button, Dialog, DialogContent, DialogTitle, Pagination, Container, Box, Typography, Divider, IconButton, Slider } from "@mui/material";
import { getCategories, getServiceSPAByStatus } from "../../service/apiService";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { AlarmClock, CircleDollarSign, ListFilter, X } from "lucide-react";
import { motion } from 'framer-motion'
import { ServiceFull, Category } from "../../interface/ServiceSPA_interface";
// import axios from "axios";
import { useNavigate } from "react-router-dom";

// import { useInvoice } from "../../hook/invoice/InvoiceContext";
import { useApiWithLoading } from '../../hook/useApiWithLoading';

const pageSize = 8;

const DichVu: React.FC = () => {
    const [services, setServices] = useState<ServiceFull[]>([]);
    const [currentPage, setCurrentPage] = useState(1); //State currenPage
    const [open, setOpen] = useState(false); // State để kiểm soát việc hiển thị Dialog
    const [selectedService, setSelectedService] = useState<ServiceFull | null>(null); // State để lưu thông tin dịch vụ được chọn
    const [searchTerm, setSearchTerm] = useState("");
    // const [statusFilter, setStatusFilter] = useState("");
    // const [statusFilter] = useState("");
    const [activeSort, setActiveSort] = useState('option:noibat');
    const navigate = useNavigate();
    const [mainImage, setMainImage] = useState<string | null>(null);

    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

    // const { addServiceToInvoice } = useInvoice();

    const { callApi } = useApiWithLoading(); // khởi tạo

    // Fetch categories khi load trang
    // useEffect(() => {
    //     axios.get("/api/categories")
    //     .then(res => setCategories(res.data))
    //     .catch(err => console.error("Lỗi khi load categories", err));
    // }, []);

    // useEffect(() => {
    //     if (selectedCategoryId !== null) {
    //       axios.get("/api/service-spa") // Gọi tất cả services
    //         .then(res => {
    //           const allServices: ServiceFull[] = res.data;
    //           const filtered = allServices.filter(service => service.categoryId === selectedCategoryId);
    //           setServices(filtered);
    //         })
    //         .catch(err => 
    //         console.error("Lỗi khi load services", err));
    //     }
    // }, [selectedCategoryId]);

    const getServiceTypesByCategory = (categoryId: number): string[] => {
        const filteredServices = services.filter(s => s.categoryId === categoryId);
        const types = [...new Set(filteredServices.map(s => s.serviceType))]; // loại bỏ trùng lặp
        return types;
    };

    const sortOptions = [
        { value: 'noibat', label: 'Nổi bật' },
        { value: 'moinhat', label: 'Mới nhất' },
        // { value: 'banchay', label: 'Bán chạy' },
        // { value: 'giamgia', label: 'Giảm giá' },
        { value: 'giathapdencao', label: 'Giá thấp đến cao' },
        { value: 'giacaodenthap', label: 'Giá cao đến thấp' },
    ];

    const [sortType, setSortType] = useState("noibat");

    useEffect(() => {
        let filtered = [...allServices];

        // Lọc theo danh mục nếu có
        if (selectedCategoryId) {
            filtered = filtered.filter(service => service.categoryId === selectedCategoryId);
        }

        // Lọc theo khoảng giá nếu đã lọc
        if (isFilteredByPrice) {
            const [minPrice, maxPrice] = priceRange;
            filtered = filtered.filter(service =>
                Number(service.price) >= minPrice && Number(service.price) <= maxPrice
            );
        }

        //  Sắp xếp theo sortType (trừ "nổi bật")
        if (sortType !== 'noibat') {
            filtered.sort((a, b) => {
                switch (sortType) {
                    case 'giathapdencao':
                        return a.price - b.price;
                    case 'giacaodenthap':
                        return b.price - a.price;
                    case 'moinhat': {
                        return b.id - a.id; // Sắp xếp id giảm dần
                    }
                    default:
                        return 0;
                }
            });
        }

        setServices(filtered); // Cập nhật dịch vụ sau khi lọc và sắp xếp
        setCurrentPage(1); // Quay lại trang đầu tiên

    }, [sortType, selectedCategoryId]);

    // Yêu cầu đăng nhập để được đặt lịch    
    const handleBookingClick = (service: unknown) => {
        const user = localStorage.getItem("user");

        if (!user) {
            alert("Vui lòng đăng nhập để đặt lịch.");
            navigate("/login");
            return;
        }
        const selectedService = service;

        navigate("/booking", { state: { selectedService } });
    };

    // Xem lịch đã đặt hẹn của người dùng
    // const handleViewBookingsClick = () => {
    //     const user = localStorage.getItem("user");

    //     if (!user) {
    //         alert("Vui lòng đăng nhập để xem lịch hẹn.");
    //         navigate("/login");
    //         return;
    //     }

    //     navigate("/listbooking"); 
    // };

    const [allServices, setAllServices] = useState<ServiceFull[]>([]);

    // State để lưu khoảng giá
    const DEFAULT_PRICE_RANGE = [50000, 1000000];
    const [priceRange, setPriceRange] = useState<number[]>(DEFAULT_PRICE_RANGE);
    useEffect(() => {
        setPriceRange(DEFAULT_PRICE_RANGE);
    }, [selectedCategoryId]);

    const [isFilteredByPrice, setIsFilteredByPrice] = useState(false);

    const [selectedServiceType, setSelectedServiceType] = useState<string | null>(null);

    const filteredServices = services.filter((service) => {
        return (
            (service.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (service.categoryId === selectedCategoryId &&
                (!selectedServiceType || service.serviceType === selectedServiceType))
        );
    });

    // Khi chọn loại dịch vụ
    const handleSelectServiceType = (type: string) => {
        // Nếu nhấn lại cái đang chọn → bỏ chọn
        if (type === selectedServiceType) {
            setSelectedServiceType("");
        } else {
            setSelectedServiceType(type === "ALL" ? "" : type);
        }
    };

    // Hàm xử lý khi click nút áp dụng khoảng giá
    const handleApplyPrice = () => {
        const [minPrice, maxPrice] = priceRange;
        console.log("Áp dụng khoảng giá:", minPrice, "-", maxPrice);

        let filtered = allServices.filter(service => service.categoryId === selectedCategoryId);

        filtered = filtered.filter(service =>
            Number(service.price) >= minPrice && Number(service.price) <= maxPrice
        );

        console.log("Filtered services:", filtered);

        setServices(filtered);
        setCurrentPage(1);
        setIsFilteredByPrice(true);
    };

    useEffect(() => {
        fetchServices();
        fetchCategory();
    }, []);

    // Tải danh sách dịch vụ
    // const fetchServices = async () => {
    //     try {
    //         const response = await getServiceSPA(); // Thay bằng API thực tế
    //         setServices(response);         // Hiển thị ban đầu
    //         setAllServices(response);      // Ghi vào bộ lọc gốc
    //     } catch (error) {
    //         console.error("Lỗi tải danh sách dịch vụ:", error);
    //     }
    // };

    const fetchServices = async () => {
        await callApi(
            () => getServiceSPAByStatus(),
            (response) => {
                setServices(response);
                setAllServices(response);
            },
            (error) => {
                console.error('Lỗi tải danh sách dịch vụ:', error);
            }
        );
    };

    const fetchCategory = async () => {
        await callApi(
            () => getCategories(),
            setCategories,
            (error) => console.error("Lỗi khi load categories", error)
        );
    };

    // const filteredSer = services.filter((ser) => {
    //     return ser.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    //         (statusFilter === "" || ser.status === statusFilter);
    // })

    const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
        setCurrentPage(value);
    };

    // Render danh sách dịch vụ theo Page
    // const paginatedServices = filteredSer.slice(
    //     (currentPage - 1) * pageSize,
    //     currentPage * pageSize
    // );

    const displayedServices = filteredServices.length === 0 ? services : filteredServices;
    const paginatedServices = displayedServices.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    // Hiển thị Dialog
    const handleOpenDialog = (service: ServiceFull) => {
        setSelectedService(service);
        setOpen(true);
    };

    // Đóng Dialog
    const handleCloseDialog = () => {
        setOpen(false);
        setSelectedService(null); // Reset thông tin dịch vụ
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="sm:p-6"
            style={{
                backgroundColor: "#F0F9F8", // nền dịu nhẹ cho cảm giác thư giãn
                minHeight: "100vh",
            }}
        >
            <ToastContainer />
            <Container sx={{ mb: 3 }}>
                <img
                    src="https://media.hcdn.vn/catalog/category/1320x250-1.jpg"
                    alt="Banner Hasaki"
                    style={{ width: "100%", borderRadius: 12, objectFit: "cover" }}
                />

                {/* Tiêu đề canh giữa */}
                {/* <h2 className="sm:text-2xl text-lg font-bold mt-2 mb-2 text-center text-gray-800">Dịch vụ Massage</h2> */}
            </Container>

            <Container maxWidth={false} disableGutters sx={{ maxWidth: "1600px", mx: "auto", px: 2 }}>
                <Box display="flex" flexDirection={{ xs: "column", md: "row" }} gap={3}>
                    <Box width={{ md: "20%" }}
                        sx={{
                            backgroundColor: "rgba(255,255,255,0.9)",
                            borderRadius: 2,
                            boxShadow: "0 6px 16px rgba(0,0,0,0.05)",
                            padding: 2
                        }}
                    >

                        <Box sx={{ backgroundColor: "#fff", borderRadius: 2 }}>
                            <details>

                                <summary className="font-bold text-sm flex items-center gap-1 cursor-pointer hover:text-blue-500"><ListFilter /> Bộ lọc</summary>

                                <Typography
                                    fontSize={16}
                                    onClick={() => {
                                        setSelectedCategoryId(null);
                                        setIsFilteredByPrice(false);
                                        setPriceRange(DEFAULT_PRICE_RANGE);
                                        setServices(allServices); // hiện tất cả dịch vụ
                                    }}
                                    sx={{
                                        cursor: "pointer",
                                        color: selectedCategoryId === null ? "primary.main" : "text.primary",
                                        fontWeight: selectedCategoryId === null ? 600 : 400,
                                        mb: 0.5,
                                    }}>
                                    Danh mục
                                </Typography>

                                <div className="flex flex-col">
                                    {categories
                                        .filter((category) => category.categoryId >= 1 && category.categoryId <= 3)
                                        .map((category) => (
                                            <Typography
                                                key={category.categoryId}
                                                fontSize={14}
                                                onClick={() => setSelectedCategoryId(category.categoryId)}
                                                sx={{
                                                    cursor: "pointer",
                                                    color: selectedCategoryId === category.categoryId ? "primary.main" : "text.primary",
                                                    fontWeight: selectedCategoryId === category.categoryId ? 600 : 400,
                                                    mb: 0.5,
                                                    mt: 1,
                                                    textTransform: "capitalize",
                                                    textAlign: "center",
                                                    padding: "5px 0",
                                                    border: "1px solid #ccc",
                                                    borderRadius: "4px",
                                                    transition: "background-color 0.3s ease, color 0.3s ease",
                                                }}
                                                className='hover:bg-blue-500 hover:text-white'
                                            >
                                                {category.categoryName}
                                            </Typography>
                                        ))}
                                </div>
                            </details>




                            <Divider sx={{ my: 2 }} />

                            {selectedCategoryId && (
                                <>
                                    <Typography fontWeight={700} mb={1}>KHOẢNG GIÁ</Typography>
                                    <Slider
                                        value={priceRange}
                                        onChange={(_, newValue) => setPriceRange(newValue as number[])}
                                        valueLabelDisplay="auto"
                                        min={50000}
                                        max={1000000}
                                        step={10000}
                                    />

                                    <Typography variant="body2" mt={1}>
                                        {priceRange[0].toLocaleString('vi-VN')} VND - {priceRange[1].toLocaleString('vi-VN')} VND
                                    </Typography>

                                    <Button
                                        variant="contained"
                                        color="warning"
                                        size="small"
                                        fullWidth
                                        sx={{ mt: 2 }}
                                        onClick={handleApplyPrice}>
                                        Áp dụng
                                    </Button>
                                </>
                            )}


                            <Divider sx={{ my: 2 }} />

                            <div className="hidden sm:block">
                                <img
                                    src="anh-spa.jpg"
                                    alt="Quảng cáo 1"
                                    style={{ width: "100%", borderRadius: 8 }}
                                />
                                <Typography variant="body2" mt={1} color="text.secondary">
                                    Ưu đãi siêu hot tại Spa - Không thể bỏ lỡ!
                                </Typography>
                            </div>

                            <div className="hidden sm:block">
                                <img
                                    src="anh-spa-6.jpg"
                                    alt="Quảng cáo 2"
                                    style={{ width: "100%", borderRadius: 8 }}
                                />
                                <Typography variant="body2" mt={1} color="text.secondary">
                                    Trải nghiệm dịch vụ thư giãn đỉnh cao hôm nay.
                                </Typography>
                            </div>
                        </Box>
                    </Box>

                    <Box flex={1}
                        sx={{
                            backgroundColor: 'rgba(255,255,255,0.85)',
                            borderRadius: 4,
                            padding: 3,
                            boxShadow: '0 8px 20px rgba(0,0,0,0.05)'
                        }}>
                        <Typography fontWeight={700} fontSize={20} display="flex" alignItems="center" gap={1}>
                            Dịch vụ Massage
                            <Typography component="span" fontWeight={400} color="gray">
                                ({services.length} dịch vụ)
                            </Typography>
                        </Typography>

                        {selectedCategoryId && (
                            <div className="flex flex-col gap-2 mt-2"
                            >
                                <Typography fontSize={16} fontWeight={500}>
                                    Các loại dịch vụ:
                                </Typography>

                                {/* Nút "Tất cả" */}
                                <Box px={1.5} py={0.5}
                                    onClick={() => handleSelectServiceType("ALL")}
                                    sx={{
                                        backgroundColor: !selectedServiceType || selectedServiceType === 'ALL' ? '#059669' : '#e5e7eb',
                                        cursor: 'pointer',
                                        color: !selectedServiceType || selectedServiceType === 'ALL' ? '#fff' : '#111827',
                                        borderRadius: '6px',
                                        fontSize: '14px',
                                        fontWeight: 600,
                                        '&:hover': {
                                            backgroundColor: !selectedServiceType || selectedServiceType === 'ALL' ? '#047857' : '#d1d5db',
                                        },
                                    }}>
                                    Tất cả
                                </Box>


                                {/* Các tag serviceType */}
                                {getServiceTypesByCategory(selectedCategoryId).map((type, index) => (
                                    <Box
                                        key={index}
                                        px={1.5}
                                        py={0.5}
                                        onClick={() => handleSelectServiceType(type)}
                                        sx={{
                                            backgroundColor: selectedServiceType === type ? '#059669' : '#e5e7eb', // xám nhạt mặc định
                                            cursor: 'pointer',
                                            color: selectedServiceType === type ? '#fff' : '#111827', // đen khi chưa chọn, trắng khi chọn
                                            borderRadius: '6px',
                                            fontSize: '14px',
                                            fontWeight: 600,
                                            '&:hover': {
                                                backgroundColor: selectedServiceType === type ? '#047857' : '#d1d5db',
                                            },
                                        }}
                                    >
                                        {type}
                                    </Box>
                                ))}
                            </div>
                        )}


                        {/*Phần lọc giá riêng */}
                        {isFilteredByPrice && (
                            <Box mb={2} display="flex" alignItems="center" gap={1} flexWrap="wrap" px={2} py={1} mt={2} borderRadius={2}
                                sx={{ backgroundColor: '#f3f4f6' }}>
                                <Typography fontSize={14} fontWeight={500}>
                                    Sản phẩm lọc theo:
                                </Typography>
                                <Box
                                    px={1.5}
                                    py={0.5}
                                    sx={{
                                        backgroundColor: '#10B981',
                                        color: '#fff',
                                        borderRadius: '6px',
                                        fontSize: '14px',
                                        fontWeight: 600,
                                    }}
                                >
                                    Giá: {priceRange[0].toLocaleString('vi-VN')} - {priceRange[1].toLocaleString('vi-VN')}
                                </Box>
                                <Button
                                    size="small"
                                    color="error"
                                    onClick={() => {
                                        const filteredByCategory = allServices.filter(
                                            service => service.categoryId === selectedCategoryId
                                        );
                                        setServices(filteredByCategory);
                                        setIsFilteredByPrice(false);
                                    }}

                                    sx={{ ml: 1, textTransform: 'none' }}
                                >
                                    Xóa bộ lọc
                                </Button>
                            </Box>
                        )}

                        <Box mb={2} display="flex" alignItems="center" gap={2} flexWrap="wrap" px={2} py={1} borderRadius={2}
                            sx={{ backgroundColor: '#f3f4f6' }}>
                            <Typography fontWeight={600}>Sắp xếp theo:</Typography>

                            {sortOptions.map((option) => (
                                <Button
                                    key={option.value}
                                    variant={activeSort === `option:${option.value}` ? 'contained' : 'outlined'}
                                    size="small"
                                    color={activeSort === `option:${option.value}` ? 'success' : 'inherit'}
                                    onClick={() => {
                                        setSortType(option.value);
                                        setActiveSort(`option:${option.value}`);
                                    }}
                                    sx={{ textTransform: 'none', borderRadius: 2, px: 2 }}
                                >
                                    {option.label}
                                </Button>
                            ))}

                            <Box flexGrow={1} />
                        </Box>


                        {/* Thanh tìm kiếm & lọc */}
                        <div className="flex justify-center mb-4 mt-4">
                            <div className="w-full max-w-xl bg-white shadow-md rounded-2xl px-6 py-2 border border-gray-200">
                                <div className="flex items-center gap-3">
                                    <span className="text-xl text-gray-500">🔍</span>
                                    <input
                                        type="text"
                                        placeholder="Tìm kiếm dịch vụ..."
                                        className="flex-1 text-base text-gray-800 placeholder-gray-400 focus:outline-none bg-transparent"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>


                        {/* Hiển thị danh sách dịch vụ hoặc thông báo khi không có */}
                        {paginatedServices.length === 0 ? (
                            <Box textAlign="center" mt={6}>
                                <Typography fontSize={64}>🙁</Typography>
                                <Typography mt={2} color="text.secondary" fontSize={14}>
                                    Không có sản phẩm nào phù hợp với điều kiện lọc của bạn.<br />
                                    Bạn thử tắt điều kiện lọc và tìm lại nhé!
                                </Typography>
                                <Button
                                    variant="contained"
                                    color="success"
                                    size="small"
                                    sx={{ mt: 2 }}
                                    onClick={() => {
                                        const filteredByCategory = allServices.filter(
                                            service => service.categoryId === selectedCategoryId
                                        );
                                        setServices(filteredByCategory);
                                        setIsFilteredByPrice(false);
                                    }}
                                >
                                    Xóa bộ lọc
                                </Button>
                            </Box>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 sm:gap-6 gap-2 mt-6">
                                {paginatedServices.map((service) => (
                                    <div key={service.id} className="bg-white rounded-xl shadow-md overflow-hidden transition-shadow flex flex-col cursor-default">
                                        <motion.div
                                            whileHover={{ scale: 1.05 }}
                                            onClick={() => handleOpenDialog(service)}
                                            className="group cursor-pointer hover:shadow-lg transition-shadow"
                                        >
                                            <h3
                                                className="sm:text-lg text-[14px] font-bold text-gray-900 p-4 group-hover:text-green-700 transition-colors duration-200 
                                                        line-clamp-2 h-[4rem] leading-snug overflow-hidden"
                                            >
                                                {service.name}
                                            </h3>
                                            <img
                                                src={service.images[0] || "https://media.hcdn.vn/catalog/category/1320x250-1.jpg"}
                                                alt={service.name}
                                                className="w-full h-40 object-cover"
                                            />
                                            <div className="p-4 flex sm:flex-row flex-col sm:items-center justify-between text-sm text-gray-700">
                                                <div className="flex items-center gap-1">
                                                    <CircleDollarSign className="w-4 h-4 text-gray-700" />
                                                    <span className="text-orange-500">{service.price.toLocaleString("vi-VN")} VND</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <AlarmClock className="w-4 h-4" />
                                                    {service.duration} phút
                                                </div>
                                            </div>
                                        </motion.div>

                                        <hr className="my-2 border-gray-200" />

                                        <div className="px-4 pb-4 flex flex-col gap-2 flex-grow">
                                            <div className="relative sm:h-[60px] sm:mt-0">
                                                <p className="text-sm text-gray-600 sm:line-clamp-3 sm:pr-[45px] sm:w-full w-0 text-justify line-clamp-1">
                                                    {service.description}
                                                </p>
                                                <span
                                                    className="absolute bottom-0 right-0 text-xs text-blue-500 hover:underline cursor-pointer bg-white pl-1"
                                                    onClick={() => handleOpenDialog(service)}
                                                >
                                                    xem thêm
                                                </span>
                                            </div>
                                            <div className="py-2 border-t border-gray-200">
                                                <button
                                                    onClick={() => handleBookingClick(service)}
                                                    title="Đặt hẹn"
                                                    className="w-full bg-orange-400 hover:bg-orange-600 text-white font-medium py-1.5 px-4 rounded-md text-sm transition-colors"
                                                >
                                                    Đặt hẹn
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}


                        {/* Phân trang */}
                        <div className="flex justify-center mt-6">
                            {/* <Pagination
                                count={Math.ceil(services.length / pageSize)}
                                page={currentPage}
                                onChange={handlePageChange}
                                color="primary"
                            /> */}
                            <Pagination
                                count={Math.ceil(displayedServices.length / pageSize)}
                                page={currentPage}
                                onChange={handlePageChange}
                                color="primary"
                            />
                        </div>
                    </Box>
                </Box>
            </Container>

            {/* Dialog xem chi tiết */}
            <Dialog open={open} onClose={handleCloseDialog} maxWidth="md" fullWidth >
                {selectedService && (
                    <>
                        <DialogTitle sx={{ fontSize: '30px', position: 'relative', pr: 6 }}>
                            <p className="sm:text-2xl text-lg">
                                {selectedService.name}
                            </p>

                            <IconButton
                                onClick={handleCloseDialog}
                                sx={{ position: 'absolute', right: 8, top: 8, color: 'gray', '&:hover': { color: 'red' }, }}>
                                <X className="w-5 h-5" />
                            </IconButton>
                        </DialogTitle>

                        <DialogContent>
                            {/* Hình ảnh chính */}
                            <div className="rounded-lg overflow-hidden shadow mb-6">
                                <img
                                    src={mainImage || selectedService.images[0] || "https://media.hcdn.vn/catalog/category/1320x250-1.jpg"}
                                    alt={selectedService.name}
                                    className="w-full sm:h-[300px] h-[150px] object-cover transition-transform duration-300 hover:scale-105"
                                />
                            </div>

                            {/* Bộ ảnh nhỏ */}
                            <div className="flex gap-3 overflow-x-auto mb-6 scrollbar-thin scrollbar-thumb-gray-300">
                                {selectedService.images.map((image, index) => (
                                    <img
                                        key={index}
                                        src={image || "https://via.placeholder.com/300"}
                                        alt={`Image ${index + 1}`}
                                        onClick={() => setMainImage(image)} //khi click vào thì gán ảnh chính
                                        className={`w-36 h-24 object-cover rounded-md shadow-sm border cursor-pointer 
                                            ${mainImage === image ? "ring-2 ring-orange-500" : "border-gray-200"} 
                                            hover:opacity-90 transition`}
                                    />
                                ))}
                            </div>

                            <p className="text-gray-700 mb-4 leading-relaxed text-justify">
                                <strong className="text-gray-900">Mô tả:</strong> {selectedService.description}
                            </p>

                            <p className="text-gray-600 mb-2">Giá: <span className="text-orange-500 font-semibold">{selectedService.price.toLocaleString("vi-VN")} VND</span></p>

                            <p className="text-gray-600">Thời gian: {selectedService.duration} phút</p>

                            <h4 className="text-lg font-semibold mt-4 mb-2">Các bước thực hiện:</h4>
                            <ul>
                                {selectedService.steps.map((step) => (
                                    <li key={step.stepId} className="mb-2">
                                        <p className="font-semibold">Bước {step.stepOrder}:</p> <p className="text-gray-600 text-justify">{step.description}</p>
                                    </li>
                                ))}
                            </ul>
                        </DialogContent>

                        {/* Đặt hẹn & Chi tiết */}
                        <div className="flex justify-end px-6 pb-2 pt-2 border-t">
                            {/* <button
                                className="bg-gradient-to-r from-gray-300 to-gray-400 hover:from-pink-200 hover:to-pink-400 text-white 
                                            px-8 py-2 rounded-full text-lg font-medium shadow-md transition duration-300 mr-4"
                                onClick={() => {
                                    addServiceToInvoice(selectedService);
                                    navigate("/profile", { state: { tab: "orders" } }); // chuyển sang tab hóa đơn
                                }}
                                >
                                Thêm vào hóa đơn
                            </button> */}
                            <button className="bg-gradient-to-r from-orange-400 to-orange-600 hover:from-orange-500 hover:to-orange-700 text-white 
                                                px-8 py-2 rounded-full sm:text-lg text-sm font-medium shadow-md transition duration-300"
                                // onClick={() => navigate("/booking", { state: { selectedService: selectedService } })}
                                onClick={() => handleBookingClick(selectedService)}
                            >
                                Đặt hẹn ngay
                            </button>
                        </div>
                    </>
                )}
            </Dialog>
        </motion.div>
    );
}

export default DichVu;