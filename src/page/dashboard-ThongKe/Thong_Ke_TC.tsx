

import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Box, Card, CardContent, Typography, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';

const ThongKeTC: React.FC = () => {
  // Dữ liệu mẫu
  const financialData = [
    { month: 'Tháng 1', revenue: 50000, expense: 20000, profit: 30000 },
    { month: 'Tháng 2', revenue: 70000, expense: 30000, profit: 40000 },
    { month: 'Tháng 3', revenue: 80000, expense: 25000, profit: 55000 },
    { month: 'Tháng 4', revenue: 60000, expense: 30000, profit: 30000 },
  ];

  return (
    <div className="flex flex-col p-4 gap-6 pb-16">
      {/* Row 1: Biểu đồ doanh thu và chi phí */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Biểu đồ doanh thu và chi phí
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={financialData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="revenue" fill="#8884d8" name="Doanh thu" />
              <Bar dataKey="expense" fill="#82ca9d" name="Chi phí" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Row 2: Biểu đồ lợi nhuận theo thời gian */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Biểu đồ lợi nhuận theo thời gian
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={financialData}>
              <CartesianGrid strokeDasharray="3 3" />
              
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="profit" stroke="#ff7300" name="Lợi nhuận" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Row 3: Bảng chi tiết tài chính */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Bảng chi tiết tài chính
          </Typography>
          <Box className="overflow-x-auto">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Tháng</TableCell>
                  <TableCell>Doanh thu (VNĐ)</TableCell>
                  <TableCell>Chi phí (VNĐ)</TableCell>
                  <TableCell>Lợi nhuận (VNĐ)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {financialData.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{row.month}</TableCell>
                    <TableCell>{row.revenue.toLocaleString()}</TableCell>
                    <TableCell>{row.expense.toLocaleString()}</TableCell>
                    <TableCell>{row.profit.toLocaleString()}</TableCell>
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

export default ThongKeTC;
