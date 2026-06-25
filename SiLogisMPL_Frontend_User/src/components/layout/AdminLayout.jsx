import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen bg-[#f3f4f6]">
      {/* Sidebar sudah punya lebar internal [260px], jadi panggil langsung */}
      <Sidebar />
      
      {/* Main content akan mengisi sisa layar */}
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;