import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { createProduct } from '../../service/apiProduct';
import { ProductForm } from '../../interface/Product_interface';
import { getCategories } from '../../service/apiService';
import { Category, CloudinaryResponse } from '../../interface/ServiceSPA_interface';
import { CloudUpload } from 'lucide-react';
import { DeleteForever } from '@mui/icons-material';
import axios, { AxiosResponse } from 'axios';

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
const PRODUCTS = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRODUCTS;
const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`


const ProductAdd: React.FC = () => {
    const [formData, setFormData] = useState<ProductForm>({
        nameProduct: '',
        description: '',
        price: 0,
        categoryId: 1,
        imageUrl: '',
        quantity: 0,
    });
    const [loading, setLoading] = useState(false);
    const [category, setCategory] = useState<Category[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]); // Chứa URL của ảnh đã chọn
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

    useEffect(() => {
        fetchCategory();
    }, []);


    const fetchCategory = async () => {
        try {
            const response = await getCategories();
            setCategory(response);
        } catch (error) {
            console.error('Error fetching category:', error);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const uploadImagesToCloudinary = async (files: File[]): Promise<string | undefined> => {
        const cloudinaryUrl = CLOUDINARY_URL;
        const maxFileSize = 1048576; // 1MB

        // Chỉ xử lý file đầu tiên trong mảng (nếu có)
        if (files.length > 0) {
            const file = files[0];

            if (file.size > maxFileSize) {
                toast.error(`Tệp "${file.name}" quá lớn. Vui lòng chọn tệp dưới 1MB.`);
                return undefined;
            }

            const formData = new FormData();
            formData.append("file", file);
            formData.append(UPLOAD_PRESET, PRODUCTS); 

            try {
                const response: AxiosResponse<CloudinaryResponse> = await axios.post(cloudinaryUrl, formData);
                return response.data.secure_url;
            } catch (error: unknown) {
                console.error(`Lỗi upload tệp "${file.name}":`, error);
                toast.error(`Lỗi tải tệp "${file.name}" lên Cloudinary.`);
                return undefined;
            }
        }

        return undefined; // Trường hợp không có file nào được chọn
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.nameProduct) {
            toast.warn("Vui lòng nhập tên sản phẩm.");
            return;
        }

        if (!formData.description) {
            toast.warn("Vui lòng nhập mô tạo sản phẩm.");
            return;
        }

        if (formData.price === 0) {
            toast.warn("Vui lòng nhập gia sách sản phẩm.");
            return;
        }

        if (formData.categoryId === 0) {
            toast.warn("Vui lòng chọn danh mục.");
            return;
        }

        setLoading(true);
        try {
            let imageUrl = ""; // Giá trị mặc định khi không có ảnh

            if (selectedFiles.length > 0) {
                const uploadedImageUrl = await uploadImagesToCloudinary(selectedFiles);
                if (uploadedImageUrl) {
                    imageUrl = uploadedImageUrl;
                } else {
                    toast.error("Lỗi: Không thể tải ảnh lên. Sản phẩm sẽ được thêm nhưng không có ảnh.");
                }
            }

            const finalData = { ...formData, imageUrl: imageUrl };
            const response = await createProduct(finalData);
            setFormData({
                nameProduct: '',
                description: '',
                price: 0,
                categoryId: 1,
                imageUrl: '',
                quantity: 0,
            });
            setImagePreviews([]);
            setSelectedFiles([]);
            toast.success(`Thêm sản phẩm "${response.data.nameProduct}" thành công!`);

        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response?.data?.code === 1006) {
                toast.warning("Sản phẩm này đã tồn tại");
            }
            else {
                toast.error("Đã xảy ra lỗi không xác định.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;

        const file = e.target.files[0]; // Lấy file đầu tiên
        if (file.size > 1048576) {
            toast.error("Ảnh quá lớn. Vui lòng chọn ảnh dưới 1MB.");
            return;
        }

        setSelectedFiles([file]); // Lưu một file duy nhất
        setImagePreviews([URL.createObjectURL(file)]); // Hiển thị một ảnh xem trước
    };

    const removeImage = (index: number) => {
        setImagePreviews((prev) => prev.filter((_, i) => i !== index));
        setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    };

    return (
        <div className="w-full p-10 bg-white rounded-lg shadow-md">
            <ToastContainer />
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
                Thêm Sản Phẩm Mới
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="nameProduct" className="block text-gray-700 text-sm font-bold mb-2">
                        Tên Sản Phẩm:
                    </label>
                    <input
                        type="text"
                        id="nameProduct"
                        name="nameProduct"
                        value={formData.nameProduct}
                        onChange={handleChange}
                        required
                        className="w-[50%] p-3 border rounded focus:outline-none focus:ring focus:ring-blue-300"
                    />
                </div>
                <div>
                    <label htmlFor="price" className="block text-gray-700 text-sm font-bold mb-2">
                        Giá:
                    </label>
                    <input
                        type="number"
                        id="price"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        required
                        className="w-[50%] p-3 border rounded focus:outline-none focus:ring focus:ring-blue-300"
                    />
                </div>
                <div>
                    <label htmlFor="categoryId" className="block text-gray-700 text-sm font-bold mb-2">
                        Danh Mục:
                    </label>

                    <select id="categoryId" name="categoryId" 
                    className="w-[50%] p-3 border rounded focus:outline-none focus:ring focus:ring-blue-300"
                    value={formData.categoryId} 
                    onChange={handleChange}>
                        {category.map((item) => (
                            <option key={item.categoryId} value={item.categoryId}>
                                {item.categoryName}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="quantity" className="block text-gray-700 text-sm font-bold mb-2">
                        Số Lượng:
                    </label>
                    <input
                        type="number"
                        id="quantity"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleChange}
                        required
                        className="w-[50%] p-3 border rounded focus:outline-none focus:ring focus:ring-blue-300"
                    />
                </div>

                <div>
                    <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">
                        Mô Tả:
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="w-full p-3 border rounded focus:outline-none focus:ring focus:ring-blue-300"
                    />
                </div>
                <div className="space-y-4">
                    <div className="flex justify-center">
                        <label
                            htmlFor="file-upload"
                            className="relative flex flex-col items-center justify-center w-28 h-28 sm:w-6/12 sm:h-40 border-2 border-dashed rounded-2xl cursor-pointer bg-white/20 hover:bg-white/30 transition-all duration-300"
                        >
                            <CloudUpload className="text-gray-400" fontSize="large" />
                            <p className="text-xs text-gray-500 mt-1">Nhấn để tải ảnh</p>
                            <input
                                id="file-upload"
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                        </label>
                    </div>


                    {/* Preview hình ảnh */}
                    {imagePreviews.length > 0 && (
                        <div className="grid grid-cols-4 gap-y-2 gap-x-2">
                            {imagePreviews.map((src, index) => (
                                <div key={index} className="relative w-full">
                                    <img src={src} alt={`Preview ${index}`} className=" w-[200px] h-[120px] sm:w-[500px] sm:h-[200px] object-cover rounded-md" />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(index)}
                                        className="absolute w-[30px] h-[30px] top-[5px] left-[20%] sm:top[5px] sm:left-[90%] bg-gray-200 text-gray-600 p-2 text-xs rounded-full hover:scale-150 text-center duration-75 hover:bg-red-300 flex items-center justify-center"
                                    >
                                        <DeleteForever />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <div className="w-full flex justify-center">
                      <button
                    type="submit"
                    disabled={loading}
                    className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${loading ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                >
                    {loading ? 'Đang thêm...' : 'Thêm Sản Phẩm'}
                </button>
                </div>
              
            </form>
        </div>
    );
};

export default ProductAdd;