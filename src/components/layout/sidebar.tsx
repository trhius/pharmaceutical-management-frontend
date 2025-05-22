import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  Users,
  Package,
  ShoppingCart,
  Truck,
  BarChart3,
  Settings,
  Pill,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const location = useLocation();
  
  const sidebarWidth = isOpen ? 'w-64' : 'w-16';
  const logoTextClass = isOpen ? 'opacity-100' : 'opacity-0 w-0';
  const itemTextClass = isOpen ? 'opacity-100' : 'opacity-0 w-0';
  
  const navigation = [
    { name: 'Dashboard', href: '/', icon: BarChart3 },
    { name: 'Employees', href: '/employees', icon: Users },
    { name: 'Customers', href: '/customers', icon: Users },
    { name: 'Products', href: '/products', icon: Pill },
    { name: 'Update Prices', href: '/products/update-prices', icon: Package },
    { name: 'Providers', href: '/providers', icon: Truck },
    { name: 'Orders', href: '/orders', icon: ShoppingCart },
  ];

  return (
    <div
      className={cn(
        "bg-card border-r border-border h-screen transition-all duration-300 flex flex-col",
        sidebarWidth
      )}
    >
      <div className="h-16 flex items-center justify-between px-4 border-b border-border">
        <Link to="/" className="flex items-center">
          <Pill className="h-6 w-6 text-primary" />
          <span
            className={cn(
              "ml-2 font-bold text-xl transition-opacity duration-300",
              logoTextClass
            )}
          >
            PharmaPlus
          </span>
        </Link>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsOpen(!isOpen)}
          className="hidden md:flex"
        >
          {isOpen ? (
            <ChevronLeft className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </Button>
      </div>

      <ScrollArea className="flex-1 py-2">
        <nav className="space-y-1 px-2">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <Icon className={cn("flex-shrink-0 h-5 w-5")} />
                <span
                  className={cn(
                    "ml-3 transition-opacity duration-300",
                    itemTextClass
                  )}
                >
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>
      </ScrollArea>

      <div className="p-4 border-t border-border">
        <Link
          to="/settings"
          className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          <Settings className="flex-shrink-0 h-5 w-5" />
          <span
            className={cn(
              "ml-3 transition-opacity duration-300",
              itemTextClass
            )}
          >
            Settings
          </span>
        </Link>
      </div>
    </div>
  );
}
