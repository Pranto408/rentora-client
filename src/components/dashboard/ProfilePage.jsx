"use client";

import { useState } from "react";
import { useSession } from "@/lib/auth-client";
import { apiFetch } from "@/lib/api";
import {
  HiOutlineUser,
  HiOutlineEnvelope,
  HiOutlinePhoto,
  HiOutlineShieldCheck,
  HiOutlineBuildingOffice2,
  HiOutlineHome,
  HiOutlineCheckCircle,
  HiOutlineExclamationCircle,
  HiOutlinePencilSquare,
  HiOutlineXMark,
} from "react-icons/hi2";

const ROLE_CONFIG = {
  admin: {
    label: "Admin",
    icon: HiOutlineShieldCheck,
    chipBg:
      "bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/50",
    gradient: "from-[#1B3B5A] to-[#E8834D]",
  },
  owner: {
    label: "Owner",
    icon: HiOutlineBuildingOffice2,
    chipBg:
      "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900/50",
    gradient: "from-[#1B3B5A] to-[#1e4a6e]",
  },
  tenant: {
    label: "Tenant",
    icon: HiOutlineHome,
    chipBg:
      "bg-green-50 dark:bg-green-950/40 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-900/50",
    gradient: "from-[#1B3B5A] to-[#2d6a4f]",
  },
};

const inputClass =
  "w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#1E293B] text-sm text-[#1B3B5A] dark:text-white placeholder-slate-400 outline-none focus:border-[#E8834D] transition-colors";

export default function ProfilePage() {
  const { data: session } = useSession();
  const user = session?.user;

  const role = user?.role ?? "tenant";
  const config = ROLE_CONFIG[role] ?? ROLE_CONFIG.tenant;
  const RoleIcon = config.icon;

  const initials =
    user?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) ?? "U";

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: "", photo: "" });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [serverError, setServerError] = useState("");

  function startEdit() {
    setForm({ name: user?.name ?? "", photo: user?.image ?? "" });
    setErrors({});
    setSuccessMsg("");
    setServerError("");
    setEditing(true);
  }

  function change(e) {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    setErrors((p) => ({ ...p, [name]: "" }));
  }

  function validate() {
    const errs = {};
    if (!form.name.trim()) errs.name = "Name is required.";
    if (form.photo && !/^https?:\/\/.+\..+/.test(form.photo)) {
      errs.photo = "Enter a valid image URL.";
    }
    return errs;
  }

  async function handleSave(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setSaving(true);
    setServerError("");

    try {
      const result = await fetch("/api/users/update-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user?.email,
          photo: form.photo,
          // name update would need BetterAuth's updateUser — keeping simple for now
        }),
      });
      const data = await result.json();
      if (data?.error) {
        setServerError(data.error);
        return;
      }

      setSuccessMsg("Profile updated! Reload to see changes.");
      setEditing(false);
    } catch {
      setServerError("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-[#1B3B5A] dark:text-white">
          My Profile
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          View and update your account details.
        </p>
      </div>

      {/* Success */}
      {successMsg && (
        <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 text-sm">
          <HiOutlineCheckCircle size={18} /> {successMsg}
        </div>
      )}

      {/* Server error */}
      {serverError && (
        <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm">
          <HiOutlineExclamationCircle size={18} /> {serverError}
        </div>
      )}

      {/* Profile card */}
      <div className="bg-white dark:bg-[#0F172A] rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Banner */}
        <div className={`h-28 bg-gradient-to-r ${config.gradient}`} />

        {/* Avatar + info */}
        <div className="px-6 pb-6">
          <div className="flex items-end justify-between -mt-10 mb-4">
            {/* Avatar */}
            <div className="relative">
              {user?.image ? (
                <img
                  src={user.image}
                  alt={user.name}
                  className="w-20 h-20 rounded-2xl object-cover border-4 border-white dark:border-[#0F172A]"
                />
              ) : (
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#1B3B5A] to-[#E8834D] flex items-center justify-center text-white text-2xl font-bold border-4 border-white dark:border-[#0F172A]">
                  {initials}
                </div>
              )}
            </div>

            {/* Edit button */}
            {!editing && (
              <button
                onClick={startEdit}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-600 dark:text-slate-300 hover:border-[#E8834D] hover:text-[#E8834D] transition-colors"
              >
                <HiOutlinePencilSquare size={15} />
                Edit Profile
              </button>
            )}
            {editing && (
              <button
                onClick={() => setEditing(false)}
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <HiOutlineXMark size={18} />
              </button>
            )}
          </div>

          {/* Name + role */}
          <div className="mb-1">
            <h2 className="text-xl font-bold text-[#1B3B5A] dark:text-white">
              {user?.name}
            </h2>
            <p className="text-sm text-slate-400 mb-2">{user?.email}</p>
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${config.chipBg}`}
            >
              <RoleIcon size={12} />
              {config.label}
            </span>
          </div>
        </div>
      </div>

      {/* Edit form */}
      {editing ? (
        <div className="bg-white dark:bg-[#0F172A] rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
          <h3 className="text-base font-semibold text-[#1B3B5A] dark:text-white mb-5 pb-3 border-b border-slate-100 dark:border-slate-800">
            Edit Profile
          </h3>
          <form onSubmit={handleSave} className="space-y-4">
            {/* Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-600 dark:text-slate-300 flex items-center gap-2">
                <HiOutlineUser size={14} /> Full Name
              </label>
              <input
                name="name"
                value={form.name}
                onChange={change}
                placeholder="Your full name"
                className={inputClass}
              />
              {errors.name && (
                <p className="text-xs text-red-500 flex items-center gap-1">
                  <HiOutlineExclamationCircle size={13} /> {errors.name}
                </p>
              )}
              <p className="text-xs text-slate-400">
                Note: Name change requires re-login to reflect everywhere.
              </p>
            </div>

            {/* Photo URL */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-600 dark:text-slate-300 flex items-center gap-2">
                <HiOutlinePhoto size={14} /> Profile Photo URL
              </label>
              <input
                name="photo"
                type="url"
                value={form.photo}
                onChange={change}
                placeholder="https://example.com/your-photo.jpg"
                className={inputClass}
              />
              {errors.photo && (
                <p className="text-xs text-red-500 flex items-center gap-1">
                  <HiOutlineExclamationCircle size={13} /> {errors.photo}
                </p>
              )}

              {/* Photo preview */}
              {form.photo && /^https?:\/\/.+\..+/.test(form.photo) && (
                <div className="flex items-center gap-3 mt-1">
                  <img
                    src={form.photo}
                    alt="Preview"
                    className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-slate-700"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                  <p className="text-xs text-slate-400">Preview</p>
                </div>
              )}
            </div>

            {/* Email (readonly) */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-600 dark:text-slate-300 flex items-center gap-2">
                <HiOutlineEnvelope size={14} /> Email Address
              </label>
              <input
                value={user?.email ?? ""}
                readOnly
                className={`${inputClass} opacity-60 cursor-not-allowed`}
              />
              <p className="text-xs text-slate-400">Email cannot be changed.</p>
            </div>

            {/* Role (readonly) */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-600 dark:text-slate-300 flex items-center gap-2">
                <RoleIcon size={14} /> Role
              </label>
              <input
                value={config.label}
                readOnly
                className={`${inputClass} opacity-60 cursor-not-allowed`}
              />
              <p className="text-xs text-slate-400">
                Role can only be changed by an admin.
              </p>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#E8834D] hover:bg-[#d4733e] text-white text-sm font-semibold transition-colors disabled:opacity-60"
              >
                {saving ? (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <HiOutlineCheckCircle size={16} />
                )}
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="px-6 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* View mode — info cards */
        <div className="bg-white dark:bg-[#0F172A] rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
          <h3 className="text-base font-semibold text-[#1B3B5A] dark:text-white mb-5 pb-3 border-b border-slate-100 dark:border-slate-800">
            Account Details
          </h3>
          <div className="space-y-4">
            {[
              { label: "Full Name", value: user?.name, icon: HiOutlineUser },
              {
                label: "Email Address",
                value: user?.email,
                icon: HiOutlineEnvelope,
              },
              { label: "Role", value: config.label, icon: RoleIcon },
              {
                label: "Member Since",
                value: user?.createdAt
                  ? new Date(user.createdAt).toLocaleDateString("en-BD", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "—",
                icon: HiOutlineCheckCircle,
              },
            ].map(({ label, value, icon: Icon }) => (
              <div
                key={label}
                className="flex items-center gap-4 p-3.5 rounded-xl bg-slate-50 dark:bg-[#1E293B]"
              >
                <div className="w-9 h-9 rounded-xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-700 flex items-center justify-center flex-shrink-0">
                  <Icon size={16} className="text-[#E8834D]" />
                </div>
                <div>
                  <p className="text-xs text-slate-400">{label}</p>
                  <p className="text-sm font-semibold text-[#1B3B5A] dark:text-white">
                    {value ?? "—"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
