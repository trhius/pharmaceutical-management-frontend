import { useState, useEffect } from 'react';
import useListPageState from '@/hooks/useListPageState';
import { useProducts } from '@/apis/hooks/product';
import { GetProductRequest, ProductResponse } from '@/apis/types/product';
import { CustomerResponse } from '@/apis/types/customer'; // Import CustomerResponse
import {
  Search,
  Filter,
  List,
  Grid,
  Plus,
  X,
  ChevronLeft,
  ChevronRight,
  Lock,
  RotateCcw,
  RefreshCw,
  Printer,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CustomerComboBox } from './customer-box'; // Import the new CustomerComboBox

interface CartItem extends ProductResponse {
  quantity: number;
}

interface TabItem {
  id: number;
  selectedProducts: CartItem[];
  name: string;
  active: boolean;
}

export default function Component() {
  const { pageIndex, pageSize, searchTerm, setPageIndex, setSearchTerm } = useListPageState<GetProductRequest>({
    initialPage: 0,
    initialSize: 21,
    resetPageIndexOnFilterChange: false,
  });

  const [activeTab, setActiveTab] = useState(1);
  const [tabs, setTabs] = useState<TabItem[]>([{ id: 1, name: 'Hóa đơn 1', active: true, selectedProducts: [] }]);
  const [nextTabId, setNextTabId] = useState(2);
  const [displayedTotalPages, setDisplayedTotalPages] = useState(1);

  // State for selected customer
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerResponse | null>(null);

  const {
    data: productsData,
    isLoading,
    isError,
  } = useProducts({
    page: pageIndex,
    size: pageSize,
  });
  const products = productsData?.content || [];

  useEffect(() => {
    if (productsData?.totalPages !== undefined && productsData.totalPages > 0) {
      setDisplayedTotalPages(productsData.totalPages);
    }
  }, [productsData?.totalPages]);

  const addProductToCart = (product: ProductResponse) => {
    setTabs((prevTabs: TabItem[]) =>
      prevTabs.map((tab) => {
        if (tab.id === activeTab) {
          const existing = tab.selectedProducts.find((p: CartItem) => p.id === product.id);
          let newSelectedProducts;
          if (existing) {
            newSelectedProducts = tab.selectedProducts.map((p: CartItem) =>
              p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p
            );
          } else {
            newSelectedProducts = [...tab.selectedProducts, { ...product, quantity: 1 }];
          }
          return { ...tab, selectedProducts: newSelectedProducts };
        }
        return tab;
      })
    );
  };

  const addNewTab = () => {
    const newTab = {
      id: nextTabId,
      name: `Hóa đơn ${nextTabId}`,
      active: false,
      selectedProducts: [],
    };
    setTabs((prev: TabItem[]) =>
      prev.map((tab: TabItem) => ({ ...tab, active: false })).concat({ ...newTab, active: true })
    );
    setActiveTab(nextTabId);
    setNextTabId((prev) => prev + 1);
  };

  const closeTab = (tabId: number) => {
    if (tabs.length === 1) return; // Don\'t close if it\'s the last tab

    setTabs((prev) => {
      const filtered = prev.filter((tab) => tab.id !== tabId);
      if (activeTab === tabId && filtered.length > 0) {
        // If closing active tab, make the first remaining tab active
        filtered[0].active = true;
        setActiveTab(filtered[0].id);
      }
      return filtered;
    });
  };

  const switchTab = (tabId: number) => {
    setTabs((prev) => prev.map((tab) => ({ ...tab, active: tab.id === tabId })));
    setActiveTab(tabId);
    // Here you could load the products for this specific tab if you store them per tab
  };

  // Find the active tab and its products for rendering
  // Note: This could be memoized for performance using useMemo
  // The `|| []` ensures we always have an array to work with
  const activeTabData = tabs.find((tab) => tab.id === activeTab);
  const currentSelectedProducts = activeTabData?.selectedProducts || [];

  // Calculate total amount for the active tab
  const totalAmount = currentSelectedProducts.reduce((sum, product) => {
    return sum + (product.defaultPrice?.purchasePrice || 0) * product.quantity;
  }, 0);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Header */}
      <div className="h-[60px] text-white dark:bg-gray-800">
        <div className="flex items-center justify-between bg-blue-600 dark:bg-blue-800 px-3">
          <div className="flex items-center space-x-4">
            {/* Search Bar */}
            <div className="flex items-center space-x-2 bg-white dark:bg-gray-700 rounded px-3 my-2">
              <Search className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              <Input
                placeholder="Tìm hàng hóa (F3)"
                className="border-0 bg-transparent text-black dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus-visible:ring-0 w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Button size="sm" variant="ghost" className="text-gray-500 dark:text-gray-400 p-1">
                <Filter className="h-4 w-4" />
              </Button>
            </div>

            {/* Tabs */}
            <div className="flex items-center space-x-1 self-end">
              {tabs.map((tab) => (
                <div
                  key={tab.id}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-t cursor-pointer self-end font-medium ${
                    tab.active
                      ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400'
                      : 'bg-blue-500 dark:bg-gray-600/80 text-gray-400 hover:bg-blue-400 dark:hover:bg-gray-600'
                  }`}
                  onClick={() => switchTab(tab.id)}
                >
                  <span className="text-sm">{tab.name}</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="p-0 h-4 w-4 hover:bg-red-500 hover:text-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      closeTab(tab.id);
                    }}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
              <Button
                size="sm"
                variant="ghost"
                className="text-white p-1 hover:bg-blue-500 dark:hover:bg-gray-700"
                onClick={addNewTab}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" className="text-white dark:text-gray-100">
              <Lock className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-white dark:text-gray-100">
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-white dark:text-gray-100">
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-white dark:text-gray-100">
              <Printer className="h-4 w-4" />
            </Button>
            <span className="text-white dark:text-gray-100">0911881741</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-5 h-[calc(100vh-60px)] overflow-hidden">
        {/* Main Content - Selected Products for Checkout */}
        <div className="col-span-3 bg-gray-50 dark:bg-gray-900 overflow-y-auto">
          <div className="bg-white dark:bg-gray-800 flex flex-col rounded-lg h-full">
            {/* Scrollable content area */}
            <div className="flex-grow overflow-y-auto p-4">
              {currentSelectedProducts.length === 0 ? (
                <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                  <div className="text-center">
                    <p className="text-lg mb-2">Chưa có sản phẩm nào được chọn</p>
                    <p className="text-sm">Chọn sản phẩm từ danh sách bên phải để thêm vào hóa đơn</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  {currentSelectedProducts.map((product: CartItem) => (
                    <div
                      key={product.id}
                      className="flex items-center justify-between p-3 border rounded-lg dark:border-gray-700"
                    >
                      <div className="flex items-center space-x-3">
                        <img
                          src={product.imageUrl}
                          alt={product.productName}
                          className="w-8 h-8 object-cover rounded"
                        />
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-gray-100">{product.productName}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {product.defaultPrice?.purchasePrice?.toLocaleString()} VND
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-900 dark:text-gray-100">Số lượng: {product.quantity}</span>
                        <Badge variant="secondary">
                          {((product.defaultPrice?.purchasePrice || 0) * product.quantity).toLocaleString()} VND
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Bottom Section */}
            <div className="shrink-0 h-18 bg-white dark:bg-gray-800 w-full flex items-center justify-between border-t dark:border-gray-700 px-4">
              <div className="text-sm text-gray-600 dark:text-gray-400">Ghi chú đơn hàng</div>
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Tổng tiền hàng: <span className="font-semibold">{currentSelectedProducts.length}</span>
                </div>
                <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {totalAmount.toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="overflow-y-auto col-span-2 bg-white dark:bg-gray-800 border-l dark:border-gray-700 flex flex-col">
          {/* Customer Search */}
          <div className="p-4 border-b dark:border-gray-700">
            <div className="flex w-full">
              <CustomerComboBox
                onCustomerSelect={setSelectedCustomer}
                selectedCustomer={selectedCustomer}
              />
              <Button
                size="sm"
                variant="ghost"
                className="flex-shrink-0 text-gray-500 dark:text-gray-400"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-2 mt-4">
              <Button variant="outline" size="sm">
                <List className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm">
                <Grid className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Product Catalog */}
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 place-content-center">
              {isLoading ? (
                <div className="text-center col-span-3 text-gray-500 dark:text-gray-400">Đang tải sản phẩm...</div>
              ) : isError ? (
                <div className="text-center col-span-3 text-red-500 dark:text-red-400">Lỗi khi tải sản phẩm.</div>
              ) : (
                products
                  .filter((product) => product.productName?.toLowerCase().includes(searchTerm.toLowerCase()))
                  .map((product) => (
                    <Card
                      key={product.id}
                      className="cursor-pointer hover:shadow-md transition-shadow bg-white dark:bg-gray-700 dark:border-gray-600 dark:hover:shadow-xl"
                      onClick={() => addProductToCart(product)}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-start space-x-2">
                          <img
                            src={product.imageUrl}
                            alt={product.productName}
                            className="w-8 h-8 object-cover rounded"
                          />
                          <div className="flex-1 min-w-0">
                            <h3 className="text-xs font-medium text-gray-900 dark:text-gray-100 line-clamp-2 mb-1">
                              {product.productName}
                            </h3>
                            <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                              {product.defaultPrice?.purchasePrice?.toLocaleString()} VND
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
              )}
            </div>
          </div>

          {/* Pagination and Checkout */}
          <div className="p-4 border-t dark:border-gray-700">
            {/* Pagination */}
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPageIndex(Math.max(0, pageIndex - 1))}
                disabled={pageIndex + 1 === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm text-gray-900 dark:text-gray-100">
                {pageIndex + 1}/{displayedTotalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPageIndex(Math.min(displayedTotalPages || 1, pageIndex + 1))}
                disabled={pageIndex + 1 === displayedTotalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Checkout Button */}
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 dark:bg-blue-700 dark:hover:bg-blue-800">
              THANH TOÁN
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
