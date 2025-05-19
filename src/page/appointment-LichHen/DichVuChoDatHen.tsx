import { useEffect, useState } from "react";
import { Card, CardContent, CircularProgress, Typography } from "@mui/material";
import { createAppointment } from "../../service/apiAppoinment";
import dayjs from "dayjs";
import "dayjs/locale/vi";
dayjs.locale("vi");

import { Service } from "../../interface/AppointmentForm_interface";

type Invoice = {
  id: string;
  userId: string;
  guestName: string;
  appointmentDateTime: string;
  serviceIds: string[];
  totalPrice: number;
  notes?: string;
  status: string;
};

const groupByDate = (invoices: Invoice[]) => {
  return invoices.reduce((groups: Record<string, Invoice[]>, invoice) => {
    const dateKey = new Date(invoice.appointmentDateTime).toISOString().split("T")[0];
    if (!groups[dateKey]) groups[dateKey] = [];
    groups[dateKey].push(invoice);
    return groups;
  }, {});
};

// const InvoiceList: React.FC<{ filterByStatus: string[] }> = ({ filterByStatus }) => {
const InvoiceList: React.FC<{ filterByStatus: string[], currentUserId: string }> = ({ filterByStatus, currentUserId }) => {

  const [groupedInvoices, setGroupedInvoices] = useState<Record<string, Invoice[]>>({});
  const [loading, setLoading] = useState(true);
  const [allServices, setAllServices] = useState<Service[]>([]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch("/api/service-spa");
        const data = await res.json();
        setAllServices(data);
      } catch (err) {
        console.error("Lỗi khi lấy dịch vụ:", err);
      }
    };
    fetchServices();
  }, []);

  useEffect(() => {
    const fetchInvoices = async () => {
      setLoading(true);
      try {
        // const storedInvoices = JSON.parse(localStorage.getItem("allInvoices") || "[]") as unknown;
        const storedInvoices = JSON.parse(localStorage.getItem(`invoices_${currentUserId}`) || "[]") as unknown;

        const invoices = Array.isArray(storedInvoices)
          ? (storedInvoices as Invoice[])
          : [];

        const filtered = invoices.filter((inv: unknown): inv is Invoice =>
          typeof inv === "object" &&
          inv !== null &&
          filterByStatus.includes((inv as Invoice).status)
        );

        const grouped = groupByDate(filtered);
        setGroupedInvoices(grouped);
      } catch (error) {
        console.error("Lỗi khi lấy hóa đơn:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchInvoices();
  }, [filterByStatus]);

  const handleConfirmDayBooking = async (invoices: Invoice[]) => {
    if (!invoices || invoices.length === 0) return;

    const userId = invoices[0].userId;
    const guestName = invoices[0].guestName;
    const serviceIds = invoices.flatMap(inv => inv.serviceIds || []);
    const uniqueServiceIds = [...new Set(serviceIds)];
    const totalPrice = invoices.reduce((sum, inv) => sum + (inv.totalPrice || 0), 0);
    const sorted = invoices.slice().sort((a, b) =>
      new Date(a.appointmentDateTime).getTime() - new Date(b.appointmentDateTime).getTime()
    );
    const appointmentDateTime = sorted[0].appointmentDateTime;
    const combinedNotes = invoices.map(inv => inv.notes).filter(Boolean).join(" | ");

    const payload = {
      userId: Number(userId), // Chuyển userId sang kiểu number
      guestName,
      appointmentDateTime,
      notes: combinedNotes,
      serviceIds: uniqueServiceIds.map(id => Number(id)), // Chuyển các ID dịch vụ sang kiểu number
      totalPrice,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await createAppointment(payload); // <- gọi ở đây để tránh lỗi

    try {
      alert("Đặt lịch thành công cho ngày này!");

      // const stored = JSON.parse(localStorage.getItem("allInvoices") || "[]") as unknown;
      const stored = JSON.parse(localStorage.getItem(`invoices_${currentUserId}`) || "[]") as unknown;

      const updated = (Array.isArray(stored) ? stored : []).filter((inv: unknown): inv is Invoice =>
        typeof inv === "object" &&
        inv !== null &&
        !invoices.some((i) => i.id === (inv as Invoice).id)
      );

      // localStorage.setItem("allInvoices", JSON.stringify(updated));
      localStorage.setItem(`invoices_${currentUserId}`, JSON.stringify(updated));

      const grouped = groupByDate(updated.filter((inv) => filterByStatus.includes(inv.status)));
      // const filtered = updated.filter((inv: Invoice) => filterByStatus.includes(inv.status));
      // const grouped = groupByDate(filtered);
      setGroupedInvoices(grouped);
    } catch (err) {
      console.error("Lỗi xác nhận lịch:", err);
      alert("Xác nhận đặt lịch thất bại!");
    }
  }; 

  // Xóa dịch vụ khỏi danh sách
  const handleRemoveDayInvoices = (invoices: Invoice[]) => {
    if (!invoices || invoices.length === 0) return;

    try {
      const stored = JSON.parse(localStorage.getItem(`invoices_${currentUserId}`) || "[]") as unknown;
      const updated = (Array.isArray(stored) ? stored : []).filter((inv: unknown): inv is Invoice =>
        typeof inv === "object" &&
        inv !== null &&
        !invoices.some((i) => i.id === (inv as Invoice).id)
      );

      localStorage.setItem(`invoices_${currentUserId}`, JSON.stringify(updated));

      const grouped = groupByDate(updated.filter((inv) => filterByStatus.includes(inv.status)));
      setGroupedInvoices(grouped);

      alert("Đã xóa khỏi danh sách chờ!");
    } catch (err) {
      console.error("Lỗi khi xóa hóa đơn:", err);
      alert("Xóa không thành công!");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <CircularProgress />
      </div>
    );
  }

  const dateKeys = Object.keys(groupedInvoices);
  if (dateKeys.length === 0) {
    return <div className="w-full bg-white rounded-2xl shadow-lg border border-gray-200 text-center text-gray-500 text-lg font-medium flex items-center justify-center gap-2 min-h-[370px]">🛎️ Hiện tại bạn chưa có dịch vụ chờ nào</div>;
  }

  const getServiceName = (id: string) => {
    const found = allServices.find(s => String(s.id) === String(id));
    return found ? `${found.name} - ${found.duration} phút` : `ID Dịch vụ: ${id}`;
  };

  // Hàm xóa chọn dịch vụ 
  const handleRemoveSingleInvoice = (idToRemove: string) => {
    try {
      const stored = JSON.parse(localStorage.getItem(`invoices_${currentUserId}`) || "[]") as unknown;
      const updated = (Array.isArray(stored) ? stored : []).filter((inv: unknown): inv is Invoice =>
        typeof inv === "object" &&
        inv !== null &&
        (inv as Invoice).id !== idToRemove
      );

      localStorage.setItem(`invoices_${currentUserId}`, JSON.stringify(updated));
      const grouped = groupByDate(updated.filter((inv) => filterByStatus.includes(inv.status)));
      setGroupedInvoices(grouped);

      alert("Đã xoá lịch hẹn!");
    } catch (err) {
      console.error("Lỗi khi xoá lịch hẹn:", err);
      alert("Xoá không thành công!");
    }
  };
  
  return (
    <div className="space-y-6">
      {dateKeys.map((date) => {
        const invoices = groupedInvoices[date];
        const guestNames = [...new Set(invoices.map((inv) => inv.guestName))];
        const allServiceIds = invoices.flatMap((inv) => inv.serviceIds || []);
        const uniqueServices = [...new Set(allServiceIds)];
        const totalPrice = invoices.reduce((sum, inv) => sum + (inv.totalPrice || 0), 0);

        return (
          <Card key={date} className="shadow-sm">
            <CardContent className="p-0">
              <div className="bg-orange-100 px-6 py-2 rounded-t-md border-b border-orange-300 flex items-center justify-between">
                <p className="text-orange-700 sm:text-lg txt-sm font-bold flex items-center gap-2">
                  📅 {dayjs(date).format("dddd, DD/MM/YYYY").replace(/^./, c => c.toUpperCase())}
                </p>
              </div>

              <div className="p-4 space-y-3 bg-white rounded-b-md">
                <div>
                  <Typography className="text-sm text-gray-600"><strong>Tên khách hàng:</strong> {guestNames.join(", ")}</Typography>
                </div>

                <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                  <Typography className="font-semibold text-gray-700 mb-2">Gói dịch vụ:</Typography>
                  <ul className="list-disc ml-5 space-y-1 text-sm text-gray-700">
                    {uniqueServices.map((id, idx) => (
                      <li key={idx}>{getServiceName(id)}</li>
                    ))}
                  </ul>
                </div>

                <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                  <Typography className="font-semibold text-gray-700 mb-2">Chi tiết lịch hẹn:</Typography>
                  <ul className="list-disc ml-5 text-sm space-y-4 text-gray-700">
                    {invoices.map((inv, idx) => (
                      <li key={idx} className="flex items-center justify-between">
                        <span>
                          ⏰ {dayjs(inv.appointmentDateTime).format("dddd, DD/MM/YYYY [lúc] HH:mm").replace(/^\w/, c => c.toUpperCase())} - Ghi chú: {inv.notes || "Không có"}
                        </span>
                        <button
                          onClick={() => handleRemoveSingleInvoice(inv.id)}
                          className="ml-4 text-red-500 hover:text-red-700 text-xs font-medium"
                        >
                          Xoá
                        </button>
                      </li>
                    ))}
                  </ul>

                </div>

                <div className="text-right font-semibold text-lg text-orange-600">
                  Tổng tiền: {totalPrice.toLocaleString()}đ
                </div>

                <div className="pt-4 flex sm:flex-row flex-col sm:gap-3 gap-2 sm:justify-end">
                  <button
                    className="bg-red-500 hover:bg-red-600 text-white sm:px-6 py-2 rounded-full text-sm font-medium shadow-sm transition duration-300"
                    onClick={() => handleRemoveDayInvoices(invoices)}
                  >
                    Xóa khỏi danh sách
                  </button>

                  <button
                    className="bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white 
                    sm:px-6 py-2 rounded-full text-sm font-medium shadow-md transition duration-300"
                    onClick={() => handleConfirmDayBooking(invoices)}
                  >
                    Xác nhận đặt lịch
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>

  );
};

export default InvoiceList;

