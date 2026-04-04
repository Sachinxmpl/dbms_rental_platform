import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { Avatar } from "../ui/Avatar";
import { Button } from "../ui/Button";
import { useState } from "react";

export function Navbar() {
  const { user, isLoggedIn, clearAuth } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const logout = () => {
    clearAuth();
    navigate("/login");
  };

  return (
    <nav
      style={{
        background: "var(--white)",
        borderBottom: "1px solid var(--border)",
        position: "sticky",
        top: 0,
        zIndex: 100,
        boxShadow: "var(--shadow-sm)",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 24px",
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Logo */}
        <Link
          to="/"
          style={{ display: "flex", alignItems: "center", gap: "8px" }}
        >
          <span style={{ fontSize: "26px" }}>🔑</span>
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "22px",
              fontWeight: 900,
              color: "var(--text-primary)",
            }}
          >
            Sajilo<span style={{ color: "var(--orange)" }}>rent</span>
          </span>
        </Link>

        {/* Nav links */}
        <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
          <Link
            to="/items"
            style={{
              fontSize: "14px",
              fontWeight: 500,
              color: "var(--text-secondary)",
              transition: "color 0.15s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.color = "var(--orange)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = "var(--text-secondary)")
            }
          >
            Browse
          </Link>

          {isLoggedIn ? (
            <>
              <Link
                to="/rentals"
                style={{
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "var(--text-secondary)",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = "var(--orange)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "var(--text-secondary)")
                }
              >
                My Rentals
              </Link>
              <Button size="sm" onClick={() => navigate("/items/new")}>
                + List Item
              </Button>
              <div style={{ position: "relative" }}>
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    borderRadius: "var(--radius-pill)",
                    padding: "4px 8px",
                    border: "1.5px solid var(--border)",
                    background: "var(--white)",
                  }}
                >
                  <Avatar
                    name={user?.name ?? ""}
                    url={user?.avatarUrl}
                    size={30}
                  />
                  <span style={{ fontSize: "13px", fontWeight: 600 }}>
                    {user?.name.split(" ")[0]}
                  </span>
                </button>
                {menuOpen && (
                  <div
                    style={{
                      position: "absolute",
                      right: 0,
                      top: "calc(100% + 8px)",
                      background: "var(--white)",
                      border: "1px solid var(--border)",
                      borderRadius: "var(--radius-card)",
                      boxShadow: "var(--shadow-md)",
                      width: 180,
                      overflow: "hidden",
                    }}
                  >
                    {[
                      { label: "Profile", to: "/profile" },
                      { label: "My Listings", to: "/items?mine=true" },
                    ].map(({ label, to }) => (
                      <Link
                        key={to}
                        to={to}
                        onClick={() => setMenuOpen(false)}
                        style={{
                          display: "block",
                          padding: "12px 16px",
                          fontSize: "14px",
                          color: "var(--text-primary)",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.background = "var(--bg)")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.background = "transparent")
                        }
                      >
                        {label}
                      </Link>
                    ))}
                    <button
                      onClick={logout}
                      style={{
                        display: "block",
                        width: "100%",
                        textAlign: "left",
                        padding: "12px 16px",
                        fontSize: "14px",
                        color: "#DC2626",
                        borderTop: "1px solid var(--border)",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background = "#FEF2F2")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "transparent")
                      }
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div style={{ display: "flex", gap: "12px" }}>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/login")}
              >
                Sign in
              </Button>
              <Button size="sm" onClick={() => navigate("/register")}>
                Join free
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
