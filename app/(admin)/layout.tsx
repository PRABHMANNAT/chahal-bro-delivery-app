import { RoleGate } from '../../components/auth/role-gate';
import { AdminSidebar } from '../../components/navigation/admin-sidebar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleGate expectedRole="admin">
      <div className="min-h-screen bg-[#F5F7FA] lg:pl-[260px]">
        <AdminSidebar />
        {children}
      </div>
    </RoleGate>
  );
}
