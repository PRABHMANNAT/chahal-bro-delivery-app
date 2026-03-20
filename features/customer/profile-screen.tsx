'use client';

import { useEffect, useMemo, useState } from 'react';
import { Plus_Jakarta_Sans } from 'next/font/google';
import { useRouter } from 'next/navigation';
import {
  Bell,
  Building2,
  ChevronRight,
  Globe,
  House,
  Info,
  LogOut,
  MapPin,
  Moon,
  Package,
  PencilLine,
  Phone,
  Plus,
  Star,
  Trash2,
  Wallet,
} from 'lucide-react';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['500', '600', '700', '800'],
});

type AddressType = 'home' | 'office' | 'other';

type SavedProfile = {
  fullName?: string;
  phoneNumber?: string;
  email?: string;
  addressType?: AddressType;
  fullAddress?: string;
  landmark?: string;
  pincode?: string;
  city?: string;
  state?: string;
};

type SavedAddress = {
  id: string;
  type: AddressType;
  label: string;
  address: string;
  isDefault: boolean;
};

type SettingsState = {
  darkMode: boolean;
  notifications: boolean;
  language: string;
};

type AddressDraft = {
  id: string | null;
  type: AddressType;
  label: string;
  address: string;
  isDefault: boolean;
};

const fallbackName = 'Adhiraj Singh';
const fallbackPhone = '+91 98765-43210';
const versionLabel = 'Version 1.0.0';

const addressTypeMeta: Record<AddressType, { label: string; icon: typeof House }> = {
  home: { label: 'Home', icon: House },
  office: { label: 'Office', icon: Building2 },
  other: { label: 'Other', icon: MapPin },
};

const defaultSettings: SettingsState = {
  darkMode: false,
  notifications: true,
  language: 'English',
};

function formatCurrency(amount: number) {
  return `\u20B9${new Intl.NumberFormat('en-IN').format(amount)}`;
}

const languageCycle = ['English', 'Hindi', 'Punjabi'];

function buildProfileAddress(profile: SavedProfile) {
  const address = [
    profile.fullAddress?.trim(),
    profile.landmark?.trim(),
    profile.city?.trim(),
    profile.state?.trim(),
    profile.pincode?.trim(),
  ]
    .filter(Boolean)
    .join(', ');

  return address || 'House 123, Sarabha Nagar, Near Gurudwara, Ludhiana, Punjab 141001';
}

function createSeedAddresses(profile: SavedProfile): SavedAddress[] {
  return [
    {
      id: 'addr-home',
      type: profile.addressType ?? 'home',
      label: addressTypeMeta[profile.addressType ?? 'home'].label,
      address: buildProfileAddress(profile),
      isDefault: true,
    },
    {
      id: 'addr-office',
      type: 'office',
      label: 'Office',
      address: 'Cabin 12, Feroze Gandhi Market, Ludhiana, Punjab 141001',
      isDefault: false,
    },
  ];
}

function createEmptyDraft(): AddressDraft {
  return {
    id: null,
    type: 'other',
    label: '',
    address: '',
    isDefault: false,
  };
}

function MenuButton({
  icon: Icon,
  label,
  value,
  badge,
  onClick,
  danger = false,
}: {
  icon: typeof Package;
  label: string;
  value?: string;
  badge?: string;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-[22px] bg-white px-4 py-4 text-left shadow-[0_12px_28px_rgba(26,26,46,0.04)]"
    >
      <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${danger ? 'bg-[#FFF1F1] text-[#CC2222]' : 'bg-[#F5F7FA] text-[#1A1A2E]'}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className={`text-[15px] font-bold ${danger ? 'text-[#CC2222]' : 'text-[#1A1A2E]'}`}>{label}</p>
      </div>
      {badge ? (
        <span className="rounded-full bg-[#FFF1F1] px-3 py-1 text-xs font-bold text-[#CC2222]">{badge}</span>
      ) : null}
      {value ? <span className="text-sm font-semibold text-[#6B7280]">{value}</span> : null}
      {!danger ? <ChevronRight className="h-4 w-4 text-[#9CA3AF]" /> : null}
    </button>
  );
}

export default function CustomerProfilePage() {
  const router = useRouter();
  const [fullName, setFullName] = useState(fallbackName);
  const [phoneNumber, setPhoneNumber] = useState(fallbackPhone);
  const [addresses, setAddresses] = useState<SavedAddress[]>([]);
  const [settings, setSettings] = useState<SettingsState>(defaultSettings);
  const [editorOpen, setEditorOpen] = useState(false);
  const [draft, setDraft] = useState<AddressDraft>(createEmptyDraft());
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [hasLoaded, setHasLoaded] = useState(false);

  const userInitial = useMemo(() => fullName.trim().charAt(0).toUpperCase() || 'A', [fullName]);

  useEffect(() => {
    let parsedProfile: SavedProfile = {};
    const savedProfile = window.localStorage.getItem('chahalbros_profile');
    const savedPhone = window.localStorage.getItem('chahalbros_user_phone');
    const savedSettings = window.localStorage.getItem('chahalbros_settings');
    const savedAddresses = window.localStorage.getItem('chahalbros_saved_addresses');

    if (savedProfile) {
      try {
        parsedProfile = JSON.parse(savedProfile) as SavedProfile;
      } catch {
        window.localStorage.removeItem('chahalbros_profile');
      }
    }

    if (parsedProfile.fullName?.trim()) {
      setFullName(parsedProfile.fullName.trim());
    }

    if (parsedProfile.phoneNumber?.trim()) {
      setPhoneNumber(parsedProfile.phoneNumber.trim());
    } else if (savedPhone?.trim()) {
      setPhoneNumber(savedPhone.trim());
    }

    if (savedAddresses) {
      try {
        const parsedAddresses = JSON.parse(savedAddresses) as SavedAddress[];

        if (Array.isArray(parsedAddresses) && parsedAddresses.length > 0) {
          setAddresses(parsedAddresses);
        } else {
          setAddresses(createSeedAddresses(parsedProfile));
        }
      } catch {
        setAddresses(createSeedAddresses(parsedProfile));
        window.localStorage.removeItem('chahalbros_saved_addresses');
      }
    } else {
      setAddresses(createSeedAddresses(parsedProfile));
    }

    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings) as Partial<SettingsState>;

        setSettings({
          darkMode: parsedSettings.darkMode ?? defaultSettings.darkMode,
          notifications: parsedSettings.notifications ?? defaultSettings.notifications,
          language: parsedSettings.language ?? defaultSettings.language,
        });
      } catch {
        window.localStorage.removeItem('chahalbros_settings');
      }
    }

    setHasLoaded(true);
  }, []);

  useEffect(() => {
    if (!hasLoaded) {
      return;
    }

    window.localStorage.setItem('chahalbros_saved_addresses', JSON.stringify(addresses));
  }, [addresses, hasLoaded]);

  useEffect(() => {
    if (!hasLoaded) {
      return;
    }

    window.localStorage.setItem('chahalbros_settings', JSON.stringify(settings));
  }, [hasLoaded, settings]);

  useEffect(() => {
    if (!toastMessage) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setToastMessage(null);
    }, 2200);

    return () => window.clearTimeout(timeoutId);
  }, [toastMessage]);

  function openAddAddress() {
    setDraft(createEmptyDraft());
    setEditorOpen(true);
  }

  function openEditAddress(address: SavedAddress) {
    setDraft({
      id: address.id,
      type: address.type,
      label: address.label,
      address: address.address,
      isDefault: address.isDefault,
    });
    setEditorOpen(true);
  }

  function closeEditor() {
    setEditorOpen(false);
    setDraft(createEmptyDraft());
  }

  function saveAddress() {
    const trimmedAddress = draft.address.trim();

    if (!trimmedAddress) {
      setToastMessage('Enter an address before saving.');
      return;
    }

    const nextLabel = draft.label.trim() || addressTypeMeta[draft.type].label;
    const nextId = draft.id ?? `addr-${Date.now()}`;

    setAddresses((current) => {
      const nextAddress: SavedAddress = {
        id: nextId,
        type: draft.type,
        label: nextLabel,
        address: trimmedAddress,
        isDefault: draft.isDefault || current.length === 0,
      };

      let nextList = draft.id
        ? current.map((address) => (address.id === draft.id ? nextAddress : address))
        : [nextAddress, ...current];

      if (nextAddress.isDefault) {
        nextList = nextList.map((address) => ({ ...address, isDefault: address.id === nextId }));
      } else if (!nextList.some((address) => address.isDefault) && nextList[0]) {
        nextList = nextList.map((address, index) => ({ ...address, isDefault: index === 0 }));
      }

      return nextList;
    });

    closeEditor();
    setToastMessage(draft.id ? 'Address updated.' : 'Address added.');
  }

  function deleteAddress(addressId: string) {
    setAddresses((current) => {
      const filtered = current.filter((address) => address.id !== addressId);

      if (filtered.length > 0 && !filtered.some((address) => address.isDefault)) {
        return filtered.map((address, index) => ({ ...address, isDefault: index === 0 }));
      }

      return filtered;
    });

    setToastMessage('Address removed.');
  }

  function cycleLanguage() {
    setSettings((current) => {
      const currentIndex = languageCycle.indexOf(current.language);
      const nextLanguage = languageCycle[(currentIndex + 1 + languageCycle.length) % languageCycle.length];

      setToastMessage(`Language set to ${nextLanguage}.`);

      return { ...current, language: nextLanguage };
    });
  }

  return (
    <div className={`${plusJakartaSans.className} min-h-screen bg-[#F5F7FA] text-[#1A1A2E]`}>
      <main className="mx-auto w-full max-w-[480px] px-4 pb-24 pt-6">
        <section className="rounded-[28px] bg-white px-5 py-6 shadow-[0_16px_36px_rgba(26,26,46,0.05)]">
          <div className="flex items-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#E9EDF4] text-[30px] font-extrabold text-[#6B7280]">
              {userInitial}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[20px] font-extrabold tracking-[-0.03em] text-[#1A1A2E]">{fullName}</p>
              <p className="mt-1 text-sm text-[#6B7280]">{phoneNumber}</p>
              <button
                type="button"
                onClick={() => router.push('/onboarding')}
                className="mt-3 text-sm font-bold text-[#2299DD]"
              >
                Edit Profile
              </button>
            </div>
          </div>
        </section>

        <section className="mt-6">
          <div className="mb-3 flex items-center justify-between gap-3 px-1">
            <h2 className="text-[18px] font-extrabold tracking-[-0.02em] text-[#1A1A2E]">Saved Addresses</h2>
            <button type="button" onClick={openAddAddress} className="text-sm font-bold text-[#2299DD]">
              + Add New
            </button>
          </div>

          <div className="space-y-3">
            {addresses.map((address) => {
              const Icon = addressTypeMeta[address.type].icon;

              return (
                <article key={address.id} className="rounded-[24px] bg-white px-4 py-4 shadow-[0_12px_28px_rgba(26,26,46,0.04)]">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#F5F7FA] text-[#1A1A2E]">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-[15px] font-extrabold text-[#1A1A2E]">{address.label}</p>
                        {address.isDefault ? (
                          <span className="rounded-full bg-[#FFF1F1] px-2.5 py-1 text-[11px] font-bold text-[#CC2222]">
                            Default
                          </span>
                        ) : null}
                      </div>
                      <p className="mt-2 text-sm leading-6 text-[#6B7280]">{address.address}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => openEditAddress(address)}
                        className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#EEF6FF] text-[#2299DD]"
                      >
                        <PencilLine className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteAddress(address.id)}
                        className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FFF1F1] text-[#CC2222]"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="mt-6 space-y-3">
          <MenuButton icon={Package} label="My Orders" onClick={() => router.push('/orders')} />
          <MenuButton icon={Wallet} label="Wallet & Coupons" badge={formatCurrency(120)} onClick={() => setToastMessage('Wallet features coming soon.')} />
          <MenuButton icon={Globe} label="Language" value={settings.language} onClick={cycleLanguage} />

          <div className="rounded-[22px] bg-white px-4 py-4 shadow-[0_12px_28px_rgba(26,26,46,0.04)]">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#F5F7FA] text-[#1A1A2E]">
                <Moon className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[15px] font-bold text-[#1A1A2E]">Dark Mode</p>
              </div>
              <button
                type="button"
                onClick={() => setSettings((current) => ({ ...current, darkMode: !current.darkMode }))}
                className={`relative inline-flex h-8 w-14 items-center rounded-full p-1 transition ${settings.darkMode ? 'bg-[#1A1A2E]' : 'bg-[#D1D5DB]'}`}
              >
                <span
                  className={`h-6 w-6 rounded-full bg-white shadow-sm transition ${settings.darkMode ? 'translate-x-6' : 'translate-x-0'}`}
                />
              </button>
            </div>
          </div>

          <div className="rounded-[22px] bg-white px-4 py-4 shadow-[0_12px_28px_rgba(26,26,46,0.04)]">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#F5F7FA] text-[#1A1A2E]">
                <Bell className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[15px] font-bold text-[#1A1A2E]">Notifications</p>
              </div>
              <button
                type="button"
                onClick={() => setSettings((current) => ({ ...current, notifications: !current.notifications }))}
                className={`relative inline-flex h-8 w-14 items-center rounded-full p-1 transition ${settings.notifications ? 'bg-[#2299DD]' : 'bg-[#D1D5DB]'}`}
              >
                <span
                  className={`h-6 w-6 rounded-full bg-white shadow-sm transition ${settings.notifications ? 'translate-x-6' : 'translate-x-0'}`}
                />
              </button>
            </div>
          </div>

          <MenuButton icon={Phone} label="Help & Support" onClick={() => setToastMessage('Support: +91 1800-120-2727')} />
          <MenuButton icon={Info} label="About Chahal Bros" onClick={() => setToastMessage('Chahal Bros delivers groceries across Ludhiana.')} />
          <MenuButton icon={Star} label="Rate Us" onClick={() => setToastMessage('Thanks for rating Chahal Bros!')} />
          <MenuButton icon={LogOut} label="Logout" onClick={() => router.push('/login')} danger />
        </section>

        <footer className="px-2 pb-4 pt-8 text-center">
          <p className="text-sm font-semibold text-[#6B7280]">{versionLabel}</p>
          <p className="mt-2 text-sm text-[#6B7280]">
            Made with <span className="text-[#CC2222]">{'\u2764\uFE0F'}</span> in Ludhiana
          </p>
        </footer>
      </main>

      {editorOpen ? (
        <div className="fixed inset-0 z-40 flex items-end justify-center bg-[#0F172A]/45 p-4">
          <div className="w-full max-w-[448px] rounded-[28px] bg-white p-5 shadow-[0_26px_60px_rgba(15,23,42,0.22)]">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-[20px] font-extrabold tracking-[-0.03em] text-[#1A1A2E]">
                {draft.id ? 'Edit Address' : 'Add Address'}
              </h3>
              <button type="button" onClick={closeEditor} className="text-sm font-bold text-[#6B7280]">
                Close
              </button>
            </div>

            <div className="mt-5 space-y-4">
              <label className="block">
                <span className="mb-2 block text-sm font-bold text-[#1A1A2E]">Type</span>
                <select
                  value={draft.type}
                  onChange={(event) => setDraft((current) => ({ ...current, type: event.target.value as AddressType }))}
                  className="h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 text-sm font-medium text-[#1A1A2E] outline-none"
                >
                  <option value="home">Home</option>
                  <option value="office">Office</option>
                  <option value="other">Other</option>
                </select>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-bold text-[#1A1A2E]">Label</span>
                <input
                  value={draft.label}
                  onChange={(event) => setDraft((current) => ({ ...current, label: event.target.value }))}
                  placeholder="Home"
                  className="h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 text-sm font-medium text-[#1A1A2E] outline-none"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-bold text-[#1A1A2E]">Address</span>
                <textarea
                  value={draft.address}
                  onChange={(event) => setDraft((current) => ({ ...current, address: event.target.value }))}
                  rows={4}
                  placeholder="Enter the full delivery address"
                  className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-[#1A1A2E] outline-none"
                />
              </label>

              <button
                type="button"
                onClick={() => setDraft((current) => ({ ...current, isDefault: !current.isDefault }))}
                className="flex w-full items-center justify-between rounded-2xl bg-[#F5F7FA] px-4 py-3 text-left"
              >
                <span className="text-sm font-bold text-[#1A1A2E]">Set as default address</span>
                <span
                  className={`relative inline-flex h-8 w-14 items-center rounded-full p-1 transition ${draft.isDefault ? 'bg-[#CC2222]' : 'bg-[#D1D5DB]'}`}
                >
                  <span
                    className={`h-6 w-6 rounded-full bg-white shadow-sm transition ${draft.isDefault ? 'translate-x-6' : 'translate-x-0'}`}
                  />
                </span>
              </button>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeEditor}
                  className="flex h-12 items-center justify-center rounded-2xl border border-gray-200 text-sm font-bold text-[#475569]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={saveAddress}
                  className="flex h-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#CC2222,#E03030)] text-sm font-extrabold text-white shadow-[0_16px_30px_rgba(204,34,34,0.22)]"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {toastMessage ? (
        <div className="fixed bottom-6 left-1/2 z-50 w-[calc(100%-2rem)] max-w-[448px] -translate-x-1/2 rounded-[18px] bg-[#1A1A2E] px-4 py-3 text-sm font-semibold text-white shadow-[0_18px_34px_rgba(26,26,46,0.22)]">
          {toastMessage}
        </div>
      ) : null}
    </div>
  );
}
