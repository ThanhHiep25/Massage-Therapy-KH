
import { Check, Trash2, XIcon } from 'lucide-react';
import { AppointmentResponse } from '../../interface/AppointmentForm_interface';
import { motion } from 'framer-motion'
import { updateStatusCancel, updateStatusComplete, updateStatusScheduled } from '../../service/apiAppoinment';
import { toast } from 'react-toastify';

interface Props {
  open: boolean;
  onClose: () => void;
  appointment: AppointmentResponse | null;
  onUpdateSuccess?: () => void;
}



const AppointmentDetailModal: React.FC<Props> = ({ open, onClose, appointment, onUpdateSuccess }) => {
  if (!open || !appointment) return null;

  // Xác nhận lịch hẹn khách hàng đã đặt
  const handleStatusScheduled = async (id: number) => {
    if (!window.confirm('Bạn có chắc muốn xác nhận lịch hẹn này ?')) return;

    if (appointment.status === 'SCHEDULED') {
      toast.warning('Lịch hẹn này đã được xác nhận')
      return;
    }

    try {
      await updateStatusScheduled(id)
      toast.success(`Xác nhận dịch vụ thành công`)
      onUpdateSuccess?.();
    } catch (error: unknown) {
      console.error(`Lỗi kích hoạt dịch vụ`, error);
      toast.error("Xác nhận thất bại")
    }
  }

  // Complete lịch hẹn
  const handleStatusComplete = async (id: number) => {
    if (!window.confirm('Bạn có chắc muốn xác nhận hoàn thành lịch hẹn này ?')) return;

    try {
      await updateStatusComplete(id)
      toast.success(`Hoàn thành dịch vụ thành công`)
      onUpdateSuccess?.();
    } catch (error) {
      console.error(`Lỗi kích hoạt dịch vụ`, error);
      toast.error("Xác nhận thất bại")
    }
  }

  // Hủy lịch hẹn 
  const handleCancel = async (id: number) => {
    if (!window.confirm('Bạn có chắc muốn hủy lịch hẹn này ?')) return;

    if (appointment.status === 'SCHEDULED') {
      toast.warning('Đã xác nhận lịch hẹn không thể hủy')
      return
    }

    try {
      await updateStatusCancel(id)
      toast.success(`Hủy dịch vụ thành công`)
      onUpdateSuccess?.();
    } catch (error) {
      console.error(`Lỗi kích hoạt dịch vụ`, error);
      toast.error("Xác nhận thất bại")
    }
  }

  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 rounded-xl shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-600 hover:text-red-500 text-xl font-bold"
        >
          <XIcon className="h-6 w-6" />
        </button>

        <h2 className="text-xl font-bold mb-4 text-center">Chi tiết lịch hẹn</h2>

        <div className="space-y-3">
          <div>
            <span className="font-medium">Khách hàng:</span> {appointment.userId?.name || appointment.gustName}
          </div>
          <div>
            <span className="font-medium">Email:</span> {appointment.userId?.email || "Không có"}
          </div>
          <div>
            <span className="font-medium">Số điện thoại:</span> {appointment.userId?.phone || "Không có"}
          </div>
          <div>
            <span className="font-medium">Ngày hẹn:</span>{" "}
            {new Date(appointment.appointmentDateTime).toLocaleString("vi-VN")}
          </div>
          <div>
            <span className="font-medium">Tổng tiền:</span> {appointment.totalPrice.toLocaleString("vi-VN")}đ
          </div>

          <div>
            <span className="font-medium">Dịch vụ đã chọn:</span>
            <ul className="list-disc list-inside ml-4 mt-1 flex flex-col gap-y-2">
              {appointment.serviceIds.map((service) => (
                <li key={service.id} className="flex items-center gap-5 p-2 bg-green-200/50 rounded-lg">
                  <motion.img whileInView={{
                    x: 0,
                    y: 0,
                    transition: { duration: 0.3 },
                    scale: 1.1

                  }} src={service.images[0]} alt={service.name} className="w-16 h-16 object-cover rounded" />
                  <div className="flex flex-col ">
                    <span className="font-medium text-[16px">{service.name}</span>
                    <span className='text-gray-600'>Thời gian thực hiện: {service.duration} phút</span>
                    <span className='text-gray-600'>Tag: {service.serviceType}</span>
                  </div>

                </li>
              ))}
            </ul>
          </div>
          {appointment.notes && (
            <div>
              <span className="font-medium">Ghi chú:</span> {appointment.notes}
            </div>
          )}
        </div>
        <div className="mt-10 flex items-center gap-2">
          {appointment.status === "PENDING" && (
            <motion.button whileHover={{ scale: 1.05 }} className='flex items-center justify-center gap-2 p-2 rounded-lg bg-blue-200 text-gray-500 hover:bg-blue-400 hover:text-white' onClick={() => handleStatusScheduled(appointment.id)}><Check />Xác nhận lịch hẹn</motion.button>
          )}

          {
            appointment.status === "SCHEDULED" && (
              <motion.button whileHover={{ scale: 1.05 }} className='flex items-center justify-center gap-2 p-2 rounded-lg bg-green-200 text-gray-500 hover:bg-green-400 hover:text-white' onClick={() => handleStatusComplete(appointment.id)}><Check />Hoàn thành</motion.button>
            )}

          <motion.button whileHover={{ scale: 1.05 }} className='flex items-center justify-center gap-2 p-2 rounded-lg bg-red-200 text-gray-500 hover:bg-red-400 hover:text-white' onClick={() => handleCancel(appointment.id)}><Trash2 />Hủy lịch hẹn</motion.button>
        </div>
      </div>
    </div>
  );
};

export default AppointmentDetailModal;
