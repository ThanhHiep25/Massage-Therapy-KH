import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import {
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Box,
} from '@mui/material';

const DichVuTK: React.FC = () => {
  // Dữ liệu mẫu
  const serviceData = [
    { name: 'Massage toàn thân', value: 40, revenue: 1000000 },
    { name: 'Chăm sóc da mặt', value: 25, revenue: 750000 },
    { name: 'Xông hơi', value: 20, revenue: 500000 },
    { name: 'Trị liệu cổ vai gáy', value: 15, revenue: 300000 },
  ];

  const colors = ['#4CAF50', '#FF9800', '#03A9F4', '#E91E63'];

  return (
    <div className="flex flex-col p-6 gap-8">

      {/* Row 1: Biểu đồ phân bố dịch vụ */}
      <Card className="shadow-md" style={{ height: 500 }}>
        <CardContent>
          <Typography
            variant="h6"
            gutterBottom
            className="text-gray-800 font-medium"
          >
            Phân bố dịch vụ
          </Typography>
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={serviceData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={120}
                fill="#8884d8"
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
              >
                {serviceData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend layout="horizontal" verticalAlign="bottom" align="center" />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Row 2: Biểu đồ doanh thu và số lượng khách hàng */}
      <Card className="shadow-md">
        <CardContent>
          <Typography
            variant="h6"
            gutterBottom
            className="text-gray-800 font-medium"
          >
            Doanh thu và số lượng khách hàng
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={serviceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend layout="horizontal" verticalAlign="top" align="center" />
              <Bar dataKey="value" fill="#4CAF50" name="Khách hàng" />
              <Bar dataKey="revenue" fill="#FF9800" name="Doanh thu (VNĐ)" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Row 3: Bảng chi tiết dịch vụ */}
      <Card className="shadow-md">
        <CardContent>
          <Typography
            variant="h6"
            gutterBottom
            className="text-gray-800 font-medium"
          >
            Chi tiết dịch vụ
          </Typography>
          <Box className="overflow-x-auto">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell className="font-bold text-gray-600">Tên dịch vụ</TableCell>
                  <TableCell className="font-bold text-gray-600">Khách hàng</TableCell>
                  <TableCell className="font-bold text-gray-600">Doanh thu (VNĐ)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {serviceData.map((row, index) => (
                  <TableRow key={index} className="hover:bg-gray-100">
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.value}</TableCell>
                    <TableCell>{row.revenue.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        </CardContent>
      </Card>
    </div>
  );
};

export default DichVuTK;
