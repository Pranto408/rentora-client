"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { getJWT } from "@/lib/api";
import {
  HiOutlineEnvelope,
  HiOutlineLockClosed,
  HiOutlineEye,
  HiOutlineEyeSlash,
  HiOutlineExclamationCircle,
} from "react-icons/hi2";
import { FcGoogle } from "react-icons/fc";
import { signIn } from "@/lib/auth-client"; // adjust path if different

// ─── animation ───────────────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.42, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] },
  }),
};

// ─── Field wrapper ────────────────────────────────────────────────────────────
function Field({ icon: Icon, label, error, children }) {
  const borderClass = error
    ? "border-red-400 dark:border-red-500"
    : "border-[#1B3B5A]/20 dark:border-white/10 focus-within:border-[#E8834D] dark:focus-within:border-[#E8834D]";

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-[#1B3B5A] dark:text-[#d0dbe8]">
        {label}
      </label>
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-xl border bg-white dark:bg-[#142537] transition-colors ${borderClass}`}
      >
        <Icon className="w-5 h-5 text-[#1B3B5A]/40 dark:text-white/30 shrink-0" />
        {children}
      </div>
      {error && (
        <p className="text-xs text-red-500 dark:text-red-400 pl-1">{error}</p>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function LoginPage() {
  const router = useRouter();

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  // ── helpers ────────────────────────────────────────────────────────────────
  function change(e) {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    setErrors((p) => ({ ...p, [name]: "" }));
    setServerError("");
  }

  function validate() {
    const errs = {};
    if (!form.email.trim()) errs.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.email = "Enter a valid email.";
    if (!form.password) errs.password = "Password is required.";
    return errs;
  }

  // ── email login ────────────────────────────────────────────────────────────
  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setLoading(true);
    setServerError("");

    try {
      const { data, error } = await signIn.email({
        email: form.email,
        password: form.password,
      });

      if (!error) {
        await getJWT(form.email);
        window.location.href = "/";
      }


      router.push("/");
    } catch (err) {
      setServerError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // ── google login ───────────────────────────────────────────────────────────
  async function handleGoogle() {
    setLoading(true);
    setServerError("");
    try {
      await signIn.social({
        provider: "google",
        callbackURL: "/", // Google users are always tenants
      });
    } catch (err) {
      setServerError("Google sign-in failed. Please try again.");
      setLoading(false);
    }
  }

  // ── render ─────────────────────────────────────────────────────────────────
  return (
    <main className="min-h-screen bg-[#F8F6F2] dark:bg-[#0d1b2a] flex items-center justify-center px-4 py-12">
      <motion.div initial="hidden" animate="show" className="w-full max-w-md">
        {/* Logo */}
        <motion.div
          variants={fadeUp}
          custom={0}
          className="flex items-center justify-center gap-3 mb-8"
        >
          <div className="w-9 h-9 rounded-xl bg-[#1B3B5A] flex items-center justify-center">
            <svg viewBox="0 0 32 32" className="w-5 h-5 fill-white" aria-hidden>
              <path d="M16 2 L30 14 L30 28 L20 28 L20 20 L12 20 L12 28 L2 28 L2 14 Z" />
            </svg>
          </div>
          <span className="text-xl font-bold text-[#1B3B5A] dark:text-white">
            Rentora
          </span>
        </motion.div>

        <motion.h2
          variants={fadeUp}
          custom={1}
          className="text-3xl font-bold text-[#1B3B5A] dark:text-white mb-1 text-center"
        >
          Welcome back
        </motion.h2>

        <motion.p
          variants={fadeUp}
          custom={2}
          className="text-[#1B3B5A]/60 dark:text-white/50 mb-8 text-sm text-center"
        >
          No account yet?{" "}
          <Link
            href="/register"
            className="text-[#E8834D] font-medium hover:underline"
          >
            Create one
          </Link>
        </motion.p>

        {/* Server error banner */}
        {serverError && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2.5 mb-5 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm"
          >
            <HiOutlineExclamationCircle className="w-5 h-5 shrink-0" />
            {serverError}
          </motion.div>
        )}

        {/* Google */}
        <motion.button
          variants={fadeUp}
          custom={3}
          type="button"
          onClick={handleGoogle}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-[#1B3B5A]/20 dark:border-white/10 bg-white dark:bg-[#142537] text-[#1B3B5A] dark:text-white font-medium text-sm hover:bg-[#1B3B5A]/5 dark:hover:bg-white/5 transition-colors mb-5 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FcGoogle className="w-5 h-5" />
          Continue with Google
        </motion.button>

        {/* Divider */}
        <motion.div
          variants={fadeUp}
          custom={4}
          className="flex items-center gap-3 mb-5"
        >
          <div className="flex-1 h-px bg-[#1B3B5A]/10 dark:bg-white/10" />
          <span className="text-xs text-[#1B3B5A]/40 dark:text-white/30 uppercase tracking-widest">
            or
          </span>
          <div className="flex-1 h-px bg-[#1B3B5A]/10 dark:bg-white/10" />
        </motion.div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          noValidate
          className="flex flex-col gap-4"
        >
          <motion.div variants={fadeUp} custom={5}>
            <Field
              icon={HiOutlineEnvelope}
              label="Email address"
              error={errors.email}
            >
              <input
                name="email"
                type="email"
                placeholder="rahim@example.com"
                value={form.email}
                onChange={change}
                autoComplete="email"
                className="flex-1 bg-transparent text-sm text-[#1B3B5A] dark:text-white placeholder-[#1B3B5A]/30 dark:placeholder-white/20 outline-none"
              />
            </Field>
          </motion.div>

          <motion.div variants={fadeUp} custom={6}>
            <Field
              icon={HiOutlineLockClosed}
              label="Password"
              error={errors.password}
            >
              <input
                name="password"
                type={showPass ? "text" : "password"}
                placeholder="Your password"
                value={form.password}
                onChange={change}
                autoComplete="current-password"
                className="flex-1 bg-transparent text-sm text-[#1B3B5A] dark:text-white placeholder-[#1B3B5A]/30 dark:placeholder-white/20 outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPass((p) => !p)}
                className="text-[#1B3B5A]/40 dark:text-white/30 hover:text-[#E8834D] transition-colors"
                aria-label={showPass ? "Hide password" : "Show password"}
              >
                {showPass ? (
                  <HiOutlineEyeSlash className="w-5 h-5" />
                ) : (
                  <HiOutlineEye className="w-5 h-5" />
                )}
              </button>
            </Field>
          </motion.div>

          <motion.button
            variants={fadeUp}
            custom={7}
            type="submit"
            disabled={loading}
            className="mt-2 w-full py-3.5 rounded-xl bg-[#E8834D] hover:bg-[#d4733e] active:scale-[0.98] text-white font-semibold text-sm tracking-wide transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Signing in…
              </>
            ) : (
              "Sign in"
            )}
          </motion.button>
        </form>
      </motion.div>
    </main>
  );
}
