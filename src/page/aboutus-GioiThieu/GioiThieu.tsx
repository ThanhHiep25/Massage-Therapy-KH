import React from "react"; // Removed unused imports like useState, useEffect, useRef
import { Phone, LocationOn } from "@mui/icons-material"; // Kept MUI icons
import { motion } from "framer-motion";

const GioiThieu: React.FC = () => {
  const images = ["/trilieu1.png", "/trilieu2.jpg", "/massage-tri-lieu.jpg"];

  return (
    <div>
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
        className="bg-cover bg-center text-white text-center"
        style={{
          backgroundImage: "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('https://source.unsplash.com/1600x900/?wellness,spa,therapy')",
        }}
      >
        <div className="container mx-auto max-w-screen-lg px-5 py-20 sm:py-24 md:py-32"> {/* Adjusted padding */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Hành Trình Hồi Phục & Thăng Hoa Cảm Xúc
          </h1>
          <p className="text-lg sm:text-xl opacity-90">
            Massage trị liệu không chỉ là thư giãn mà là sự kết nối giữa cơ thể và tâm trí. Hãy để mỗi giác quan của bạn được đánh thức và chăm sóc toàn diện.
          </p>
        </div>
      </motion.section>

      {/* Sứ Mệnh & Giá Trị Cốt Lõi Section */}
      <div className="flex flex-col md:flex-row justify-center items-start max-w-screen-2xl mx-auto px-3 sm:px-5 md:px-10 py-10 sm:py-16 md:py-20 lg:py-24 gap-8 md:gap-10 lg:gap-16 xl:gap-20">
        {/* KHỐI ẢNH */}
        {/*
          Note on absolute positioning with Tailwind:
          Parent needs `relative`. Children use `absolute` with `top-`, `left-`, `w-`, `h-`.
          Exact pixel values might be tricky with Tailwind's default spacing scale.
          You might need to define custom JIT values like `w-[720px]` or adjust the design
          to better fit Tailwind's spacing/sizing or use a more fluid grid for images.
          For this conversion, I'll use JIT values to match your pixel specifics.
        */}
        <div className="relative w-full md:w-[720px] h-[520px] md:h-[680px] flex-shrink-0 mx-auto md:mx-0">
          {/* Hình 1 – Dọc lớn hơn */}
          <img
            src={images[0]}
            alt="Trị liệu spa 1"
            className="absolute top-0 left-0 w-[180px] h-[320px] sm:w-[220px] sm:h-[400px] md:w-[300px] md:h-[520px] rounded-2xl object-cover shadow-2xl z-30"
          />

          {/* Hình 2 – Vuông lớn hơn */}
          <img
            src={images[1]}
            alt="Trị liệu spa 2"
            className="absolute top-0 left-[200px] sm:left-[250px] md:left-[340px] w-[150px] h-[150px] sm:w-[200px] sm:h-[200px] md:w-[320px] md:h-[320px] rounded-2xl object-cover shadow-xl z-20"
          />

          {/* Hình 3 – Ngang lớn hơn */}
          <img
            src={images[2]}
            alt="Trị liệu spa 3"
            className="absolute top-[200px] sm:top-[260px] md:top-[380px] left-[100px] sm:left-[150px] md:left-[220px] w-[230px] h-[150px] sm:w-[300px] sm:h-[200px] md:w-[440px] md:h-[300px] rounded-2xl object-cover shadow-xl z-10"
          />
        </div>

        {/* KHỐI NỘI DUNG */}
        <div className="w-full md:max-w-[700px] px-2 sm:px-0">
          <h2 className="text-[#c3a27e] font-bold mb-4 sm:mb-6 text-2xl sm:text-3xl md:text-4xl">
            Sứ Mệnh & Giá Trị Cốt Lõi
          </h2>
          <div className="space-y-4 text-justify sm:space-y-6 text-gray-700 text-sm sm:text-base md:text-lg leading-relaxed sm:leading-loose">
            <p>
              Spa được nhiều du khách trong và ngoài nước biết đến. Đến Spa Quý khách sẽ cảm nhận không gian ấm cúng, gần gũi,
              sang trọng nhưng vẫn mang phong cách thuần Việt, Spa chăm sóc từ Tóc, Nail, Da mặt và Massage Trị Liệu Bấm Huyệt
              ngăn ngừa cũng như điều trị các bệnh: chấn thương, thể dục sai phương pháp, suy giãn tĩnh mạch, thoái hóa đốt sống, thần kinh tọa,...
              Đặc biệt ngâm lá Dao đỏ của vùng núi Tây Bắc đã được áp dụng tuyệt vời tại Spa. Cuộc sống càng hiện đại thì môi trường càng ảnh hưởng
              nhiều đến sức khỏe, cùng thói quen sinh hoạt thiếu cân bằng, áp lực công việc sẽ tác động xấu lên hệ miễn dịch của cơ thể.
              Hệ thống Spa đã ra đời và trở thành một nơi lý tưởng cho Quý khách được chăm sóc và lấy lại tinh thần sảng khoái,
              cơ thể tràn đầy sức sống bằng các liệu pháp chuẩn y học cổ truyền.
            </p>
            <p>
              Với đội ngũ chuyên viên tận tâm và giàu kinh nghiệm, không gian được thiết kế theo tiêu chuẩn cao cấp,
              chúng tôi luôn đặt khách hàng làm trung tâm – mang đến sự hài lòng tuyệt đối trong từng khoảnh khắc trải nghiệm.
            </p>
          </div>
        </div>
      </div>

      {/* Nội dung ảnh và chữ (Spa Chăm Sóc) Section */}
      <div className="flex flex-col md:flex-row w-full min-h-auto md:min-h-[700px] lg:min-h-[800px] xl:min-h-[900px] 2xl:min-h-[1000px]"> {/* Adjusted min-heights */}
        <div className="flex-1">
          <img
            src="/massage-tri-lieu.jpg"
            alt="Spa Team"
            className="w-full h-full object-cover min-h-[300px] sm:min-h-[400px] md:min-h-0" /* Ensure image has height on mobile */
          />
        </div>

        <div className="flex-1 bg-[#f2f0ed] p-6 sm:p-8 md:p-10 lg:p-12 xl:p-16 flex flex-col justify-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
            Spa Chăm Sóc <br />
            <span className="text-[#a16c3f]">
              Sức Khỏe & Tinh Thần Của Bạn
            </span>
          </h2>
          <p className="text-gray-600 text-justify leading-relaxed sm:leading-loose mb-6 sm:mb-8 text-sm sm:text-base md:text-lg">
            Spa tự hào là “spa sức khỏe” duy trì chất lượng suốt 12 năm nay với đội ngũ bác sĩ, kỹ thuật viên được đào tạo tiêu chuẩn gần 10 năm. Ưu điểm kỹ thuật viên chính là khả năng cảm nhận các điểm tắc nghẽn gây đau nhức trên cơ thể khách và làm tan các điểm đau nhức đó, làm mềm sự căng cơ và giải phóng năng lượng cơ thể cân bằng Tinh Thần & Sức Khỏe. Massage Trị Liệu được xem là một phương pháp không dùng thuốc nhằm tác động lên da, cơ và các huyệt đạo giúp thư giãn chống mệt mỏi căng thẳng.
          </p>

          <div className="flex flex-wrap gap-4 sm:gap-6 md:gap-8">
            {[
              { icon: "🌟", text: "Dịch vụ tốt nhất" },
              { icon: "🤝", text: "Khách hàng trên hết" },
              { icon: "👨‍⚕️", text: "Kỹ Thuật Viên Tận Tâm, Tận Tình" },
              { icon: "🧖‍♀️", text: "Không Gian Thư Giãn" },
              { icon: "📋", text: "Phục Vụ Chuyên Nghiệp" },
              { icon: "💰", text: "Giá cả phải chăng" },
              { icon: "⏱️", text: "Đặt Lịch Nhanh Chóng & Linh Hoạt" },
              { icon: "💎", text: "Khỏe Trong Đẹp Ngoài" },
            ].map((item, i) => (
              <div key={i} className="flex items-center w-full sm:w-[calc(50%-0.75rem)] md:w-[calc(50%-1rem)] lg:w-[calc(50%-1rem)]"> {/* Adjusted width for 2 columns */}
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white shadow-md flex items-center justify-center text-xl sm:text-2xl mr-3 sm:mr-4">
                  {item.icon}
                </div>
                <p className="font-medium text-xs sm:text-sm md:text-base text-gray-700">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Trải Nghiệm Dịch Vụ Hôm Nay Section */}
      <div className="container mx-auto px-5 py-12 sm:py-16 md:py-20 text-center">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
          Trải Nghiệm Dịch Vụ Hôm Nay
        </h2>
        <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8">
          Hãy dành thời gian cho bản thân. Đặt lịch ngay để được chăm sóc như bạn xứng đáng.
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4">
          <button className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-5 py-2.5 sm:px-6 sm:py-3 rounded-full text-sm sm:text-base transition-colors duration-300 w-full sm:w-auto">
            <Phone fontSize="small" /> {/* MUI Icon size can be controlled */}
            Gọi Tư Vấn
          </button>
          <button className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 sm:px-6 sm:py-3 rounded-full text-sm sm:text-base transition-colors duration-300 w-full sm:w-auto">
            <LocationOn fontSize="small" />
            Xem Vị Trí
          </button>
        </div>
      </div>
    </div>
  );
};

export default GioiThieu;