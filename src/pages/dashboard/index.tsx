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
import { ArrowUpRight, Users, Package, ShoppingCart, AlertCircle } from 'lucide-react';

// Sample data
const revenueData = [
  { name: 'Jan', total: 1500 },
  { name: 'Feb', total: 2300 },
  { name: 'Mar', total: 1900 },
  { name: 'Apr', total: 2700 },
  { name: 'May', total: 2500 },
  { name: 'Jun', total: 3000 },
  { name: 'Jul', total: 2800 },
  { name: 'Aug', total: 3200 },
  { name: 'Sep', total: 3600 },
  { name: 'Oct', total: 3100 },
  { name: 'Nov', total: 3700 },
  { name: 'Dec', total: 4000 },
];

const customerData = [
  { name: 'Jan', new: 50, returning: 120 },
  { name: 'Feb', new: 60, returning: 130 },
  { name: 'Mar', new: 45, returning: 125 },
  { name: 'Apr', new: 70, returning: 140 },
  { name: 'May', new: 65, returning: 150 },
  { name: 'Jun', new: 80, returning: 160 },
];

const productCategoryData = [
  { name: 'Antibiotics', value: 35 },
  { name: 'Pain Relief', value: 25 },
  { name: 'Vitamins', value: 20 },
  { name: 'Cardiovascular', value: 15 },
  { name: 'Other', value: 5 },
];

const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

export default function DashboardPage() {
  const { user } = useAuthStore();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user?.role}</h1>
        <p className="text-muted-foreground">
          Here's an overview of your pharmacy's performance
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Revenue
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
            <div className="text-2xl font-bold">$45,231.89</div>
            <p className="text-xs text-muted-foreground">
              +20.1% from last month
            </p>
            <div className="mt-4 h-1 w-full bg-primary/10 rounded-full overflow-hidden">
              <div className="bg-primary h-full w-[75%]" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              New Customers
            </CardTitle>
            <div className="bg-primary/10 p-1 rounded-full">
              <Users className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+328</div>
            <p className="text-xs text-muted-foreground">
              +10.5% from last month
            </p>
            <div className="mt-4 h-1 w-full bg-primary/10 rounded-full overflow-hidden">
              <div className="bg-primary h-full w-[65%]" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Products Sold</CardTitle>
            <div className="bg-primary/10 p-1 rounded-full">
              <Package className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+12,234</div>
            <p className="text-xs text-muted-foreground">
              +15.3% from last month
            </p>
            <div className="mt-4 h-1 w-full bg-primary/10 rounded-full overflow-hidden">
              <div className="bg-primary h-full w-[80%]" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Orders
            </CardTitle>
            <div className="bg-primary/10 p-1 rounded-full">
              <ShoppingCart className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+573</div>
            <p className="text-xs text-muted-foreground">
              +7.2% from last month
            </p>
            <div className="mt-4 h-1 w-full bg-primary/10 rounded-full overflow-hidden">
              <div className="bg-primary h-full w-[60%]" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="space-x-2">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="lg:col-span-4">
              <CardHeader>
                <CardTitle>Revenue Overview</CardTitle>
                <CardDescription>
                  Revenue trends over the last 12 months
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart
                    data={revenueData}
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
                      stroke="hsl(var(--muted-foreground))" 
                      fontSize={12} 
                      tickLine={false} 
                      axisLine={false} 
                    />
                    <YAxis 
                      stroke="hsl(var(--muted-foreground))" 
                      fontSize={12} 
                      tickLine={false} 
                      axisLine={false} 
                      tickFormatter={(value) => `$${value}`}
                    />
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} vertical={false} />
                    <Tooltip 
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-card border border-border rounded-lg shadow-lg p-3">
                              <p className="text-sm font-medium">{payload[0].payload.name}</p>
                              <p className="text-sm font-semibold text-primary">
                                ${payload[0].value?.toLocaleString()}
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
                <CardTitle>Product Categories</CardTitle>
                <CardDescription>
                  Sales distribution by category
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={productCategoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {productCategoryData.map((_, index) => (
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
                <CardTitle>Customer Trends</CardTitle>
                <CardDescription>
                  New vs returning customers this year
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={customerData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} vertical={false} />
                    <XAxis 
                      dataKey="name" 
                      stroke="hsl(var(--muted-foreground))" 
                      fontSize={12} 
                      tickLine={false} 
                      axisLine={false} 
                    />
                    <YAxis 
                      stroke="hsl(var(--muted-foreground))" 
                      fontSize={12} 
                      tickLine={false} 
                      axisLine={false} 
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
                                  New: {payload[0].value}
                                </p>
                                <p className="flex items-center text-sm">
                                  <span className="h-2 w-2 rounded-full bg-chart-3 mr-1"></span>
                                  Returning: {payload[1].value}
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
                      name="New Customers" 
                      fill="hsl(var(--chart-2))" 
                      radius={[4, 4, 0, 0]} 
                    />
                    <Bar 
                      dataKey="returning" 
                      name="Returning Customers" 
                      fill="hsl(var(--chart-3))" 
                      radius={[4, 4, 0, 0]} 
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Low Stock Alerts</CardTitle>
                <CardDescription>Products that need reordering</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { id: 1, name: 'Ibuprofen 600mg', stock: 12, threshold: 20 },
                    { id: 2, name: 'Amoxicillin 500mg', stock: 8, threshold: 15 },
                    { id: 3, name: 'Lisinopril 10mg', stock: 5, threshold: 10 },
                    { id: 4, name: 'Simvastatin 20mg', stock: 3, threshold: 10 },
                  ].map((product) => (
                    <div key={product.id} className="flex items-center">
                      <div className="w-full flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <AlertCircle className="h-4 w-4 text-destructive" />
                          <span className="font-medium">{product.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{product.stock} left</Badge>
                          <ArrowUpRight className="h-4 w-4 text-destructive" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Analytics</CardTitle>
              <CardDescription>
                Detailed analytics information will appear here
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center border border-dashed rounded-lg">
                <p className="text-muted-foreground">Analytics module coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="inventory" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Inventory</CardTitle>
              <CardDescription>
                Inventory management information will appear here
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center border border-dashed rounded-lg">
                <p className="text-muted-foreground">Inventory module coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
