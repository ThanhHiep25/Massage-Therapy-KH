import { useState } from "react";
import { registerUser, verifyOtp } from "../../service/apiService";
import axios from "axios";
import { CloudUpload } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useAuth } from "../../hook/AuthContext"; // Import context
import { loginUser } from "../../service/apiService"; // Import API login

const RegisterForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    // confirmPassword: '',
    imageUrl: "",// Lưu avatar dưới dạng URL từ Cloudinary
  });
  
  const [message, setMessage] = useState<string>("");
  const [otp, setOtp] = useState<string>(""); // OTP state
  const [isOtpSent, setIsOtpSent] = useState<boolean>(false); // Trạng thái OTP đã gửi
  const [isOtpVerified, setIsOtpVerified] = useState<boolean>(false); // Trạng thái OTP đã xác thực
  const [isLoading, setIsLoading] = useState<boolean>(false); // Trạng thái xử lý
  const [imageFile, setImageFile] = useState<File | null>(null); // Lưu trữ file ảnh
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  // const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { login } = useAuth(); // Lấy hàm login từ context
  const navigation = useNavigate();
  const handleNavigation = (path: string) => {
    navigation(path);
  };

  const handleRegisterSuccess = async () => {
    try {
      // Tự động đăng nhập với thông tin vừa đăng ký
      const response = await loginUser({ 
        email: formData.email, 
        password: formData.password 
      });
  
      login(response.data.user); // Lưu user vào context
      navigation("/"); // Chuyển sang trang chủ
  
    } catch (error) {
      console.error("Tự động đăng nhập thất bại:", error);
      navigation("/login"); // Nếu lỗi, chuyển về trang login
    }
  };

  const [isFocused, setIsFocused] = useState({
    name: false,
    email: false,
    password: false,
    // confirmPassword: false,
    phone: false,
  });
  
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    // confirmPassword: "", 
    phone: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Hàm cập nhật trạng thái focus
  const handleFocus = (field: string, value: boolean) => {
    setIsFocused((prev) => ({ ...prev, [field]: value }));
  };

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOtp(e.target.value);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Kiểm tra kích thước ảnh
      if (file.size > 1048576) {
        setMessage("Ảnh tải lên quá lớn. Vui lòng chọn ảnh dưới 1MB.");
        toast.error("Ảnh tải lên quá lớn. Vui lòng chọn ảnh dưới 1MB.");
        return;
      }

      // Tạo URL preview ảnh
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl); // Cập nhật URL preview
      setImageFile(file); // Cập nhật file ảnh

      // Xóa ảnh trước đó (nếu có)
      if (formData.imageUrl) {
        try {
          const publicId = formData.imageUrl.split("/").pop()?.split(".")[0];
          await axios.post(
            `https://api.cloudinary.com/v1_1/dokp7ig0u/delete_by_token`,
            { public_id: publicId }
          );
        } catch (error) {
          console.error("Lỗi khi xóa ảnh cũ:", error);
        }
      }

      setMessage(
        "Ảnh đã được chọn. Ảnh sẽ được tải lên khi bạn nhấn 'Đăng ký'."
      );
      toast.success("Ảnh đã được chọn. Ảnh sẽ được tải lên khi bạn nhấn 'Đăng ký'.");
    }
  };

  // Thông báo điều kiện điền form
  const validateName = (value: string) => {
    const nameRegex = /^[A-Za-zÀ-ỹ\s]{2,50}$/;
    if (!value) {
      setErrors((prev) => ({ ...prev, name: "Họ và Tên không được để trống" }));
    } else if (!nameRegex.test(value)) {
      setErrors((prev) => ({
        ...prev,
        name: "Tên chứa chữ cái, khoảng trắng, 2-50 ký tự",
      }));
    } else {
      setErrors((prev) => ({ ...prev, name: "" }));
    }
  };

  const validateEmail = (value: string) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (!value) {
      setErrors((prev) => ({ ...prev, email: "Email không được để trống" }));
    } else if (!emailRegex.test(value)) {
      setErrors((prev) => ({
        ...prev,
        email: "Email phải có đuôi @gmail.com",
      }));
    } else {
      setErrors((prev) => ({ ...prev, email: "" }));
    }
  };

  const validatePassword = (value: string) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/;
    if (!value) {
      setErrors((prev) => ({ ...prev, password: "Mật khẩu không được để trống" }));
    } else if (!passwordRegex.test(value)) {
      setErrors((prev) => ({
        ...prev,
        password: "Mật khẩu phải có ít nhất 8 ký tự, chứa ít nhất một chữ hoa và một ký tự đặc biệt.",
      }));
    } else {
      setErrors((prev) => ({ ...prev, password: "" }));
    }
  };

  // const validateConfirmPassword = (value) => {
  //   if (!value) {
  //     setErrors((prev) => ({
  //       ...prev,
  //       confirmPassword: 'Vui lòng xác nhận mật khẩu',
  //     }));
  //   } else if (value !== formData.password) {
  //     setErrors((prev) => ({
  //       ...prev,
  //       confirmPassword: 'Mật khẩu không trùng khớp',
  //     }));
  //   } else {
  //     setErrors((prev) => ({ ...prev, confirmPassword: '' }));
  //   }
  // };

  const validatePhone = (value: string) => {
    const phoneRegex = /^0\d{9}$/;
    if (!value) {
      setErrors((prev) => ({ ...prev, phone: "Vui lòng nhập số điện thoại" }));
    } else if (!phoneRegex.test(value)) {
      setErrors((prev) => ({
        ...prev,
        phone: "Số điện thoại phải đủ 10 số và bắt đầu bằng 0",
      }));
    } else {
      setErrors((prev) => ({ ...prev, phone: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    validateEmail(formData.email);
    validateName(formData.name);
    validatePhone(formData.phone);
    validatePassword(formData.password);
    // validateConfirmPassword(formData.confirmPassword);

    if (Object.values(errors).some((error) => error !== "")) {
      return;
    }

    setIsLoading(true);
    try {
      let imageUrl = formData.imageUrl;

      // Tải ảnh lên Cloudinary nếu có file
      // if (imageFile) {
      //   const uploadFormData = new FormData();
      //   uploadFormData.append("file", imageFile);
      //   uploadFormData.append("upload_preset", "spamassage");

      //   const response = await axios.post(
      //     "https://api.cloudinary.com/v1_1/dokp7ig0u/image/upload",
      //     uploadFormData
      //   );
      //   imageUrl = response.data.secure_url; // Lấy URL ảnh
      // }

      // Tải ảnh lên Cloudinary nếu có file
      if (imageFile) {
        const uploadFormData = new FormData();
        uploadFormData.append("file", imageFile);
        uploadFormData.append("upload_preset", "customer");

        const response = await axios.post(
          "https://api.cloudinary.com/v1_1/dokp7ig0u/image/upload",
          uploadFormData
        );
        imageUrl = response.data.secure_url; // Lấy URL ảnh
      }

      // Gửi thông tin đăng ký
      const userToRegister = {
        ...formData,
        imageUrl,
      };

      console.log("formData", formData);
      console.log("userToRegister", userToRegister);
      console.log("userToRegister", JSON.stringify(userToRegister, null, 2));

      // Gửi yêu cầu đăng ký với thông tin avatar từ Cloudinary
      await registerUser(userToRegister); // Gửi thông tin đăng ký
      setMessage("OTP đã được gửi đến email của bạn.");
      toast.success("OTP đã được gửi đến email của bạn.");
      setIsOtpSent(true); // OTP đã được gửi

    } catch (error: unknown) {
      console.error("Lỗi trong handleSubmit:", error); // log lỗi
      if (axios.isAxiosError(error)) {
        // Kiểm tra nếu API trả về mã lỗi 1000
        if (error.response?.data?.code === 1011) {
          toast.warning("Email đã tồn tại")
          setIsOtpSent(false);
        } else {
          // Xử lý lỗi chung từ API
          setMessage(`Lỗi: ${error.response?.data?.message || "Có lỗi xảy ra."}`);
        }
      } else {
        // Xử lý lỗi không xác định
        setMessage("Đã xảy ra lỗi không xác định.");
      }
    }
    finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await verifyOtp(
        {
          email: formData.email,
          otp: otp,
        }
      );

      if (response.data.message === "OTP verified successfully") {
        setIsOtpVerified(true);
        setMessage(
          "OTP đã được xác thực thành công. Bạn có thể hoàn tất đăng ký."
        );
        toast.success("OTP đã được xác thực thành công. Bạn có thể hoàn tất đăng ký.");

        // Gọi hàm tự động đăng nhập sau khi xác thực OTP thành công, chờ 3 giây rồi chuyển qua trang chủchủ
        setTimeout(async () => {
          await handleRegisterSuccess();
        }, 3000);
      } else {
        setMessage("OTP không hợp lệ hoặc đã hết hạn.");
        toast.error("OTP không hợp lệ hoặc đã hết hạn.");
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setMessage(`Lỗi: ${error.response?.data?.message || error.message}`);
      } else {
        setMessage("Đã xảy ra lỗi không xác định.");
      }
    }
  };

  return (
    <div className="relative w-full min-h-screen px-4 sm:px-8 lg:px-16 flex flex-col md:flex-row items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-black">
      <ToastContainer />

      {/* Nút quay lại */}
      <div className="absolute top-10 left-5">
        <a className="text-white hover:underline cursor-pointer" onClick={() => navigation(-1)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </a>
      </div>

      {/* Hộp chứa nội dung */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col md:flex-row items-center justify-center w-full md:w-[80%] lg:w-[65%] bg-white/10 backdrop-blur-lg p-6 sm:p-8 md:p-10 rounded-2xl shadow-xl text-white border border-white/20"
      >
        {/* Nội dung chào mừng */}
        <div className="hidden sm:flex flex-col  justify-center md:mr-10 text-center md:text-left">
          <h1 className="text-3xl sm:text-[30px] font-bold tracking-wider">Chào mừng đến với Spa</h1>
           <p className="text-sm sm:text-lg text-justify text-gray-300 mt-2">Nơi thư giãn tuyệt đối với liệu pháp chăm sóc tự nhiên.</p>
        </div>

        {/* Form đăng ký */}
        <form onSubmit={handleSubmit} className="w-full max-w-md sm:bg-white/10 sm:backdrop-blur-lg p-1 sm:p-8 rounded-2xl shadow-xl text-white sm:border  sm:border-white/20 mt-6 md:mt-0">
            <div className="mb-6 text-center">
            <p className="text-lg sm:text-[30px[ font-medium">Đăng ký tài khoản</p>
            <p className="text-gray-200 text-sm">Vui lòng điền thông tin để đăng ký tài khoản.</p>
          </div>

          {!isOtpSent ? (
            <>
              {/* Upload avatar */}
              <div className="mb-6 flex justify-center">
                <label
                  htmlFor="file-upload"
                  className="relative flex flex-col items-center justify-center w-28 h-28 sm:w-32 sm:h-32 border-2 border-dashed rounded-full cursor-pointer bg-white/20 hover:bg-white/30 transition-all duration-300"
                >
                  {!imagePreview ? (
                    <>
                      <CloudUpload className="text-gray-300" fontSize="large" />
                      <p className="text-xs text-gray-200 mt-1">Nhấn để tải ảnh</p>
                    </>
                  ) : (
                    <img src={imagePreview} alt="Xem trước" className="w-full h-full object-cover rounded-full" />
                  )}
                  <input id="file-upload" type="file" name="avatar" onChange={handleFileChange} accept="image/*" className="hidden" />
                </label>
              </div>

              {/* Hiển thị lỗi nếu có */}
              {message && <p className="mt-4 mb-4 text-center text-red-300 text-sm">{message}</p>}

              {/* Email */}
              <div className="gap-4 mb-4">
                <div className="relative">
                  <label
                    className={`absolute left-4 bg-white px-1 transition-all pointer-events-none ${
                      isFocused.email || formData.email
                        ? "-top-3 left-3 text-gray-500 text-sm"
                        : "top-5 left-4 text-gray-500 text-lg"
                    }`}
                  >
                    Email *
                  </label>

                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    placeholder="Email"
                    onChange={(e) => {
                      handleChange(e); // Cập nhật giá trị vào formData
                      validateEmail(e.target.value); // Kiểm tra lỗi ngay khi nhập
                    }}
                    onFocus={() => handleFocus("email", true)}
                    onBlur={() => handleFocus("email", false)}
                    className={`w-full p-4 pt-6 text-black text-base border rounded-md focus:outline-none focus:ring-2 ${
                      errors.email ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
                    }`}
                  />
                </div>
                {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
              </div>

              <div className="mb-4 flex flex-col sm:flex-row gap-4">
                {/* Họ và Tên */}
                <div className="w-full sm:w-1/2">
                  <div className="relative">
                    <label
                      className={`absolute left-4 bg-white px-1 transition-all pointer-events-none ${
                        isFocused.name || formData.name
                          ? "-top-3 left-3 text-gray-500 text-sm"
                          : "top-5 left-4 text-gray-500 text-lg"
                      }`}
                    >
                      Họ và Tên *
                    </label>

                    <input
                      name="name"
                      value={formData.name}
                      placeholder="Họ và Tên"
                      onChange={(e) => {
                        handleChange(e); // Cập nhật giá trị vào formData
                        validateName(e.target.value); // Kiểm tra lỗi ngay khi nhập
                      }}
                      onFocus={() => handleFocus("name", true)}
                      onBlur={() => handleFocus("name", false)}
                      className={`w-full p-4 pt-6 text-black text-base border rounded-md focus:outline-none focus:ring-2 ${
                        errors.name ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
                      }`}
                    />
                  </div>
                  {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
                </div>

                {/* Số điện thoại */}
                <div className="w-full sm:w-1/2">
                  <div className="relative">
                    <label
                      className={`absolute left-4 bg-white px-1 transition-all pointer-events-none ${
                        isFocused.phone || formData.phone
                          ? "-top-3 left-3 text-gray-500 text-sm"
                          : "top-5 left-4 text-gray-500 text-lg"
                      }`}
                    >
                      Số điện thoại *
                    </label>

                    <input
                      name="phone"
                      value={formData.phone}
                      placeholder="Số điện thoại"
                      onChange={(e) => {
                        handleChange(e); // Cập nhật giá trị vào formData
                        validatePhone(e.target.value); // Kiểm tra lỗi ngay khi nhập
                      }}
                      onFocus={() => handleFocus("phone", true)}
                      onBlur={() => handleFocus("phone", false)}
                      className={`w-full p-4 pt-6 text-black text-base border rounded-md focus:outline-none focus:ring-2 ${
                        errors.phone ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
                      }`}
                    />
                  </div>
                  {errors.phone && <p className="text-red-600 text-sm mt-1">{errors.phone}</p>}
                </div>
              </div>

              {/* Mật khẩu */}
              <div className="gap-4 mb-4">
                <div className="relative">
                  <label
                    className={`absolute left-4 bg-white px-1 transition-all pointer-events-none ${
                      isFocused.password || formData.password
                        ? "-top-3 left-3 text-gray-500 text-sm"
                        : "top-5 left-4 text-gray-500 text-lg"
                    }`}
                  >
                    Mật khẩu *
                  </label>
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    placeholder="Mật khẩu"
                    onChange={(e) => {
                      handleChange(e);
                      validatePassword(e.target.value);
                    }}
                    onFocus={() => handleFocus("password", true)}
                    onBlur={() => handleFocus("password", false)}
                    className={`w-full p-4 pt-6 text-black text-base border rounded-md focus:outline-none focus:ring-2 ${
                      errors.password ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </button>
                </div>
                {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password}</p>}
              </div>
              
              {/* Xác nhận mật khẩu */}
              {/* <div className="gap-4 mb-4">
                <div className="relative">
                  <label
                    className={`absolute left-4 bg-white px-1 transition-all pointer-events-none ${
                      isFocused.confirmPassword || formData.confirmPassword
                        ? "-top-3 left-3 text-gray-500 text-sm"
                        : "top-5 left-4 text-gray-500 text-lg"
                    }`}
                  >
                    Xác nhận mật khẩu *
                  </label>
                  <input
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    placeholder="Xác nhận mật khẩu"
                    onChange={(e) => {
                      handleChange(e);
                      validateConfirmPassword(e.target.value);
                    }}
                    onFocus={() => handleFocus("confirmPassword", true)}
                    onBlur={() => handleFocus("confirmPassword", false)}
                    className={`w-full p-4 pt-6 text-black text-base border rounded-md focus:outline-none focus:ring-2 ${
                      errors.confirmPassword ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-red-600 text-sm mt-1">{errors.confirmPassword}</p>}
              </div> */}

              {/* Nút đăng ký */}
              <button
                type="submit"
                className={`w-full ${isLoading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"} text-white p-3 rounded-md transition duration-200`}
                disabled={isLoading}
              >
                {isLoading ? "Đang xử lý..." : "Đăng ký"}
              </button>

              <div className="text-center text-blue-500 mt-4">
                <button onClick={() => handleNavigation('/login')} >Đã có tài khoản? Đăng nhập</button>
            </div>
            </>
          ) : !isOtpVerified ? (
            <>
              {/* OTP Input */}
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Nhập OTP"
                  value={otp}
                  onChange={handleOtpChange}
                  className="w-full p-3 border border-gray-300 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <button
                onClick={handleVerifyOtp}
                className={`w-full ${isLoading ? "bg-gray-400" : "bg-green-500 hover:bg-green-600"} text-white p-3 rounded-md transition duration-200`}
                disabled={isLoading}
              >
                {isLoading ? "Đang xác thực..." : "Xác thực OTP"}
              </button>
            </>
          ) : (
            <div className="text-center mt-4">
              <p className="text-green-500">Đăng ký hoàn tất! Bạn đã được đăng ký.</p>
            </div>
          )}

        </form>
      </motion.div>
    </div>

  );
};

export default RegisterForm;