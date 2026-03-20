'use client';

import type { ClipboardEvent, KeyboardEvent } from 'react';
import { useEffect, useRef, useState } from 'react';
import {
  AnimatePresence,
  motion,
  useAnimationControls,
  useReducedMotion,
} from 'framer-motion';
import { Plus_Jakarta_Sans } from 'next/font/google';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { getDashboardPath, useAuth } from '../../providers/auth-provider';
import type { UserRole } from '../../types';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['500', '600', '700', '800'],
});

const OTP_LENGTH = 6;
const RESEND_SECONDS = 45;
const DEMO_OTP = '123456';

type AuthMethod = 'phone' | 'email';
type AuthStep = 'entry' | 'otp';
type DemoAccount = {
  role: UserRole;
  label: string;
  identifier: string;
  password: string;
  note: string;
};

const demoAccounts: DemoAccount[] = [
  {
    role: 'customer',
    label: 'Customer Demo',
    identifier: '+91 9876543210',
    password: '123456',
    note: 'Use the normal OTP flow or quick access below.',
  },
  {
    role: 'admin',
    label: 'Admin Demo',
    identifier: 'admin@chahalbros.in',
    password: 'Admin@123',
    note: 'Opens the admin dashboard and all admin sub-pages.',
  },
  {
    role: 'delivery',
    label: 'Delivery Demo',
    identifier: 'delivery@chahalbros.in',
    password: 'Delivery@123',
    note: 'Opens the delivery partner workflow and tabs.',
  },
];

const groceries = [
  { icon: '🌾', top: '14%', left: '12%', delay: '0s', duration: '7s', size: '2.4rem' },
  { icon: '🍚', top: '28%', left: '74%', delay: '0.8s', duration: '8.4s', size: '2.2rem' },
  { icon: '🫘', top: '55%', left: '18%', delay: '1.4s', duration: '7.7s', size: '2.1rem' },
  { icon: '🧈', top: '69%', left: '72%', delay: '0.3s', duration: '8.1s', size: '2rem' },
  { icon: '🌶️', top: '80%', left: '46%', delay: '1.1s', duration: '7.4s', size: '2.25rem' },
];

async function sendOTP(value: string, method: AuthMethod) {
  await new Promise((resolve) => window.setTimeout(resolve, 900));
  return { ok: true, value, method };
}

async function verifyOTP(value: string, code: string, method: AuthMethod) {
  await new Promise((resolve) => window.setTimeout(resolve, 1050));

  if (code !== DEMO_OTP) {
    throw new Error(`Invalid OTP for ${method}:${value}`);
  }

  return { ok: true, value, method };
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function maskPhone(phone: string) {
  const digits = phone.replace(/\D/g, '').slice(-10);
  if (digits.length !== 10) {
    return '+91 98XXXXX90';
  }
  return `+91 ${digits.slice(0, 2)}XXXXX${digits.slice(-2)}`;
}

function maskEmail(email: string) {
  const [name = '', domain = 'mail.com'] = email.split('@');
  return `${(name.slice(0, 2) || 'us')}***@${domain}`;
}

function formatTimer(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  return `${minutes}:${remainder.toString().padStart(2, '0')}`;
}

function BrandLockup({ light = false }: { light?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#1A1A2E]/10 bg-white shadow-[0_10px_30px_rgba(26,26,46,0.08)]">
        <span className="text-xl font-extrabold tracking-[-0.08em]">
          <span className="text-[#CC2222]">C</span>
          <span className="text-[#2299DD]">B</span>
        </span>
      </div>
      <div>
        <div
          className={`text-[0.68rem] font-semibold uppercase tracking-[0.32em] ${
            light ? 'text-white/75' : 'text-[#6B7280]'
          }`}
        >
          Quick Commerce
        </div>
        <div className={`text-sm font-extrabold tracking-[0.26em] ${light ? 'text-white' : 'text-[#1A1A2E]'}`}>
          <span className="text-[#CC2222]">CHAHAL</span>{' '}
          <span className="text-[#2299DD]">BROS</span>
        </div>
      </div>
    </div>
  );
}

function ArrowLeftIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
      <path d="M15 18 9 12l6-6" strokeLinecap="round" strokeLinejoin="round" />
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

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="h-8 w-8">
      <path d="m5.5 12.5 4.2 4.2L18.5 8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const shouldReduceMotion = useReducedMotion() ?? false;
  const { loginAs } = useAuth();
  const shakeControls = useAnimationControls();
  const otpRefs = useRef<Array<HTMLInputElement | null>>([]);
  const autoSubmitRef = useRef('');
  const redirectTimerRef = useRef<number | null>(null);

  const [step, setStep] = useState<AuthStep>('entry');
  const [direction, setDirection] = useState(1);
  const [method, setMethod] = useState<AuthMethod>('phone');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [submittedValue, setSubmittedValue] = useState('');
  const [otp, setOtp] = useState<string[]>(Array.from({ length: OTP_LENGTH }, () => ''));
  const [resendTimer, setResendTimer] = useState(RESEND_SECONDS);
  const [isSending, setIsSending] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isDemoLoggingIn, setIsDemoLoggingIn] = useState<UserRole | null>(null);
  const [otpError, setOtpError] = useState(false);
  const [verificationSuccess, setVerificationSuccess] = useState(false);
  const [liveMessage, setLiveMessage] = useState('');

  const digits = phone.replace(/\D/g, '').slice(0, 10);
  const canSend = method === 'phone' ? digits.length === 10 : isValidEmail(email);
  const code = otp.join('');
  const canVerify = code.length === OTP_LENGTH && !otp.includes('');
  const maskedDestination =
    method === 'phone' ? maskPhone(submittedValue || phone) : maskEmail(submittedValue || email);

  useEffect(() => {
    if (step !== 'otp') {
      return;
    }

    const timer = window.setTimeout(() => {
      otpRefs.current[0]?.focus();
    }, shouldReduceMotion ? 40 : 180);

    return () => window.clearTimeout(timer);
  }, [shouldReduceMotion, step]);

  useEffect(() => {
    if (step !== 'otp' || resendTimer <= 0) {
      return;
    }

    const interval = window.setInterval(() => {
      setResendTimer((current) => {
        if (current <= 1) {
          window.clearInterval(interval);
          return 0;
        }
        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [resendTimer, step]);

  useEffect(() => {
    if (step !== 'otp' || !canVerify || isVerifying || verificationSuccess) {
      return;
    }

    if (autoSubmitRef.current === code) {
      return;
    }

    autoSubmitRef.current = code;
    void handleVerify(code);
  }, [canVerify, code, isVerifying, step, verificationSuccess]);

  useEffect(() => {
    if (!verificationSuccess) {
      return;
    }

    redirectTimerRef.current = window.setTimeout(() => {
      router.push('/onboarding');
    }, shouldReduceMotion ? 400 : 1200);

    return () => {
      if (redirectTimerRef.current) {
        window.clearTimeout(redirectTimerRef.current);
      }
    };
  }, [router, shouldReduceMotion, verificationSuccess]);

  useEffect(() => {
    return () => {
      if (redirectTimerRef.current) {
        window.clearTimeout(redirectTimerRef.current);
      }
    };
  }, []);

  async function handleSendOtp() {
    if (!canSend || isSending) {
      return;
    }

    const value = method === 'phone' ? digits : email.trim().toLowerCase();
    setIsSending(true);
    setLiveMessage(`Sending OTP to your ${method}.`);

    try {
      await sendOTP(value, method);
      setSubmittedValue(value);
      setDirection(1);
      setStep('otp');
      setOtp(Array.from({ length: OTP_LENGTH }, () => ''));
      setResendTimer(RESEND_SECONDS);
      setOtpError(false);
      setVerificationSuccess(false);
      autoSubmitRef.current = '';
      toast.success(`OTP sent to ${method === 'phone' ? maskPhone(value) : maskEmail(value)}.`);
      setLiveMessage('OTP sent. Enter the code to continue.');
    } catch {
      toast.error('Unable to send OTP right now.');
      setLiveMessage('Unable to send OTP right now.');
    } finally {
      setIsSending(false);
    }
  }

  function resetOtp() {
    setOtp(Array.from({ length: OTP_LENGTH }, () => ''));
    setOtpError(false);
    autoSubmitRef.current = '';
  }

  function handleBack() {
    setDirection(-1);
    setStep('entry');
    setIsVerifying(false);
    setVerificationSuccess(false);
    setResendTimer(RESEND_SECONDS);
    resetOtp();
    setLiveMessage('Returned to login details.');
  }

  function updateOtp(index: number, value: string) {
    setOtp((current) => {
      const next = [...current];
      next[index] = value;
      return next;
    });

    setOtpError(false);
    autoSubmitRef.current = '';

    if (!value) {
      return;
    }

    if (index < OTP_LENGTH - 1) {
      otpRefs.current[index + 1]?.focus();
    }
  }

  function handleOtpChange(index: number, value: string) {
    updateOtp(index, value.replace(/\D/g, '').slice(-1));
  }

  function handleOtpKeyDown(index: number, event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Backspace') {
      event.preventDefault();
      setOtp((current) => {
        const next = [...current];

        if (next[index]) {
          next[index] = '';
          return next;
        }

        if (index > 0) {
          next[index - 1] = '';
          window.requestAnimationFrame(() => otpRefs.current[index - 1]?.focus());
        }

        return next;
      });

      setOtpError(false);
      autoSubmitRef.current = '';
      return;
    }

    if (event.key === 'ArrowLeft' && index > 0) {
      event.preventDefault();
      otpRefs.current[index - 1]?.focus();
    }

    if (event.key === 'ArrowRight' && index < OTP_LENGTH - 1) {
      event.preventDefault();
      otpRefs.current[index + 1]?.focus();
    }
  }

  function handleOtpPaste(event: ClipboardEvent<HTMLInputElement>) {
    event.preventDefault();
    const pasted = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);

    if (!pasted) {
      return;
    }

    const next = Array.from({ length: OTP_LENGTH }, (_, index) => pasted[index] ?? '');
    setOtp(next);
    setOtpError(false);
    autoSubmitRef.current = '';

    const focusIndex = Math.min(pasted.length, OTP_LENGTH - 1);
    window.requestAnimationFrame(() => otpRefs.current[focusIndex]?.focus());
  }

  async function showOtpError() {
    setOtpError(true);
    setLiveMessage('The OTP entered is invalid.');
    await shakeControls.start({
      x: [0, -10, 10, -6, 6, -3, 3, 0],
      transition: { duration: shouldReduceMotion ? 0.18 : 0.42, ease: 'easeInOut' },
    });
    otpRefs.current[0]?.focus();
  }

  async function handleVerify(inputCode = code) {
    if (!submittedValue || inputCode.length !== OTP_LENGTH || isVerifying) {
      return;
    }

    setIsVerifying(true);
    setOtpError(false);
    setLiveMessage('Verifying OTP.');

    try {
      await verifyOTP(submittedValue, inputCode, method);

      if (method === 'phone') {
        window.localStorage.setItem('chahalbros_user_phone', `+91 ${submittedValue}`);
      } else {
        window.localStorage.setItem('chahalbros_user_email', submittedValue);
      }

      if (email.trim()) {
        window.localStorage.setItem('chahalbros_user_email', email.trim().toLowerCase());
      }

      if (digits.length === 10) {
        window.localStorage.setItem('chahalbros_user_phone', `+91 ${digits}`);
      }

      setVerificationSuccess(true);
      toast.success('Verification successful.');
      setLiveMessage('Verification successful. Redirecting.');
    } catch {
      toast.error('Incorrect OTP. Please try again.');
      autoSubmitRef.current = inputCode;
      await showOtpError();
    } finally {
      setIsVerifying(false);
    }
  }

  async function handleResendOtp() {
    if (isResending || resendTimer > 0 || !submittedValue) {
      return;
    }

    setIsResending(true);
    setLiveMessage('Resending OTP.');

    try {
      await sendOTP(submittedValue, method);
      resetOtp();
      setResendTimer(RESEND_SECONDS);
      toast.success('A new OTP has been sent.');
      window.requestAnimationFrame(() => otpRefs.current[0]?.focus());
    } catch {
      toast.error('Unable to resend OTP right now.');
      setLiveMessage('Unable to resend OTP right now.');
    } finally {
      setIsResending(false);
    }
  }

  function seedCustomerDemoProfile() {
    const profile = {
      fullName: 'Adhiraj Singh',
      phoneNumber: '+91 9876543210',
      email: 'customer@chahalbros.in',
      addressType: 'home',
      fullAddress: 'House 204, Model Town Extension',
      landmark: 'Near Main Market',
      city: 'Ludhiana',
      state: 'Punjab',
      pincode: '141002',
    };

    window.localStorage.setItem('chahalbros_user_phone', profile.phoneNumber);
    window.localStorage.setItem('chahalbros_user_email', profile.email);
    window.localStorage.setItem('chahalbros_profile', JSON.stringify(profile));
  }

  function handleDemoAccess(account: DemoAccount) {
    setIsDemoLoggingIn(account.role);
    setLiveMessage(`Opening the ${account.label.toLowerCase()} interface.`);

    if (account.role === 'customer') {
      seedCustomerDemoProfile();
      loginAs('customer', {
        fullName: 'Adhiraj Singh',
        phoneNumber: '+91 9876543210',
        email: 'customer@chahalbros.in',
      });
    } else if (account.role === 'admin') {
      loginAs('admin', {
        fullName: 'Aman Chahal',
        email: 'admin@chahalbros.in',
        phoneNumber: '+91 98155-88001',
      });
    } else {
      loginAs('delivery', {
        fullName: 'Ravi Kumar',
        email: 'delivery@chahalbros.in',
        phoneNumber: '+91 98765-12121',
      });
    }

    toast.success(`${account.label} ready.`);
    router.replace(getDashboardPath(account.role));
  }

  return (
    <>
      <main
        className={`${plusJakartaSans.className} relative min-h-screen overflow-hidden bg-[#F8F9FC] text-[#1A1A2E]`}
        style={{ minHeight: '100dvh' }}
      >
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,153,221,0.08),transparent_34%),radial-gradient(circle_at_bottom,rgba(204,34,34,0.08),transparent_32%)]"
        />

        <div className="relative mx-auto grid min-h-screen max-w-[1600px] grid-cols-1 lg:grid-cols-[1.22fr_1fr]">
          <section className="relative hidden overflow-hidden lg:flex">
            <div className="mesh-shell absolute inset-8 rounded-[36px]" />

            {groceries.map((item) => (
              <div
                key={`${item.icon}-${item.top}-${item.left}`}
                aria-hidden="true"
                className="floating-grocery absolute z-10 select-none"
                style={{
                  top: item.top,
                  left: item.left,
                  fontSize: item.size,
                  animationDelay: item.delay,
                  animationDuration: item.duration,
                }}
              >
                {item.icon}
              </div>
            ))}

            <div className="relative z-20 flex w-full flex-col justify-between px-14 py-12 text-white">
              <div className="flex items-center justify-between">
                <BrandLockup light />
                <div className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold tracking-[0.26em] text-white/90 backdrop-blur-sm">
                  INDIA FIRST DELIVERY
                </div>
              </div>

              <motion.div
                initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                className="max-w-xl rounded-[30px] border border-white/[0.15] bg-white/10 p-8 shadow-[0_24px_80px_rgba(15,23,42,0.18)] backdrop-blur-md"
              >
                <p className="text-sm font-semibold uppercase tracking-[0.34em] text-white/75">
                  Packed Food + Grocery Essentials
                </p>
                <h1 className="mt-4 text-5xl font-extrabold leading-[1.02] tracking-[-0.04em]">
                  Groceries, staples, and packed food delivered faster than a market run.
                </h1>
                <p className="mt-5 max-w-lg text-base leading-7 text-white/[0.78]">
                  Atta, wheat, rice, pulses, dairy, snacks, and daily retail essentials with one
                  login flow for customers, delivery partners, and admins.
                </p>

                <div className="mt-8 grid grid-cols-3 gap-3 text-sm font-semibold">
                  <div className="rounded-2xl border border-white/[0.15] bg-white/[0.12] px-4 py-3 text-white/90">
                    Live OTP Access
                  </div>
                  <div className="rounded-2xl border border-white/[0.15] bg-white/[0.12] px-4 py-3 text-white/90">
                    Role-Based Flows
                  </div>
                  <div className="rounded-2xl border border-white/[0.15] bg-white/[0.12] px-4 py-3 text-white/90">
                    Real-Time Delivery
                  </div>
                </div>
              </motion.div>

              <div className="grid max-w-xl grid-cols-3 gap-4 text-sm">
                <div className="rounded-3xl border border-white/[0.12] bg-white/10 px-5 py-4 backdrop-blur-sm">
                  <div className="text-2xl font-extrabold">15 min</div>
                  <div className="mt-1 text-white/70">delivery promise</div>
                </div>
                <div className="rounded-3xl border border-white/[0.12] bg-white/10 px-5 py-4 backdrop-blur-sm">
                  <div className="text-2xl font-extrabold">3 roles</div>
                  <div className="mt-1 text-white/70">user, admin, delivery</div>
                </div>
                <div className="rounded-3xl border border-white/[0.12] bg-white/10 px-5 py-4 backdrop-blur-sm">
                  <div className="text-2xl font-extrabold">24x7</div>
                  <div className="mt-1 text-white/70">order tracking</div>
                </div>
              </div>
            </div>
          </section>

          <section className="relative flex items-center justify-center px-4 py-4 sm:px-6 sm:py-6 lg:px-10 lg:py-10">
            <div className="absolute inset-x-4 top-4 h-40 rounded-[32px] bg-[radial-gradient(circle_at_top,rgba(34,153,221,0.18),transparent_58%),radial-gradient(circle_at_top_right,rgba(204,34,34,0.14),transparent_44%)] blur-3xl lg:hidden" />

            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="relative z-10 w-full max-w-md"
            >
              <div className="relative overflow-hidden rounded-[30px] border border-gray-100 bg-white/95 shadow-sm shadow-[#1A1A2E]/[0.06] backdrop-blur-xl min-h-[calc(100dvh-2rem)] lg:min-h-[650px]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,153,221,0.08),transparent_30%),radial-gradient(circle_at_bottom,rgba(204,34,34,0.09),transparent_26%)]" />
                <div className="absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,#CC2222_0%,#E03030_35%,#2299DD_100%)]" />

                <div className="relative flex h-full min-h-[calc(100dvh-2rem)] flex-col p-5 sm:p-7 lg:min-h-[650px]">
                  <div className="flex items-start justify-between gap-4">
                    <BrandLockup />
                    <div className="rounded-full bg-[#F4F6FA] px-3 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.26em] text-[#6B7280]">
                      Secure Login
                    </div>
                  </div>

                  <div className="mt-8 flex-1">
                    <AnimatePresence mode="wait" custom={direction} initial={false}>
                      {step === 'entry' ? (
                        <motion.section
                          key="entry"
                          initial={{ opacity: 0, x: direction > 0 ? -42 : 42, filter: 'blur(6px)' }}
                          animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                          exit={{ opacity: 0, x: -42, filter: 'blur(6px)' }}
                          transition={{ duration: shouldReduceMotion ? 0.18 : 0.38, ease: [0.22, 1, 0.36, 1] }}
                          className="flex h-full flex-col"
                        >
                          <div>
                            <h2 className="text-[1.7rem] font-extrabold tracking-[-0.03em] text-[#1A1A2E]">
                              Welcome back!
                            </h2>
                            <p className="mt-2 text-sm leading-6 text-[#6B7280]">
                              Order groceries delivered to your door.
                            </p>
                          </div>

                          <div className="mt-8 rounded-2xl bg-[#F4F6FA] p-1" role="tablist" aria-label="Login method">
                            <div className="grid grid-cols-2 gap-1">
                              {(['phone', 'email'] as AuthMethod[]).map((option) => {
                                const active = method === option;

                                return (
                                  <button
                                    key={option}
                                    type="button"
                                    role="tab"
                                    aria-selected={active}
                                    onClick={() => setMethod(option)}
                                    className={`rounded-[14px] px-4 py-3 text-sm font-semibold transition ${
                                      active
                                        ? 'bg-[linear-gradient(135deg,#CC2222,#E03030)] text-white shadow-[0_12px_28px_rgba(204,34,34,0.28)]'
                                        : 'text-[#6B7280] hover:text-[#1A1A2E]'
                                    }`}
                                  >
                                    {option === 'phone' ? 'Phone' : 'Email'}
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          <div className="mt-8">
                            {method === 'phone' ? (
                              <div>
                                <label htmlFor="phone" className="mb-2 block text-sm font-semibold text-[#1A1A2E]">
                                  Mobile Number
                                </label>
                                <div className="flex rounded-2xl border border-gray-200 bg-white shadow-[0_10px_30px_rgba(26,26,46,0.04)] transition focus-within:border-[#2299DD] focus-within:ring-4 focus-within:ring-[#2299DD]/[0.12]">
                                  <div className="flex min-h-12 items-center rounded-l-2xl border-r border-gray-200 bg-[#F4F6FA] px-4 text-sm font-semibold text-[#6B7280]">
                                    +91
                                  </div>
                                  <input
                                    id="phone"
                                    type="tel"
                                    inputMode="numeric"
                                    autoComplete="tel"
                                    maxLength={10}
                                    placeholder="Enter 10-digit mobile number"
                                    value={phone}
                                    onChange={(event) => setPhone(event.target.value.replace(/\D/g, '').slice(0, 10))}
                                    className="h-12 w-full rounded-r-2xl border-0 bg-transparent px-4 text-[15px] font-medium text-[#1A1A2E] outline-none placeholder:text-[#9CA3AF]"
                                  />
                                </div>
                              </div>
                            ) : (
                              <div>
                                <label htmlFor="email" className="mb-2 block text-sm font-semibold text-[#1A1A2E]">
                                  Email Address
                                </label>
                                <div className="flex min-h-12 items-center gap-3 rounded-2xl border border-gray-200 bg-white px-4 shadow-[0_10px_30px_rgba(26,26,46,0.04)] transition focus-within:border-[#2299DD] focus-within:ring-4 focus-within:ring-[#2299DD]/[0.12]">
                                  <span className="text-[#6B7280]">
                                    <MailIcon />
                                  </span>
                                  <input
                                    id="email"
                                    type="email"
                                    inputMode="email"
                                    autoComplete="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(event) => setEmail(event.target.value)}
                                    className="h-12 w-full border-0 bg-transparent text-[15px] font-medium text-[#1A1A2E] outline-none placeholder:text-[#9CA3AF]"
                                  />
                                </div>
                              </div>
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={() => void handleSendOtp()}
                            disabled={!canSend || isSending}
                            className="mt-8 inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-[linear-gradient(135deg,#CC2222,#E03030)] px-5 text-sm font-bold text-white shadow-[0_18px_34px_rgba(204,34,34,0.24)] transition hover:brightness-105 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {isSending ? (
                              <span className="inline-flex items-center gap-2">
                                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/25 border-t-white" />
                                Sending OTP...
                              </span>
                            ) : (
                              'Send OTP'
                            )}
                          </button>

                          <div className="mt-auto pt-8">
                            <div className="rounded-[24px] border border-[#E6EBF2] bg-[#F8FAFC] p-4">
                              <div>
                                <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#6B7280]">
                                  Demo Access
                                </p>
                                <p className="mt-2 text-sm leading-6 text-[#6B7280]">
                                  Use these test credentials to open every interface from this login screen.
                                </p>
                              </div>

                              <div className="mt-4 space-y-3">
                                {demoAccounts.map((account) => {
                                  const isLoading = isDemoLoggingIn === account.role;

                                  return (
                                    <div
                                      key={account.role}
                                      className="rounded-[20px] border border-white bg-white px-4 py-3 shadow-[0_10px_24px_rgba(26,26,46,0.04)]"
                                    >
                                      <div className="flex items-start justify-between gap-3">
                                        <div>
                                          <p className="text-sm font-extrabold text-[#1A1A2E]">{account.label}</p>
                                          <p className="mt-1 text-xs text-[#6B7280]">Login: {account.identifier}</p>
                                          <p className="mt-1 text-xs text-[#6B7280]">Password / OTP: {account.password}</p>
                                          <p className="mt-1 text-xs leading-5 text-[#94A3B8]">{account.note}</p>
                                        </div>

                                        <button
                                          type="button"
                                          onClick={() => handleDemoAccess(account)}
                                          disabled={Boolean(isDemoLoggingIn)}
                                          className="inline-flex min-h-10 shrink-0 items-center justify-center rounded-xl border border-[#CC2222]/20 bg-[#FFF5F5] px-3 text-xs font-extrabold text-[#CC2222] transition hover:border-[#CC2222]/40 hover:bg-[#FFF0F0] disabled:cursor-not-allowed disabled:opacity-60"
                                        >
                                          {isLoading ? 'Opening...' : 'Open'}
                                        </button>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>

                            <p className="text-center text-xs leading-6 text-[#6B7280]">
                              By continuing, you agree to our{' '}
                              <a href="/terms" className="font-semibold text-[#2299DD] transition hover:text-[#1A1A2E]">
                                Terms
                              </a>{' '}
                              &{' '}
                              <a href="/privacy" className="font-semibold text-[#2299DD] transition hover:text-[#1A1A2E]">
                                Privacy Policy
                              </a>
                            </p>

                            <p className="mt-4 rounded-2xl bg-[#F8F9FC] px-4 py-3 text-center text-xs leading-5 text-[#6B7280]">
                              Customer demo uses OTP. Admin and delivery demo access seed the shared auth context directly.
                            </p>
                          </div>
                        </motion.section>
                      ) : (
                        <motion.section
                          key="otp"
                          initial={{ opacity: 0, x: 42, filter: 'blur(6px)' }}
                          animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                          exit={{ opacity: 0, x: 42, filter: 'blur(6px)' }}
                          transition={{ duration: shouldReduceMotion ? 0.18 : 0.38, ease: [0.22, 1, 0.36, 1] }}
                          className="flex h-full flex-col"
                        >
                          <div className="flex items-start gap-4">
                            <button
                              type="button"
                              onClick={handleBack}
                              className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-gray-200 bg-white text-[#1A1A2E] transition hover:border-[#2299DD]/30 hover:text-[#2299DD] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#2299DD]/[0.15]"
                              aria-label="Back to login details"
                            >
                              <ArrowLeftIcon />
                            </button>

                            <div>
                              <h2 className="text-[1.7rem] font-extrabold tracking-[-0.03em] text-[#1A1A2E]">
                                Verify OTP
                              </h2>
                              <p className="mt-2 text-sm leading-6 text-[#6B7280]">
                                We sent a 6-digit code to {maskedDestination}
                              </p>
                            </div>
                          </div>

                          <motion.div animate={shakeControls} className="mt-8">
                            <div className="grid grid-cols-6 gap-2 sm:gap-3">
                              {otp.map((digit, index) => (
                                <div key={`otp-${index}`}>
                                  <label htmlFor={`otp-${index}`} className="sr-only">
                                    OTP digit {index + 1}
                                  </label>
                                  <input
                                    ref={(node) => {
                                      otpRefs.current[index] = node;
                                    }}
                                    id={`otp-${index}`}
                                    type="text"
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    maxLength={1}
                                    autoComplete={index === 0 ? 'one-time-code' : 'off'}
                                    value={digit}
                                    onChange={(event) => handleOtpChange(index, event.target.value)}
                                    onKeyDown={(event) => handleOtpKeyDown(index, event)}
                                    onPaste={handleOtpPaste}
                                    aria-invalid={otpError}
                                    aria-label={`Digit ${index + 1} of ${OTP_LENGTH}`}
                                    className={`h-12 min-h-12 w-full min-w-0 rounded-2xl border bg-white text-center text-2xl font-bold text-[#1A1A2E] shadow-[0_10px_24px_rgba(26,26,46,0.04)] outline-none transition focus:border-[#2299DD] focus:ring-4 focus:ring-[#2299DD]/[0.15] ${
                                      otpError ? 'border-[#CC2222]/60' : 'border-gray-200'
                                    }`}
                                  />
                                </div>
                              ))}
                            </div>
                          </motion.div>

                          <AnimatePresence initial={false}>
                            {otpError ? (
                              <motion.p
                                initial={{ opacity: 0, y: -6 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -6 }}
                                className="mt-4 text-sm font-medium text-[#CC2222]"
                              >
                                The code entered is incorrect. Please try again.
                              </motion.p>
                            ) : null}
                          </AnimatePresence>

                          <div className="mt-6 flex items-center justify-between gap-4 rounded-2xl bg-[#F8F9FC] px-4 py-3">
                            <div>
                              <p className="text-sm font-semibold text-[#1A1A2E]">Didn&apos;t receive the code?</p>
                              <p className="text-xs text-[#6B7280]">Resend is enabled when the timer ends.</p>
                            </div>
                            {resendTimer > 0 ? (
                              <div className="text-sm font-semibold text-[#6B7280]">
                                Resend OTP in {formatTimer(resendTimer)}
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => void handleResendOtp()}
                                disabled={isResending}
                                className="text-sm font-bold text-[#2299DD] transition hover:text-[#1A1A2E] disabled:opacity-50"
                              >
                                {isResending ? 'Sending...' : 'Resend OTP'}
                              </button>
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={() => void handleVerify()}
                            disabled={!canVerify || isVerifying}
                            className="mt-8 inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-[linear-gradient(135deg,#CC2222,#E03030)] px-5 text-sm font-bold text-white shadow-[0_18px_34px_rgba(204,34,34,0.24)] transition hover:brightness-105 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {isVerifying ? (
                              <span className="inline-flex items-center gap-2">
                                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/25 border-t-white" />
                                Verifying...
                              </span>
                            ) : (
                              'Verify & Continue'
                            )}
                          </button>

                          <div className="mt-auto pt-8">
                            <p className="rounded-2xl bg-[#F8F9FC] px-4 py-3 text-center text-xs leading-5 text-[#6B7280]">
                              Demo OTP: <span className="font-bold text-[#1A1A2E]">{DEMO_OTP}</span>
                            </p>
                          </div>
                        </motion.section>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                <AnimatePresence>
                  {verificationSuccess ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 z-20 flex items-center justify-center bg-white/80 backdrop-blur-sm"
                    >
                      <motion.div
                        initial={{ opacity: 0, scale: 0.86, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: shouldReduceMotion ? 0.18 : 0.38, type: 'spring', bounce: 0.3 }}
                        className="mx-6 flex max-w-xs flex-col items-center rounded-[28px] border border-emerald-100 bg-white px-8 py-10 text-center shadow-[0_24px_80px_rgba(22,163,74,0.16)]"
                      >
                        <motion.div
                          initial={{ scale: 0.7, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: shouldReduceMotion ? 0 : 0.08, duration: 0.24 }}
                          className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500 text-white shadow-[0_16px_40px_rgba(34,197,94,0.28)]"
                        >
                          <CheckIcon />
                        </motion.div>
                        <h3 className="mt-5 text-2xl font-extrabold tracking-[-0.03em] text-[#1A1A2E]">
                          Verified
                        </h3>
                        <p className="mt-2 text-sm leading-6 text-[#6B7280]">
                          Your account is ready. Redirecting to the next step.
                        </p>
                      </motion.div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            </motion.div>
          </section>
        </div>

        <div className="sr-only" aria-live="polite" aria-atomic="true">
          {liveMessage}
        </div>
      </main>

      <style jsx>{`
        .mesh-shell {
          background:
            radial-gradient(circle at 18% 18%, rgba(255, 255, 255, 0.14), transparent 24%),
            radial-gradient(circle at 78% 16%, rgba(255, 255, 255, 0.12), transparent 26%),
            radial-gradient(circle at 62% 72%, rgba(255, 255, 255, 0.1), transparent 28%),
            linear-gradient(155deg, rgba(204, 34, 34, 0.94) 0%, rgba(224, 48, 48, 0.9) 34%, rgba(37, 131, 215, 0.92) 72%, rgba(34, 153, 221, 0.9) 100%);
          box-shadow: 0 40px 120px rgba(15, 23, 42, 0.18);
          animation: meshShift 18s ease-in-out infinite alternate;
        }

        .floating-grocery {
          animation-name: floatGrocery;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
          filter: drop-shadow(0 10px 18px rgba(15, 23, 42, 0.16));
        }

        @keyframes meshShift {
          0% {
            transform: scale(1) rotate(0deg);
            filter: saturate(1.02);
          }
          100% {
            transform: scale(1.05) rotate(-1.4deg);
            filter: saturate(1.12);
          }
        }

        @keyframes floatGrocery {
          0%,
          100% {
            transform: translate3d(0, 0, 0) rotate(0deg);
          }
          25% {
            transform: translate3d(8px, -12px, 0) rotate(4deg);
          }
          50% {
            transform: translate3d(-6px, -22px, 0) rotate(-5deg);
          }
          75% {
            transform: translate3d(6px, -10px, 0) rotate(3deg);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .mesh-shell,
          .floating-grocery {
            animation: none;
          }
        }
      `}</style>
    </>
  );
}
