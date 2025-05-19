import { Box, Typography, TextField, Button, Paper } from "@mui/material";
import { Phone, Email, AccessTime, Room } from "@mui/icons-material";

const LienHe = () => {
    return (
        <Box sx={{ backgroundColor: "#f3e9dd", py: 6, px: 2, display: "flex", flexDirection: "column", alignItems: "center" }}>
        {/* TIÊU ĐỀ */}
        <Typography
            variant="h4"
            sx={{
            fontFamily: "sans-serif",
            fontWeight: 700,
            textTransform: "uppercase",
            mb: 4,
            }}
        >
            Liên hệ
        </Typography>

        {/* FORM VÀ HÌNH */}
        <Box
            sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 5,
            width: "100%",
            maxWidth: 1400,
            alignItems: "flex-start",
            justifyContent: "center",
            }}>
                
            {/* FORM */}
            <Box sx={{ width: { xs: "100%", md: "50%" } }}>
                <Typography variant="h6" sx={{ fontFamily: "Roboto", fontWeight: 600, mb: 1 }}>
                    Thông tin liên hệ
                </Typography>
                <Typography sx={{ mb: 3, color: "#4f4f4f", fontSize: 15 }}>
                    Quý khách vui lòng để lại thông tin, bên mình nhận thư sẽ liên hệ quý khách trong thời gian sớm nhất.
                </Typography>

                <Box component="form" sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                    <Box>
                        <Typography fontWeight={600} fontSize={14} mb={0.5}>Tên khách hàng</Typography>
                        <TextField fullWidth placeholder="Tên khách hàng" size="small" sx={{ bgcolor: "#fff7f2", borderRadius: 2 }} />
                    </Box>

                    <Box>
                        <Typography fontWeight={600} fontSize={14} mb={0.5}>Email</Typography>
                        <TextField fullWidth placeholder="Email" size="small" sx={{ bgcolor: "#fff7f2", borderRadius: 2 }} />
                    </Box>

                    <Box>
                        <Typography fontWeight={600} fontSize={14} mb={0.5}>Số điện thoại</Typography>
                        <TextField fullWidth placeholder="Số điện thoại" size="small" sx={{ bgcolor: "#fff7f2", borderRadius: 2 }} />
                    </Box>

                    <Box>
                        <Typography fontWeight={600} fontSize={14} mb={0.5}>Nội dung <span style={{ fontWeight: 400, fontStyle: "italic" }}>(không bắt buộc)</span></Typography>
                        <TextField fullWidth placeholder="Nội dung" multiline rows={4} sx={{ bgcolor: "#fff7f2", borderRadius: 2 }}/>
                    </Box>

                    <Button variant="contained" sx={{ alignSelf: "flex-start", backgroundColor: "#c96f4a", color: "white", borderRadius: "30px", px: 3, py: 1, fontWeight: "bold", textTransform: "none", "&:hover": { backgroundColor: "#b45a3d" }, }}>
                        Gửi thông tin
                    </Button>
                </Box>                
            </Box>

            {/* HÌNH ẢNH */}
            <Box
                sx={{
                    width: { xs: "100%", md: "50%" },
                    borderRadius: "40px",
                    overflow: "hidden",
                    boxShadow: 3,
                }}>
                <img
                    src="anh-spa.jpg" // thay bằng ảnh bạn muốn
                    alt="Spa Reception"
                    style={{ width: "100%", height: "auto"}}
                />
            </Box>
        </Box>

        {/* THÔNG TIN LIÊN HỆ */}
        <Box
            sx={{
            mt: 6,
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 4,
            width: "100%",
            maxWidth: 1400,
            }}
        >
            {/* MAP */}
            <Box
            sx={{
                flex: 1,
                height: 400,
                borderRadius: 3,
                overflow: "hidden",
                boxShadow: 2,
            }}
            >
                <iframe
                    title="IUH - Trường Đại học Công nghiệp TP.HCM"
                    src="https://www.google.com/maps?q=Trường+Đại+học+Công+nghiệp+TP.HCM&output=embed"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                />
            </Box>

            {/* THÔNG TIN */}
            <Paper elevation={2} sx={{ p: 4, borderRadius: 3, flex: 1, bgcolor: "#fff7f2" }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Mọi chi tiết xin liên hệ với Siêu Spa tại:
            </Typography>

            <Typography sx={{ mb: 1 }}><Phone fontSize="small" sx={{ mr: 1 }}/>Hotline: 012 345 6789</Typography>
            <Typography sx={{ mb: 1 }}><Email fontSize="small" sx={{ mr: 1 }}/>contact.jaloo.1@gmail.com</Typography>
            <Typography sx={{ mb: 1 }}><AccessTime fontSize="small" sx={{ mr: 1 }}/>09:00 - 21:00 (Hằng ngày)</Typography>
            <Typography sx={{ mt: 1 }}><Room fontSize="small" sx={{ mr: 1 }}/>123 Đường Spa, Quận Relax, Thành phố Chill</Typography>
            </Paper>
        </Box>
        </Box>
    );
};

export default LienHe;