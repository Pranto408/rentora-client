"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import {
  HiOutlineMapPin,
  HiOutlineCurrencyDollar,
  HiOutlinePlusCircle,
  HiOutlineXMark,
  HiOutlineCheckCircle,
  HiOutlineExclamationCircle,
  HiOutlineArrowLeft,
} from "react-icons/hi2";

// ─── Constants ────────────────────────────────────────────────────────────────
const PROPERTY_TYPES = [
  "Apartment",
  "House",
  "Villa",
  "Studio",
  "Duplex",
  "Penthouse",
  "Room",
  "Office Space",
];

const RENT_TYPES = ["Monthly", "Weekly", "Daily"];

const AMENITY_OPTIONS = [
  "WiFi",
  "Air Conditioning",
  "Parking",
  "Generator",
  "Security",
  "CCTV",
  "Elevator",
  "Gym",
  "Swimming Pool",
  "Rooftop",
  "Gas",
  "Water Supply",
  "Balcony",
  "Garden",
];

// ─── Reusable components ──────────────────────────────────────────────────────
function FormSection({ title, children }) {
  return (
    <div className="bg-white dark:bg-[#0F172A] rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
      <h2 className="text-base font-semibold text-[#1B3B5A] dark:text-white mb-5 pb-3 border-b border-slate-100 dark:border-slate-800">
        {title}
      </h2>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function Field({ label, required, error, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-slate-600 dark:text-slate-300">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {error && (
        <p className="text-xs text-red-500 flex items-center gap-1">
          <HiOutlineExclamationCircle size={13} />
          {error}
        </p>
      )}
    </div>
  );
}

const inputClass =
  "w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#1E293B] text-sm text-[#1B3B5A] dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none focus:border-[#E8834D] dark:focus:border-[#E8834D] transition-colors";

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function EditPropertyPage() {
  const { id } = useParams();
  const router = useRouter();

  const [form, setForm] = useState(null);
  const [imageInput, setImageInput] = useState("");
  const [featureInput, setFeatureInput] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState("");

  // ── fetch existing property ────────────────────────────────────────────────
  useEffect(() => {
    async function fetchProperty() {
      try {
        const data = await apiFetch(`/api/properties/${id}`);
        if (data?.error) {
          setServerError(data.error);
          return;
        }
        setForm({
          title: data.title ?? "",
          description: data.description ?? "",
          location: data.location ?? "",
          type: data.type ?? "Apartment",
          rent: data.rent?.toString() ?? "",
          rentType: data.rentType ?? "Monthly",
          bedrooms: data.bedrooms?.toString() ?? "",
          bathrooms: data.bathrooms?.toString() ?? "",
          size: data.size ?? "",
          amenities: data.amenities ?? [],
          images: data.images ?? [],
          extraFeatures: data.extraFeatures ?? [],
        });
      } catch {
        setServerError("Failed to load property.");
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchProperty();
  }, [id]);

  // ── helpers ────────────────────────────────────────────────────────────────
  function change(e) {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    setErrors((p) => ({ ...p, [name]: "" }));
  }

  function toggleAmenity(item) {
    setForm((p) => ({
      ...p,
      amenities: p.amenities.includes(item)
        ? p.amenities.filter((a) => a !== item)
        : [...p.amenities, item],
    }));
  }

  function addImage() {
    const url = imageInput.trim();
    if (!url) return;
    if (!/^https?:\/\/.+\..+/.test(url)) {
      setErrors((p) => ({ ...p, images: "Enter a valid image URL." }));
      return;
    }
    if (form.images.includes(url)) {
      setErrors((p) => ({ ...p, images: "Image already added." }));
      return;
    }
    setForm((p) => ({ ...p, images: [...p.images, url] }));
    setImageInput("");
    setErrors((p) => ({ ...p, images: "" }));
  }

  function removeImage(url) {
    setForm((p) => ({ ...p, images: p.images.filter((i) => i !== url) }));
  }

  function addFeature() {
    const f = featureInput.trim();
    if (!f || form.extraFeatures.includes(f)) return;
    setForm((p) => ({ ...p, extraFeatures: [...p.extraFeatures, f] }));
    setFeatureInput("");
  }

  function removeFeature(f) {
    setForm((p) => ({
      ...p,
      extraFeatures: p.extraFeatures.filter((x) => x !== f),
    }));
  }

  function validate() {
    const errs = {};
    if (!form.title.trim()) errs.title = "Title is required.";
    if (!form.description.trim()) errs.description = "Description is required.";
    if (!form.location.trim()) errs.location = "Location is required.";
    if (!form.rent) errs.rent = "Rent is required.";
    else if (isNaN(form.rent) || parseFloat(form.rent) <= 0)
      errs.rent = "Enter a valid rent amount.";
    if (!form.bedrooms) errs.bedrooms = "Bedrooms is required.";
    if (!form.bathrooms) errs.bathrooms = "Bathrooms is required.";
    if (!form.size.trim()) errs.size = "Property size is required.";
    if (form.images.length === 0) errs.images = "Add at least one image.";
    return errs;
  }

  // ── submit ─────────────────────────────────────────────────────────────────
  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setSaving(true);
    setServerError("");

    try {
      const result = await apiFetch(`/api/properties/${id}`, {
        method: "PUT",
        body: JSON.stringify({
          ...form,
          rent: parseFloat(form.rent),
          bedrooms: parseInt(form.bedrooms),
          bathrooms: parseInt(form.bathrooms),
        }),
      });

      if (result?.error) {
        setServerError(result.error);
        return;
      }

      setSuccess(true);
      setTimeout(() => router.push("/dashboard/owner/my-properties"), 1500);
    } catch {
      setServerError("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  // ── loading ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-40 bg-slate-100 dark:bg-slate-800 rounded-2xl animate-pulse"
          />
        ))}
      </div>
    );
  }

  // ── success ────────────────────────────────────────────────────────────────
  if (success) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-950/40 flex items-center justify-center">
          <HiOutlineCheckCircle size={36} className="text-green-500" />
        </div>
        <h2 className="text-xl font-bold text-[#1B3B5A] dark:text-white">
          Property Updated!
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          Redirecting to My Properties…
        </p>
      </div>
    );
  }

  if (!form) return null;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.push("/dashboard/owner/my-properties")}
          className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <HiOutlineArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-[#1B3B5A] dark:text-white">
            Edit Property
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Update your property details below.
          </p>
        </div>
      </div>

      {/* Server error */}
      {serverError && (
        <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm">
          <HiOutlineExclamationCircle size={18} />
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        {/* Basic Info */}
        <FormSection title="Basic Information">
          <Field label="Property Title" required error={errors.title}>
            <input
              name="title"
              value={form.title}
              onChange={change}
              placeholder="e.g. Modern 3BHK Apartment in Gulshan"
              className={inputClass}
            />
          </Field>

          <Field label="Description" required error={errors.description}>
            <textarea
              name="description"
              value={form.description}
              onChange={change}
              rows={4}
              placeholder="Describe the property..."
              className={`${inputClass} resize-none`}
            />
          </Field>

          <Field label="Location" required error={errors.location}>
            <div className="relative">
              <HiOutlineMapPin
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                name="location"
                value={form.location}
                onChange={change}
                placeholder="e.g. Gulshan-2, Dhaka"
                className={`${inputClass} pl-9`}
              />
            </div>
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Property Type" required>
              <select
                name="type"
                value={form.type}
                onChange={change}
                className={inputClass}
              >
                {PROPERTY_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Rent Type" required>
              <select
                name="rentType"
                value={form.rentType}
                onChange={change}
                className={inputClass}
              >
                {RENT_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </Field>
          </div>
        </FormSection>

        {/* Pricing & Details */}
        <FormSection title="Pricing & Details">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Rent (৳)" required error={errors.rent}>
              <div className="relative">
                <HiOutlineCurrencyDollar
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  name="rent"
                  type="number"
                  value={form.rent}
                  onChange={change}
                  placeholder="e.g. 25000"
                  className={`${inputClass} pl-9`}
                />
              </div>
            </Field>
            <Field label="Property Size" required error={errors.size}>
              <input
                name="size"
                value={form.size}
                onChange={change}
                placeholder="e.g. 1200 sqft"
                className={inputClass}
              />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Bedrooms" required error={errors.bedrooms}>
              <input
                name="bedrooms"
                type="number"
                min="0"
                value={form.bedrooms}
                onChange={change}
                placeholder="e.g. 3"
                className={inputClass}
              />
            </Field>
            <Field label="Bathrooms" required error={errors.bathrooms}>
              <input
                name="bathrooms"
                type="number"
                min="0"
                value={form.bathrooms}
                onChange={change}
                placeholder="e.g. 2"
                className={inputClass}
              />
            </Field>
          </div>
        </FormSection>

        {/* Amenities */}
        <FormSection title="Amenities">
          <div className="flex flex-wrap gap-2">
            {AMENITY_OPTIONS.map((item) => {
              const selected = form.amenities.includes(item);
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => toggleAmenity(item)}
                  className={[
                    "px-3 py-1.5 rounded-lg text-xs font-medium border transition-all",
                    selected
                      ? "bg-[#1B3B5A] text-white border-[#1B3B5A] dark:bg-[#E8834D] dark:border-[#E8834D]"
                      : "bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-[#1B3B5A]",
                  ].join(" ")}
                >
                  {selected ? "✓ " : ""}
                  {item}
                </button>
              );
            })}
          </div>
        </FormSection>

        {/* Images */}
        <FormSection title="Property Images">
          <Field label="Add Image URL" error={errors.images}>
            <div className="flex gap-2">
              <input
                type="url"
                value={imageInput}
                onChange={(e) => setImageInput(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addImage())
                }
                placeholder="https://example.com/image.jpg"
                className={inputClass}
              />
              <button
                type="button"
                onClick={addImage}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#1B3B5A] hover:bg-[#162f48] text-white text-sm font-medium transition-colors flex-shrink-0"
              >
                <HiOutlinePlusCircle size={16} /> Add
              </button>
            </div>
          </Field>

          {form.images.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-2">
              {form.images.map((url, i) => (
                <div
                  key={i}
                  className="relative group rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 aspect-video"
                >
                  <img
                    src={url}
                    alt={`Image ${i + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src =
                        "https://placehold.co/400x225?text=Invalid+URL";
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(url)}
                    className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <HiOutlineXMark size={13} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </FormSection>

        {/* Extra Features */}
        <FormSection title="Extra Features">
          <Field label="Add Extra Feature">
            <div className="flex gap-2">
              <input
                type="text"
                value={featureInput}
                onChange={(e) => setFeatureInput(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addFeature())
                }
                placeholder="e.g. Pet Friendly, Furnished"
                className={inputClass}
              />
              <button
                type="button"
                onClick={addFeature}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#1B3B5A] hover:bg-[#162f48] text-white text-sm font-medium transition-colors flex-shrink-0"
              >
                <HiOutlinePlusCircle size={16} /> Add
              </button>
            </div>
          </Field>

          {form.extraFeatures.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-1">
              {form.extraFeatures.map((f) => (
                <span
                  key={f}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#E8834D]/10 text-[#E8834D] text-xs font-medium border border-[#E8834D]/20"
                >
                  {f}
                  <button type="button" onClick={() => removeFeature(f)}>
                    <HiOutlineXMark size={12} />
                  </button>
                </span>
              ))}
            </div>
          )}
        </FormSection>

        {/* Submit */}
        <div className="flex items-center gap-3 pb-6">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#E8834D] hover:bg-[#d4733e] text-white font-semibold text-sm transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving…
              </>
            ) : (
              <>
                <HiOutlineCheckCircle size={17} />
                Save Changes
              </>
            )}
          </button>
          <button
            type="button"
            onClick={() => router.push("/dashboard/owner/my-properties")}
            className="px-6 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
