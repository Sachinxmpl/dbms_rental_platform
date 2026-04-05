import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    L: any;
  }
}

interface LocationPickerProps {
  value: string;
  onChange: (location: string) => void;
}

const LEAFLET_CSS = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
const LEAFLET_JS = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";

function loadLeaflet(): Promise<void> {
  return new Promise((resolve) => {
    if (window.L) return resolve();

    if (!document.querySelector(`link[href="${LEAFLET_CSS}"]`)) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = LEAFLET_CSS;
      document.head.appendChild(link);
    }

    const script = document.createElement("script");
    script.src = LEAFLET_JS;
    script.onload = () => resolve();
    document.head.appendChild(script);
  });
}

async function reverseGeocode(lat: number, lng: number): Promise<string> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
      { headers: { "Accept-Language": "en" } }
    );

    const data = await res.json();
    const addr = data.address;

    const parts = [
      addr?.neighbourhood || addr?.suburb || addr?.village || addr?.town,
      addr?.city || addr?.county || addr?.state_district,
    ].filter(Boolean);

    return (
      parts.join(", ") ||
      data.display_name?.split(",").slice(0, 2).join(",").trim() ||
      `${lat.toFixed(4)}, ${lng.toFixed(4)}`
    );
  } catch {
    return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  }
}

export function LocationPicker({ value, onChange }: LocationPickerProps) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapInstanceRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const markerRef = useRef<any>(null);

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    if (!open) return;

    let isMounted = true;

    loadLeaflet().then(() => {
      if (!isMounted || !mapRef.current || mapInstanceRef.current) return;

      const L = window.L;

      delete (L.Icon.Default.prototype as { _getIconUrl?: unknown })._getIconUrl;

      L.Icon.Default.mergeOptions({
        iconRetinaUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      const map = L.map(mapRef.current).setView([27.7172, 85.324], 13);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      const orangeIcon = L.divIcon({
        html: `<div style="width:32px;height:32px;background:var(--orange,#FF5500);border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:3px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,0.3)"></div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        className: "",
      });

      map.on(
        "click",
        async (e: { latlng: { lat: number; lng: number } }) => {
          const { lat, lng } = e.latlng;

          if (markerRef.current)
            markerRef.current.setLatLng([lat, lng]);
          else
            markerRef.current = L.marker([lat, lng], {
              icon: orangeIcon,
            }).addTo(map);

          setLoading(true);

          const location = await reverseGeocode(lat, lng);

          setLoading(false);

          if (isMounted) onChange(location);
        }
      );

      mapInstanceRef.current = map;

      setTimeout(() => map.invalidateSize(), 100);
    });

    return () => {
      isMounted = false;

      if (mapInstanceRef.current) {
        mapInstanceRef.current?.remove();
        mapInstanceRef.current = null;
        markerRef.current = null;
      }
    };
  }, [open]);

  const searchLocation = async () => {
    if (!searchQuery.trim() || !mapInstanceRef.current) return;

    setSearching(true);

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          searchQuery + ", Nepal"
        )}&format=json&limit=1`,
        { headers: { "Accept-Language": "en" } }
      );

      const results = await res.json();

      if (results.length > 0) {
        const { lat, lon, display_name } = results[0];

        const L = window.L;

        mapInstanceRef.current.setView(
          [parseFloat(lat), parseFloat(lon)],
          16
        );

        const orangeIcon = L.divIcon({
          html: `<div style="width:32px;height:32px;background:var(--orange,#FF5500);border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:3px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,0.3)"></div>`,
          iconSize: [32, 32],
          iconAnchor: [16, 32],
          className: "",
        });

        if (markerRef.current)
          markerRef.current.setLatLng([
            parseFloat(lat),
            parseFloat(lon),
          ]);
        else
          markerRef.current = L.marker(
            [parseFloat(lat), parseFloat(lon)],
            { icon: orangeIcon }
          ).addTo(mapInstanceRef.current);

        const shortName = display_name
          .split(",")
          .slice(0, 2)
          .join(",")
          .trim();

        onChange(shortName);
      }
    } catch {
      // ignore
    } finally {
      setSearching(false);
    }
  };

  return (
    <>
      <div>
        <label
          style={{
            fontSize: "13px",
            fontWeight: 600,
            display: "block",
            marginBottom: "6px",
          }}
        >
          Location
        </label>

        <div style={{ display: "flex", gap: "10px" }}>
          <div
            style={{
              flex: 1,
              padding: "12px 20px",
              border: "1.5px solid var(--border)",
              borderRadius: "var(--radius-pill)",
              fontSize: "14px",
              background: "var(--white)",
              cursor: "pointer",
              color: value ? "var(--text-primary)" : "#94A3B8",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
            onClick={() => setOpen(true)}
          >
            <span>📍</span>
            <span>{value || "Click to pick on map"}</span>
          </div>

          <button
            onClick={() => setOpen(true)}
            style={{
              padding: "10px 20px",
              background: "var(--orange)",
              color: "#fff",
              border: "none",
              borderRadius: "var(--radius-pill)",
              fontWeight: 600,
              fontSize: "13px",
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            🗺️ Pick on Map
          </button>
        </div>

        {loading && (
          <p
            style={{
              fontSize: "12px",
              color: "var(--text-secondary)",
              marginTop: "6px",
            }}
          >
            Getting location name...
          </p>
        )}
      </div>

      {open && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 2000,
            background: "rgba(30,41,59,0.5)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
        >
          <div
            style={{
              background: "var(--white)",
              borderRadius: "var(--radius-card)",
              width: "100%",
              maxWidth: "700px",
              overflow: "hidden",
              boxShadow: "var(--shadow-lg)",
            }}
          >
            <div
              style={{
                padding: "16px 20px",
                borderBottom: "1px solid var(--border)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <h3 style={{ fontWeight: 700, fontSize: "16px" }}>
                  Pick Location
                </h3>
                <p
                  style={{
                    fontSize: "12px",
                    color: "var(--text-secondary)",
                    marginTop: "2px",
                  }}
                >
                  Click anywhere on the map to set your item's location
                </p>
              </div>

              <button
                onClick={() => setOpen(false)}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  border: "1px solid var(--border)",
                  background: "var(--bg)",
                  cursor: "pointer",
                  fontSize: "16px",
                }}
              >
                ×
              </button>
            </div>

            <div
              style={{
                padding: "12px 16px",
                borderBottom: "1px solid var(--border)",
                display: "flex",
                gap: "8px",
              }}
            >
              <input
                placeholder="Search a place in Nepal..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && searchLocation()
                }
                style={{
                  flex: 1,
                  padding: "10px 16px",
                  border: "1.5px solid var(--border)",
                  borderRadius: "var(--radius-pill)",
                  fontSize: "14px",
                  outline: "none",
                  fontFamily: "var(--font-body)",
                }}
              />

              <button
                onClick={searchLocation}
                disabled={searching}
                style={{
                  padding: "10px 20px",
                  background: "var(--orange)",
                  color: "#fff",
                  border: "none",
                  borderRadius: "var(--radius-pill)",
                  fontWeight: 600,
                  fontSize: "13px",
                  cursor: "pointer",
                  opacity: searching ? 0.7 : 1,
                }}
              >
                {searching ? "..." : "Search"}
              </button>
            </div>

            <div ref={mapRef} style={{ height: "400px", width: "100%" }} />

            <div
              style={{
                padding: "14px 20px",
                borderTop: "1px solid var(--border)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  fontSize: "13px",
                  color: value
                    ? "var(--text-primary)"
                    : "var(--text-secondary)",
                  fontWeight: value ? 600 : 400,
                }}
              >
                {value ? `📍 ${value}` : "No location selected yet"}
              </div>

              <button
                onClick={() => setOpen(false)}
                style={{
                  padding: "10px 24px",
                  background: "var(--orange)",
                  color: "#fff",
                  border: "none",
                  borderRadius: "var(--radius-pill)",
                  fontWeight: 600,
                  fontSize: "14px",
                  cursor: "pointer",
                  opacity: value ? 1 : 0.5,
                }}
                disabled={!value}
              >
                Confirm Location
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}