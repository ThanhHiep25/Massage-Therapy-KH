import { useEffect, useState } from "react";
import { getAllAppointmentById} from "../../service/apiAppoinment";
import { AppointmentResponse } from "../../interface/AppointmentForm_interface";
import { Service } from "../../interface/AppointmentForm_interface";
import { Step } from "../../interface/AppointmentForm_interface";
import { X } from "lucide-react";
import dayjs from "dayjs";
import "dayjs/locale/vi";
dayjs.locale("vi");
import { Card, CardContent } from "@mui/material";

import { updateStatusCancel } from "../../service/apiAppoinment";
import { toast } from 'react-toastify';

import PaymentModal from "../Payment/PaymentModal";

const statusColor = {
  PENDING: "bg-orange-200 text-orange-700 border-orange-300",
  SCHEDULED: "bg-green-200 text-green-800 border-green-300",
  CANCELLED: "bg-red-200 text-red-800 border-red-300",
  COMPLETED: "bg-blue-200 text-blue-800 border-blue-300",
  PAID: "bg-green-200 text-black border-blue-300",
};

const statusLabel: Record<AppointmentStatus, string> = {
  PENDING: "Chờ xác nhận",
  SCHEDULED: "Đã đặt lịch",
  CANCELLED: "Đã hủy",
  COMPLETED: "Hoàn thành",
  PAID: "Đã thanh toán",
};


type AppointmentStatus = "PENDING" | "SCHEDULED" | "CANCELLED" | "COMPLETED" | "PAID";

interface AppointmentListProps {
  filterByStatus?: AppointmentStatus[];
}

const AppointmentList: React.FC<AppointmentListProps> = ({ filterByStatus }) => {
  const [appointments, setAppointments] = useState<AppointmentResponse[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [confirmCancelId, setConfirmCancelId] = useState<number | null>(null);

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentResponse | null>(null);

  // Nhận diện tab dựa trên status
  const isHistoryTab = filterByStatus
    ? filterByStatus.every((status) =>
      ["COMPLETED", "PAID", "CANCELLED"].includes(status)
    )
    : false;

  const fetchAppointments = async () => {
    try {
      const user = localStorage.getItem("user");

      if (!user) {
        console.warn("Không tìm thấy thông tin user.");
        return;
      }

      const parsedUser = JSON.parse(user);
      const userEmail = parsedUser.email?.toLowerCase();

      const data: AppointmentResponse[] = await getAllAppointmentById(parsedUser.id);

      // Lọc lịch hẹn theo email khách hàng
      const filtered: AppointmentResponse[] = data.filter(
        (appointment) =>
          appointment.userId?.email?.toLowerCase() === userEmail
      );

      let finalList: AppointmentResponse[] = filtered;

      if (filterByStatus) {
        finalList = filtered.filter((item) =>
          filterByStatus.includes(item.status as AppointmentStatus)
        );
      }

      setAppointments(finalList);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Lỗi khi tải lịch hẹn:", error.message);
      } else {
        console.error("Lỗi không xác định:", error);
      }
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  // Fetch dữ liệu API
  // useEffect(() => {
  //   console.log(`[${new Date().toLocaleTimeString()}] Đang fetch lần đầu`);
  //   fetchAppointments(); // Fetch lần đầu

  //   const interval = setInterval(() => {
  //     console.log(`[${new Date().toLocaleTimeString()}] Đang fetch dữ liệu mỗi 10 giây`);
  //     fetchAppointments(); // Fetch liên tục 10s 1 lần
  //   }, 10000);

  //   return () => {
  //     console.log("Dừng fetch do rời khỏi trang");
  //     clearInterval(interval);
  //   };
  // }, []);

  const handleCancel = (id: number) => {
    setConfirmCancelId(id); // lưu id lại
  };

  const confirmCancel = async () => {
    if (!confirmCancelId) return; // dùng id đã lưu

    const appointment = appointments.find(a => a.id === confirmCancelId);
    if (!appointment) {
      toast.error("Không tìm thấy lịch hẹn.");
      return;
    }

    // if (appointment.status === "SCHEDULED") {
    //   toast.warning("Lịch hẹn đã được xác nhận và không thể hủy.");
    //   return;
    // }

    try {
      await updateStatusCancel(confirmCancelId);

      alert("Lịch hẹn đã được hủy thành công.\n\nVui lòng vào mục 'Lịch sử' để xem các lịch đã hủy.");

      fetchAppointments?.();
    } catch (error) {
      console.error("Lỗi khi hủy lịch:", error);
      alert("Hủy lịch thất bại. Vui lòng thử lại.");
    } finally {
      setConfirmCancelId(null);
    }
  };

  const groupAppointmentsByDate = (appointments: AppointmentResponse[]) => {
    const grouped: Record<string, AppointmentResponse[]> = {};

    appointments.forEach((appointment) => {
      const dateKey = dayjs(appointment.appointmentDateTime).format("YYYY-MM-DD");
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(appointment);
    });

    return grouped;
  };

  const groupedAppointments = groupAppointmentsByDate(appointments);

  return (
    <div className="sm:px-4 sm:py-4">
      {Object.keys(groupedAppointments).length === 0 ? (
        <div className="w-full bg-white rounded-2xl shadow-lg border border-gray-200 text-center text-gray-500 text-lg font-medium flex items-center justify-center gap-2 min-h-[370px]">
          <div className="text-3xl">🗓️</div>
          <p className="text-lg font-medium">
            {isHistoryTab
              ? "Không có lịch sử cuộc hẹn nào"
              : "Bạn chưa có lịch hẹn sắp tới"}
          </p>
        </div>
      ) : (
        Object.keys(groupedAppointments).map((date) => (
          // {Object.keys(groupedAppointments).map((date) => (
          <Card key={date} className="space-y-4 mb-6">
            <CardContent className="space-y-4 border-t-2">
              {/* <h3 className="text-lg font-semibold text-gray-800">
            {dayjs(date).format("dddd, DD/MM/YYYY").replace(/^\w/, c => c.toUpperCase())}
          </h3> */}
              <div className="bg-orange-100 px-6 py-2 rounded-t-md border-b border-orange-300 flex items-center justify-between">
                <p className="text-orange-700 sm:text-lg text-sm font-bold flex items-center gap-2">
                  📅 {dayjs(date).format("dddd, DD/MM/YYYY").replace(/^\w/, c => c.toUpperCase())}
                </p>
              </div>

              {groupedAppointments[date].map((appointment) => (
                <div
                  key={appointment.id}
                  className="bg-white border rounded-lg shadow-sm p-4 space-y-3"
                >
                  <p className="font-bold sm:text-base text-gray-800 text-sm">
                    Tên khách hàng: {appointment.userId?.name}
                  </p>

                  <div className="space-y-1 text-sm text-gray-700">
                    <p>Gói dịch vụ</p>
                    <ul className="list-disc list-inside space-y-1 text-gray-700">
                      {appointment.serviceIds.map((service) => (
                        <li key={service.id}>
                          <span className="font-medium">{service.name}</span> - {service.duration} phút{" "} - Giá: <span className="text-orange-500 font-semibold">{service.price.toLocaleString("vi-VN")} VND</span>
                          <button
                            onClick={() => setSelectedService(service)}
                            className="ml-2 text-blue-600 text-xs underline"
                          >
                            Xem chi tiết
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <p className="text-sm text-gray-600">
                    ⏰ {dayjs(appointment.appointmentDateTime).format("dddd, DD/MM/YYYY [lúc] HH:mm").replace(/^\w/, c => c.toUpperCase())}
                  </p>

                  <p className="text-sm text-gray-700">
                    <strong>Tổng tiền:</strong>{" "}
                    <span className="text-orange-500 font-bold">
                      {appointment.totalPrice.toLocaleString()}₫
                    </span>
                  </p>

                  <p className="text-sm text-gray-600 italic">
                    📝 Ghi chú: {appointment.notes || "Không có ghi chú"}
                  </p>

                  <div className="mt-2">
                    <span
                      className={`px-3 py-1 text-xs rounded-full border font-medium transition-colors duration-200 ${statusColor[appointment.status as AppointmentStatus]}`}
                    >
                      {statusLabel[appointment.status as AppointmentStatus]}
                    </span>
                  </div>
                  <div className="text-right mt-3">
                    {(appointment.status === "PENDING" ||
                      (appointment.status === "SCHEDULED" &&
                        dayjs().diff(dayjs((appointment as { updatedAt?: string }).updatedAt!), "hour") < 2)) && (
                        <button
                          onClick={() => handleCancel(appointment.id)}
                          className="inline-block bg-red-100 hover:bg-red-200 text-red-600 text-sm px-4 py-1 rounded"
                        >
                          Hủy lịch hẹn
                        </button>
                      )}

                    {appointment.status === "SCHEDULED" && (
                      <>
                        {(appointment as { updatedAt?: string }).updatedAt && (
                          <>
                            <p className="text-xs text-gray-500 italic">
                              Đã xác nhận lúc:{" "}
                              {dayjs((appointment as { updatedAt?: string }).updatedAt!).format("HH:mm DD/MM/YYYY")}
                            </p>

                            {/* {dayjs().diff(dayjs((appointment as { updatedAt?: string }).updatedAt!), "hour") < 2 ? (
                          <p className="text-xs text-green-600 italic">
                            Bạn còn {120 - dayjs().diff(dayjs((appointment as { updatedAt?: string }).updatedAt!), "minute")} phút để hủy lịch hẹn.
                          </p>
                        ) : (
                          <p className="text-xs text-red-500 italic">
                            Bạn chỉ có thể hủy trong vòng 2 tiếng sau khi được xác nhận.
                          </p>
                        )} */}

                            {dayjs().diff(dayjs((appointment as { updatedAt?: string }).updatedAt!), "hour") < 2 ? (
                              (() => {
                                const minutesLeft = 120 - dayjs().diff(dayjs((appointment as { updatedAt?: string }).updatedAt!), "minute");
                                const hours = Math.floor(minutesLeft / 60);
                                const minutes = minutesLeft % 60;
                                return (
                                  <p className="text-xs text-green-600 italic">
                                    Bạn còn {hours} giờ {minutes} phút để hủy lịch hẹn.
                                  </p>
                                );
                              })()
                            ) : (
                              <p className="text-xs text-red-500 italic">
                                Bạn chỉ có thể hủy trong vòng 2 tiếng sau khi được xác nhận.
                              </p>
                            )}
                            <button
                              onClick={() => {
                                setSelectedAppointment(appointment);
                                setIsPaymentModalOpen(true);
                              }}
                              className="mt-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                            >
                              Thanh toán
                            </button>
                          </>
                        )}
                      </>
                    )}

                    {(appointment.status === "CANCELLED" || appointment.status === "COMPLETED" || appointment.status === "PAID") && (
                      <div className="text-right w-full">
                        {appointment.status === "CANCELLED" ? (
                          <span className="inline-block text-sm text-red-500 italic">Đã hủy lịch hẹn</span>
                        ) : appointment.status === "PAID" ? (
                          <span className="inline-block text-sm text-green-500 italic">Đã thanh toán</span>
                        ) : (
                          <span className="inline-block text-sm text-blue-500 italic">Đã hoàn thành</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
          // ))}
        ))
      )}

      {/* Modal thanh toán */}
      <PaymentModal
        open={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        appointment={selectedAppointment}
      />

      {/* Modal Chi tiết dịch vụ */}
      {selectedService && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4">
          <div className="bg-white rounded-xl overflow-y-auto h-[90vh] p-3 max-w-xl w-full shadow-lg space-y-4 relative">
            <div>
              <button
                onClick={() => setSelectedService(null)}
                className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
              >
                <X className="w-5 h-5" />
              </button>
              <h3 className="text-lg font-semibold text-pink-600">
                Dịch vụ: {selectedService.name}
              </h3>
            </div>

            {/* Hình ảnh */}
            <div className="rounded-lg overflow-hidden shadow mb-6">
              <img
                src={selectedService.images[0] || "https://media.hcdn.vn/catalog/category/1320x250-1.jpg"}
                alt={selectedService.name}
                className="w-full object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>

            <p className="text-gray-700 mb-4 leading-relaxed">
              <strong className="text-gray-900">Mô tả:</strong> {selectedService.description}
            </p>

            <p className="text-gray-600 mb-2">Giá: <span className="text-orange-500 font-semibold">{selectedService.price.toLocaleString("vi-VN")} VND</span></p>

            <p className="text-gray-600">Thời gian: {selectedService.duration} phút</p>

            <p className="text-gray-700 font-semibold">Các bước thực hiện:</p>
            <ul className="list-decimal list-inside text-gray-600">
              {selectedService.steps.map((step: Step) => (
                <li key={step.stepId}>{step.description}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Confirm Hủy lịch */}
      {confirmCancelId && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4">
          <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-md space-y-4 text-center">
            <p className="text-lg font-semibold text-red-600">
              Bạn có chắc muốn hủy lịch hẹn không?
            </p>
            <div className="flex justify-center gap-4 mt-4">
              <button
                onClick={confirmCancel}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Có, hủy ngay
              </button>
              <button
                onClick={() => setConfirmCancelId(null)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Không, giữ lại
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentList;