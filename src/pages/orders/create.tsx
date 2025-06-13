import { useState, useEffect, useMemo } from 'react';
import useListPageState from '@/hooks/useListPageState';
import { useProducts } from '@/apis/hooks/product';
import { GetProductRequest, ProductResponse, ProductPriceResponse } from '@/apis/types/product';
import { CustomerResponse } from '@/apis/types/customer';
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
import { CustomerComboBox } from './customer-box';
import { PaymentSheet } from './payment-sheet'; // Import the new PaymentSheet
import { AddCustomerDialog } from '../customers/add-customer-dialog';
import { UserNavMenu } from './user-nav-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useRecommendSupplements } from '@/apis/hooks/sales';
import { RecommendedProduct } from '@/apis/types/sales';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useDebounce } from '@/hooks/useDebounce';

interface CartItem extends ProductResponse {
  quantity: number;
  selectedPrice: ProductPriceResponse;
}

interface TabItem {
  id: number;
  selectedProducts: CartItem[];
  name: string;
  active: boolean;
  note?: string;
}

export default function Component() {
  const { pageIndex, pageSize, searchTerm, setPageIndex, setSearchTerm } = useListPageState<GetProductRequest>({
    initialPage: 0,
    initialSize: 21,
    resetPageIndexOnFilterChange: false,
  });

  const [activeTab, setActiveTab] = useState(1);
  const [tabs, setTabs] = useState<TabItem[]>([
    { id: 1, name: 'Hóa đơn 1', active: true, selectedProducts: [], note: '' },
  ]);
  const [nextTabId, setNextTabId] = useState(2);
  const [displayedTotalPages, setDisplayedTotalPages] = useState(1);
  const [recommendedProducts, setRecommendedProducts] = useState<RecommendedProduct[]>([]);

  const [isAddCustomerDialogOpen, setIsAddCustomerDialogOpen] = useState(false);

  // State for selected customer - now stores the full object
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
  const recommendSupplementsMutation = useRecommendSupplements();

  useEffect(() => {
    if (productsData?.totalPages !== undefined && productsData.totalPages > 0) {
      setDisplayedTotalPages(productsData.totalPages);
    }
  }, [productsData?.totalPages]);

  const activeTabDataForEffect = tabs.find((tab) => tab.id === activeTab);

  const drugIds = useMemo(() => {
    return (
      activeTabDataForEffect?.selectedProducts
        .filter((p) => p.type === 'DRUG')
        .map((p) => parseInt(p.id.toString(), 10)) || []
    );
  }, [activeTabDataForEffect?.selectedProducts]);

  const debouncedDrugIds = useDebounce(drugIds, 1000); // 1-second debounce

  useEffect(() => {
    if (debouncedDrugIds.length > 0) {
      recommendSupplementsMutation.mutate(
        { productIds: debouncedDrugIds },
        {
          onSuccess: (data) => {
            setRecommendedProducts(data);
          },
          onError: (error) => {
            console.error('Failed to fetch recommendations:', error);
            setRecommendedProducts([]); // Clear recommendations on error
          },
        }
      );
    } else {
      setRecommendedProducts([]); // Clear if no drugs in cart
    }
  }, [debouncedDrugIds]);

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
          } else if (product.defaultPrice) {
            newSelectedProducts = [
              ...tab.selectedProducts,
              { ...product, quantity: 1, selectedPrice: product.defaultPrice },
            ];
          } else {
            // Handle case where product has no default price. Maybe alert user or don't add.
            // For now, we'll just not add it.
            return tab;
          }
          return { ...tab, selectedProducts: newSelectedProducts };
        }
        return tab;
      })
    );
  };

  const removeProductFromCart = (productId: number) => {
    setTabs((prevTabs: TabItem[]) =>
      prevTabs.map((tab) => {
        if (tab.id === activeTab) {
          const newSelectedProducts = tab.selectedProducts.filter((p: CartItem) => p.id !== productId);
          return { ...tab, selectedProducts: newSelectedProducts };
        }
        return tab;
      })
    );
  };

  const updateProductQuantity = (productId: number, quantity: number) => {
    setTabs((prevTabs: TabItem[]) =>
      prevTabs.map((tab) => {
        if (tab.id === activeTab) {
          const newSelectedProducts = tab.selectedProducts.map(
            (p: CartItem) => (p.id === productId ? { ...p, quantity: Math.max(0, quantity) } : p) // Prevent negative quantity
          );
          return { ...tab, selectedProducts: newSelectedProducts };
        }
        return tab;
      })
    );
  };

  const handlePriceUnitChange = (productId: number, measurementUnitId: number) => {
    setTabs((prevTabs) =>
      prevTabs.map((tab) => {
        if (tab.id === activeTab) {
          const newSelectedProducts = tab.selectedProducts.map((p) => {
            if (p.id === productId) {
              const newSelectedPrice = p.prices?.find((price) => price.measurementUnitId === measurementUnitId);
              if (newSelectedPrice) {
                return { ...p, selectedPrice: newSelectedPrice };
              }
            }
            return p;
          });
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
      note: '',
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
  const activeTabData = tabs.find((tab) => tab.id === activeTab);
  const currentSelectedProducts = activeTabData?.selectedProducts || [];

  const handleNoteChange = (note: string) => {
    setTabs((prevTabs) =>
      prevTabs.map((tab) => {
        if (tab.id === activeTab) {
          return { ...tab, note };
        }
        return tab;
      })
    );
  };

  const resetOrderState = () => {
    setTabs([{ id: 1, name: 'Hóa đơn 1', active: true, selectedProducts: [], note: '' }]);
    setActiveTab(1);
    setNextTabId(2);
    setSelectedCustomer(null);
    setRecommendedProducts([]);
    setSearchTerm('');
  };

  // Calculate total amount for the active tab
  const totalAmount = currentSelectedProducts.reduce((sum, product) => {
    return sum + (product.selectedPrice?.purchasePrice || 0) * product.quantity;
  }, 0);

  const handleCustomerSelect = (customer: CustomerResponse | null) => {
    setSelectedCustomer(customer); // Store the full customer object
  };

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
            <UserNavMenu />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-5 h-[calc(100vh-60px)] overflow-hidden">
        {/* Main Content - Selected Products for Checkout */}
        <div className="col-span-3 h-[calc(100vh-60px)] bg-white dark:bg-gray-800 flex flex-col">
          {/* Scrollable content area for cart items */}
          <div className="flex-grow p-4 overflow-y-auto min-h-0">
            {currentSelectedProducts.length === 0 ? (
              <div className="flex flex-grow items-center justify-center h-full text-gray-500 dark:text-gray-400">
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
                      <img src={product.imageUrl} alt={product.productName} className="w-8 h-8 object-cover rounded" />
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-gray-100">
                          {product.shortenName || product.productName}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {product.selectedPrice?.price?.toLocaleString()} VND
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Input
                        type="number"
                        className="w-16 h-8 text-center"
                        value={product.quantity}
                        onChange={(e) => updateProductQuantity(product.id, parseInt(e.target.value, 10) || 0)}
                      />
                      <Select
                        value={product.selectedPrice?.measurementUnitId?.toString()}
                        onValueChange={(value) => handlePriceUnitChange(product.id, parseInt(value, 10))}
                        disabled={(product.prices?.length ?? 0) <= 1}
                      >
                        <SelectTrigger className="w-[120px] h-8">
                          <SelectValue placeholder="Đơn vị" />
                        </SelectTrigger>
                        <SelectContent>
                          {product.prices?.map((price) => (
                            <SelectItem key={price.measurementUnitId} value={price.measurementUnitId!.toString()}>
                              {price.measurementUnitName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Badge variant="secondary" className="w-24 justify-end">
                        {((product.selectedPrice?.price || 0) * product.quantity).toLocaleString()}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-0 h-6 w-6 hover:bg-red-500 hover:text-white"
                        onClick={() => removeProductFromCart(product.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recommended Products (fixed at the bottom) */}
          {recommendedProducts.length > 0 && (
            <div className="shrink-0 flex-grow max-h-fit relative overflow-y-auto p-4 border-t dark:border-gray-700">
              <h3 className="sticky-0 text-sm font-semibold mb-2 text-gray-600 dark:text-gray-400">Sản phẩm gợi ý</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                {recommendedProducts.map((product) => (
                  <RecommendedProductCard key={product.id} product={product} onAdd={addProductToCart} />
                ))}
              </div>
            </div>
          )}

          {/* Bottom Section */}
          <div className="shrink-0 h-18 bg-white dark:bg-gray-800 w-full flex items-center justify-between border-t dark:border-gray-700 px-4">
            <Input
              placeholder="Ghi chú đơn hàng"
              className="w-1/2 text-sm text-gray-600 dark:text-gray-400 border-0 focus-visible:ring-0"
              value={activeTabData?.note || ''}
              onChange={(e) => handleNoteChange(e.target.value)}
            />
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Tổng tiền hàng ({currentSelectedProducts.length}):
              </div>
              <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {totalAmount.toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="p-2 h-[calc(100vh-60px)] overflow-y-auto col-span-2 bg-white dark:bg-gray-800 border-l dark:border-gray-700 flex flex-col">
          {/* Customer Search & Actions */}
          <div className="flex items-center justify-between relative mb-4 gap-2">
            {/* Customer ComboBox and Add/Clear Buttons */}
            <div className="flex flex-grow items-center border rounded-md">
              <CustomerComboBox onCustomerSelect={handleCustomerSelect} selectedCustomer={selectedCustomer} />
              {selectedCustomer && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-gray-500 dark:text-gray-400 h-6 w-6 p-0 mr-1"
                  onClick={() => handleCustomerSelect(null)} // Clear selection
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
              <Button
                size="sm"
                variant="ghost"
                className="text-gray-500 dark:text-gray-400 h-8 w-8 p-0"
                onClick={() => setIsAddCustomerDialogOpen(true)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-2">
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
          <div className="py-4 flex-grow overflow-y-auto">
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
                              {product.shortenName || product.productName}
                            </h3>

                            <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                              {product.defaultPrice?.price?.toLocaleString()} VND
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">SL: {product.totalQuantity || 0}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
              )}
            </div>
          </div>

          {/* Pagination and Checkout */}
          <div className="p-4 shrink-0 border-t dark:border-gray-700">
            <div className="flex justify-between items-center w-full">
              {/* Pagination */}
              <div className="flex items-center justify-center space-x-2">
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

              {/* Checkout Sheet using PaymentSheet component */}
              <PaymentSheet
                selectedCustomer={selectedCustomer}
                currentSelectedProducts={currentSelectedProducts}
                totalAmount={totalAmount}
                onOrderSuccess={resetOrderState}
              />
            </div>

            {/* Add Customer Dialog */}
            <AddCustomerDialog
              open={isAddCustomerDialogOpen}
              onOpenChange={setIsAddCustomerDialogOpen}
              onCustomerAdded={(newCustomer) => {
                setSelectedCustomer(newCustomer); // Set the new customer as selected
                // TODO: Refresh customer list if necessary in the CustomerComboBox
                setIsAddCustomerDialogOpen(false); // Close the dialog
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function RecommendedProductCard({
  product,
  onAdd,
}: {
  product: RecommendedProduct;
  onAdd: (product: ProductResponse) => void;
}) {
  const handleAddClick = () => {
    onAdd(product);
  };

  return (
    <Card className="hover:shadow-md transition-shadow bg-white dark:bg-gray-700 dark:border-gray-600 dark:hover:shadow-xl">
      <CardContent className="p-3">
        <div className="flex items-start space-x-3">
          <img
            src={product.imageUrl || `https://ui-avatars.com/api/?name=${product.productName}&background=random`}
            alt={product.productName}
            className="w-10 h-10 object-cover rounded"
          />
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 line-clamp-2 mb-1">
              {product.productName}
            </h3>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-2 italic">
                    "{product.reason}"
                  </p>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{product.reason}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Button size="sm" className="h-7 text-xs w-full" onClick={handleAddClick}>
              Thêm vào giỏ
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
