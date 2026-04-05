import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { itemsApi, rentalsApi } from "../api/client";
import type { Item } from "../types";
import { Modal } from "../components/ui/Modal";
import { Spinner } from "../components/ui/Spinner";
import { Avatar } from "../components/ui/Avatar";
import { useAuth } from "../hooks/useAuth";
import { toast } from "../hooks/useToast";
import { format, differenceInCalendarDays } from "date-fns";
import axios from "axios";

const CATEGORY_LABEL: Record<string, string> = {
  ELECTRONICS: "💻 Electronics",
  MUSICAL_INSTRUMENTS: "🎸 Musical Instruments",
  VEHICLES: "🚗 Vehicles",
  SPORTS_EQUIPMENT: "⚽ Sports Equipment",
  TOOLS: "🔧 Tools",
  CLOTHING: "👕 Clothing",
  OTHER: "📦 Other",
};

const CATEGORY_EMOJI: Record<string, string> = {
  ELECTRONICS: "💻",
  MUSICAL_INSTRUMENTS: "🎸",
  VEHICLES: "🚗",
  SPORTS_EQUIPMENT: "⚽",
  TOOLS: "🔧",
  CLOTHING: "👕",
  OTHER: "📦",
};

export default function ItemDetail() {
  const { id } = useParams<{ id: string }>();
  const { user, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [dates, setDates] = useState({ startDate: "", endDate: "" });
  const [submitting, setSubmitting] = useState(false);
  const [activeImg, setActiveImg] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
    itemsApi.getById(id!).then(setItem).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Spinner />;
  if (!item) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh", fontFamily: "'DM Sans', sans-serif", color: "#94a3b8", fontSize: "15px" }}>
      Item not found
    </div>
  );

  const days =
    dates.startDate && dates.endDate
      ? Math.max(0, differenceInCalendarDays(new Date(dates.endDate), new Date(dates.startDate)))
      : 0;
  const rentalTotal = days * item.pricePerDay;
  const isOwner = user?.id === item.ownerId;

  const submitRental = async () => {
    if (!isLoggedIn) return navigate("/login");
    if (user?.verificationStatus !== "VERIFIED") {
      toast("You must be ID-verified to rent. Go to Profile → Verify.", "error");
      return;
    }
    setSubmitting(true);
    try {
      await rentalsApi.create({ itemId: item.id, startDate: dates.startDate, endDate: dates.endDate });
      toast("Rental request sent! Waiting for owner approval.", "success");
      setBookingOpen(false);
      navigate("/rentals");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) toast(err.response?.data?.message ?? "Failed to create rental", "error");
      else toast("Something went wrong", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const statusConfig = {
    AVAILABLE: { bg: "#ECFDF5", color: "#065F46", dot: "#10B981", label: "Available" },
    RENTED: { bg: "#FEF2F2", color: "#991B1B", dot: "#EF4444", label: "Rented" },
    UNAVAILABLE: { bg: "#F8FAFC", color: "#475569", dot: "#94A3B8", label: "Unavailable" },
  }[item.status];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600&display=swap');

        :root {
          --ink: #0F1117;
          --ink-2: #374151;
          --ink-3: #6B7280;
          --ink-4: #9CA3AF;
          --surface: #FFFFFF;
          --surface-2: #F9FAFB;
          --surface-3: #F3F4F6;
          --border: #E5E7EB;
          --border-2: #D1D5DB;
          --accent: #E85D26;
          --accent-2: #C44A19;
          --accent-soft: #FFF4F0;
          --radius: 16px;
          --radius-sm: 10px;
          --font-display: 'Playfair Display', Georgia, serif;
          --font-body: 'DM Sans', system-ui, sans-serif;
          --shadow-xs: 0 1px 2px rgba(0,0,0,0.04);
          --shadow-sm: 0 2px 8px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04);
          --shadow-md: 0 8px 24px rgba(0,0,0,0.08), 0 2px 6px rgba(0,0,0,0.04);
          --shadow-lg: 0 24px 48px rgba(0,0,0,0.1), 0 4px 12px rgba(0,0,0,0.06);
        }

        .id-page * { box-sizing: border-box; margin: 0; padding: 0; }
        .id-page { font-family: var(--font-body); color: var(--ink); background: var(--surface-2); min-height: 100vh; }

        /* ── Animations ── */
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.97); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }

        .fade-up-1 { animation: fadeUp 0.5s cubic-bezier(0.22,1,0.36,1) both; }
        .fade-up-2 { animation: fadeUp 0.5s 0.08s cubic-bezier(0.22,1,0.36,1) both; }
        .fade-up-3 { animation: fadeUp 0.5s 0.16s cubic-bezier(0.22,1,0.36,1) both; }

        /* ── Breadcrumb ── */
        .id-breadcrumb {
          display: flex; align-items: center; gap: 6px;
          font-size: 12px; font-weight: 500; color: var(--ink-4);
          letter-spacing: 0.02em;
          max-width: 1280px; margin: 0 auto;
          padding: 20px 40px 0;
        }
        .id-breadcrumb a { color: var(--ink-4); text-decoration: none; transition: color 0.15s; }
        .id-breadcrumb a:hover { color: var(--accent); }
        .id-breadcrumb .sep { color: var(--border-2); }
        .id-breadcrumb .current { color: var(--ink-2); font-weight: 600; }

        /* ── Layout grid ── */
        .id-grid {
          max-width: 1280px; margin: 0 auto;
          padding: 28px 40px 80px;
          display: grid;
          grid-template-columns: 1fr 380px;
          gap: 40px;
          align-items: start;
        }

        /* ── Gallery ── */
        .id-main-img {
          border-radius: var(--radius);
          overflow: hidden;
          aspect-ratio: 4/3;
          background: var(--surface-3);
          position: relative;
          cursor: zoom-in;
          box-shadow: var(--shadow-md);
        }
        .id-main-img img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.4s cubic-bezier(0.22,1,0.36,1); }
        .id-main-img:hover img { transform: scale(1.02); }

        .id-img-nav {
          position: absolute; top: 50%; transform: translateY(-50%);
          width: 40px; height: 40px; border-radius: 50%;
          background: rgba(255,255,255,0.92); backdrop-filter: blur(8px);
          border: none; cursor: pointer; display: flex; align-items: center; justify-content: center;
          font-size: 18px; color: var(--ink); box-shadow: var(--shadow-sm);
          transition: all 0.2s; z-index: 2;
        }
        .id-img-nav:hover { background: #fff; transform: translateY(-50%) scale(1.08); box-shadow: var(--shadow-md); }
        .id-img-nav.prev { left: 14px; }
        .id-img-nav.next { right: 14px; }

        .id-thumbs {
          display: flex; gap: 8px; margin-top: 12px; overflow-x: auto; padding-bottom: 2px;
        }
        .id-thumbs::-webkit-scrollbar { height: 3px; }
        .id-thumbs::-webkit-scrollbar-track { background: transparent; }
        .id-thumbs::-webkit-scrollbar-thumb { background: var(--border-2); border-radius: 99px; }

        .id-thumb {
          flex-shrink: 0; width: 72px; height: 56px;
          border-radius: var(--radius-sm); overflow: hidden;
          border: 2px solid transparent; cursor: pointer;
          transition: all 0.2s; background: var(--surface-3);
        }
        .id-thumb.active { border-color: var(--accent); }
        .id-thumb:hover:not(.active) { border-color: var(--border-2); transform: translateY(-1px); }
        .id-thumb img { width: 100%; height: 100%; object-fit: cover; display: block; }

        /* ── Status pill ── */
        .id-status {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 5px 12px; border-radius: 99px;
          font-size: 12px; font-weight: 600; letter-spacing: 0.03em;
        }
        .id-status .dot {
          width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0;
        }
        .id-status .dot.pulse { animation: pulse-dot 2s ease-in-out infinite; }

        /* ── Section title ── */
        .id-section-title {
          font-size: 11px; font-weight: 700; letter-spacing: 0.12em;
          text-transform: uppercase; color: var(--ink-4); margin-bottom: 16px;
        }

        /* ── Details grid ── */
        .id-details-grid {
          display: grid; grid-template-columns: 1fr 1fr; gap: 10px;
        }
        .id-detail-card {
          background: var(--surface); border: 1px solid var(--border);
          border-radius: var(--radius-sm); padding: 16px;
          display: flex; gap: 12px; align-items: flex-start;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .id-detail-card:hover { border-color: var(--border-2); box-shadow: var(--shadow-xs); }
        .id-detail-icon {
          width: 36px; height: 36px; border-radius: 8px;
          background: var(--accent-soft); display: flex; align-items: center;
          justify-content: center; font-size: 16px; flex-shrink: 0;
        }
        .id-detail-label {
          font-size: 10px; font-weight: 700; letter-spacing: 0.08em;
          text-transform: uppercase; color: var(--ink-4); margin-bottom: 3px;
        }
        .id-detail-value { font-size: 14px; font-weight: 600; color: var(--ink-2); }

        /* ── Trust items ── */
        .id-trust-item {
          display: flex; gap: 14px; padding: 16px 0;
          border-bottom: 1px solid var(--border);
        }
        .id-trust-item:last-child { border-bottom: none; }
        .id-trust-icon {
          width: 40px; height: 40px; border-radius: 10px;
          background: var(--accent-soft);
          display: flex; align-items: center; justify-content: center;
          font-size: 18px; flex-shrink: 0; margin-top: 1px;
        }

        /* ── Owner card ── */
        .id-owner-card {
          background: var(--surface); border: 1px solid var(--border);
          border-radius: var(--radius); padding: 24px;
        }

        /* ── Booking card (sticky right) ── */
        .id-booking-card {
          background: var(--surface); border-radius: var(--radius);
          box-shadow: var(--shadow-lg); border: 1px solid var(--border);
          overflow: hidden; position: sticky; top: 88px;
        }

        .id-price-header {
          padding: 28px 28px 22px;
          background: linear-gradient(135deg, #0F1117 0%, #1E2433 100%);
          position: relative; overflow: hidden;
        }
        .id-price-header::before {
          content: '';
          position: absolute; top: -40px; right: -40px;
          width: 120px; height: 120px; border-radius: 50%;
          background: rgba(232, 93, 38, 0.12);
        }
        .id-price-header::after {
          content: '';
          position: absolute; bottom: -20px; left: -20px;
          width: 80px; height: 80px; border-radius: 50%;
          background: rgba(232, 93, 38, 0.08);
        }

        .id-price-amount {
          font-family: var(--font-display); font-size: 48px; font-weight: 900;
          color: #FFFFFF; line-height: 1; letter-spacing: -0.02em;
          position: relative; z-index: 1;
        }
        .id-price-unit {
          font-size: 14px; font-weight: 400; color: rgba(255,255,255,0.5);
          letter-spacing: 0.03em; margin-left: 2px;
        }
        .id-deposit-note {
          margin-top: 8px; font-size: 12px; color: rgba(255,255,255,0.5);
          display: flex; align-items: center; gap: 6px; position: relative; z-index: 1;
        }
        .id-deposit-note strong { color: rgba(255,255,255,0.8); font-weight: 600; }

        .id-rate-row {
          display: grid; grid-template-columns: 1fr 1fr;
          border-bottom: 1px solid var(--border);
        }
        .id-rate-cell {
          padding: 14px 20px; border-right: 1px solid var(--border);
        }
        .id-rate-cell:last-child { border-right: none; }
        .id-rate-label {
          font-size: 10px; font-weight: 700; letter-spacing: 0.1em;
          text-transform: uppercase; color: var(--ink-4); margin-bottom: 4px;
        }
        .id-rate-value { font-size: 15px; font-weight: 700; color: var(--ink); }

        .id-owner-mini {
          padding: 16px 20px; border-bottom: 1px solid var(--border);
          display: flex; align-items: center; gap: 12px;
        }

        .id-cta-area {
          padding: 20px 24px; display: flex; flex-direction: column; gap: 10px;
        }

        .id-rent-btn {
          width: 100%; padding: 16px 24px;
          background: var(--accent); color: #fff;
          border: none; border-radius: 12px; cursor: pointer;
          font-family: var(--font-body); font-size: 15px; font-weight: 700;
          letter-spacing: 0.01em; display: flex; align-items: center;
          justify-content: center; gap: 8px;
          transition: all 0.2s; box-shadow: 0 4px 12px rgba(232,93,38,0.3);
        }
        .id-rent-btn:hover { background: var(--accent-2); transform: translateY(-1px); box-shadow: 0 6px 20px rgba(232,93,38,0.4); }
        .id-rent-btn:active { transform: translateY(0); }
        .id-rent-btn:disabled {
          background: var(--surface-3); color: var(--ink-4);
          box-shadow: none; cursor: not-allowed; transform: none;
        }

        .id-safety-note {
          padding: 14px 20px; background: var(--surface-2);
          border-top: 1px solid var(--border);
          font-size: 11px; color: var(--ink-4);
          display: flex; gap: 8px; align-items: flex-start; line-height: 1.5;
        }

        /* ── Divider ── */
        .id-divider { height: 1px; background: var(--border); margin: 28px 0; }

        /* ── Modal overrides ── */
        .id-modal-field label {
          display: block; font-size: 12px; font-weight: 700;
          letter-spacing: 0.06em; text-transform: uppercase;
          color: var(--ink-3); margin-bottom: 7px;
        }
        .id-modal-input {
          width: 100%; padding: 13px 16px;
          border: 1.5px solid var(--border); border-radius: 10px;
          font-family: var(--font-body); font-size: 14px; color: var(--ink);
          outline: none; transition: border-color 0.15s;
          background: var(--surface);
        }
        .id-modal-input:focus { border-color: var(--accent); }

        .id-cost-row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 14px; }
        .id-cost-row span:first-child { color: var(--ink-3); }
        .id-cost-row span:last-child { font-weight: 600; color: var(--ink-2); }
        .id-cost-total {
          display: flex; justify-content: space-between;
          padding: 14px 0 0; margin-top: 4px; border-top: 1.5px solid var(--border);
          font-size: 16px; font-weight: 800;
        }
        .id-cost-total span:last-child { color: var(--accent); }

        /* ── Lightbox ── */
        .id-lightbox {
          position: fixed; inset: 0; z-index: 4000;
          background: rgba(10,10,16,0.95); backdrop-filter: blur(16px);
          display: flex; align-items: center; justify-content: center;
        }
        .id-lightbox-close {
          position: absolute; top: 20px; right: 20px;
          width: 44px; height: 44px; border-radius: 50%;
          background: rgba(255,255,255,0.1); color: #fff;
          border: none; cursor: pointer; font-size: 22px;
          display: flex; align-items: center; justify-content: center;
          transition: background 0.2s;
        }
        .id-lightbox-close:hover { background: rgba(255,255,255,0.2); }
        .id-lightbox-nav {
          position: absolute; top: 50%; transform: translateY(-50%);
          width: 52px; height: 52px; border-radius: 50%;
          background: rgba(255,255,255,0.1); color: #fff;
          border: none; cursor: pointer; font-size: 26px;
          display: flex; align-items: center; justify-content: center;
          transition: background 0.2s;
        }
        .id-lightbox-nav:hover { background: rgba(255,255,255,0.2); }

        /* ── Responsive ── */
        @media (max-width: 900px) {
          .id-grid { grid-template-columns: 1fr; gap: 32px; padding: 20px 20px 60px; }
          .id-breadcrumb { padding: 16px 20px 0; }
          .id-booking-card { position: static; }
        }
      `}</style>

      <div className="id-page">
        {/* Breadcrumb */}
        <nav className="id-breadcrumb">
          <Link to="/items">Browse</Link>
          <span className="sep">›</span>
          <span>{CATEGORY_LABEL[item.category]?.split(" ").slice(1).join(" ")}</span>
          <span className="sep">›</span>
          <span className="current">{item.title}</span>
        </nav>

        <div className="id-grid">

          {/* ══ LEFT COLUMN ══ */}
          <div>

            {/* Gallery */}
            <div className="fade-up-1" style={{ marginBottom: "32px" }}>
              <div className="id-main-img" onClick={() => item.images.length > 0 && setLightboxOpen(true)}>
                {item.images.length > 0 ? (
                  <>
                    <img src={item.images[activeImg]} alt={item.title} />
                    {item.images.length > 1 && (
                      <>
                        <button className="id-img-nav prev"
                          onClick={(e) => { e.stopPropagation(); setActiveImg((i) => (i - 1 + item.images.length) % item.images.length); }}>
                          ‹
                        </button>
                        <button className="id-img-nav next"
                          onClick={(e) => { e.stopPropagation(); setActiveImg((i) => (i + 1) % item.images.length); }}>
                          ›
                        </button>
                      </>
                    )}
                    <div style={{ position: "absolute", top: 16, left: 16 }}>
                      <span className="id-status" style={{ background: statusConfig.bg, color: statusConfig.color }}>
                        <span className="dot pulse" style={{ background: statusConfig.dot }} />
                        {statusConfig.label}
                      </span>
                    </div>
                    {item.images.length > 1 && (
                      <div style={{ position: "absolute", bottom: 16, right: 16, background: "rgba(15,17,23,0.65)", backdropFilter: "blur(8px)", color: "#fff", fontSize: "12px", fontWeight: 600, padding: "5px 12px", borderRadius: "99px", letterSpacing: "0.04em" }}>
                        {activeImg + 1} / {item.images.length}
                      </div>
                    )}
                    <div style={{ position: "absolute", bottom: 16, left: 16, background: "rgba(15,17,23,0.55)", backdropFilter: "blur(8px)", color: "rgba(255,255,255,0.8)", fontSize: "11px", fontWeight: 500, padding: "5px 12px", borderRadius: "99px", letterSpacing: "0.03em" }}>
                      🔍 Zoom
                    </div>
                  </>
                ) : (
                  <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "12px", color: "var(--ink-4)" }}>
                    <span style={{ fontSize: "64px" }}>📦</span>
                    <span style={{ fontSize: "14px" }}>No photos yet</span>
                  </div>
                )}
              </div>

              {item.images.length > 1 && (
                <div className="id-thumbs">
                  {item.images.map((url, i) => (
                    <button key={i} className={`id-thumb${i === activeImg ? " active" : ""}`} onClick={() => setActiveImg(i)}>
                      <img src={url} alt={`${i + 1}`} />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Title block */}
            <div className="fade-up-2" style={{ marginBottom: "32px" }}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "16px", alignItems: "center" }}>
                <span style={{ fontSize: "13px", background: "var(--surface-3)", color: "var(--ink-3)", padding: "4px 12px", borderRadius: "99px", fontWeight: 500 }}>
                  {CATEGORY_EMOJI[item.category]} {CATEGORY_LABEL[item.category]?.split(" ").slice(1).join(" ")}
                </span>
                <span style={{ fontSize: "13px", background: "var(--surface-3)", color: "var(--ink-3)", padding: "4px 12px", borderRadius: "99px", fontWeight: 500 }}>
                  📍 {item.location}
                </span>
              </div>

              <h1 style={{
                fontFamily: "var(--font-display)", fontWeight: 900,
                fontSize: "clamp(30px, 4vw, 44px)", color: "var(--ink)",
                lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: "14px"
              }}>
                {item.title}
              </h1>

              <p style={{ fontSize: "13px", color: "var(--ink-4)", fontWeight: 500 }}>
                Listed {format(new Date(item.createdAt), "MMMM d, yyyy")}
              </p>
            </div>

            <div className="id-divider" />

            {/* Description */}
            <div className="fade-up-3" style={{ marginBottom: "32px" }}>
              <p className="id-section-title">About this item</p>
              <p style={{ color: "var(--ink-3)", lineHeight: 1.85, fontSize: "15px", whiteSpace: "pre-line", fontWeight: 400 }}>
                {item.description}
              </p>
            </div>

            <div className="id-divider" />

            {/* Item details */}
            <div style={{ marginBottom: "32px" }}>
              <p className="id-section-title">Item details</p>
              <div className="id-details-grid">
                {[
                  { icon: "🏷️", label: "Category", value: CATEGORY_LABEL[item.category]?.split(" ").slice(1).join(" ") },
                  { icon: "📍", label: "Location", value: item.location },
                  { icon: "💵", label: "Price per day", value: `रू${item.pricePerDay.toLocaleString()}` },
                  { icon: "🔒", label: "Security deposit", value: `रू${item.depositAmount.toLocaleString()}` },
                  { icon: "📅", label: "Listed on", value: format(new Date(item.createdAt), "MMM d, yyyy") },
                  { icon: "📦", label: "Status", value: statusConfig.label },
                ].map(({ icon, label, value }) => (
                  <div key={label} className="id-detail-card">
                    <div className="id-detail-icon">{icon}</div>
                    <div>
                      <div className="id-detail-label">{label}</div>
                      <div className="id-detail-value">{value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="id-divider" />

            {/* Trust & Safety */}
            <div style={{ marginBottom: "32px" }}>
              <p className="id-section-title">Trust & safety</p>
              <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius)", overflow: "hidden" }}>
                <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--border)", display: "flex", gap: "12px", alignItems: "center" }}>
                  <span style={{ fontSize: "22px" }}>🛡️</span>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: "15px", color: "var(--ink)", marginBottom: "2px" }}>Protected by Sajilorent</div>
                    <div style={{ fontSize: "12px", color: "var(--ink-4)" }}>Every rental includes our full accountability framework</div>
                  </div>
                </div>
                <div style={{ padding: "0 24px" }}>
                  {[
                    { icon: "💳", title: "Security deposit held", desc: `रू${item.depositAmount.toLocaleString()} is held and only released when the owner confirms the item is returned in good condition.` },
                    { icon: "🪪", title: "ID verification required", desc: "All renters must submit a government-issued ID before they can make any rental request." },
                    { icon: "📸", title: "Photo condition reports", desc: "Item condition is photographed and documented by both parties at pickup and return." },
                    { icon: "⭐", title: "Bilateral rating system", desc: "Both owners and renters are rated after each rental, building long-term reputation." },
                  ].map(({ icon, title, desc }) => (
                    <div key={title} className="id-trust-item">
                      <div className="id-trust-icon">{icon}</div>
                      <div>
                        <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--ink)", marginBottom: "4px" }}>{title}</div>
                        <div style={{ fontSize: "13px", color: "var(--ink-3)", lineHeight: 1.65 }}>{desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="id-divider" />

            {/* Owner */}
            <div className="id-owner-card">
              <p className="id-section-title">Meet the owner</p>
              <div style={{ display: "flex", gap: "18px", alignItems: "center" }}>
                <Avatar name={item.owner.name} url={item.owner.avatarUrl} size={64} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "19px", fontFamily: "var(--font-display)", fontWeight: 700, color: "var(--ink)", marginBottom: "8px" }}>
                    {item.owner.name}
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", alignItems: "center" }}>
                    {item.owner.verificationStatus === "VERIFIED" && (
                      <span style={{ fontSize: "12px", background: "#ECFDF5", color: "#065F46", padding: "3px 10px", borderRadius: "99px", fontWeight: 600 }}>✓ ID Verified</span>
                    )}
                    {item.owner.verificationStatus === "PENDING" && (
                      <span style={{ fontSize: "12px", background: "#EFF6FF", color: "#1D4ED8", padding: "3px 10px", borderRadius: "99px", fontWeight: 600 }}>🔄 Pending</span>
                    )}
                    {item.owner.averageRating > 0 ? (
                      <span style={{ fontSize: "13px", color: "var(--ink-3)", fontWeight: 500 }}>
                        ⭐ <strong style={{ color: "var(--ink-2)" }}>{item.owner.averageRating.toFixed(1)}</strong> rating
                      </span>
                    ) : (
                      <span style={{ fontSize: "12px", background: "var(--surface-3)", color: "var(--ink-4)", padding: "3px 10px", borderRadius: "99px", fontWeight: 600 }}>New owner</span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => navigate(`/users/${item.ownerId}`)}
                  style={{ padding: "10px 18px", border: "1.5px solid var(--border)", borderRadius: "10px", background: "none", cursor: "pointer", fontSize: "13px", fontWeight: 600, color: "var(--ink-2)", fontFamily: "var(--font-body)", transition: "all 0.2s", whiteSpace: "nowrap" }}
                  onMouseEnter={e => { (e.target as HTMLElement).style.borderColor = "var(--accent)"; (e.target as HTMLElement).style.color = "var(--accent)"; }}
                  onMouseLeave={e => { (e.target as HTMLElement).style.borderColor = "var(--border)"; (e.target as HTMLElement).style.color = "var(--ink-2)"; }}
                >
                  View profile →
                </button>
              </div>
            </div>
          </div>

          {/* ══ RIGHT COLUMN — Booking card ══ */}
          <div>
            <div className="id-booking-card fade-up-2">

              {/* Dark price header */}
              <div className="id-price-header">
                <div style={{ fontSize: "12px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: "10px" }}>
                  Rental rate
                </div>
                <div style={{ display: "flex", alignItems: "baseline", gap: "4px", marginBottom: "4px" }}>
                  <span className="id-price-amount">रू{item.pricePerDay.toLocaleString()}</span>
                  <span className="id-price-unit">/ day</span>
                </div>
                <div className="id-deposit-note">
                  <span>🔒</span>
                  <span>+ <strong>रू{item.depositAmount.toLocaleString()}</strong> refundable deposit</span>
                </div>
              </div>

              {/* Weekly / monthly rates */}
              <div className="id-rate-row">
                {[
                  { label: "Per week", value: `रू${(item.pricePerDay * 7).toLocaleString()}` },
                  { label: "Per month", value: `रू${(item.pricePerDay * 30).toLocaleString()}` },
                ].map(({ label, value }) => (
                  <div key={label} className="id-rate-cell">
                    <div className="id-rate-label">{label}</div>
                    <div className="id-rate-value">{value}</div>
                  </div>
                ))}
              </div>

              {/* Owner mini */}
              <div className="id-owner-mini">
                <Avatar name={item.owner.name} url={item.owner.avatarUrl} size={38} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--ink)" }}>{item.owner.name}</div>
                  <div style={{ fontSize: "12px", color: "var(--ink-4)", marginTop: "1px" }}>
                    {item.owner.verificationStatus === "VERIFIED" ? "✅ Verified owner" : "Owner"}
                    {item.owner.averageRating > 0 ? ` · ⭐ ${item.owner.averageRating.toFixed(1)}` : ""}
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="id-cta-area">
                {isOwner ? (
                  <>
                    <button className="id-rent-btn" style={{ background: "var(--surface-3)", color: "var(--ink-2)", boxShadow: "none" }}
                      onClick={() => navigate(`/items/${item.id}/edit`)}>
                      ✏️ Edit Listing
                    </button>
                    <p style={{ fontSize: "12px", color: "var(--ink-4)", textAlign: "center" }}>This is your listing</p>
                  </>
                ) : item.status === "AVAILABLE" ? (
                  <>
                    <button className="id-rent-btn" onClick={() => isLoggedIn ? setBookingOpen(true) : navigate("/login")}>
                      🔑 Request to Rent
                    </button>
                    {!isLoggedIn && (
                      <p style={{ fontSize: "12px", color: "var(--ink-4)", textAlign: "center" }}>
                        <Link to="/login" style={{ color: "var(--accent)", fontWeight: 700 }}>Sign in</Link>
                        {" "}or{" "}
                        <Link to="/register" style={{ color: "var(--accent)", fontWeight: 700 }}>create account</Link>
                        {" "}to rent
                      </p>
                    )}
                    {isLoggedIn && user?.verificationStatus !== "VERIFIED" && (
                      <div style={{ background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: "10px", padding: "12px 14px", fontSize: "12px", color: "#78350F", textAlign: "center", lineHeight: 1.6 }}>
                        ⚠️ <Link to="/profile" style={{ color: "var(--accent)", fontWeight: 700 }}>Verify your ID</Link> to unlock renting
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <button className="id-rent-btn" disabled>🔒 Not Available</button>
                    <p style={{ fontSize: "12px", color: "var(--ink-4)", textAlign: "center" }}>This item is currently unavailable</p>
                  </>
                )}
              </div>

              <div className="id-safety-note">
                <span>🛡️</span>
                <span>No payment until the owner approves your request. Deposit returned on confirmed return.</span>
              </div>
            </div>

            <p style={{ textAlign: "center", marginTop: "14px", fontSize: "12px", color: "var(--ink-4)" }}>
              Something wrong?{" "}
              <span style={{ color: "var(--accent)", cursor: "pointer", fontWeight: 600 }}>Report listing</span>
            </p>
          </div>
        </div>
      </div>

      {/* ══ LIGHTBOX ══ */}
      {lightboxOpen && item.images.length > 0 && (
        <div className="id-lightbox" onClick={() => setLightboxOpen(false)}>
          <button className="id-lightbox-close" onClick={() => setLightboxOpen(false)}>×</button>
          {item.images.length > 1 && (
            <>
              <button className="id-lightbox-nav" style={{ left: 20 }}
                onClick={(e) => { e.stopPropagation(); setActiveImg((i) => (i - 1 + item.images.length) % item.images.length); }}>
                ‹
              </button>
              <button className="id-lightbox-nav" style={{ right: 20 }}
                onClick={(e) => { e.stopPropagation(); setActiveImg((i) => (i + 1) % item.images.length); }}>
                ›
              </button>
            </>
          )}
          <img
            src={item.images[activeImg]}
            alt={item.title}
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: "88vw", maxHeight: "86vh", objectFit: "contain", borderRadius: "12px" }}
          />
          {item.images.length > 1 && (
            <div style={{ position: "absolute", bottom: 24, left: "50%", transform: "translateX(-50%)", display: "flex", gap: "8px" }}>
              {item.images.map((_, i) => (
                <button key={i}
                  onClick={(e) => { e.stopPropagation(); setActiveImg(i); }}
                  style={{ width: i === activeImg ? 22 : 8, height: 8, borderRadius: "99px", background: i === activeImg ? "var(--accent)" : "rgba(255,255,255,0.35)", border: "none", cursor: "pointer", transition: "all 0.25s", padding: 0 }}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* ══ BOOKING MODAL ══ */}
      <Modal open={bookingOpen} onClose={() => setBookingOpen(false)} title="Book this item">
        <div style={{ display: "flex", flexDirection: "column", gap: "20px", fontFamily: "var(--font-body)" }}>

          {/* Item preview */}
          <div style={{ display: "flex", gap: "14px", padding: "14px", background: "var(--surface-2)", borderRadius: "12px", alignItems: "center", border: "1px solid var(--border)" }}>
            <div style={{ width: 64, height: 52, borderRadius: "10px", overflow: "hidden", flexShrink: 0, background: "var(--surface-3)" }}>
              {item.images[0]
                ? <img src={item.images[0]} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px" }}>📦</div>}
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: "15px", color: "var(--ink)", marginBottom: "3px" }}>{item.title}</div>
              <div style={{ fontSize: "13px", color: "var(--ink-4)" }}>📍 {item.location}</div>
            </div>
          </div>

          {/* Date inputs */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
            <div className="id-modal-field">
              <label>Start Date</label>
              <input type="date" className="id-modal-input"
                min={format(new Date(), "yyyy-MM-dd")} value={dates.startDate}
                onChange={(e) => setDates((d) => ({ ...d, startDate: e.target.value }))} />
            </div>
            <div className="id-modal-field">
              <label>End Date</label>
              <input type="date" className="id-modal-input"
                min={dates.startDate || format(new Date(), "yyyy-MM-dd")} value={dates.endDate}
                onChange={(e) => setDates((d) => ({ ...d, endDate: e.target.value }))} />
            </div>
          </div>

          {/* Cost breakdown */}
          {days > 0 ? (
            <div style={{ background: "var(--surface-2)", borderRadius: "12px", padding: "18px 20px", border: "1px solid var(--border)" }}>
              <p style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--ink-4)", marginBottom: "12px" }}>
                Cost breakdown
              </p>
              <div className="id-cost-row">
                <span>{days} day{days > 1 ? "s" : ""} × रू{item.pricePerDay.toLocaleString()}</span>
                <span>रू{rentalTotal.toLocaleString()}</span>
              </div>
              <div className="id-cost-row">
                <span>Refundable deposit</span>
                <span>रू{item.depositAmount.toLocaleString()}</span>
              </div>
              <div className="id-cost-total">
                <span>Total upfront</span>
                <span>रू{(rentalTotal + item.depositAmount).toLocaleString()}</span>
              </div>
              <p style={{ fontSize: "11px", color: "var(--ink-4)", marginTop: "10px", lineHeight: 1.5 }}>
                Deposit of रू{item.depositAmount.toLocaleString()} is returned after the owner confirms a good return.
              </p>
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "18px", background: "var(--surface-2)", borderRadius: "12px", fontSize: "13px", color: "var(--ink-4)", border: "1px dashed var(--border-2)" }}>
              Select dates to see pricing
            </div>
          )}

          <button className="id-rent-btn" style={{ ...((!days) ? { background: "var(--surface-3)", color: "var(--ink-4)", boxShadow: "none", cursor: "not-allowed" } : {}) }}
            disabled={!days || submitting}
            onClick={submitRental}>
            {submitting ? "Sending…" : "🔑 Send Rental Request"}
          </button>

          <p style={{ fontSize: "12px", color: "var(--ink-4)", textAlign: "center" }}>
            No payment taken yet — the owner must approve first.
          </p>
        </div>
      </Modal>
    </>
  );
}