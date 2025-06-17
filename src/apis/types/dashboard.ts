export interface DashboardSummary {
  totalRevenue: { value: number; change: number; };
  newCustomers: { value: number; change: number; };
  productsSold: { value: number; change: number; };
  activeOrders: { value: number; change: number; };
}

export interface RevenueDataPoint { 
  name: string; 
  total: number; 
}

export interface ProductCategoryPoint { 
  name: string; 
  value: number; 
}

export interface CustomerTrendPoint { 
  name: string; 
  new: number; 
  returning: number; 
}

export interface LowStockProduct { 
  id: number | string; 
  name: string; 
  stock: number; 
  threshold: number; 
}

export interface DashboardData {
  summary: DashboardSummary;
  revenueOverview: RevenueDataPoint[];
  productCategoryDistribution: ProductCategoryPoint[];
  customerTrends: CustomerTrendPoint[];
  lowStockAlerts: LowStockProduct[];
}