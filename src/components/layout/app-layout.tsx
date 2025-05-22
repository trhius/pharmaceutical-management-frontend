import { Outlet } from 'react-router-dom';
import { Navbar } from './navbar';

export function AppLayout() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto py-4 px-4">
        <Outlet />
      </main>
    </div>
  );
}
