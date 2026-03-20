'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Plus_Jakarta_Sans } from 'next/font/google';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../providers/auth-provider';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['500', '600', '700', '800'],
});

const addressTypes = [
  { id: 'home', emoji: '🏠', label: 'Home' },
  { id: 'office', emoji: '🏢', label: 'Office' },
  { id: 'other', emoji: '📍', label: 'Other' },
] as const;

type AddressType = (typeof addressTypes)[number]['id'];
type LocationMatch = {
  city: string;
  state: string;
};
type LookupStatus = 'idle' | 'loading' | 'success' | 'error';

const exactPincodeMap: Record<string, LocationMatch> = {
  '110001': { city: 'New Delhi', state: 'Delhi' },
  '122001': { city: 'Gurugram', state: 'Haryana' },
  '160017': { city: 'Chandigarh', state: 'Chandigarh' },
  '201301': { city: 'Noida', state: 'Uttar Pradesh' },
  '302001': { city: 'Jaipur', state: 'Rajasthan' },
  '400001': { city: 'Mumbai', state: 'Maharashtra' },
  '560001': { city: 'Bengaluru', state: 'Karnataka' },
  '600001': { city: 'Chennai', state: 'Tamil Nadu' },
};

function lookupPincode(pincode: string): LocationMatch | null {
  if (exactPincodeMap[pincode]) {
    return exactPincodeMap[pincode];
  }

  if (pincode.startsWith('11')) {
    return { city: 'New Delhi', state: 'Delhi' };
  }
  if (pincode.startsWith('12')) {
    return { city: 'Gurugram', state: 'Haryana' };
  }
  if (pincode.startsWith('16')) {
    return { city: 'Chandigarh', state: 'Chandigarh' };
  }
  if (pincode.startsWith('20')) {
    return { city: 'Lucknow', state: 'Uttar Pradesh' };
  }
  if (pincode.startsWith('30')) {
    return { city: 'Jaipur', state: 'Rajasthan' };
  }
  if (pincode.startsWith('40')) {
    return { city: 'Mumbai', state: 'Maharashtra' };
  }
  if (pincode.startsWith('56')) {
    return { city: 'Bengaluru', state: 'Karnataka' };
  }
  if (pincode.startsWith('60')) {
    return { city: 'Chennai', state: 'Tamil Nadu' };
  }

  return null;
}

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
      <path
        d="M12 12a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5ZM4.75 19.25a7.25 7.25 0 0 1 14.5 0"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
      <path
        d="M7.25 10.25h9.5a1.75 1.75 0 0 1 1.75 1.75v6a1.75 1.75 0 0 1-1.75 1.75h-9.5A1.75 1.75 0 0 1 5.5 18v-6a1.75 1.75 0 0 1 1.75-1.75Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M8.5 10.25V8a3.5 3.5 0 1 1 7 0v2.25" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
      <path
        d="M4 7.5A2.5 2.5 0 0 1 6.5 5h11A2.5 2.5 0 0 1 20 7.5v9A2.5 2.5 0 0 1 17.5 19h-11A2.5 2.5 0 0 1 4 16.5v-9Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="m5 8 7 5 7-5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CameraIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
      <path
        d="M4.5 8.75A2.25 2.25 0 0 1 6.75 6.5h1.08c.32 0 .63-.13.86-.37l.72-.76c.23-.24.54-.37.86-.37h3.46c.32 0 .63.13.86.37l.72.76c.23.24.54.37.86.37h1.08a2.25 2.25 0 0 1 2.25 2.25v8.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 17.25v-8.5Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M12 15.5a3.25 3.25 0 1 0 0-6.5 3.25 3.25 0 0 0 0 6.5Z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MapPinIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
      <path
        d="M12 20.25s6-5.35 6-10.08a6 6 0 1 0-12 0c0 4.73 6 10.08 6 10.08Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M12 12.5a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5Z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="h-5 w-5">
      <path d="m5.5 12.5 4.2 4.2L18.5 8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
      <path d="M5 12h14" strokeLinecap="round" strokeLinejoin="round" />
      <path d="m13 6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ProgressDots() {
  return (
    <div className="flex items-center gap-2" aria-label="Profile setup progress">
      <span className="h-2.5 w-2.5 rounded-full bg-[#CC2222]" />
      <span className="h-2.5 w-7 rounded-full bg-[#CC2222]" />
      <span className="h-2.5 w-2.5 rounded-full bg-[#D6DBE6]" />
    </div>
  );
}

export default function OnboardingPage() {
  const router = useRouter();
  const shouldReduceMotion = useReducedMotion() ?? false;
  const { loginAs } = useAuth();
  const redirectTimerRef = useRef<number | null>(null);

  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('+91 9876543210');
  const [email, setEmail] = useState('');
  const [addressType, setAddressType] = useState<AddressType>('home');
  const [fullAddress, setFullAddress] = useState('');
  const [landmark, setLandmark] = useState('');
  const [pincode, setPincode] = useState('');
  const [location, setLocation] = useState<LocationMatch | null>(null);
  const [lookupStatus, setLookupStatus] = useState<LookupStatus>('idle');
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [liveMessage, setLiveMessage] = useState('');

  useEffect(() => {
    const savedPhone = window.localStorage.getItem('chahalbros_user_phone');
    const savedEmail = window.localStorage.getItem('chahalbros_user_email');
    const savedProfile = window.localStorage.getItem('chahalbros_profile');

    if (savedPhone) {
      setPhoneNumber(savedPhone);
    }

    if (savedEmail) {
      setEmail(savedEmail);
    }

    if (savedProfile) {
      try {
        const profile = JSON.parse(savedProfile) as {
          fullName?: string;
          email?: string;
          addressType?: AddressType;
          fullAddress?: string;
          landmark?: string;
          pincode?: string;
        };

        if (profile.fullName) {
          setFullName(profile.fullName);
        }
        if (profile.email) {
          setEmail(profile.email);
        }
        if (profile.addressType) {
          setAddressType(profile.addressType);
        }
        if (profile.fullAddress) {
          setFullAddress(profile.fullAddress);
        }
        if (profile.landmark) {
          setLandmark(profile.landmark);
        }
        if (profile.pincode) {
          setPincode(profile.pincode);
        }
      } catch {
        window.localStorage.removeItem('chahalbros_profile');
      }
    }
  }, []);

  useEffect(() => {
    if (pincode.length === 0) {
      setLocation(null);
      setLookupStatus('idle');
      return;
    }

    if (pincode.length < 6) {
      setLocation(null);
      setLookupStatus('idle');
      return;
    }

    setLookupStatus('loading');

    const timer = window.setTimeout(() => {
      const match = lookupPincode(pincode);

      if (match) {
        setLocation(match);
        setLookupStatus('success');
        setLiveMessage(`Pincode resolved to ${match.city}, ${match.state}.`);
      } else {
        setLocation(null);
        setLookupStatus('error');
        setLiveMessage('Unable to detect city and state from pincode.');
      }
    }, shouldReduceMotion ? 120 : 420);

    return () => {
      window.clearTimeout(timer);
    };
  }, [pincode, shouldReduceMotion]);

  useEffect(() => {
    return () => {
      if (redirectTimerRef.current) {
        window.clearTimeout(redirectTimerRef.current);
      }
    };
  }, []);

  const isEmailValid = useMemo(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()), [email]);
  const canSubmit =
    fullName.trim().length >= 2 &&
    phoneNumber.trim().length > 0 &&
    isEmailValid &&
    fullAddress.trim().length >= 10 &&
    pincode.length === 6 &&
    lookupStatus === 'success' &&
    !isSaving &&
    !isSaved;

  function motionProps(index: number) {
    return {
      initial: shouldReduceMotion ? false : { opacity: 0, y: 18 },
      animate: { opacity: 1, y: 0 },
      transition: {
        duration: shouldReduceMotion ? 0.18 : 0.42,
        delay: shouldReduceMotion ? 0 : index * 0.05,
        ease: [0.22, 1, 0.36, 1],
      },
    };
  }

  async function handleSubmit() {
    if (!canSubmit) {
      return;
    }

    setIsSaving(true);
    setLiveMessage('Saving your profile.');

    await new Promise((resolve) => window.setTimeout(resolve, 1100));

    window.localStorage.setItem(
      'chahalbros_profile',
      JSON.stringify({
        fullName: fullName.trim(),
        phoneNumber,
        email: email.trim().toLowerCase(),
        addressType,
        fullAddress: fullAddress.trim(),
        landmark: landmark.trim(),
        pincode,
        city: location?.city ?? '',
        state: location?.state ?? '',
      }),
    );
    window.localStorage.setItem('chahalbros_user_phone', phoneNumber);
    window.localStorage.setItem('chahalbros_user_email', email.trim().toLowerCase());

    setIsSaving(false);
    setIsSaved(true);
    setLiveMessage('Profile saved. Welcome to Chahal Bros.');
    toast.success('Welcome to Chahal Bros!');

    redirectTimerRef.current = window.setTimeout(() => {
      loginAs('customer');
      router.replace('/home');
    }, shouldReduceMotion ? 240 : 1100);
  }

  return (
    <>
      <main
        className={`${plusJakartaSans.className} relative min-h-screen overflow-hidden bg-[#F8F9FC] text-[#1A1A2E]`}
        style={{ minHeight: '100dvh' }}
      >
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,153,221,0.12),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(204,34,34,0.12),transparent_30%)]"
        />

        <div className="relative mx-auto flex min-h-screen max-w-6xl items-center justify-center px-4 py-4 sm:px-6 sm:py-6">
          <motion.section
            initial={shouldReduceMotion ? false : { opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: shouldReduceMotion ? 0.2 : 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-lg overflow-hidden rounded-[32px] border border-gray-100 bg-white shadow-[0_28px_90px_rgba(26,26,46,0.08)]"
          >
            <div className="absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,#CC2222_0%,#E03030_42%,#2299DD_100%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,153,221,0.06),transparent_28%),radial-gradient(circle_at_bottom,rgba(204,34,34,0.08),transparent_24%)]" />

            <div className="relative max-h-[calc(100dvh-2rem)] overflow-y-auto px-5 py-6 sm:px-7 sm:py-7">
              <motion.div {...motionProps(0)} className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#6B7280]">Step 2 of 3</p>
                  <div className="mt-3">
                    <ProgressDots />
                  </div>
                </div>
                <div className="rounded-full bg-[#F4F6FA] px-3 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.26em] text-[#6B7280]">
                  Profile Setup
                </div>
              </motion.div>

              <motion.div {...motionProps(1)} className="mt-7">
                <h1 className="text-[1.7rem] font-extrabold tracking-[-0.03em] text-[#1A1A2E]">
                  Complete your profile
                </h1>
                <p className="mt-2 text-sm leading-6 text-[#6B7280]">
                  Help us deliver to the right place.
                </p>
              </motion.div>

              <motion.div {...motionProps(2)} className="mt-7 flex items-center justify-center">
                <button
                  type="button"
                  className="group relative inline-flex h-28 w-28 items-center justify-center rounded-full border border-dashed border-[#CC2222]/[0.25] bg-[linear-gradient(180deg,#FFFFFF_0%,#FFF6F5_100%)] shadow-[0_18px_36px_rgba(204,34,34,0.10)] transition hover:border-[#CC2222]/[0.45]"
                  aria-label="Upload profile photo"
                >
                  <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[radial-gradient(circle_at_top,rgba(34,153,221,0.16),transparent_42%),#F4F6FA] text-3xl font-black tracking-[-0.08em] text-[#1A1A2E]">
                    {fullName.trim().length > 0 ? fullName.trim().charAt(0).toUpperCase() : 'C'}
                  </div>
                  <span className="absolute bottom-1 right-1 inline-flex h-9 w-9 items-center justify-center rounded-full bg-[linear-gradient(135deg,#CC2222,#E03030)] text-white shadow-[0_12px_24px_rgba(204,34,34,0.24)]">
                    <CameraIcon />
                  </span>
                </button>
              </motion.div>

              <motion.p {...motionProps(3)} className="mt-3 text-center text-xs leading-5 text-[#6B7280]">
                Add a profile photo so your orders feel personal from day one.
              </motion.p>

              <div className="my-6 border-t border-gray-100" />

              <motion.div {...motionProps(4)} className="space-y-5">
                <div>
                  <label htmlFor="fullName" className="mb-2 block text-sm font-semibold text-[#1A1A2E]">
                    Full Name
                  </label>
                  <div className="flex h-12 items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 shadow-[0_8px_24px_rgba(26,26,46,0.04)] transition focus-within:border-[#2299DD] focus-within:ring-2 focus-within:ring-blue-400/30">
                    <span className="text-[#6B7280]">
                      <UserIcon />
                    </span>
                    <input
                      id="fullName"
                      type="text"
                      autoComplete="name"
                      value={fullName}
                      onChange={(event) => setFullName(event.target.value)}
                      placeholder="Enter your full name"
                      className="h-full w-full border-0 bg-transparent text-[15px] font-medium text-[#1A1A2E] outline-none placeholder:text-[#9CA3AF]"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="phone" className="mb-2 block text-sm font-semibold text-[#1A1A2E]">
                    Phone Number
                  </label>
                  <div className="flex h-12 items-center gap-3 rounded-xl border border-gray-200 bg-[#F4F6FA] px-4 text-[#6B7280] shadow-[0_8px_24px_rgba(26,26,46,0.03)]">
                    <LockIcon />
                    <input
                      id="phone"
                      type="text"
                      readOnly
                      value={phoneNumber}
                      className="h-full w-full cursor-not-allowed border-0 bg-transparent text-[15px] font-semibold text-[#6B7280] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="mb-2 block text-sm font-semibold text-[#1A1A2E]">
                    Email Address
                  </label>
                  <div className="flex h-12 items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 shadow-[0_8px_24px_rgba(26,26,46,0.04)] transition focus-within:border-[#2299DD] focus-within:ring-2 focus-within:ring-blue-400/30">
                    <span className="text-[#6B7280]">
                      <MailIcon />
                    </span>
                    <input
                      id="email"
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="Enter your email address"
                      className="h-full w-full border-0 bg-transparent text-[15px] font-medium text-[#1A1A2E] outline-none placeholder:text-[#9CA3AF]"
                    />
                  </div>
                </div>
              </motion.div>

              <div className="my-6 border-t border-gray-100" />

              <motion.section {...motionProps(5)} className="space-y-5">
                <div className="flex items-center gap-2">
                  <span className="text-[#2299DD]">
                    <MapPinIcon />
                  </span>
                  <h2 className="text-base font-extrabold tracking-[-0.02em] text-[#1A1A2E]">
                    Delivery Address
                  </h2>
                </div>

                <div>
                  <p className="mb-3 text-sm font-semibold text-[#1A1A2E]">Address Type</p>
                  <div className="grid grid-cols-3 gap-2">
                    {addressTypes.map((option) => {
                      const active = addressType === option.id;

                      return (
                        <button
                          key={option.id}
                          type="button"
                          onClick={() => setAddressType(option.id)}
                          className={`rounded-xl border px-3 py-3 text-sm font-semibold transition ${
                            active
                              ? 'border-[#CC2222] bg-[#FFF5F5] text-[#CC2222] shadow-[0_10px_24px_rgba(204,34,34,0.08)]'
                              : 'border-gray-200 bg-white text-[#6B7280] hover:border-[#CC2222]/30 hover:text-[#1A1A2E]'
                          }`}
                        >
                          <span className="mr-1.5" aria-hidden="true">
                            {option.emoji}
                          </span>
                          {option.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label htmlFor="address" className="mb-2 block text-sm font-semibold text-[#1A1A2E]">
                    Full Address
                  </label>
                  <textarea
                    id="address"
                    rows={3}
                    value={fullAddress}
                    onChange={(event) => setFullAddress(event.target.value)}
                    placeholder="House no, Building, Street, Area..."
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-[15px] font-medium text-[#1A1A2E] shadow-[0_8px_24px_rgba(26,26,46,0.04)] outline-none transition placeholder:text-[#9CA3AF] focus:border-[#2299DD] focus:ring-2 focus:ring-blue-400/30"
                  />
                </div>

                <div>
                  <label htmlFor="landmark" className="mb-2 block text-sm font-semibold text-[#1A1A2E]">
                    Landmark <span className="text-[#6B7280]">(Optional)</span>
                  </label>
                  <div className="flex h-12 items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 shadow-[0_8px_24px_rgba(26,26,46,0.04)] transition focus-within:border-[#2299DD] focus-within:ring-2 focus-within:ring-blue-400/30">
                    <span className="text-[#6B7280]">
                      <MapPinIcon />
                    </span>
                    <input
                      id="landmark"
                      type="text"
                      value={landmark}
                      onChange={(event) => setLandmark(event.target.value)}
                      placeholder="Near..."
                      className="h-full w-full border-0 bg-transparent text-[15px] font-medium text-[#1A1A2E] outline-none placeholder:text-[#9CA3AF]"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="pincode" className="mb-2 block text-sm font-semibold text-[#1A1A2E]">
                    Pincode
                  </label>
                  <div className="flex h-12 items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 shadow-[0_8px_24px_rgba(26,26,46,0.04)] transition focus-within:border-[#2299DD] focus-within:ring-2 focus-within:ring-blue-400/30">
                    <span className="text-[#6B7280]">
                      <MapPinIcon />
                    </span>
                    <input
                      id="pincode"
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      value={pincode}
                      onChange={(event) => setPincode(event.target.value.replace(/\D/g, '').slice(0, 6))}
                      placeholder="Enter 6-digit pincode"
                      className="h-full w-full border-0 bg-transparent text-[15px] font-medium text-[#1A1A2E] outline-none placeholder:text-[#9CA3AF]"
                    />
                    {lookupStatus === 'loading' ? (
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#2299DD]/20 border-t-[#2299DD]" aria-hidden="true" />
                    ) : null}
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {location ? (
                      <>
                        <span className="rounded-full border border-[#2299DD]/[0.15] bg-[#EFF6FF] px-3 py-1.5 text-xs font-semibold text-[#2299DD]">
                          City: {location.city}
                        </span>
                        <span className="rounded-full border border-[#CC2222]/[0.15] bg-[#FFF5F5] px-3 py-1.5 text-xs font-semibold text-[#CC2222]">
                          State: {location.state}
                        </span>
                      </>
                    ) : null}
                  </div>

                  {lookupStatus === 'error' && pincode.length > 0 ? (
                    <p className="mt-3 text-xs font-medium text-[#CC2222]">
                      Enter a valid 6-digit pincode to detect city and state.
                    </p>
                  ) : null}
                </div>

                <div className="relative h-[200px] overflow-hidden rounded-xl border border-gray-200 bg-[linear-gradient(180deg,#F9FBFF_0%,#F2F5FB_100%)] shadow-[0_8px_24px_rgba(26,26,46,0.04)]">
                  <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(34,153,221,0.06)_1px,transparent_1px),linear-gradient(0deg,rgba(34,153,221,0.06)_1px,transparent_1px)] bg-[size:32px_32px]" />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,153,221,0.12),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(204,34,34,0.12),transparent_30%)]" />
                  <div className="relative flex h-full flex-col items-center justify-center text-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-[#CC2222] shadow-[0_16px_30px_rgba(26,26,46,0.08)]">
                      <MapPinIcon />
                    </div>
                    <p className="mt-3 text-sm font-semibold text-[#1A1A2E]">Map preview</p>
                    <p className="mt-1 max-w-[240px] text-xs leading-5 text-[#6B7280]">
                      A live map can be connected here later for precise doorstep positioning.
                    </p>
                  </div>
                </div>
              </motion.section>

              <div className="my-6 border-t border-gray-100" />

              <motion.div {...motionProps(6)}>
                <button
                  type="button"
                  onClick={() => void handleSubmit()}
                  disabled={isSaving || (!canSubmit && !isSaved)}
                  className={`inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl px-5 text-sm font-bold text-white shadow-[0_18px_34px_rgba(204,34,34,0.24)] transition ${
                    isSaved
                      ? 'bg-emerald-500 shadow-[0_18px_34px_rgba(34,197,94,0.22)]'
                      : 'bg-[linear-gradient(135deg,#CC2222,#E03030)] hover:brightness-105 active:scale-[0.98]'
                  } disabled:cursor-not-allowed disabled:opacity-50`}
                >
                  {isSaving ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/25 border-t-white" />
                      Saving profile...
                    </>
                  ) : isSaved ? (
                    <>
                      <CheckIcon />
                      Welcome to Chahal Bros!
                    </>
                  ) : (
                    <>
                      Save & Start Ordering
                      <ArrowRightIcon />
                    </>
                  )}
                </button>
              </motion.div>
            </div>
          </motion.section>
        </div>

        <div className="sr-only" aria-live="polite" aria-atomic="true">
          {liveMessage}
        </div>
      </main>
    </>
  );
}
