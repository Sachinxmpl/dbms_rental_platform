import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { useState } from "react";

const CATEGORIES = [
  { emoji: "💻", label: "Electronics", value: "ELECTRONICS" },
  { emoji: "🎸", label: "Instruments", value: "MUSICAL_INSTRUMENTS" },
  { emoji: "🚗", label: "Vehicles", value: "VEHICLES" },
  { emoji: "⚽", label: "Sports", value: "SPORTS_EQUIPMENT" },
  { emoji: "🔧", label: "Tools", value: "TOOLS" },
  { emoji: "👕", label: "Clothing", value: "CLOTHING" },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    icon: "🔍",
    title: "Browse Listings",
    desc: "Find what you need from local owners in your area.",
  },
  {
    step: "02",
    icon: "📝",
    title: "Request & Deposit",
    desc: "Book your dates. A refundable deposit secures accountability.",
  },
  {
    step: "03",
    icon: "🤝",
    title: "Handover with Photo Proof",
    desc: "Condition documented by both sides at pickup and return.",
  },
  {
    step: "04",
    icon: "⭐",
    title: "Rate & Build Trust",
    desc: "Ratings build reputation, making the platform safer for all.",
  },
];

export default function Home() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  return (
    <div>
      {/* Hero */}
      <section
        style={{
          background: "linear-gradient(160deg, #FCFBF8 0%, #FFF0E6 100%)",
          padding: "80px 24px 100px",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <div
            style={{
              display: "inline-block",
              background: "#FFF0E8",
              color: "var(--orange)",
              padding: "6px 18px",
              borderRadius: "var(--radius-pill)",
              fontSize: "13px",
              fontWeight: 600,
              marginBottom: "24px",
            }}
          >
            🇳🇵 Nepal's Peer-to-Peer Rental Platform
          </div>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(42px, 7vw, 72px)",
              fontWeight: 900,
              lineHeight: 1.1,
              color: "var(--text-primary)",
              marginBottom: "20px",
            }}
          >
            Rent anything.
            <br />
            <span style={{ color: "var(--orange)" }}>Own less.</span> Do more.
          </h1>
          <p
            style={{
              fontSize: "18px",
              color: "var(--text-secondary)",
              lineHeight: 1.7,
              maxWidth: 520,
              margin: "0 auto 40px",
            }}
          >
            Borrow musical instruments, cameras, vehicles, and more from
            verified neighbors — or earn income from things you rarely use.
          </p>

          {/* Search */}
          <div
            style={{
              display: "flex",
              maxWidth: 560,
              margin: "0 auto",
              background: "var(--white)",
              borderRadius: "var(--radius-pill)",
              boxShadow: "var(--shadow-lg)",
              padding: "6px 6px 6px 24px",
              border: "1px solid var(--border)",
            }}
          >
            <input
              placeholder="What do you want to rent? e.g. guitar, camera..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && navigate(`/items?q=${search}`)
              }
              style={{
                flex: 1,
                border: "none",
                outline: "none",
                fontSize: "15px",
                background: "transparent",
                color: "var(--text-primary)",
              }}
            />
            <Button onClick={() => navigate(`/items?q=${search}`)}>
              Search
            </Button>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section
        style={{ maxWidth: 1100, margin: "0 auto", padding: "60px 24px" }}
      >
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "32px",
            fontWeight: 700,
            marginBottom: "32px",
            textAlign: "center",
          }}
        >
          Browse by Category
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
            gap: "16px",
          }}
        >
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.value}
              to={`/items?category=${cat.value}`}
              style={{ textDecoration: "none" }}
            >
              <div
                style={{
                  background: "var(--white)",
                  borderRadius: "var(--radius-card)",
                  padding: "28px 20px",
                  textAlign: "center",
                  border: "1px solid var(--border)",
                  boxShadow: "var(--shadow-sm)",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.borderColor = "var(--orange)";
                  e.currentTarget.style.boxShadow = "var(--shadow-md)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.borderColor = "var(--border)";
                  e.currentTarget.style.boxShadow = "var(--shadow-sm)";
                }}
              >
                <div style={{ fontSize: "40px", marginBottom: "10px" }}>
                  {cat.emoji}
                </div>
                <div
                  style={{
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "var(--text-primary)",
                  }}
                >
                  {cat.label}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section
        style={{ background: "var(--text-primary)", padding: "80px 24px" }}
      >
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "36px",
              fontWeight: 700,
              color: "var(--white)",
              textAlign: "center",
              marginBottom: "12px",
            }}
          >
            How Sajilorent works
          </h2>
          <p
            style={{
              color: "#94A3B8",
              textAlign: "center",
              marginBottom: "52px",
              fontSize: "16px",
            }}
          >
            Designed for trust in every step.
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "24px",
            }}
          >
            {HOW_IT_WORKS.map((step) => (
              <div
                key={step.step}
                style={{
                  background: "rgba(255,255,255,0.05)",
                  borderRadius: "var(--radius-card)",
                  padding: "28px 24px",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "40px",
                    color: "var(--orange)",
                    opacity: 0.3,
                    fontWeight: 900,
                    marginBottom: "4px",
                  }}
                >
                  {step.step}
                </div>
                <div style={{ fontSize: "36px", marginBottom: "12px" }}>
                  {step.icon}
                </div>
                <h3
                  style={{
                    color: "var(--white)",
                    fontSize: "17px",
                    fontWeight: 700,
                    marginBottom: "8px",
                  }}
                >
                  {step.title}
                </h3>
                <p
                  style={{
                    color: "#94A3B8",
                    fontSize: "14px",
                    lineHeight: 1.6,
                  }}
                >
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Banner */}
      <section
        style={{
          background: "linear-gradient(135deg, var(--orange) 0%, #FF8C42 100%)",
          padding: "60px 24px",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "36px",
              color: "#fff",
              fontWeight: 900,
              marginBottom: "16px",
            }}
          >
            What if they don't return it?
          </h2>
          <p
            style={{
              color: "rgba(255,255,255,0.9)",
              fontSize: "16px",
              lineHeight: 1.7,
              marginBottom: "32px",
            }}
          >
            Every rental requires a <strong>refundable security deposit</strong>{" "}
            held until the owner confirms return. ID verification, photo
            condition reports, and a rating system create accountability at
            every step.
          </p>
          <Button
            variant="ghost"
            size="lg"
            onClick={() => navigate("/register")}
          >
            Start renting safely →
          </Button>
        </div>
      </section>
    </div>
  );
}
