import React, { useEffect, useState } from 'react';
import { deleteProduct, getProductsByStatus, updateProduct } from '../../service/apiProduct';
import { ProductForm, ProductResponse } from '../../interface/Product_interface';
import ProductDetailModal from '../../components/products/ProductDetailModal'; // Import modal
import RenderNotFound from '../../components/notFound/renderNotFound';
import { Pagination } from '@mui/material';
import { motion } from 'framer-motion'
import { toast, ToastContainer } from 'react-toastify';
import { getCategories } from '../../service/apiService';
import { Category } from '../../interface/ServiceSPA_interface';
import axios from 'axios';
import { Package } from 'lucide-react';
import CartProductModal from '../../components/products/CartProductModal';

const pageSize = 8
const ProductList: React.FC = () => {
    const [products, setProducts] = useState<ProductResponse[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<ProductResponse | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCartModalOpen, setIsCartModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        fetchProducts();
        fetchCategory();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await getProductsByStatus();
            const now = new Date();
            const sortedProducts = response.sort((a: ProductResponse, b: ProductResponse) => {
                const dateA = new Date(a.createdAt);
                const dateB = new Date(b.createdAt);
                return dateB.getTime() - dateA.getTime();
            })
            setProducts(sortedProducts.map((product: ProductResponse) => ({
                ...product,
                isNew: (now.getTime() - new Date(product.createdAt).getTime()) / 1000 < 60,
            })));

        } catch (error: unknown) {
            console.error('Lỗi khi tải sản phẩm:', error);

        }
    };

    const fetchCategory = async () => {
        try {
            const response = await getCategories();
            setCategories(response);
        } catch (error) {
            console.error('Error fetching category:', error);
        }
    };


    const handleViewDetail = (product: ProductResponse) => {
        // Có thể không cần cập nhật lại ở đây nếu state products đã được cập nhật
        // setSelectedProduct(product);
        setSelectedProduct(products.find(p => p.id === product.id) || null);
        setIsModalOpen(true);
    };

    const handleViewCart = (product: ProductResponse) => {
        setSelectedProduct(products.find(p => p.id === product.id) || null);
        setIsCartModalOpen(true);
    };

    const handleCloseModal = () => {
        setSelectedProduct(null);
        setIsModalOpen(false); // Đóng modal
    };

    const handleCloseCartModal = () => {
        setSelectedProduct(null);
        setIsCartModalOpen(false); // Đóng modal
    };

    // Lọc danh sách sản phẩm
    const filteredProducts = products.filter((product) =>
        product.nameProduct.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Phân trang
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const currentProducts = filteredProducts.slice(startIndex, endIndex);

    const handleChangePage = (_: unknown, value: number) => {
        setCurrentPage(value);
    };

    // Xóa sản phẩm
    const handleDeleteProduct = async (productId: number) => {
        if (!window.confirm("Bạn có chắc chắn muốn xóa sản phẩm không?")) return;

        try {
            await deleteProduct(productId);
            setProducts(products.filter((product) => product.id !== productId));
            toast.success('Xóa sản phẩm thành công!');
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response?.data?.code === 1006) {
                toast.warn("Không thể xóa do sản phẩm này đã được bán!");
                console.log(error.response?.data?.message);

            }
            else {
                toast.error("Có lỗi xảy ra khi gửi yêu cầu.");
                console.error("Lỗi không xác định:", error);
            }
        }
    }

    // Cập nhật sản phẩm
    const handleUpdateProduct = async (productId: number, formData: FormData) => {
        try {
            const productForm: ProductForm = {
                nameProduct: formData.get('nameProduct') as string,
                description: formData.get('description') as string,
                price: Number(formData.get('price')),
                categoryId: Number(formData.get('categoryId')),
                quantity: Number(formData.get('quantity')),
            };
            const response = await updateProduct(productId, productForm);
            // Cập nhật state products với dữ liệu mới từ response
            setProducts(products.map(product =>
                product.id === productId ? response : product
            ));
            toast.success('Cập nhật sản phẩm thành công!');
        } catch (error) {
            console.error('Lỗi khi cập nhật sản phẩm:', error);
            toast.error('Cập nhật sản phẩm thất bại!');
        }
    };


    return (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="p-6">
            <ToastContainer />
            <h2 className="text-2xl font-semibold mb-4">Danh Sách Sản Phẩm</h2>
            {/* Tìm kiếm sản phẩm */}
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Tìm kiếm sản phẩm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-3 py-4 border rounded-md text-sm focus:outline-none focus:ring focus:ring-blue-300"
                />
            </div>

            {products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {currentProducts.map((product) => (
                        <div key={product.id} className="relative bg-white  rounded-lg shadow-md p-4">
                            {product.isNew && (
                                <span className="absolute top-2 left-2 inline-flex items-center mr-2 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-500 text-white">
                                    New
                                </span>
                            )}
                            <h3 className="text-lg font-semibold mb-2 mt-4">{product.nameProduct}</h3>
                            {product.imageUrl && (
                                <img
                                    src={product.imageUrl}
                                    alt={product.nameProduct}
                                    className="w-full h-32 object-cover rounded-md mb-2"
                                />
                            )}
                            <p className="text-blue-500 font-semibold mb-1">Giá: {product.price.toLocaleString()} VNĐ</p>
                            <div className="flex items-center justify-between">
                                <button
                                    onClick={() => handleViewDetail(product)}
                                    className="hover:text-blue-500 text-gray-500 rounded-md text-sm"
                                >
                                    Xem chi tiết
                                </button>
                                <button
                                    title='Xem đặt hàng'
                                    onClick={() => handleViewCart(product)}
                                    className='bg-blue-200 hover:bg-blue-400 hover:text-white text-gray-500 py-2 px-4 rounded-md text-sm'
                                >
                                    <Package />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <RenderNotFound />
            )}

            {/* Phân trang */}
            <div className="flex justify-center mt-6">
                <Pagination
                    count={Math.ceil(filteredProducts.length / pageSize)}
                    page={currentPage}
                    onChange={handleChangePage}
                    color="primary"
                />
            </div>

            {/* Gọi component Modal và truyền props */}
            {isModalOpen && (
                <ProductDetailModal
                    product={selectedProduct}
                    categories={categories}
                    onClose={handleCloseModal}
                    handleDeleteProduct={handleDeleteProduct}
                    onUpdate={handleUpdateProduct}
                />
            )}

            {isCartModalOpen && (
                <CartProductModal
                    product={selectedProduct}
                    onClose={handleCloseCartModal}
                    onSuccessAddToCart={() => {
                        setIsCartModalOpen(false);
                    }}
                />
            )}
        </motion.div>
    );
};

export default ProductList;