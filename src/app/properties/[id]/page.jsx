"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { apiFetch } from "@/lib/api";
import Link from "next/link";
import {
  HiOutlineMapPin,
  HiOutlineCurrencyDollar,
  HiOutlineHome,
  HiOutlineSquares2X2,
  HiOutlineHeart,
  HiOutlineStar,
  HiStar,
  HiOutlineCalendar,
  HiOutlinePhone,
  HiOutlineUser,
  HiOutlineDocumentText,
  HiOutlineCheckCircle,
  HiOutlineXMark,
  HiOutlineExclamationCircle,
  HiOutlineArrowLeft,
  HiOutlineShieldCheck,
  HiOutlineWifi,
} from "react-icons/hi2";

// ─── Star Rating ──────────────────────────────────────────────────────────────
function StarRating({ value, onChange, readonly = false }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type={readonly ? "button" : "button"}
          disabled={readonly}
          onClick={() => !readonly && onChange?.(star)}
          onMouseEnter={() => !readonly && setHover(star)}
          onMouseLeave={() => !readonly && setHover(0)}
          className={`transition-colors ${readonly ? "cursor-default" : "cursor-pointer hover:scale-110"}`}
        >
          {(hover || value) >= star ? (
            <HiStar size={20} className="text-yellow-400" />
          ) : (
            <HiOutlineStar
              size={20}
              className="text-slate-300 dark:text-slate-600"
            />
          )}
        </button>
      ))}
    </div>
  );
}

// ─── Booking Modal ────────────────────────────────────────────────────────────
function BookingModal({ property, onClose, onConfirm }) {
  const { data: session } = useSession();
  const user = session?.user;

  const [form, setForm] = useState({
    moveInDate: "",
    contactNumber: "",
    additionalNotes: "",
  });
  const [errors, setErrors] = useState({});

  function change(e) {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    setErrors((p) => ({ ...p, [name]: "" }));
  }

  function validate() {
    const errs = {};
    if (!form.moveInDate) errs.moveInDate = "Move-in date is required.";
    else if (new Date(form.moveInDate) < new Date())
      errs.moveInDate = "Date must be in the future.";
    if (!form.contactNumber.trim())
      errs.contactNumber = "Contact number is required.";
    return errs;
  }

  function handleConfirm() {
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    onConfirm({ ...form, userInfo: { name: user?.name, email: user?.email } });
  }

  const inputClass =
    "w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#1E293B] text-sm text-[#1B3B5A] dark:text-white placeholder-slate-400 outline-none focus:border-[#E8834D] transition-colors";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white dark:bg-[#1E293B] rounded-2xl shadow-2xl w-full max-w-md z-10 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-700">
          <div>
            <h3 className="font-bold text-lg text-[#1B3B5A] dark:text-white">
              Book Property
            </h3>
            <p className="text-xs text-slate-400 truncate max-w-[260px]">
              {property.title}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            <HiOutlineXMark size={18} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Rent summary */}
          <div className="bg-[#1B3B5A]/5 dark:bg-white/5 rounded-xl p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400">Reservation Fee</p>
              <p className="text-2xl font-bold text-[#1B3B5A] dark:text-white">
                ৳{property.rent?.toLocaleString()}
              </p>
              <p className="text-xs text-slate-400">Per {property.rentType}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-[#E8834D]/10 flex items-center justify-center">
              <HiOutlineCurrencyDollar size={24} className="text-[#E8834D]" />
            </div>
          </div>

          {/* Move-in date */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-600 dark:text-slate-300">
              Move-in Date <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <HiOutlineCalendar
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                name="moveInDate"
                type="date"
                value={form.moveInDate}
                onChange={change}
                min={new Date().toISOString().split("T")[0]}
                className={`${inputClass} pl-9`}
              />
            </div>
            {errors.moveInDate && (
              <p className="text-xs text-red-500">{errors.moveInDate}</p>
            )}
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-600 dark:text-slate-300">
              Contact Number <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <HiOutlinePhone
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                name="contactNumber"
                type="tel"
                value={form.contactNumber}
                onChange={change}
                placeholder="+880 1700 000000"
                className={`${inputClass} pl-9`}
              />
            </div>
            {errors.contactNumber && (
              <p className="text-xs text-red-500">{errors.contactNumber}</p>
            )}
          </div>

          {/* User info (readonly) */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-600 dark:text-slate-300">
                Name
              </label>
              <div className="relative">
                <HiOutlineUser
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  value={user?.name ?? ""}
                  readOnly
                  className={`${inputClass} pl-9 opacity-60 cursor-not-allowed`}
                />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-600 dark:text-slate-300">
                Email
              </label>
              <input
                value={user?.email ?? ""}
                readOnly
                className={`${inputClass} opacity-60 cursor-not-allowed text-xs`}
              />
            </div>
          </div>

          {/* Notes */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-600 dark:text-slate-300">
              Additional Notes
            </label>
            <div className="relative">
              <HiOutlineDocumentText
                size={16}
                className="absolute left-3.5 top-3.5 text-slate-400"
              />
              <textarea
                name="additionalNotes"
                value={form.additionalNotes}
                onChange={change}
                rows={3}
                placeholder="Any special requests or questions..."
                className={`${inputClass} pl-9 resize-none`}
              />
            </div>
          </div>

          {/* Confirm button */}
          <button
            onClick={handleConfirm}
            className="w-full py-3.5 rounded-xl bg-[#E8834D] hover:bg-[#d4733e] text-white font-semibold text-sm transition-colors"
          >
            Confirm & Proceed to Payment
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Review Form ──────────────────────────────────────────────────────────────
function ReviewForm({ propertyId, onSubmitted }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!rating) {
      setError("Please select a rating.");
      return;
    }
    if (!comment.trim()) {
      setError("Please write a comment.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const result = await apiFetch("/api/reviews", {
        method: "POST",
        body: JSON.stringify({ propertyId, rating, comment }),
      });
      if (result?.error) {
        setError(result.error);
        return;
      }
      setRating(0);
      setComment("");
      onSubmitted?.();
    } catch {
      setError("Failed to submit review.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-slate-50 dark:bg-[#0F172A] rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-4"
    >
      <h3 className="font-semibold text-[#1B3B5A] dark:text-white">
        Write a Review
      </h3>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm text-slate-500 dark:text-slate-400">
          Your Rating
        </label>
        <StarRating value={rating} onChange={setRating} />
      </div>

      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows={3}
        placeholder="Share your experience with this property..."
        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1E293B] text-sm text-[#1B3B5A] dark:text-white placeholder-slate-400 outline-none focus:border-[#E8834D] transition-colors resize-none"
      />

      {error && (
        <p className="text-xs text-red-500 flex items-center gap-1">
          <HiOutlineExclamationCircle size={13} /> {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1B3B5A] hover:bg-[#162f48] text-white text-sm font-semibold transition-colors disabled:opacity-60"
      >
        {loading ? (
          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : null}
        Submit Review
      </button>
    </form>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function PropertyDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user;

  const [property, setProperty] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [bookingModal, setBookingModal] = useState(false);
  const [favorited, setFavorited] = useState(false);
  const [favLoading, setFavLoading] = useState(false);
  const [activeImage, setActiveImage] = useState(0);

  // ── fetch property + reviews ───────────────────────────────────────────────
  useEffect(() => {
    async function load() {
      try {
        const [propData, reviewData] = await Promise.all([
          apiFetch(`/api/properties/${id}`),
          apiFetch(`/api/reviews/${id}`),
        ]);
        if (propData?.error) {
          setError(propData.error);
          return;
        }
        setProperty(propData);
        setReviews(reviewData ?? []);
      } catch {
        setError("Failed to load property.");
      } finally {
        setLoading(false);
      }
    }
    if (id) load();
  }, [id]);

  // ── add to favorites ───────────────────────────────────────────────────────
  async function handleFavorite() {
    if (!user) {
      router.push("/login");
      return;
    }
    setFavLoading(true);
    try {
      const result = await apiFetch("/api/favorites", {
        method: "POST",
        body: JSON.stringify({ propertyId: id }),
      });
      if (result?.error && result.error !== "Already in favorites.") return;
      setFavorited(true);
    } catch {
      // silent
    } finally {
      setFavLoading(false);
    }
  }

  // ── booking confirmed → go to payment ────────────────────────────────────
  function handleBookingConfirm(bookingData) {
    // Save booking data to sessionStorage, redirect to payment page
    sessionStorage.setItem(
      "pendingBooking",
      JSON.stringify({ ...bookingData, propertyId: id, amount: property.rent }),
    );
    setBookingModal(false);
    router.push(`/payment/${id}`);
  }

  // ── book button click ──────────────────────────────────────────────────────
  function handleBookClick() {
    if (!user) {
      router.push("/login");
      return;
    }
    setBookingModal(true);
  }

  // ── loading ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-10 space-y-6">
        <div className="h-80 bg-slate-200 dark:bg-slate-800 rounded-2xl animate-pulse" />
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 space-y-4">
            <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse w-3/4" />
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse" />
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse w-5/6" />
          </div>
          <div className="h-48 bg-slate-200 dark:bg-slate-800 rounded-2xl animate-pulse" />
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20 text-center">
        <p className="text-slate-500 dark:text-slate-400">
          {error || "Property not found."}
        </p>
        <Link
          href="/properties"
          className="mt-4 inline-block text-[#E8834D] hover:underline text-sm"
        >
          ← Back to Properties
        </Link>
      </div>
    );
  }

  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  return (
    <>
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        {/* Back */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-slate-500 hover:text-[#1B3B5A] dark:hover:text-white transition-colors"
        >
          <HiOutlineArrowLeft size={16} />
          Back to Properties
        </button>

        {/* Image Gallery */}
        <div className="space-y-3">
          <div className="w-full h-72 sm:h-96 rounded-2xl overflow-hidden bg-slate-200 dark:bg-slate-800">
            {property.images?.[activeImage] ? (
              <img
                src={property.images[activeImage]}
                alt={property.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <HiOutlineHome size={48} className="text-slate-400" />
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {property.images?.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {property.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`flex-shrink-0 w-20 h-14 rounded-xl overflow-hidden border-2 transition-all ${activeImage === i ? "border-[#E8834D]" : "border-transparent opacity-60 hover:opacity-100"}`}
                >
                  <img
                    src={img}
                    alt={`Thumb ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ── Left: Details ─────────────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title + badges */}
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="px-2.5 py-1 rounded-lg bg-[#1B3B5A]/10 dark:bg-white/5 text-[#1B3B5A] dark:text-blue-300 text-xs font-semibold">
                  {property.type}
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-green-50 dark:bg-green-950/30 text-green-600 dark:text-green-400 text-xs font-semibold">
                  {property.rentType}
                </span>
                {avgRating && (
                  <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-yellow-50 dark:bg-yellow-950/30 text-yellow-600 dark:text-yellow-400 text-xs font-semibold">
                    <HiStar size={12} />
                    {avgRating} ({reviews.length} review
                    {reviews.length !== 1 ? "s" : ""})
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#1B3B5A] dark:text-white">
                {property.title}
              </h1>
              <div className="flex items-center gap-1.5 mt-2 text-slate-500 dark:text-slate-400 text-sm">
                <HiOutlineMapPin size={15} />
                {property.location}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              {[
                {
                  label: "Bedrooms",
                  value: property.bedrooms,
                  icon: HiOutlineHome,
                },
                {
                  label: "Bathrooms",
                  value: property.bathrooms,
                  icon: HiOutlineSquares2X2,
                },
                {
                  label: "Size",
                  value: property.size,
                  icon: HiOutlineShieldCheck,
                },
              ].map(({ label, value, icon: Icon }) => (
                <div
                  key={label}
                  className="bg-slate-50 dark:bg-[#0F172A] rounded-xl border border-slate-200 dark:border-slate-800 p-3 text-center"
                >
                  <Icon size={18} className="mx-auto text-[#E8834D] mb-1" />
                  <p className="text-base font-bold text-[#1B3B5A] dark:text-white">
                    {value}
                  </p>
                  <p className="text-xs text-slate-400">{label}</p>
                </div>
              ))}
            </div>

            {/* Description */}
            <div>
              <h2 className="text-lg font-semibold text-[#1B3B5A] dark:text-white mb-2">
                About this property
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                {property.description}
              </p>
            </div>

            {/* Amenities */}
            {property.amenities?.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-[#1B3B5A] dark:text-white mb-3">
                  Amenities
                </h2>
                <div className="flex flex-wrap gap-2">
                  {property.amenities.map((a) => (
                    <span
                      key={a}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 font-medium"
                    >
                      <HiOutlineCheckCircle
                        size={13}
                        className="text-green-500"
                      />
                      {a}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Extra Features */}
            {property.extraFeatures?.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-[#1B3B5A] dark:text-white mb-3">
                  Extra Features
                </h2>
                <div className="flex flex-wrap gap-2">
                  {property.extraFeatures.map((f) => (
                    <span
                      key={f}
                      className="px-3 py-1.5 rounded-lg bg-[#E8834D]/10 text-[#E8834D] text-xs font-medium border border-[#E8834D]/20"
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Owner info */}
            <div className="bg-slate-50 dark:bg-[#0F172A] rounded-2xl border border-slate-200 dark:border-slate-800 p-5">
              <h2 className="text-base font-semibold text-[#1B3B5A] dark:text-white mb-3">
                Listed by
              </h2>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#1B3B5A] flex items-center justify-center text-white font-bold text-sm">
                  {property.owner?.name?.[0]?.toUpperCase() ?? "O"}
                </div>
                <div>
                  <p className="font-semibold text-[#1B3B5A] dark:text-white text-sm">
                    {property.owner?.name}
                  </p>
                  <p className="text-xs text-slate-400">
                    {property.owner?.email}
                  </p>
                </div>
              </div>
            </div>

            {/* Reviews */}
            <div>
              <h2 className="text-lg font-semibold text-[#1B3B5A] dark:text-white mb-4">
                Reviews{" "}
                {reviews.length > 0 && (
                  <span className="text-slate-400 font-normal text-base">
                    ({reviews.length})
                  </span>
                )}
              </h2>

              {reviews.length === 0 ? (
                <p className="text-sm text-slate-400">
                  No reviews yet. Be the first to review!
                </p>
              ) : (
                <div className="space-y-4 mb-6">
                  {reviews.map((review) => (
                    <div
                      key={review._id}
                      className="bg-slate-50 dark:bg-[#0F172A] rounded-2xl border border-slate-200 dark:border-slate-800 p-4"
                    >
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-[#1B3B5A] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                            {review.tenant?.name?.[0]?.toUpperCase() ?? "T"}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-[#1B3B5A] dark:text-white">
                              {review.tenant?.name}
                            </p>
                            <p className="text-xs text-slate-400">
                              {review.tenant?.email}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <StarRating value={review.rating} readonly />
                          <p className="text-xs text-slate-400">
                            {new Date(review.createdAt).toLocaleDateString(
                              "en-BD",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              },
                            )}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                        {review.comment}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Review form — only for logged-in tenants */}
              {user?.role === "tenant" && (
                <ReviewForm
                  propertyId={id}
                  onSubmitted={async () => {
                    const updated = await apiFetch(`/api/reviews/${id}`);
                    setReviews(updated ?? []);
                  }}
                />
              )}

              {!user && (
                <div className="bg-slate-50 dark:bg-[#0F172A] rounded-2xl border border-slate-200 dark:border-slate-800 p-5 text-center">
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
                    <Link
                      href="/login"
                      className="text-[#E8834D] hover:underline font-medium"
                    >
                      Login
                    </Link>{" "}
                    to write a review.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* ── Right: Booking Card ────────────────────────────────────── */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white dark:bg-[#0F172A] rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-4">
              {/* Price */}
              <div>
                <p className="text-3xl font-bold text-[#1B3B5A] dark:text-white">
                  ৳{property.rent?.toLocaleString()}
                </p>
                <p className="text-sm text-slate-400">
                  Per {property.rentType?.toLowerCase()}
                </p>
              </div>

              <div className="h-px bg-slate-100 dark:bg-slate-800" />

              {/* Book button */}
              <button
                onClick={handleBookClick}
                className="w-full py-3.5 rounded-xl bg-[#E8834D] hover:bg-[#d4733e] text-white font-semibold text-sm transition-colors"
              >
                Book Property
              </button>

              {/* Favorite button */}
              <button
                onClick={handleFavorite}
                disabled={favLoading || favorited}
                className={[
                  "w-full py-3 rounded-xl border text-sm font-medium transition-all flex items-center justify-center gap-2",
                  favorited
                    ? "border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/20 text-red-500"
                    : "border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-red-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20",
                ].join(" ")}
              >
                <HiOutlineHeart
                  size={16}
                  className={favorited ? "fill-red-500 text-red-500" : ""}
                />
                {favorited ? "Saved to Favorites" : "Add to Favorites"}
              </button>

              <div className="h-px bg-slate-100 dark:bg-slate-800" />

              {/* Quick info */}
              <div className="space-y-2.5 text-sm">
                {[
                  { label: "Property Type", value: property.type },
                  { label: "Bedrooms", value: property.bedrooms },
                  { label: "Bathrooms", value: property.bathrooms },
                  { label: "Size", value: property.size },
                  { label: "Rent Type", value: property.rentType },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between">
                    <span className="text-slate-400">{label}</span>
                    <span className="font-medium text-[#1B3B5A] dark:text-white">
                      {value}
                    </span>
                  </div>
                ))}
              </div>

              {!user && (
                <p className="text-xs text-center text-slate-400">
                  <Link
                    href="/login"
                    className="text-[#E8834D] hover:underline"
                  >
                    Login
                  </Link>{" "}
                  to book or save this property.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {bookingModal && (
        <BookingModal
          property={property}
          onClose={() => setBookingModal(false)}
          onConfirm={handleBookingConfirm}
        />
      )}
    </>
  );
}
