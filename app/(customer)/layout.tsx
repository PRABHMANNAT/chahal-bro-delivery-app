import { RoleGate } from '../../components/auth/role-gate';
import { CustomerBottomNav } from '../../components/navigation/customer-bottom-nav';

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleGate expectedRole="customer">
      <div className="min-h-screen pb-24">
        {children}
      </div>
      <CustomerBottomNav />
    </RoleGate>
  );
}
