import { Outlet } from 'react-router-dom';
import { Navbar } from './navbar';

export function AppLayout() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full bg-background">
        <Navbar />
      </header>
      <main className="mx-auto py-4 px-4">
        <Outlet />
      </main>
    </div>
  );
}
