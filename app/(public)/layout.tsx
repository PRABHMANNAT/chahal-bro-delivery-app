import { PublicRouteGate } from '../../components/auth/public-route-gate';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PublicRouteGate>{children}</PublicRouteGate>;
}
