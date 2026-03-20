'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { Address, User, UserRole } from '../types';

type AuthContextValue = {
  isHydrated: boolean;
  role: UserRole | null;
  currentUser: User | null;
  dashboardPath: string;
  loginAs: (role: UserRole, overrides?: Partial<User>) => void;
  setRole: (role: UserRole | null) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const roleStorageKey = 'chahalbros_user_role';
const userStorageKey = 'chahalbros_current_user';

function isUserRole(value: string | null | undefined): value is UserRole {
  return value === 'customer' || value === 'admin' || value === 'delivery';
}

export function getDashboardPath(role: UserRole | null) {
  if (role === 'admin') {
    return '/admin';
  }

  if (role === 'delivery') {
    return '/delivery';
  }

  return '/home';
}

function readJson<T>(key: string) {
  const value = window.localStorage.getItem(key);

  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value) as T;
  } catch {
    window.localStorage.removeItem(key);
    return null;
  }
}

function buildCustomerUser(): User {
  const savedProfile = readJson<{
    fullName?: string;
    phoneNumber?: string;
    email?: string;
    addressType?: Address['type'];
    fullAddress?: string;
    landmark?: string;
    city?: string;
    state?: string;
    pincode?: string;
  }>('chahalbros_profile');

  const fallbackPhone = window.localStorage.getItem('chahalbros_user_phone') ?? '+91 98765-43210';
  const fallbackEmail = window.localStorage.getItem('chahalbros_user_email') ?? 'adhiraj@chahalbros.in';

  const address: Address | undefined = savedProfile?.fullAddress
    ? {
        id: 'customer-default-address',
        label: savedProfile.addressType === 'office' ? 'Office' : 'Home',
        type: savedProfile.addressType ?? 'home',
        fullAddress: [
          savedProfile.fullAddress,
          savedProfile.landmark,
          savedProfile.city,
          savedProfile.state,
          savedProfile.pincode,
        ]
          .filter(Boolean)
          .join(', '),
        landmark: savedProfile.landmark,
        city: savedProfile.city,
        state: savedProfile.state,
        pincode: savedProfile.pincode,
        isDefault: true,
      }
    : undefined;

  return {
    id: 'customer-001',
    role: 'customer',
    fullName: savedProfile?.fullName?.trim() || 'Adhiraj Singh',
    phoneNumber: savedProfile?.phoneNumber?.trim() || fallbackPhone,
    email: savedProfile?.email?.trim() || fallbackEmail,
    addresses: address ? [address] : [],
  };
}

function buildDefaultUser(role: UserRole): User {
  if (role === 'admin') {
    return {
      id: 'admin-001',
      role,
      fullName: 'Aman Chahal',
      email: 'admin@chahalbros.in',
      phoneNumber: '+91 98155-88001',
    };
  }

  if (role === 'delivery') {
    return {
      id: 'delivery-001',
      role,
      fullName: 'Ravi Kumar',
      email: 'delivery@chahalbros.in',
      phoneNumber: '+91 98765-12121',
    };
  }

  return buildCustomerUser();
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<UserRole | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const storedRole = window.localStorage.getItem(roleStorageKey);
    const parsedRole: UserRole | null = isUserRole(storedRole) ? storedRole : null;

    const storedUser = readJson<User>(userStorageKey);
    const fallbackRole = isUserRole(storedUser?.role) ? storedUser.role : null;
    const resolvedRole = parsedRole ?? fallbackRole;

    if (resolvedRole) {
      const nextUser = storedUser && storedUser.role === resolvedRole ? storedUser : buildDefaultUser(resolvedRole);

      setRoleState(resolvedRole);
      setCurrentUser(nextUser);
      window.localStorage.setItem(roleStorageKey, resolvedRole);
      window.localStorage.setItem(userStorageKey, JSON.stringify(nextUser));
    }

    setIsHydrated(true);
  }, []);

  const loginAs = useCallback((nextRole: UserRole, overrides?: Partial<User>) => {
    const baseUser = buildDefaultUser(nextRole);
    const nextUser: User = {
      ...baseUser,
      ...overrides,
      role: nextRole,
    };

    window.localStorage.setItem(roleStorageKey, nextRole);
    window.localStorage.setItem(userStorageKey, JSON.stringify(nextUser));
    setRoleState(nextRole);
    setCurrentUser(nextUser);
  }, []);

  const logout = useCallback(() => {
    window.localStorage.removeItem(roleStorageKey);
    window.localStorage.removeItem(userStorageKey);
    setRoleState(null);
    setCurrentUser(null);
  }, []);

  const setRole = useCallback(
    (nextRole: UserRole | null) => {
      if (!nextRole) {
        logout();
        return;
      }

      loginAs(nextRole);
    },
    [loginAs, logout],
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      isHydrated,
      role,
      currentUser,
      dashboardPath: getDashboardPath(role),
      loginAs,
      setRole,
      logout,
    }),
    [currentUser, isHydrated, loginAs, logout, role, setRole],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}
