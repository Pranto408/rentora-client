"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { apiFetch } from "@/lib/api";
import Link from "next/link";
import {
  HiOutlineLockClosed,
  HiOutlineCreditCard,
  HiOutlineCheckCircle,
  HiOutlineExclamationCircle,
  HiOutlineArrowLeft,
  HiOutlineBuildingOffice2,
  HiOutlineMapPin,
  HiOutlineCalendar,
  HiOutlineShieldCheck,
} from "react-icons/hi2";

// ─── Load Stripe ──────────────────────────────────────────────────────────────
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
);

// ─── Stripe element style ─────────────────────────────────────────────────────
const STRIPE_STYLE = {
  style: {
    base: {
      fontSize: "14px",
      color: "#1B3B5A",
      fontFamily: "inherit",
      "::placeholder": { color: "#94a3b8" },
    },
    invalid: { color: "#ef4444" },
  },
};

// ─── Checkout Form ────────────────────────────────────────────────────────────
function CheckoutForm({ property, bookingData, onSuccess }) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [cardName, setCardName] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setError("");

    try {
      // 1️⃣ Create payment intent on backend
      const intentResult = await apiFetch("/api/payments/create-intent", {
        method: "POST",
        body: JSON.stringify({
          propertyId: property._id,
          amount: property.rent,
        }),
      });

      if (intentResult?.error) {
        setError(intentResult.error);
        return;
      }

      const { clientSecret } = intentResult;

      // 2️⃣ Confirm payment with Stripe
      const { error: stripeError, paymentIntent } =
        await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: elements.getElement(CardNumberElement),
            billing_details: { name: cardName },
          },
        });

      if (stripeError) {
        setError(stripeError.message);
        return;
      }

      if (paymentIntent.status === "succeeded") {
        // 3️⃣ Save transaction
        await apiFetch("/api/payments/confirm", {
          method: "POST",
          body: JSON.stringify({
            propertyId: property._id,
            transactionId: paymentIntent.id,
            amount: property.rent,
          }),
        });

        // 4️⃣ Save booking
        await apiFetch("/api/bookings", {
          method: "POST",
          body: JSON.stringify({
            propertyId: property._id,
            moveInDate: bookingData.moveInDate,
            contactNumber: bookingData.contactNumber,
            additionalNotes: bookingData.additionalNotes,
            transactionId: paymentIntent.id,
            amountPaid: property.rent,
          }),
        });

        onSuccess(paymentIntent.id);
      }
    } catch (err) {
      setError("Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const inputWrap =
    "px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#1E293B] transition-colors focus-within:border-[#E8834D]";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Card name */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-slate-600 dark:text-slate-300">
          Cardholder Name
        </label>
        <input
          type="text"
          value={cardName}
          onChange={(e) => setCardName(e.target.value)}
          placeholder="Name on card"
          required
          className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#1E293B] text-sm text-[#1B3B5A] dark:text-white placeholder-slate-400 outline-none focus:border-[#E8834D] transition-colors"
        />
      </div>

      {/* Card number */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-slate-600 dark:text-slate-300">
          Card Number
        </label>
        <div className={inputWrap}>
          <CardNumberElement options={STRIPE_STYLE} />
        </div>
      </div>

      {/* Expiry + CVC */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-600 dark:text-slate-300">
            Expiry Date
          </label>
          <div className={inputWrap}>
            <CardExpiryElement options={STRIPE_STYLE} />
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-600 dark:text-slate-300">
            CVC
          </label>
          <div className={inputWrap}>
            <CardCvcElement options={STRIPE_STYLE} />
          </div>
        </div>
      </div>

      {/* Test card hint */}
      <div className="flex items-start gap-2.5 px-4 py-3 rounded-xl bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/40">
        <HiOutlineShieldCheck
          size={16}
          className="text-blue-500 flex-shrink-0 mt-0.5"
        />
        <div>
          <p className="text-xs font-medium text-blue-600 dark:text-blue-400">
            Test Mode
          </p>
          <p className="text-xs text-blue-500/80 dark:text-blue-400/70 mt-0.5">
            Use card{" "}
            <span className="font-mono font-semibold">4242 4242 4242 4242</span>
            , any future expiry, any CVC.
          </p>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm">
          <HiOutlineExclamationCircle size={18} className="flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Pay button */}
      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full py-4 rounded-xl bg-[#E8834D] hover:bg-[#d4733e] text-white font-bold text-base transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3"
      >
        {loading ? (
          <>
            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Processing Payment…
          </>
        ) : (
          <>
            <HiOutlineLockClosed size={18} />
            Pay ৳{property.rent?.toLocaleString()}
          </>
        )}
      </button>

      <p className="text-center text-xs text-slate-400 flex items-center justify-center gap-1.5">
        <HiOutlineLockClosed size={12} />
        Secured by Stripe · Your payment info is encrypted
      </p>
    </form>
  );
}

// ─── Success Screen ───────────────────────────────────────────────────────────
function SuccessScreen({ transactionId, propertyTitle }) {
  const router = useRouter();

  useEffect(() => {
    const t = setTimeout(() => router.push("/dashboard/tenant/bookings"), 4000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-5 text-center px-4">
      <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-950/40 flex items-center justify-center">
        <HiOutlineCheckCircle size={44} className="text-green-500" />
      </div>
      <div>
        <h2 className="text-2xl font-bold text-[#1B3B5A] dark:text-white mb-2">
          Payment Successful!
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          Your booking for{" "}
          <span className="font-semibold text-[#1B3B5A] dark:text-white">
            {propertyTitle}
          </span>{" "}
          is confirmed.
        </p>
        {transactionId && (
          <p className="text-xs font-mono text-slate-400 mt-2">
            Transaction ID: {transactionId}
          </p>
        )}
      </div>
      <p className="text-xs text-slate-400">Redirecting to My Bookings…</p>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function PaymentPage() {
  const { id } = useParams();
  const router = useRouter();

  const [property, setProperty] = useState(null);
  const [bookingData, setBookingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [transactionId, setTransactionId] = useState("");

  useEffect(() => {
    // Get booking data saved from property details page
    const saved = sessionStorage.getItem("pendingBooking");
    if (!saved) {
      router.push("/properties");
      return;
    }
    setBookingData(JSON.parse(saved));

    // Fetch property details
    async function fetchProperty() {
      try {
        const data = await apiFetch(`/api/properties/${id}`);
        setProperty(data);
      } catch {
        router.push("/properties");
      } finally {
        setLoading(false);
      }
    }
    fetchProperty();
  }, [id]);

  function handleSuccess(txId) {
    sessionStorage.removeItem("pendingBooking");
    setTransactionId(txId);
    setSuccess(true);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F6F2] dark:bg-[#0d1b2a] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#1B3B5A]/20 border-t-[#1B3B5A] rounded-full animate-spin" />
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-[#F8F6F2] dark:bg-[#0d1b2a] flex items-center justify-center">
        <SuccessScreen
          transactionId={transactionId}
          propertyTitle={property?.title}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F6F2] dark:bg-[#0d1b2a] py-10 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-slate-500 hover:text-[#1B3B5A] dark:hover:text-white transition-colors mb-8"
        >
          <HiOutlineArrowLeft size={16} />
          Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* ── Left: Order Summary ─────────────────────────────────────── */}
          <div className="space-y-5">
            <div>
              <h1 className="text-2xl font-bold text-[#1B3B5A] dark:text-white">
                Complete Your Booking
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Review your booking details and pay securely.
              </p>
            </div>

            {/* Property card */}
            <div className="bg-white dark:bg-[#0F172A] rounded-2xl border border-slate-200 dark:border-slate-800 p-5">
              <div className="flex items-start gap-4">
                {property?.images?.[0] ? (
                  <img
                    src={property.images[0]}
                    alt={property.title}
                    className="w-20 h-16 rounded-xl object-cover flex-shrink-0"
                  />
                ) : (
                  <div className="w-20 h-16 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0">
                    <HiOutlineBuildingOffice2
                      size={24}
                      className="text-slate-400"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[#1B3B5A] dark:text-white truncate">
                    {property?.title}
                  </p>
                  <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                    <HiOutlineMapPin size={11} /> {property?.location}
                  </p>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">
                    {property?.type} · {property?.rentType}
                  </p>
                </div>
              </div>
            </div>

            {/* Booking details */}
            {bookingData && (
              <div className="bg-white dark:bg-[#0F172A] rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-3">
                <h3 className="text-sm font-semibold text-[#1B3B5A] dark:text-white mb-3">
                  Booking Details
                </h3>
                {[
                  {
                    label: "Move-in Date",
                    value: new Date(bookingData.moveInDate).toLocaleDateString(
                      "en-BD",
                      { year: "numeric", month: "long", day: "numeric" },
                    ),
                  },
                  { label: "Contact", value: bookingData.contactNumber },
                  { label: "Name", value: bookingData.userInfo?.name },
                  { label: "Email", value: bookingData.userInfo?.email },
                  ...(bookingData.additionalNotes
                    ? [{ label: "Notes", value: bookingData.additionalNotes }]
                    : []),
                ].map(({ label, value }) => (
                  <div
                    key={label}
                    className="flex justify-between text-sm gap-3"
                  >
                    <span className="text-slate-400 flex-shrink-0">
                      {label}
                    </span>
                    <span className="font-medium text-[#1B3B5A] dark:text-white text-right truncate">
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Amount breakdown */}
            <div className="bg-[#1B3B5A] rounded-2xl p-5 text-white">
              <div className="flex justify-between text-sm mb-3">
                <span className="text-white/70">Reservation Fee</span>
                <span>৳{property?.rent?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm mb-4 pb-4 border-b border-white/20">
                <span className="text-white/70">Platform Fee</span>
                <span className="text-green-400">Free</span>
              </div>
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-[#E8834D]">
                  ৳{property?.rent?.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* ── Right: Payment Form ─────────────────────────────────────── */}
          <div>
            <div className="bg-white dark:bg-[#0F172A] rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
              <div className="flex items-center gap-2 mb-6">
                <HiOutlineCreditCard size={20} className="text-[#E8834D]" />
                <h2 className="text-lg font-bold text-[#1B3B5A] dark:text-white">
                  Payment Details
                </h2>
              </div>

              <Elements stripe={stripePromise}>
                <CheckoutForm
                  property={property}
                  bookingData={bookingData}
                  onSuccess={handleSuccess}
                />
              </Elements>
            </div>

            {/* Trust badges */}
            <div className="flex items-center justify-center gap-6 mt-5">
              {["SSL Secured", "Stripe Protected", "256-bit Encrypted"].map(
                (label) => (
                  <div
                    key={label}
                    className="flex items-center gap-1.5 text-xs text-slate-400"
                  >
                    <HiOutlineLockClosed size={12} />
                    {label}
                  </div>
                ),
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
