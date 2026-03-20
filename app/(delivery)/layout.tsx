import { RoleGate } from '../../components/auth/role-gate';
import { DeliveryBottomNav } from '../../components/navigation/delivery-bottom-nav';

export default function DeliveryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleGate expectedRole="delivery">
      <div className="min-h-screen pb-24">
        {children}
      </div>
      <DeliveryBottomNav />
    </RoleGate>
  );
}
