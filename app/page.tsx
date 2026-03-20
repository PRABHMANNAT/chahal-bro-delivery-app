'use client';

import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { getDashboardPath, useAuth } from '../providers/auth-provider';

export default function SplashPage() {
  const router = useRouter();
  const shouldReduceMotion = useReducedMotion() ?? false;
  const { isHydrated, role } = useAuth();
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    const targetPath = role ? getDashboardPath(role) : '/login';
    const fadeStartDelay = shouldReduceMotion ? 2825 : 2500;

    const fadeTimer = window.setTimeout(() => {
      setIsExiting(true);
    }, fadeStartDelay);

    const navigationTimer = window.setTimeout(() => {
      router.replace(targetPath);
    }, 3000);

    return () => {
      window.clearTimeout(fadeTimer);
      window.clearTimeout(navigationTimer);
    };
  }, [isHydrated, role, router, shouldReduceMotion]);

  return (
    <>
      <motion.main
        initial={false}
        animate={
          isExiting
            ? { opacity: 0, scale: 0.985, filter: 'blur(4px)' }
            : { opacity: 1, scale: 1, filter: 'blur(0px)' }
        }
        transition={{
          duration: shouldReduceMotion ? 0.18 : 0.5,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="relative isolate flex min-h-screen overflow-hidden bg-[#FFFDF5] text-[#1A1A2E]"
        style={{ minHeight: '100dvh' }}
      >
        <div aria-hidden="true" className="sunburst absolute inset-0" />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-white/60 via-white/20 to-transparent"
        />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-52 bg-gradient-to-t from-[#fff6df]/80 via-[#fff6df]/20 to-transparent"
        />

        <section className="relative z-10 flex w-full items-center justify-center px-6 py-10 sm:px-8">
          <div className="flex w-full max-w-md flex-col items-center text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={
                shouldReduceMotion
                  ? { duration: 0.2, ease: 'easeOut' }
                  : {
                      delay: 0.05,
                      type: 'spring',
                      duration: 1.2,
                      bounce: 0.32,
                    }
              }
              className="relative will-change-transform"
            >
              <div
                aria-hidden="true"
                className="absolute inset-0 -z-10 scale-[1.28] rounded-full bg-[radial-gradient(circle,rgba(204,34,34,0.16)_0%,rgba(34,153,221,0.10)_38%,rgba(255,253,245,0)_72%)] blur-2xl"
              />
              <div className="logo-glow flex h-[120px] w-[120px] items-center justify-center rounded-full border border-[#1A1A2E]/8 bg-white/95 shadow-[0_18px_50px_rgba(26,26,46,0.12)] backdrop-blur-sm">
                <span className="select-none text-[44px] font-black tracking-[-0.08em]">
                  <span className="text-[#CC2222]">C</span>
                  <span className="text-[#2299DD]">B</span>
                </span>
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: shouldReduceMotion ? 0.2 : 0.6,
                delay: shouldReduceMotion ? 0.05 : 0.3,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="mt-7 text-[28px] font-extrabold tracking-[0.28em] sm:mt-8"
            >
              <span className="text-[#CC2222]">CHAHAL</span>{' '}
              <span className="text-[#2299DD]">BROS</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: shouldReduceMotion ? 0.2 : 0.55,
                delay: shouldReduceMotion ? 0.1 : 0.6,
                ease: 'easeOut',
              }}
              className="mt-3 text-[14px] font-medium tracking-[0.18em] text-[#6B7280]"
            >
              Delivery in minutes
            </motion.p>
          </div>
        </section>

        <div className="absolute inset-x-0 bottom-0 z-20 h-[2px] bg-[#1A1A2E]/6">
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{
              duration: shouldReduceMotion ? 2.7 : 3,
              ease: 'linear',
            }}
            className="h-full origin-left bg-[linear-gradient(90deg,#CC2222_0%,#E64545_45%,#CC2222_100%)] shadow-[0_0_18px_rgba(204,34,34,0.45)]"
          />
        </div>
      </motion.main>

      <style jsx>{`
        .sunburst {
          background:
            radial-gradient(circle at center, rgba(255, 255, 255, 0.92) 0%, rgba(255, 253, 245, 0.86) 34%, rgba(255, 253, 245, 1) 72%),
            repeating-conic-gradient(
              from -3deg at 50% 50%,
              rgba(204, 34, 34, 0.045) 0deg,
              rgba(204, 34, 34, 0.045) 7deg,
              rgba(255, 253, 245, 0) 7deg,
              rgba(255, 253, 245, 0) 15deg
            ),
            radial-gradient(circle at center, rgba(34, 153, 221, 0.08) 0%, rgba(34, 153, 221, 0) 52%);
          transform: scale(1.08);
          transform-origin: center;
        }

        .logo-glow {
          animation: pulseGlow 2.4s ease-in-out infinite;
          will-change: box-shadow, transform;
        }

        @keyframes pulseGlow {
          0%,
          100% {
            box-shadow:
              0 18px 50px rgba(26, 26, 46, 0.12),
              0 0 0 0 rgba(204, 34, 34, 0.11),
              0 0 0 12px rgba(34, 153, 221, 0.04);
          }
          50% {
            box-shadow:
              0 18px 50px rgba(26, 26, 46, 0.14),
              0 0 0 14px rgba(204, 34, 34, 0.07),
              0 0 0 28px rgba(34, 153, 221, 0.03);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .logo-glow {
            animation: none;
          }
        }
      `}</style>
    </>
  );
}
