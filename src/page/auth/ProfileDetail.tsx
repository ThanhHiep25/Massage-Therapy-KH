import { useEffect, useState } from "react";
import { useAuth } from "../../hook/AuthContext";
import { Mail, User, Camera, Phone, Lock, X, Eye, EyeOff, MapPin } from "lucide-react";
import { CustomerDataFull } from "../../interface/CustomerData_interface";

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
        login(JSON.parse(storedUser)); // Khôi phục user từ localStorage
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

        // Set lại ngày, tháng, năm từ dateOfBirth
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

    // Kiểm tra xem có thay đổi không
    setIsChanged(
      newFormData.name !== user?.name ||
      newFormData.email !== user?.email ||
      newFormData.phone !== user?.phone ||
      newFormData.address !== user?.address ||
      newFormData.description !== user?.description ||
      newFormData.gender !== user?.gender ||
      newFormData.birthDay !== user?.birthDay ||
      newFormData.birthMonth !== user?.birthMonth ||
      newFormData.birthYear !== user?.birthYear
    );
  };

  // Hàm cập nhật Tên, Giới tính, Ngày sinh
  const handleUpdate = async () => {
    try {
      const updateData: Partial<CustomerDataFull> = {};
      let hasChange = false;

      // So sánh và cập nhật tên
      const trimmedName = formData.name.trim();
      if (trimmedName !== user?.name) {
        if (!validateName(trimmedName)) {
          alert("Tên phải từ 2-50 ký tự và chỉ chứa chữ cái và khoảng trắng.");
          return;
        }
        updateData.name = trimmedName;
        hasChange = true;
      }

      // So sánh và cập nhật giới tính
      if (formData.gender !== user?.gender) {
        updateData.gender = formData.gender;
        hasChange = true;
      }

      // So sánh và cập nhật ngày sinh
      const { birthDay, birthMonth, birthYear } = formData;
      if (birthDay && birthMonth && birthYear) {
        const newDateOfBirth = `${birthYear}-${birthMonth.padStart(2, "0")}-${birthDay.padStart(2, "0")}`;
        if (newDateOfBirth !== user?.dateOfBirth) {
          updateData.dateOfBirth = newDateOfBirth;
          hasChange = true;
        }
      } else if (!user?.dateOfBirth && (birthDay || birthMonth || birthYear)) {
        alert("Vui lòng chọn đầy đủ ngày, tháng và năm sinh.");
        return;
      }

      if (!hasChange) {
        alert("Không có thay đổi nào để cập nhật.");
        return;
      }

      // Gửi API cập nhật
      const res = await fetch(`/api/auth/${user?.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...user,
          ...updateData,
        }),
      });

      if (!res.ok) throw new Error("Cập nhật thông tin thất bại");

      const updatedUser = await res.json();
      login(updatedUser);
      setIsChanged(false);
      alert("Cập nhật thành công!");
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(err.message || "Có lỗi xảy ra khi cập nhật thông tin.");
      } else {
        alert("Có lỗi không xác định.");
      }
    }
  };

  // Hàm đổi số điện thoại
  const handleUpdatePhone = async () => {
    if (!validatePhoneNumber(newPhone)) {
      setPhoneError("Số điện thoại không hợp lệ (đủ 10 số và bắt đầu bằng số 0)");
      return;
    }

    try {
      const res = await fetch(`/api/auth/${user?.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...user,
          phone: newPhone,
        }),
      });

      if (!res.ok) throw new Error("Cập nhật thất bại");

      const updatedUser = await res.json();

      login(updatedUser); // Cập nhật context

      // Đóng modal và xoá dữ liệu
      setShowPhoneModal(false);
      setPhoneError('');
      setNewPhone('');
    } 
    catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "Có lỗi xảy ra.");
      } else {
        setPhoneError("Lỗi khi cập nhật số điện thoại.");
      }
    }
  };

  // Hàm đổi địa chỉ
  const handleUpdateAddress = async () => {
    if (!newAddress.trim()) {
      setAddressError("Địa chỉ không được để trống.");
      return;
    }

    try {
      const res = await fetch(`/api/auth/${user?.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...user,
          address: newAddress.trim(),
        }),
      });

      if (!res.ok) throw new Error("Cập nhật địa chỉ thất bại");

      const updatedUser = await res.json();

      login(updatedUser); // Cập nhật context

      // Đóng modal và reset lại state
      setShowAddressModal(false);
      setAddressError('');
      setNewAddress('');
    } 
    catch (err: unknown) {
      if (err instanceof Error) {
        setAddressError(err.message || "Có lỗi xảy ra.");
      } else {
        setAddressError("Lỗi khi cập nhật địa chỉ.");
      }
    }
  };

  // Hàm đổi mật khẩu
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
      // Sử dụng PUT và thêm tham số vào URL
      const response = await fetch(`/api/auth/change-password?userId=${user?.id}&oldPassword=${currentPassword}&newPassword=${newPassword}`, {
        method: "PUT",
      });

      if (!response.ok) {
        // response không ok, cố gắng lấy message từ response body
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || "Đổi mật khẩu thất bại");
      }
    
      const data = await response.json().catch(() => null);
      console.log("Thành công:", data);

      console.log("Đổi mật khẩu thành công!");
      setSuccess("Đổi mật khẩu thành công!");

      setTimeout(() => {
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setShowPasswordModal(false);
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
                  // value={user?.email}
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
                  {/* Ngày */}
                  <select
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

                  {/* Tháng */}
                  <select
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

                  {/* Năm */}
                  <select
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


              {/* Khuyến mãi + Chính sách */}
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

              {/* Nút Cập nhật */}
              {/* <button
                className={`w-full ${isChanged ? 'bg-green-700' : 'bg-gray-500'} text-white font-semibold py-2 rounded-3xl mt-5`}
                disabled={!isChanged}
                onClick={handleUpdateName}
              >
                Cập nhật
              </button> */}

              {/* Cách gộp 3 cái */}
              <button
                className={`w-full ${isChanged ? 'bg-green-700' : 'bg-gray-500'} text-white font-semibold py-2 rounded-3xl mt-5`}
                disabled={!isChanged}
                onClick={handleUpdate}
              >
                Cập nhật
              </button>

            </div>
          </div>
        </div>

        {/* Thanh ngăn cách dọc */}
        <div className="hidden md:block w-px bg-gray-300" />

        {/* Cột phải: box từng phần */}
        <div className="">
          {/* Số điện thoại và Email */}
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

              <button className="text-sm bg-gray-100 text-gray-700 border px-4 py-1 rounded"
                      onClick={() => setShowPhoneModal(true)}>
                  Cập nhật
              </button>

              {showPhoneModal && (
                <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                  <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-lg relative">
                    {/* Nút X */}
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

                    {/* Nội dung modal */}
                    <h2 className="text-lg font-semibold mb-4">Thay đổi số điện thoại</h2>
                    <label className="block mb-2 font-medium">Số điện thoại mới</label>
                    <input
                      type="text"
                      value={newPhone}
                      onChange={(e) => setNewPhone(e.target.value)}
                      placeholder="Nhập số điện thoại mới"
                      className="w-full border rounded px-4 py-2 mb-2"
                    />
                    {phoneError && (
                      <p className="text-red-500 text-sm mb-2">{phoneError}</p>
                    )}

                    <button
                      className="bg-green-700 mt-2 text-white font-semibold px-6 py-2 rounded-3xl w-full"
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

          {/* Địa chỉ */}
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
                className="text-sm bg-gray-100 text-gray-700 border px-4 py-1 rounded"
                onClick={() => setShowAddressModal(true)}
              >
                Cập nhật
              </button>

              {showAddressModal && (
                <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                  <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-lg relative">
                    {/* Nút X */}
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

                    {/* Nội dung modal */}
                    <h2 className="text-lg font-semibold mb-4">Thay đổi địa chỉ</h2>
                    <label className="block mb-2 font-medium">Địa chỉ mới</label>
                    <input
                      type="text"
                      value={newAddress}
                      onChange={(e) => setNewAddress(e.target.value)}
                      placeholder="Nhập địa chỉ mới"
                      className="w-full border rounded px-4 py-2 mb-2"
                    />
                    {addressError && (
                      <p className="text-red-500 text-sm mb-2">{addressError}</p>
                    )}

                    <button
                      className="bg-green-700 mt-2 text-white font-semibold px-6 py-2 rounded-3xl w-full"
                      onClick={handleUpdateAddress}
                    >
                      Cập nhật
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>


          {/* Bảo mật */}
          <div>
            <p className="text-gray-900 font-semibold mt-4 mb-4">Bảo mật</p>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <Lock className="w-4 h-4 text-gray-500" />
                <span>Đổi mật khẩu</span>
              </div>
              <button
                className="text-sm bg-gray-100 text-gray-700 border px-4 py-1 rounded"
                onClick={() => setShowPasswordModal(true)}
              >
                Thay đổi
              </button>
            </div>
          </div>

          {/* Modal đổi mật khẩu */}
          {showPasswordModal && (
            <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-xl w-full max-w-lg shadow-lg relative">
                <button
                  onClick={() => setShowPasswordModal(false)}
                  className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
                >
                  <X className="w-5 h-5" />
                </button>

                <h2 className="text-lg font-semibold mb-4">Thay đổi mật khẩu</h2>

                <div className="space-y-4">
                  {error && <p className="text-red-500 text-sm">{error}</p>}
                  {success && <p className="text-green-600 text-sm">{success}</p>}

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
                      className="absolute right-2 mt-3 text-gray-500"
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
                      className="absolute right-2 mt-3 text-gray-500"
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
                      className="absolute right-2 mt-3 text-gray-500"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  <button
                    onClick={handleChangePassword}
                    className="bg-green-700 text-white font-semibold px-6 py-2 rounded-3xl w-full"
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
