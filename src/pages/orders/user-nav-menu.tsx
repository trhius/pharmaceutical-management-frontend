import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { UserProfileDialog } from '@/components/user-profile-dialog';
import { useAuthStore } from '@/store/auth-store';
import { useState } from 'react';
import { useAccountInfo } from '@/apis/hooks/account';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LogOut, PencilLine } from 'lucide-react';

export function UserNavMenu() {
  const { logout } = useAuthStore();
  const { data: accountInfo } = useAccountInfo();
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleLogout = () => {
    queryClient.invalidateQueries({ queryKey: ['accountInfo'] });
    logout();
    navigate('/login');
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder-avatar.jpg" alt={accountInfo?.role || 'Người dùng'} />
              <AvatarFallback className="text-black">{accountInfo?.fullName?.charAt(0) || 'N'}</AvatarFallback>
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
      {isProfileDialogOpen && <UserProfileDialog onClose={() => setIsProfileDialogOpen(false)} />}
    </>
  );
} 