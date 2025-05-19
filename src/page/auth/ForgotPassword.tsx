import React, { useState, useEffect } from 'react';
import { TextField, Button, Card, CardContent, Typography, InputAdornment, IconButton, Alert, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { resetPassword, sendResetPassword } from '../../service/apiService';
import { Visibility, VisibilityOff, Mail, CheckCircle } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const ForgotPassword: React.FC = () => {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [step, setStep] = useState(1);
    const [timer, setTimer] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [success, setSuccess] = useState<string | null>(null);
    const [otpExpired, setOtpExpired] = useState(false);
    const [validOtp, setValidOtp] = useState('');

    const navigation = useNavigate();

    const [focused, setFocused] = useState<{ email: boolean }>({ email: false });

    const handleFocus = (field: "email") => {
        setFocused((prev) => ({ ...prev, [field]: true }));
    };

    const handleBlur = (field: "email") => {
        setFocused((prev) => ({ ...prev, [field]: false }));
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    };

    // const handleSendOtp = async () => {
    //     setError(null);
    //     setSuccess(null);
    //     setLoading(true);
    //     try {
    //         await sendResetPassword(email);
    //         setStep(2);
    //         setTimer(30);
    //         setOtpExpired(false);
    //         setOtp(''); // Xóa OTP cũ để tránh dùng lại
    //         setSuccess('OTP đã được gửi tới email của bạn.');
    //     } catch (error: any) {
    //         const message = error.response?.data?.message || 'Gửi OTP thất bại. Vui lòng thử lại.';
    //         setError(message);
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    const handleSendOtp = async () => {
        setError(null);
        setSuccess(null);
        setLoading(true);
        try {
            const response = await sendResetPassword(email);
            console.log("OTP từ API:", response.otp); // Kiểm tra OTP trả về từ API
            setValidOtp(response.otp); // Lưu OTP mới nhất
            setStep(2);
            setTimer(30);
            setOtpExpired(false);
            setOtp('');
            setSuccess('OTP đã được gửi tới email của bạn.');
        } catch (error: any) {
            const message = error.response?.data?.message || 'Gửi OTP thất bại. Vui lòng thử lại.';
            setError(message);
        } finally {
            setLoading(false);
        }
    };    
    
    // const handleVerifyOtp = async () => {
    //     if (!otp) {
    //         setError('Vui lòng nhập OTP');
    //         return;
    //     }
    //     if (otpExpired) {
    //         setError('OTP đã hết hạn. Vui lòng gửi lại OTP mới.');
    //         return;
    //     }    
    //     setStep(3);
    //     setSuccess('Mời bạn đặt lại mật khẩu mới.');
    // };

    const handleVerifyOtp = async () => {
        console.log("OTP nhập vào:", otp);
        console.log("OTP hợp lệ:", validOtp); // Kiểm tra giá trị của validOtp

        if (!otp) {
            setError('Vui lòng nhập OTP');
            return;
        }
        if (otpExpired) {
            setError('OTP đã hết hạn. Vui lòng gửi lại OTP mới.');
            return;
        }
        if (otp !== validOtp) {
            setError('OTP không chính xác. Vui lòng kiểm tra lại.');
            return;
        }
        setStep(3);
        setSuccess('Mời bạn đặt lại mật khẩu mới.');
    };
    
    const handleResetPassword = async () => {
        console.log("Gửi yêu cầu đặt lại mật khẩu với:", { email, otp, newPassword });
        setError(null);
        setSuccess(null);
        setLoading(true);
        try {
            const response = await resetPassword(email, otp, newPassword);
            console.log("Phản hồi từ API:", response);
            const message = response.message || '';
    
            if (message.includes('OTP hết hạn')) {
                setError('OTP đã hết hạn. Vui lòng yêu cầu OTP mới.');
                setOtpExpired(true);
                setOtp('');
            } else if (message.includes('OTP không chính xác')) {
                setError('OTP không chính xác. Vui lòng kiểm tra lại.');
                setOtp('');
            } else if (message.includes('Đặt lại mật khẩu thành công')) {
                setSuccess('Đặt lại mật khẩu thành công!');
                setModalOpen(true);
                setTimeout(() => {
                    setModalOpen(false);
                    navigation('/');
                }, 3000);
            } else {
                setError('Đặt lại mật khẩu thất bại. Vui lòng thử lại.');
            }
        } catch (error: any) {
            const message = error.response?.data?.message || 'Đặt lại mật khẩu thất bại. Vui lòng thử lại.';
            if (message.includes('OTP hết hạn')) {
                setError('OTP đã hết hạn. Vui lòng yêu cầu OTP mới.');
                setOtpExpired(true);
                setOtp('');
            } else if (message.includes('OTP không chính xác')) {
                setError('OTP không chính xác. Vui lòng kiểm tra lại.');
                setOtp('');
            } else {
                setError(message);
            }
        } finally {
            setLoading(false);
        }
    };    

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (step === 2 && timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        } else if (timer === 0) {
            setOtpExpired(true);
        }
        return () => clearInterval(interval);
    }, [step, timer]);

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const toggleShowPassword = () => {
        setShowPassword((prev) => !prev);
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-800 dark:text-white">
            <Card className="w-full max-w-md shadow-lg">
                <CardContent>
                    <Typography variant="h5" className="mb-4 text-center font-bold">
                        {/* {step === 1 ? 'Quên mật khẩu?' : 'Đặt lại mật khẩu'} */}
                        {step === 1 ? 'Quên mật khẩu?' : step === 2 ? 'Nhập OTP' : 'Đặt lại mật khẩu'}
                    </Typography>

                    {error && <Alert severity="error" className="mb-4">{error}</Alert>}
                    {success && <Alert severity="success" className="mb-4">{success}</Alert>}

                    {step === 1 && (
                        <>
                            <div className="relative mt-4 mb-4">
                                {/* Label cho Email */}
                                <label 
                                    className={`absolute left-4 bg-white px-1 transition-all pointer-events-none ml-8 
                                        ${focused.email || email 
                                            ? "-top-3 left-3 text-blue-500 text-sm"  // Khi focus hoặc có giá trị: Nhảy lên + đổi màu xanh
                                            : "top-5 text-gray-500 text-lg"}`} // Khi chưa focus: Màu xám + lớn hơn
                                >
                                    Email
                                </label>

                                {/* Icon Mail */}
                                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-2xl" />

                                {/* Ô nhập Email */}
                                <input 
                                    type="email"
                                    name="email" 
                                    placeholder="Email" 
                                    onFocus={() => handleFocus("email")} 
                                    onBlur={() => handleBlur("email")} 
                                    onChange={handleChange} 
                                    value={email} 
                                    className="w-full pt-5 pl-12 pr-5 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none text-lg" 
                                />
                            </div>

                            {/* <Box sx={{ display: 'flex', alignItems: 'flex-end'}} className='mt-4 mb-4' >
                                <Mail sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
                                <TextField type="email" label="Email" variant="standard" placeholder="Email" fullWidth />
                            </Box> */}

                            <Button
                                variant="contained"
                                color="primary"
                                fullWidth
                                onClick={handleSendOtp}
                                disabled={!email || loading}
                            >
                                {loading ? 'Đang gửi...' : 'Gửi OTP'}
                            </Button>
                        </>
                    )}

                    {step === 2 && (
                        <>
                            <div className="flex flex-row items-center mb-4">
                                <TextField
                                    label="OTP"
                                    placeholder='Nhập OTP'
                                    fullWidth
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    className="mb-4"
                                    disabled={loading}
                                />

                                <Typography className="text-red-400 text-center pl-4 mb-2 font-medium">
                                    {timer > 0 ? `${formatTime(timer)}` : 'OTP đã hết hạn.'}
                                </Typography>

                            </div>

                            <div className=" flex flex-col items-center">
                                <Button variant="contained" color="primary" fullWidth onClick={handleVerifyOtp} disabled={!otp || otpExpired} className='mb-4'>
                                    Xác nhận OTP
                                </Button>
                                {otpExpired && (
                                    <Button variant="outlined" color="secondary" fullWidth onClick={handleSendOtp} className="mt-2" disabled={loading}>
                                        Gửi lại OTP
                                    </Button>
                                )}
                            </div>
                        </>
                    )}

                    {step === 3 && (
                        <>
                            <div className="flex flex-row items-center mb-4">
                                <TextField
                                    label="Mật khẩu mới"
                                    placeholder='Nhập mật khẩu mới'
                                    type={showPassword ? 'text' : 'password'}
                                    fullWidth
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="mb-4"
                                    disabled={loading}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton onClick={toggleShowPassword} edge="end">
                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </div>

                            <Button variant="contained" color="primary" fullWidth onClick={handleResetPassword} disabled={!newPassword} className='mb-4'>
                                Đặt lại mật khẩu
                            </Button>
                        </>
                    )}
                </CardContent>
            </Card>

            {/* Modal thông báo thành công */}
            <Dialog open={modalOpen} onClose={() => setModalOpen(false)}>
                <DialogTitle className="text-center">
                    <CheckCircle style={{ color: 'green', fontSize: 50 }} />
                </DialogTitle>
                <DialogContent className="text-center">
                    <Typography variant="h6" gutterBottom>
                        Mật khẩu đã được đặt lại thành công!
                    </Typography>
                    <Typography>Hệ thống sẽ chuyển bạn về trang chủ trong giây lát...</Typography>
                </DialogContent>
                <DialogActions className="justify-center">
                    <Button onClick={() => navigation('/')} color="primary" variant="contained" className='text-center'>
                        Về trang chủ ngay
                    </Button>
                </DialogActions>
            </Dialog>

        </div>
    );
};

export default ForgotPassword;
