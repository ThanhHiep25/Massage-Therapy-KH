import { useEffect, useState } from "react";
import { useAuth } from "../../hook/AuthContext";
import { Mail, User, Camera, Phone, Lock, X, Eye, EyeOff, MapPin } from "lucide-react";
import { CustomerDataFull } from "../../interface/CustomerData_interface";
import axios from "axios"; // Import axios for error type checking
import { updateCustomer } from "../../service/apiCustomer";

const ProfileDetail: React.FC = () => {
  const { login, user } = useAuth();
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [isChanged, setIsChanged] = useState(false);
  const [newPhone, setNewPhone] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [newAddress, setNewAddress] = useState("");
  const [addressError, setAddressError] = useState("");

  const validateName = (name: string) => {
    const nameRegex = /^[A-Za-zÀ-ỹ\s]{2,50}$/;
    return nameRegex.test(name.trim());
  };

  const validatePhoneNumber = (phone: string) => {
    const phoneRegex = /^0\d{9}$/;
    return phoneRegex.test(phone);
  };

  const validatePassword = (password: string) => {
    const lengthRegex = /^.{8,30}$/;
    const uppercaseRegex = /[A-Z]/;
    const lowercaseRegex = /[a-z]/;
    const digitRegex = /[0-9]/;
    const specialCharRegex = /[@]/;

    return (
      lengthRegex.test(password) &&
      uppercaseRegex.test(password) &&
      lowercaseRegex.test(password) &&
      digitRegex.test(password) &&
      specialCharRegex.test(password)
    );
  };

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
    description: user?.description || "",
    gender: user?.gender || "other",
    dateOfBirth: user?.dateOfBirth || "",
    birthDay: "",
    birthMonth: "",
    birthYear: "",
  });

  useEffect(() => {
    if (!user) {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          // Ensure parsedUser has the expected structure before calling login
          if (parsedUser && typeof parsedUser === 'object') {
            login(parsedUser); // Khôi phục user từ localStorage
          }
        } catch (e) {
          console.error("Failed to parse user from localStorage", e);
        }
      }
    }
  }, [user, login]);

  useEffect(() => {
    if (user) {
      const [year, month, day] = user.dateOfBirth ? user.dateOfBirth.split("-") : ["", "", ""];

      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
        description: user.description || "",
        gender: user.gender || "other",
        dateOfBirth: user.dateOfBirth || "",
        birthDay: day || "",
        birthMonth: month || "",
        birthYear: year || "",
      });

      setIsChanged(false); // Reset trạng thái thay đổi
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const newFormData = { ...formData, [name]: value };
    setFormData(newFormData);

    // Determine if form data relevant to the main "Update" button has changed
    const initialDay = user?.dateOfBirth?.split('-')[2] || "";
    const initialMonth = user?.dateOfBirth?.split('-')[1] || "";
    const initialYear = user?.dateOfBirth?.split('-')[0] || "";

    let changed = false;
    if (newFormData.name.trim() !== (user?.name || "")) changed = true;
    if (newFormData.gender !== (user?.gender || "other")) changed = true;
    if (
      newFormData.birthDay !== initialDay ||
      newFormData.birthMonth !== initialMonth ||
      newFormData.birthYear !== initialYear
    ) {
      changed = true;
    }
    setIsChanged(changed);
  };

  // Hàm cập nhật Tên, Giới tính, Ngày sinh
  const handleUpdate = async () => {
    if (!user || typeof user.id !== 'number') {
      alert("Thông tin người dùng không hợp lệ hoặc ID người dùng bị thiếu.");
      return;
    }

    try {
      const updateData: Partial<CustomerDataFull> = {};
      let hasChange = false;

      const trimmedName = formData.name.trim();
      if (trimmedName !== (user?.name || "")) {
        if (!validateName(trimmedName)) {
          alert("Tên phải từ 2-50 ký tự và chỉ chứa chữ cái và khoảng trắng.");
          return;
        }
        updateData.name = trimmedName;
        hasChange = true;
      }

      if (formData.gender !== (user?.gender || "other")) {
        updateData.gender = formData.gender;
        hasChange = true;
      }

      const { birthDay, birthMonth, birthYear } = formData;
      if (birthDay && birthMonth && birthYear) {
        const newDateOfBirth = `${birthYear}-${birthMonth.padStart(2, "0")}-${birthDay.padStart(2, "0")}`;
        if (newDateOfBirth !== (user?.dateOfBirth || "")) {
          updateData.dateOfBirth = newDateOfBirth;
          hasChange = true;
        }
      } else if (!user?.dateOfBirth && (birthDay || birthMonth || birthYear)) {
        alert("Vui lòng chọn đầy đủ ngày, tháng và năm sinh.");
        return;
      } else if (user?.dateOfBirth && (!birthDay || !birthMonth || !birthYear)) {
        // If date of birth was set and now user is clearing it
        updateData.dateOfBirth = ""; // Or null, depending on your backend
        hasChange = true;
      }


      if (!hasChange) {
        alert("Không có thay đổi nào để cập nhật.");
        return;
      }

      const payload = { ...user, ...updateData } as CustomerDataFull;
      const updatedUserResponse = await updateCustomer(user.id, payload);

      login(updatedUserResponse);
      setIsChanged(false);
      alert("Cập nhật thành công!");
    } catch (err: unknown) {
      let errorMessage = "Có lỗi không xác định khi cập nhật thông tin.";
      if (axios.isAxiosError(err) && err.response) {
        errorMessage = (err.response.data)?.message || err.message || "Lỗi từ server khi cập nhật thông tin.";
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      alert(errorMessage);
    }
  };

  // Hàm đổi số điện thoại
  const handleUpdatePhone = async () => {
    if (!user || typeof user.id !== 'number') {
      setPhoneError("Thông tin người dùng không hợp lệ hoặc ID người dùng bị thiếu.");
      return;
    }
    if (!validatePhoneNumber(newPhone)) {
      setPhoneError("Số điện thoại không hợp lệ (đủ 10 số và bắt đầu bằng số 0)");
      return;
    }
    setPhoneError(''); // Clear previous error

    try {
      const payload = {
        ...user,
        phone: newPhone,
      };
      const updatedUserResponse = await updateCustomer(user.id, payload);

      login(updatedUserResponse);

      setShowPhoneModal(false);
      setNewPhone('');
      alert("Cập nhật số điện thoại thành công!");
    }
    catch (err: unknown) {
      let errorMessage = "Lỗi khi cập nhật số điện thoại.";
      if (axios.isAxiosError(err) && err.response) {
        errorMessage = (err.response.data)?.message || err.message || "Lỗi server khi cập nhật số điện thoại.";
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      setPhoneError(errorMessage);
    }
  };

  // Hàm đổi địa chỉ
  const handleUpdateAddress = async () => {
    if (!user || typeof user.id !== 'number') {
      setAddressError("Thông tin người dùng không hợp lệ hoặc ID người dùng bị thiếu.");
      return;
    }
    if (!newAddress.trim()) {
      setAddressError("Địa chỉ không được để trống.");
      return;
    }
    setAddressError(''); // Clear previous error

    try {
      const payload = {
        ...user,
        address: newAddress.trim(),
      };
      const updatedUserResponse = await updateCustomer(user.id, payload);

      login(updatedUserResponse);

      setShowAddressModal(false);
      setNewAddress('');
      alert("Cập nhật địa chỉ thành công!");
    }
    catch (err: unknown) {
      let errorMessage = "Lỗi khi cập nhật địa chỉ.";
      if (axios.isAxiosError(err) && err.response) {
        errorMessage = (err.response.data)?.message || err.message || "Lỗi server khi cập nhật địa chỉ.";
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      setAddressError(errorMessage);
    }
  };

  // Hàm đổi mật khẩu (remains unchanged as per request focus)
  const handleChangePassword = async () => {
    setError("");
    setSuccess("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("Vui lòng điền đầy đủ thông tin.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Mật khẩu mới không khớp.");
      return;
    }

    if (!validatePassword(newPassword)) {
      setError("Mật khẩu không đáp ứng yêu cầu bảo mật.");
      return;
    }

    try {
      const response = await fetch(`/api/auth/change-password?userId=${user?.id}&oldPassword=${currentPassword}&newPassword=${newPassword}`, {
        method: "PUT",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || "Đổi mật khẩu thất bại");
      }

      // const data = await response.json().catch(() => null); // data might be null if response is 204 No Content
      // console.log("Thành công:", data);

      console.log("Đổi mật khẩu thành công!");
      setSuccess("Đổi mật khẩu thành công!");

      setTimeout(() => {
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setShowPasswordModal(false);
        setError("");
        setSuccess("");
      }, 3000);
    }
    catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "Có lỗi xảy ra.");
      } else {
        setError("Có lỗi xảy ra.");
      }
    }
  };

  return (
    <div className="sm:p-4 p-2 bg-white rounded-xl shadow max-w-6xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-[1.3fr_auto_1fr] gap-6">
        <div className="space-y-5 text-sm text-gray-800">
          {/* Ảnh và Tên + Email */}
          <div className="flex sm:flex-row flex-col sm:items-start items-center gap-4">
            <div className="text-center">
              <div className="relative w-20 h-20 mb-1 mx-auto">
                <img
                  src={user?.imageUrl || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                  alt="Avatar"
                  className="w-20 h-20 rounded-full border object-cover"
                />
                <button className="absolute bottom-0 right-0 p-1 bg-gray-600 rounded-full">
                  <Camera className="text-white text-xs" />
                </button>
              </div>
              <p className="text-xs text-gray-500">Tải ảnh của bạn</p>
            </div>

            <div className="flex-1 space-y-5">
              {/* Email */}
              <div className="relative">
                <input
                  type="email"
                  className="w-full border rounded px-4 py-2 pr-10 bg-gray-100 cursor-not-allowed"
                  value={formData.email}
                  disabled
                />
                <Mail className="absolute right-3 top-2.5 text-gray-500 w-4 h-4" />
              </div>

              {/* Tên */}
              <div className="relative">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full border rounded px-4 py-2 pr-10"
                  placeholder="Họ và tên"
                />
                <User className="absolute right-3 top-2.5 text-gray-500 w-4 h-4" />
              </div>

              {/* Giới tính */}
              <div>
                <div className="flex gap-6">
                  <label className="flex items-center gap-1">
                    <input
                      type="radio"
                      name="gender"
                      value="male"
                      checked={formData.gender === "male"}
                      onChange={(e) => {
                        setFormData({ ...formData, gender: e.target.value });
                        setIsChanged(true);
                      }}
                    />
                    Nam
                  </label>
                  <label className="flex items-center gap-1">
                    <input
                      type="radio"
                      name="gender"
                      value="female"
                      checked={formData.gender === "female"}
                      onChange={(e) => {
                        setFormData({ ...formData, gender: e.target.value });
                        setIsChanged(true);
                      }}
                    />
                    Nữ
                  </label>
                  <label className="flex items-center gap-1">
                    <input
                      type="radio"
                      name="gender"
                      value="other"
                      checked={formData.gender === "other"}
                      onChange={(e) => {
                        setFormData({ ...formData, gender: e.target.value });
                        setIsChanged(true);
                      }}
                    />
                    Không xác định
                  </label>
                </div>
              </div>

              {/* Ngày sinh */}
              <div>
                <label className="font-bold block mb-2">
                  Ngày sinh <span className="text-gray-500 font-normal">(Không bắt buộc)</span>
                </label>
                <div className="flex gap-2">
                  <select
                    name="birthDay"
                    className="border rounded p-2 flex-1"
                    value={formData.birthDay || ""}
                    onChange={(e) => {
                      setFormData({ ...formData, birthDay: e.target.value });
                      setIsChanged(true);
                    }}
                  >
                    <option value="">Ngày</option>
                    {[...Array(31)].map((_, i) => (
                      <option key={i + 1} value={String(i + 1).padStart(2, "0")}>
                        {i + 1}
                      </option>
                    ))}
                  </select>
                  <select
                    name="birthMonth"
                    className="border rounded p-2 flex-1"
                    value={formData.birthMonth || ""}
                    onChange={(e) => {
                      setFormData({ ...formData, birthMonth: e.target.value });
                      setIsChanged(true);
                    }}
                  >
                    <option value="">Tháng</option>
                    {[...Array(12)].map((_, i) => (
                      <option key={i + 1} value={String(i + 1).padStart(2, "0")}>
                        {i + 1}
                      </option>
                    ))}
                  </select>
                  <select
                    name="birthYear"
                    className="border rounded p-2 flex-1"
                    value={formData.birthYear || ""}
                    onChange={(e) => {
                      setFormData({ ...formData, birthYear: e.target.value });
                      setIsChanged(true);
                    }}
                  >
                    <option value="">Năm</option>
                    {Array.from({ length: 100 }, (_, i) => {
                      const year = new Date().getFullYear() - i;
                      return (
                        <option key={year} value={year.toString()}>
                          {year}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>

              <div className="space-y-4 text-sm">
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" /> Nhận thông tin khuyến mãi qua email
                </label>
                <label className="flex items-start">
                  <input type="checkbox" className="mr-2 mt-1" checked disabled />
                  Tôi đồng ý với{" "}
                  <span className="text-blue-600 ml-1 cursor-pointer">
                    chính sách xử lý dữ liệu cá nhân
                  </span>
                </label>
              </div>

              <button
                className={`w-full ${isChanged ? 'bg-green-700 hover:bg-green-800' : 'bg-gray-400 cursor-not-allowed'} text-white font-semibold py-2 rounded-3xl mt-5 transition-colors`}
                disabled={!isChanged}
                onClick={handleUpdate}
              >
                Cập nhật
              </button>
            </div>
          </div>
        </div>

        <div className="hidden md:block w-px bg-gray-300" />

        <div className="">
          <div>
            <p className="text-gray-900 font-semibold mb-4">Số điện thoại và Email</p>
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <Phone className="w-4 h-4 text-gray-500" />
                <div>
                  <p>Số điện thoại</p>
                  <p className="text-gray-500">{user?.phone || "Chưa cập nhật"}</p>
                </div>
              </div>
              <button className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 border px-4 py-1 rounded transition-colors"
                onClick={() => {
                  setNewPhone(user?.phone || ''); // Pre-fill with current phone
                  setShowPhoneModal(true);
                }}>
                Cập nhật
              </button>
              {showPhoneModal && (
                <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-4">
                  <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-lg relative">
                    <button
                      onClick={() => {
                        setShowPhoneModal(false);
                        setPhoneError('');
                        setNewPhone('');
                      }}
                      className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
                    >
                      <X className="w-5 h-5" />
                    </button>
                    <h2 className="text-lg font-semibold mb-4">Thay đổi số điện thoại</h2>
                    <label htmlFor="newPhone" className="block mb-2 font-medium">Số điện thoại mới</label>
                    <input
                      id="newPhone"
                      type="tel"
                      value={newPhone}
                      onChange={(e) => {
                        setNewPhone(e.target.value);
                        if (phoneError) setPhoneError(''); // Clear error on typing
                      }}
                      placeholder="Nhập số điện thoại mới"
                      className="w-full border rounded px-4 py-2 mb-2"
                    />
                    {phoneError && (
                      <p className="text-red-500 text-sm mb-2">{phoneError}</p>
                    )}
                    <button
                      className="bg-green-700 mt-2 text-white font-semibold px-6 py-2 rounded-3xl w-full hover:bg-green-800 transition-colors"
                      onClick={handleUpdatePhone}
                    >
                      Cập nhật
                    </button>
                  </div>
                </div>
              )}
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <Mail className="w-4 h-4 text-gray-500" />
                <div>
                  <p>Email</p>
                  <p className="text-gray-500">{user?.email}</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <p className="text-gray-900 font-semibold mt-4 mb-4">Địa chỉ</p>
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <MapPin className="w-4 h-4 text-gray-500" />
                <div>
                  <p>Địa chỉ</p>
                  <p className="text-gray-500">{user?.address || "Chưa cập nhật"}</p>
                </div>
              </div>
              <button
                className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 border px-4 py-1 rounded transition-colors"
                onClick={() => {
                  setNewAddress(user?.address || ''); // Pre-fill with current address
                  setShowAddressModal(true);
                }}
              >
                Cập nhật
              </button>
              {showAddressModal && (
                <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-4">
                  <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-lg relative">
                    <button
                      onClick={() => {
                        setShowAddressModal(false);
                        setAddressError('');
                        setNewAddress('');
                      }}
                      className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
                    >
                      <X className="w-5 h-5" />
                    </button>
                    <h2 className="text-lg font-semibold mb-4">Thay đổi địa chỉ</h2>
                    <label htmlFor="newAddress" className="block mb-2 font-medium">Địa chỉ mới</label>
                    <input
                      id="newAddress"
                      type="text"
                      value={newAddress}
                      onChange={(e) => {
                        setNewAddress(e.target.value)
                        if (addressError) setAddressError(''); // Clear error on typing
                      }}
                      placeholder="Nhập địa chỉ mới"
                      className="w-full border rounded px-4 py-2 mb-2"
                    />
                    {addressError && (
                      <p className="text-red-500 text-sm mb-2">{addressError}</p>
                    )}
                    <button
                      className="bg-green-700 mt-2 text-white font-semibold px-6 py-2 rounded-3xl w-full hover:bg-green-800 transition-colors"
                      onClick={handleUpdateAddress}
                    >
                      Cập nhật
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div>
            <p className="text-gray-900 font-semibold mt-4 mb-4">Bảo mật</p>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <Lock className="w-4 h-4 text-gray-500" />
                <span>Đổi mật khẩu</span>
              </div>
              <button
                className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 border px-4 py-1 rounded transition-colors"
                onClick={() => {
                  setError('');
                  setSuccess('');
                  setCurrentPassword('');
                  setNewPassword('');
                  setConfirmPassword('');
                  setShowPasswordModal(true)
                }}
              >
                Thay đổi
              </button>
            </div>
          </div>

          {showPasswordModal && (
            <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-4">
              <div className="bg-white p-6 rounded-xl w-full max-w-lg shadow-lg relative">
                <button
                  onClick={() => setShowPasswordModal(false)}
                  className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
                >
                  <X className="w-5 h-5" />
                </button>
                <h2 className="text-lg font-semibold mb-4">Thay đổi mật khẩu</h2>
                <div className="space-y-4">
                  {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                  {success && <p className="text-green-600 text-sm text-center">{success}</p>}
                  <div className="relative">
                    <label className="block mb-1 font-medium">Mật khẩu hiện tại:</label>
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Nhập mật khẩu cũ"
                      className="w-full border rounded px-4 py-2 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-9 text-gray-500"
                    >
                      {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <div className="relative">
                    <label className="block mb-1 font-medium">Mật khẩu mới:</label>
                    <input
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Nhập mật khẩu mới"
                      className="w-full border rounded px-4 py-2 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-9 text-gray-500"
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    <p className="text-xs text-red-400 mt-1">
                      Mật khẩu phải có 8-30 ký tự, gồm chữ hoa, chữ thường, số và ít nhất 1 ký tự '@'
                    </p>
                  </div>
                  <div className="relative">
                    <label className="block mb-1 font-medium">Nhập lại mật khẩu mới:</label>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Nhập lại mật khẩu mới"
                      className="w-full border rounded px-4 py-2 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-9 text-gray-500"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <button
                    onClick={handleChangePassword}
                    className="bg-green-700 text-white font-semibold px-6 py-2 rounded-3xl w-full hover:bg-green-800 transition-colors"
                  >
                    Cập nhật
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileDetail;