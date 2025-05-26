import { useState } from 'react';
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

const products = [
  {
    id: 1,
    name: 'Dầu Gấc Vinaga - VN - H1Lọ100Viên',
    price: '850,000',
    image: '🟠',
    color: 'bg-orange-500',
  },
  {
    id: 2,
    name: 'GinkgoSoftM6 - HaiDuong -...',
    price: '15,000',
    image: '🟢',
    color: 'bg-green-600',
  },
  {
    id: 3,
    name: 'Zentomum - TanThinh - H2Vi...',
    price: '36,000',
    image: '💊',
    color: 'bg-green-100',
  },
  {
    id: 4,
    name: 'Acnacare - ThaiLan - H3Vi x10Viên',
    price: '30,000',
    image: '🧴',
    color: 'bg-blue-500',
  },
  {
    id: 5,
    name: 'NattoGinkgo - HoGuom -...',
    price: '30,000',
    image: '🌿',
    color: 'bg-green-400',
  },
  {
    id: 6,
    name: 'Đệ Lưới Gối Hanomed - TanA -...',
    price: '4,000',
    image: '📦',
    color: 'bg-orange-300',
  },
  {
    id: 7,
    name: 'Cao Đan Salongin14x10cm...',
    price: '130,000',
    image: '🏥',
    color: 'bg-blue-400',
  },
  {
    id: 8,
    name: 'Ecosip7.5x10cm - Tatra - H20tuk...',
    price: '260,000',
    image: '📋',
    color: 'bg-orange-400',
  },
  {
    id: 9,
    name: 'Ecosipocort4x10cm - Tatra - H2tuk...',
    price: '80,000',
    image: '📄',
    color: 'bg-orange-300',
  },
  {
    id: 10,
    name: 'Nhiệt Kế Aurora - Đức - H12Chiếc',
    price: '216,000',
    image: '🌡️',
    color: 'bg-red-400',
  },
  {
    id: 11,
    name: 'Dịch vụ tiêm truyền tại nhà',
    price: '150,000',
    image: '💉',
    color: 'bg-orange-600',
  },
  {
    id: 12,
    name: 'Dịch vụ thay băng, cắt chỉ',
    price: '100,000',
    image: '🩹',
    color: 'bg-blue-300',
  },
  {
    id: 13,
    name: 'Combo thuốc bổ',
    price: '880,000',
    image: '💊',
    color: 'bg-orange-500',
  },
  {
    id: 14,
    name: 'Combo dụng cụ kiểm tra sốt',
    price: '340,000',
    image: '🔧',
    color: 'bg-blue-600',
  },
  {
    id: 15,
    name: 'Medrol16mg - Methylpred - Pháp...',
    price: '120,000',
    image: '💊',
    color: 'bg-gray-400',
  },
  {
    id: 16,
    name: 'Mobic7.5mg - Meloxicam - Đức -...',
    price: '190,000',
    image: '💊',
    color: 'bg-yellow-500',
  },
  {
    id: 17,
    name: 'Detromethorpham15mg - Đông Thạp -...',
    price: '200,000',
    image: '🏥',
    color: 'bg-green-500',
  },
  {
    id: 18,
    name: 'Dexamethason0.5mg - Becamex - L...',
    price: '250,000',
    image: '💊',
    color: 'bg-blue-400',
  },
  {
    id: 19,
    name: 'Dimicox - Meloxicam7.5mg -...',
    price: '16,000',
    image: '💊',
    color: 'bg-yellow-400',
  },
  {
    id: 20,
    name: 'Theralene - Alimemazine5mg -...',
    price: '40,000',
    image: '💊',
    color: 'bg-pink-400',
  },
  {
    id: 21,
    name: 'Cetirizin10mg - Đông Nai -...',
    price: '30,000',
    image: '💊',
    color: 'bg-blue-500',
  },
];

const tabs = [{ id: 1, name: 'Hóa đơn 1', active: true }];

export default function Component() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [activeTab, setActiveTab] = useState(1);
  const totalPages = 2;
  const [tabs, setTabs] = useState([{ id: 1, name: 'Hóa đơn 1', active: true }]);
  const [nextTabId, setNextTabId] = useState(2);

  const addProductToCart = (product) => {
    setSelectedProducts((prev) => {
      const existing = prev.find((p) => p.id === product.id);
      if (existing) {
        return prev.map((p) => (p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p));
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const totalAmount = selectedProducts.reduce((sum, product) => {
    return sum + Number.parseInt(product.price.replace(/,/g, '')) * product.quantity;
  }, 0);

  const addNewTab = () => {
    const newTab = {
      id: nextTabId,
      name: `Hóa đơn ${nextTabId}`,
      active: false,
    };
    setTabs((prev) => prev.map((tab) => ({ ...tab, active: false })).concat({ ...newTab, active: true }));
    setActiveTab(nextTabId);
    setNextTabId((prev) => prev + 1);
    setSelectedProducts([]); // Clear products for new tab
  };

  const closeTab = (tabId) => {
    if (tabs.length === 1) return; // Don't close if it's the last tab

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

  const switchTab = (tabId) => {
    setTabs((prev) => prev.map((tab) => ({ ...tab, active: tab.id === tabId })));
    setActiveTab(tabId);
    // Here you could load the products for this specific tab if you store them per tab
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-blue-600 text-white px-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Search Bar */}
            <div className="flex items-center space-x-2 bg-white rounded px-3 my-2">
              <Search className="h-4 w-4 text-gray-500" />
              <Input
                placeholder="Tìm hàng hóa (F3)"
                className="border-0 bg-transparent text-black placeholder:text-gray-500 focus-visible:ring-0 w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Button size="sm" variant="ghost" className="text-gray-500 p-1">
                <Filter className="h-4 w-4" />
              </Button>
            </div>

            {/* Tabs */}
            <div className="flex items-center space-x-1 self-end">
              {tabs.map((tab) => (
                <div
                  key={tab.id}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-t cursor-pointer self-end font-medium ${
                    tab.active ? 'bg-white text-blue-600' : 'bg-blue-500 text-white hover:bg-blue-400'
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
              <Button size="sm" variant="ghost" className="text-white p-1 hover:bg-blue-500" onClick={addNewTab}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" className="text-white">
              <Lock className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-white">
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-white">
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-white">
              <Printer className="h-4 w-4" />
            </Button>
            <span className="text-white">0911881741</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-5 h-[calc(100vh-60px)] overflow-hidden">
        {/* Main Content - Selected Products for Checkout */}
        <div className="col-span-3 bg-gray-50 overflow-y-auto">
          <div className="bg-white flex flex-col rounded-lg h-full">
            {/* Scrollable content area */}
            <div className="flex-grow overflow-y-auto p-4">
              {selectedProducts.length === 0 ? (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <div className="text-center">
                    <p className="text-lg mb-2">Chưa có sản phẩm nào được chọn</p>
                    <p className="text-sm">Chọn sản phẩm từ danh sách bên phải để thêm vào hóa đơn</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  {selectedProducts.map((product) => (
                    <div key={product.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-8 h-8 rounded ${product.color} flex items-center justify-center text-white text-xs`}
                        >
                          {product.image}
                        </div>
                        <div>
                          <h3 className="font-medium">{product.name}</h3>
                          <p className="text-sm text-gray-600">{product.price} VND</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm">Số lượng: {product.quantity}</span>
                        <Badge variant="secondary">
                          {(Number.parseInt(product.price.replace(/,/g, '')) * product.quantity).toLocaleString()} VND
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Bottom Section */}
            <div className="shrink-0 h-18 bg-white w-full flex items-center justify-between border-t px-4">
              <div className="text-sm text-gray-600">Ghi chú đơn hàng</div>
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-600">
                  Tổng tiền hàng: <span className="font-semibold">{selectedProducts.length}</span>
                </div>
                <div className="text-lg font-semibold">{totalAmount.toLocaleString()}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="col-span-2 bg-white border-l flex flex-col">
          {/* Customer Search */}
          <div className="p-4 border-b">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input placeholder="Tìm khách hàng (F4)" className="pl-10" />
              <Button size="sm" variant="ghost" className="absolute right-2 top-1/2 transform -translate-y-1/2">
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
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              {products
                .filter((product) => product.name.toLowerCase().includes(searchTerm.toLowerCase()))
                .map((product) => (
                  <Card
                    key={product.id}
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => addProductToCart(product)}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-start space-x-2">
                        <div
                          className={`w-8 h-8 rounded ${product.color} flex items-center justify-center text-white text-xs flex-shrink-0`}
                        >
                          {product.image}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-xs font-medium text-gray-900 line-clamp-2 mb-1">{product.name}</h3>
                          <p className="text-sm font-semibold text-blue-600">{product.price}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>

          {/* Pagination and Checkout */}
          <div className="p-4 border-t">
            {/* Pagination */}
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm">
                {currentPage}/{totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Checkout Button */}
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3">THANH TOÁN</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
