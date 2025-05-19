import { Box, Typography, Tabs, Tab, Card, CardMedia, CardContent } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const categories = ["Tất cả", "Thông báo", "Kiến Thức Sức Khỏe", "Chia Sẻ Về Cuộc Sống"];

const articles = [
  {
    title: "Chìm Đắm Trong Khoảnh Khắc Yên Bình: Sự Hòa Quyện Giữa Cơ Thể và Tâm Trí",
    date: "30 Tháng 10, 2023",
    image: "anh-spa.jpg",
    category: "Chia Sẻ Về Cuộc Sống",
  },
  {
    title: "Massage Thải Độc",
    date: "22 Tháng 10, 2023",
    image: "trilieu1.png",
    category: "Kiến Thức Sức Khỏe",
  },
  {
    title: "Nghệ Thuật Thưởng Thức Mỗi Giây",
    date: "20 Tháng 10, 2023",
    image: "trilieu2.jpg",
    category: "Chia Sẻ Về Cuộc Sống",
  },
  {
    title: "Điện Sinh Học",
    date: "18 Tháng 10, 2023",
    image: "anh-spa-6.jpg",
    category: "Kiến Thức Sức Khỏe",
  },
  {
    title: "Các Bệnh Lý Liên Quan Đến Mạch và Máu",
    date: "16 Tháng 10, 2023",
    image: "anh-spa-8.jpg",
    category: "Thông báo",
  },
  {
    title: "Thở Cơ Hoành – Thở Đúng Cách Để Khỏe Mạnh Hơn",
    date: "16 Tháng 10, 2023",
    image: "anh-spa-docsach.jpg",
    category: "Kiến Thức Sức Khỏe",
  },
  {
    title: "Massage khỏe",
    date: "02 Tháng 06, 2024",
    image: "anh-spa-3.jpg",
    category: "Kiến Thức Sức Khỏe",
  },
];

const TinTuc = () => {
    const [tab, setTab] = useState(0);
    const navigate = useNavigate();

    const handleChange = (_: React.SyntheticEvent, newValue: number) => {
        setTab(newValue);
    };

    const filteredArticles = tab === 0 ? articles : articles.filter(a => a.category === categories[tab]);

    return (
        <Box sx={{ backgroundColor: "#f3e9dd", px: { xs: 2, md: 10 }, py: 5 }}>
            <Typography variant="h4" align="center" gutterBottom sx={{ fontFamily: "serif", fontWeight: 600 }}>
                TIN TỨC
            </Typography>

            <Tabs
                value={tab}
                onChange={handleChange}
                centered
                sx={{ mb: 4 }}
                textColor="primary"
                indicatorColor="primary"
            >
                {categories.map((label, index) => (
                <Tab key={index} label={label} />
                ))}
            </Tabs>

            <Box
                sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 3,
                    justifyContent: "center",
                    maxWidth: 1200, // Thu nhỏ khung ngoài cùng
                    mx: "auto",      // Căn giữa
                }}
                >
                {filteredArticles.map((article, index) => (
                    <Card
                    key={index}
                    sx={{
                        width: "31%", // 3 cái mỗi hàng (với gap ~3%)
                        minWidth: 280,
                        cursor: "pointer",
                        boxShadow: 2,
                        borderRadius: 3,
                        overflow: "hidden",
                        display: "flex",
                        flexDirection: "column",
                    }}
                    onClick={() => navigate(`/tin-tuc/${index}`)}
                    >
                    
                    <Box sx={{ position: "relative" }}>
                        <CardMedia
                            component="img"
                            image={article.image}
                            alt={article.title}
                            sx={{
                            height: 140,
                            objectFit: "cover",
                            }}
                        />
                        <Box
                            sx={{
                            position: "absolute",
                            top: 8,
                            left: 8,
                            backgroundColor: "#ffffffcc", // nền trắng mờ
                            borderRadius: "50%",
                            width: 48,
                            height: 48,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "12px",
                            fontWeight: 600,
                            textAlign: "center",
                            boxShadow: 1,
                            }}
                        >
                            <Box component="span" sx={{ lineHeight: 1.2 }}>
                                {article.date.split(" ")[0]} <br />
                                {"Th" + article.date.match(/Tháng (\d+)/)?.[1]} <br />
                                {article.date.split(", ")[1]}
                            </Box>

                        </Box>
                    </Box>

                    <CardContent sx={{ py: 1.5, px: 2 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                            {article.title}
                        </Typography>
                        <Typography variant="body2" color="primary" mt={1}>
                            Chi tiết +
                        </Typography>
                    </CardContent>
                    </Card>
                ))}
            </Box>

        </Box>
    );
};

export default TinTuc;
