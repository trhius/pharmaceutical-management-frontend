import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/store/auth-store';
import { ArrowUpRight, Users, Package, ShoppingCart, AlertCircle, Loader2 } from 'lucide-react';
import { useDashboardData } from '@/apis/hooks/dashboard';
import { LowStockProduct, ProductCategoryPoint } from '@/apis/types/dashboard';

const formatYAxisTick = (tick: number) => {
  if (tick >= 1000000) return `${tick / 1000000}Tr`;
  if (tick >= 1000) return `${tick / 1000}K`;
  return tick.toString();
};

const monthMap: { [key: string]: string } = {
  Jan: 'Thg 1',
  Feb: 'Thg 2',
  Mar: 'Thg 3',
  Apr: 'Thg 4',
  May: 'Thg 5',
  Jun: 'Thg 6',
  Jul: 'Thg 7',
  Aug: 'Thg 8',
  Sep: 'Thg 9',
  Oct: 'Thg 10',
  Nov: 'Thg 11',
  Dec: 'Thg 12',
};

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize="12px" fontWeight="bold">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF'];

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { data: dashboardData, isLoading, isError } = useDashboardData();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center gap-2 p-4">
        <Loader2 className="animate-spin" />
        <span>Đang tải dữ liệu...</span>
      </div>
    );
  }

  if (isError || !dashboardData) {
    return <div className="p-4 text-red-500">Lỗi khi tải dữ liệu.</div>;
  }

  const {
    summary,
    revenueOverview,
    productCategoryDistribution,
    customerTrends,
    lowStockAlerts,
  } = dashboardData;

  const translatedRevenueOverview = revenueOverview.map((item) => ({
    ...item,
    name: monthMap[item.name] || item.name,
  }));

  const translatedCustomerTrends = customerTrends.map((item) => ({
    ...item,
    name: monthMap[item.name] || item.name,
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Chào mừng trở lại, {user?.name}</h1>
        <p className="text-muted-foreground">
          Đây là tổng quan về hiệu suất của nhà thuốc
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tổng doanh thu
            </CardTitle>
            <div className="bg-primary/10 p-1 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-primary"
              >
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.totalRevenue.value.toLocaleString()}₫</div>
            <p className={`text-xs font-medium ${summary.totalRevenue.change >= 0 ? 'text-green-600' : 'text-destructive'}`}>
              {summary.totalRevenue.change > 0 ? '+' : ''}{summary.totalRevenue.change.toFixed(2)}% so với tháng trước
            </p>
            <div className="mt-4 h-1 w-full bg-primary/10 rounded-full overflow-hidden">
              <div className="bg-primary h-full w-[75%]" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Khách hàng mới
            </CardTitle>
            <div className="bg-primary/10 p-1 rounded-full">
              <Users className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{summary.newCustomers.value}</div>
            <p className={`text-xs font-medium ${summary.newCustomers.change >= 0 ? 'text-green-600' : 'text-destructive'}`}>
              {summary.newCustomers.change > 0 ? '+' : ''}{summary.newCustomers.change.toFixed(2)}% so với tháng trước
            </p>
            <div className="mt-4 h-1 w-full bg-primary/10 rounded-full overflow-hidden">
              <div className="bg-primary h-full w-[65%]" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sản phẩm đã bán</CardTitle>
            <div className="bg-primary/10 p-1 rounded-full">
              <Package className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{summary.productsSold.value.toLocaleString()}</div>
            <p className={`text-xs font-medium ${summary.productsSold.change >= 0 ? 'text-green-600' : 'text-destructive'}`}>
              {summary.productsSold.change > 0 ? '+' : ''}{summary.productsSold.change.toFixed(2)}% so với tháng trước
            </p>
            <div className="mt-4 h-1 w-full bg-primary/10 rounded-full overflow-hidden">
              <div className="bg-primary h-full w-[80%]" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Đơn hàng hoàn thành
            </CardTitle>
            <div className="bg-primary/10 p-1 rounded-full">
              <ShoppingCart className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{summary.activeOrders.value}</div>
            <p className={`text-xs font-medium ${summary.activeOrders.change >= 0 ? 'text-green-600' : 'text-destructive'}`}>
              {summary.activeOrders.change > 0 ? '+' : ''}{summary.activeOrders.change.toFixed(2)}% so với tháng trước
            </p>
            <div className="mt-4 h-1 w-full bg-primary/10 rounded-full overflow-hidden">
              <div className="bg-primary h-full w-[60%]" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="space-x-2">
          <TabsTrigger value="overview">Tổng quan</TabsTrigger>
          <TabsTrigger value="analytics">Phân tích</TabsTrigger>
          <TabsTrigger value="inventory">Tồn kho</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="lg:col-span-4">
              <CardHeader>
                <CardTitle>Tổng quan doanh thu</CardTitle>
                <CardDescription>
                  Xu hướng doanh thu trong 12 tháng qua
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart
                    data={translatedRevenueOverview}
                    margin={{
                      top: 10,
                      right: 30,
                      left: 0,
                      bottom: 0,
                    }}
                  >
                    <defs>
                      <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis 
                      dataKey="name" 
                      stroke="currentColor" 
                      className="text-muted-foreground"
                      fontSize={12} 
                      tickLine={false} 
                      axisLine={false} 
                    />
                    <YAxis 
                      stroke="currentColor" 
                      className="text-muted-foreground"
                      fontSize={12} 
                      tickLine={false} 
                      axisLine={false} 
                      tickFormatter={formatYAxisTick}
                    />
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} vertical={false} />
                    <Tooltip 
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-card border border-border rounded-lg shadow-lg p-3">
                              <p className="text-sm font-medium">{payload[0].payload.name}</p>
                              <p className="text-sm font-semibold text-primary">
                                {payload[0].value?.toLocaleString()}₫
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="total"
                      stroke="hsl(var(--chart-1))"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorTotal)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Danh mục sản phẩm</CardTitle>
                <CardDescription>
                  Phân phối doanh số theo danh mục
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={productCategoryDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={renderCustomizedLabel}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {productCategoryDistribution.map((_: ProductCategoryPoint, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Legend 
                      layout="horizontal" 
                      verticalAlign="bottom" 
                      align="center" 
                      wrapperStyle={{
                        paddingTop: '15px',
                        fontSize: '12px',
                        color: 'hsl(var(--foreground))'
                      }}
                    />
                    <Tooltip 
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-card border border-border rounded-lg shadow-lg p-3">
                              <p className="text-sm font-medium">{payload[0].name}</p>
                              <p className="text-sm font-semibold text-primary">
                                {payload[0].value}%
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="lg:col-span-4">
              <CardHeader>
                <CardTitle>Xu hướng khách hàng</CardTitle>
                <CardDescription>
                  Khách hàng mới so với khách hàng cũ trong năm nay
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={translatedCustomerTrends}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} vertical={false} />
                    <XAxis 
                      dataKey="name" 
                      stroke="currentColor" 
                      className="text-muted-foreground"
                      fontSize={12} 
                      tickLine={false} 
                      axisLine={false} 
                    />
                    <YAxis 
                      stroke="currentColor" 
                      className="text-muted-foreground"
                      fontSize={12} 
                      tickLine={false} 
                      axisLine={false} 
                      allowDecimals={false}
                    />
                    <Tooltip 
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-card border border-border rounded-lg shadow-lg p-3">
                              <p className="text-sm font-medium">{payload[0].payload.name}</p>
                              <div className="mt-1">
                                <p className="flex items-center text-sm">
                                  <span className="h-2 w-2 rounded-full bg-chart-2 mr-1"></span>
                                  Mới: {payload[0].value}
                                </p>
                                <p className="flex items-center text-sm">
                                  <span className="h-2 w-2 rounded-full bg-chart-3 mr-1"></span>
                                  Quay lại: {payload[1].value}
                                </p>
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Legend />
                    <Bar 
                      dataKey="new" 
                      name="Khách hàng mới" 
                      fill="#8884d8" 
                      radius={[4, 4, 0, 0]} 
                      minPointSize={2}
                    />
                    <Bar 
                      dataKey="returning" 
                      name="Khách hàng quay lại" 
                      fill="#82ca9d" 
                      radius={[4, 4, 0, 0]} 
                      minPointSize={2}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Cảnh báo tồn kho thấp</CardTitle>
                <CardDescription>Các sản phẩm cần nhập hàng</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {lowStockAlerts.length > 0 ? (
                    lowStockAlerts.map((product: LowStockProduct) => (
                      <div key={product.id} className="flex items-center">
                        <div className="w-full flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <AlertCircle className="h-4 w-4 text-destructive" />
                            <span className="font-medium">{product.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">Còn {product.stock}</Badge>
                            <ArrowUpRight className="h-4 w-4 text-destructive" />
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">Không có cảnh báo tồn kho thấp.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Phân tích</CardTitle>
              <CardDescription>
                Thông tin phân tích chi tiết sẽ xuất hiện ở đây
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center border border-dashed rounded-lg">
                <p className="text-muted-foreground">Tính năng phân tích sắp ra mắt</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="inventory" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tồn kho</CardTitle>
              <CardDescription>
                Thông tin quản lý kho sẽ xuất hiện ở đây
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center border border-dashed rounded-lg">
                <p className="text-muted-foreground">Tính năng quản lý kho sắp ra mắt</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
