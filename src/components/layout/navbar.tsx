import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { ChevronDown, LogOut, PencilLine } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { UserProfileDialog } from '@/components/user-profile-dialog';
import { useAuthStore } from '@/store/auth-store';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAccountInfo } from '@/apis/hooks/account';

export function Navbar() {
  const location = useLocation();
  const { logout } = useAuthStore();
  const { data: accountInfo } = useAccountInfo();
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);
  const navigate = useNavigate();

  const navigation = [
    { name: 'Bảng điều khiển', href: '/' },
    {
      name: 'Sản phẩm',
      href: '/products', // Parent link, can be the default sub-item page
      subItems: [
        { name: 'Danh sách sản phẩm', href: '/products' },
        { name: 'Giá sản phẩm', href: '/products/update-prices' },
        // Add more sub-items here
      ],
    },
    { name: 'Nhân viên', href: '/employees' },
    { name: 'Khách hàng', href: '/customers' },
    { name: 'Nhà cung cấp', href: '/providers' },
    { name: 'Đơn hàng', href: '/orders' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="border-b">
      <div className="mx-auto px-4 flex h-16 items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="font-semibold text-lg">
            PharmaPlus
          </Link>

          <NavigationMenu>
            <NavigationMenuList>
              {navigation.map((item) => (
                <NavigationMenuItem className="group/item relative" key={item.name}>
                  <div>
                    <Link
                      to={item.href}
                      className={cn(
                        navigationMenuTriggerStyle(),
                        location.pathname === item.href && 'bg-accent text-accent-foreground'
                      )}
                    >
                      {item.name}
                      {item.subItems && (
                        <ChevronDown size={16} className="ml-2" />
                      )}
                    </Link>
                    {item.subItems && (
                      <ul className="invisible group-hover/item:visible absolute top-full left-0 flex-col gap-3 p-2 w-fit min-w-[200px] bg-popover border border-border rounded-md shadow-md z-50">
                        {item.subItems.map((subItem) => (
                          <li key={subItem.name}>
                            <Link
                              to={subItem.href}
                              className="block p-2 hover:bg-accent hover:text-accent-foreground rounded-md text-sm"
                            >
                              {subItem.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder-avatar.jpg" alt={accountInfo?.role || 'Người dùng'} />
                  <AvatarFallback>{accountInfo?.fullName?.charAt(0) || 'N'}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{accountInfo?.fullName}</p>
                  <p className="text-xs leading-none text-muted-foreground">{accountInfo?.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <Dialog open={isProfileDialogOpen} onOpenChange={setIsProfileDialogOpen}>
                <DialogTrigger asChild>
                  <DropdownMenuItem onSelect={(e) => {
                    e.preventDefault();
                    setIsProfileDialogOpen(true);
                  }}>
                    <PencilLine className="mr-2 h-4 w-4" />
                    Thông tin cá nhân
                  </DropdownMenuItem>
                </DialogTrigger>
                <UserProfileDialog onClose={() => setIsProfileDialogOpen(false)} />
              </Dialog>
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Đăng xuất
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
