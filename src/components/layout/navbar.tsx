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

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { UserProfileDialog } from '@/components/user-profile-dialog';
import { ChangePasswordForm } from '@/components/auth/change-password-form';
import { useAuthStore } from '@/store/auth-store';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAccountInfo } from '@/apis/hooks/account';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export function Navbar() {
  const location = useLocation();
  const { logout } = useAuthStore();
  const { data: accountInfo } = useAccountInfo();
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);
  const [showPasswordChangeDialog, setShowPasswordChangeDialog] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (accountInfo?.firstTimeLogin) {
      setShowPasswordChangeDialog(true);
    }
  }, [accountInfo]);

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
                      {item.subItems && <ChevronDown size={16} className="ml-2" />}
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
              <DropdownMenuItem
                onSelect={(e) => {
                  e.preventDefault();
                  setIsProfileDialogOpen(true);
                }}
              >
                <PencilLine className="mr-2 h-4 w-4" />
                Thông tin cá nhân
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Đăng xuất
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      {isProfileDialogOpen && <UserProfileDialog onClose={() => setIsProfileDialogOpen(false)} />}

      {showPasswordChangeDialog && (
        <AlertDialog open={showPasswordChangeDialog} onOpenChange={(open) => {
          // Prevent closing if it's first time login and password hasn't been changed yet
          if (accountInfo?.firstTimeLogin && open === false) { // Only prevent closing if trying to close (open is false)
            return;
          }
          setShowPasswordChangeDialog(open);
        }}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Cảnh báo bảo mật</AlertDialogTitle>
              <AlertDialogDescription>
                Đây là lần đầu tiên bạn đăng nhập. Vui lòng thay đổi mật khẩu của bạn để đảm bảo an toàn cho tài khoản.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <ChangePasswordForm
              onSuccess={() => {
                setShowPasswordChangeDialog(false);
                // Optionally, refetch account info to update firstTimeLogin status
                // If accountInfo.refetch is available and updates firstTimeLogin, it's good practice
                // However, often firstTimeLogin status is updated upon successful password change on the backend
                // and new token or user info is provided on next login/refresh.
              }}
              isFirstTimeLogin={true}
            />
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}
