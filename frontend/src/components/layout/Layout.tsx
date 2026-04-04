import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";
import { useToastState, registerToastSetter } from "../../hooks/useToast";
import { useEffect } from "react";

export function Layout() {
  const { toasts, add } = useToastState();
  useEffect(() => {
    registerToastSetter(add);
  }, [add]);

  const toastColors: Record<string, { bg: string; color: string }> = {
    success: { bg: "#DCFCE7", color: "#15803D" },
    error: { bg: "#FEE2E2", color: "#DC2626" },
    info: { bg: "#E0F2FE", color: "#0369A1" },
  };

  return (
    <>
      <Navbar />
      <main style={{ minHeight: "calc(100vh - 64px)" }}>
        <Outlet />
      </main>
      <div id="toast-root">
        {toasts.map((t) => (
          <div
            key={t.id}
            style={{
              padding: "12px 20px",
              borderRadius: "var(--radius-pill)",
              boxShadow: "var(--shadow-md)",
              fontSize: "14px",
              fontWeight: 500,
              animation: "slideUp 0.3s ease",
              ...toastColors[t.type],
            }}
          >
            {t.message}
          </div>
        ))}
      </div>
      <style>{`
        @keyframes slideUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </>
  );
}
