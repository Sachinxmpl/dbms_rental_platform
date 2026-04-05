import { useRef, useState } from "react";
import { api } from "../../api/client";

interface ImageUploadProps {
  value: string[];
  onChange: (urls: string[]) => void;
  maxImages?: number;
}

export function ImageUpload({ value, onChange, maxImages = 5 }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);

  const upload = async (files: File[]) => {
    if (!files.length) return;
    const canAdd = maxImages - value.length;
    if (canAdd <= 0) return;
    const toUpload = files.slice(0, canAdd);

    setUploading(true);
    setError("");
    try {
      const formData = new FormData();
      toUpload.forEach((f) => formData.append("images", f));
      const res = await api.post("/uploads/images", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      onChange([...value, ...res.data.urls]);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.response?.data?.message ?? "Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) upload(Array.from(e.target.files));
    e.target.value = ""; // reset so same file can be re-selected
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith("image/"));
    upload(files);
  };

  const remove = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const move = (from: number, to: number) => {
    const arr = [...value];
    [arr[from], arr[to]] = [arr[to], arr[from]];
    onChange(arr);
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
        <label style={{ fontSize: "13px", fontWeight: 600 }}>
          Item Photos
        </label>
        <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
          {value.length}/{maxImages} · First photo is cover
        </span>
      </div>

      {/* Preview grid */}
      {value.length > 0 && (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))",
          gap: "10px",
          marginBottom: "12px",
        }}>
          {value.map((url, i) => (
            <div key={url + i} style={{ position: "relative", borderRadius: "12px", overflow: "hidden", aspectRatio: "1/1", border: i === 0 ? "2px solid var(--orange)" : "1.5px solid var(--border)", background: "#F1F1F1" }}>
              <img
                src={url}
                alt={`photo ${i + 1}`}
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />

              {/* Cover badge */}
              {i === 0 && (
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "var(--orange)", color: "#fff", fontSize: "10px", fontWeight: 700, textAlign: "center", padding: "3px 0", letterSpacing: "0.5px" }}>
                  COVER
                </div>
              )}

              {/* Action buttons */}
              <div style={{ position: "absolute", top: 4, right: 4, display: "flex", gap: "4px" }}>
                {/* Move left (make cover) */}
                {i > 0 && (
                  <button
                    onClick={() => move(i, i - 1)}
                    title="Move left"
                    style={{ width: 22, height: 22, borderRadius: "50%", background: "rgba(0,0,0,0.55)", color: "#fff", border: "none", fontSize: "11px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    ←
                  </button>
                )}
                {/* Remove */}
                <button
                  onClick={() => remove(i)}
                  title="Remove"
                  style={{ width: 22, height: 22, borderRadius: "50%", background: "rgba(0,0,0,0.55)", color: "#fff", border: "none", fontSize: "14px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", lineHeight: 1 }}>
                  ×
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Drop zone */}
      {value.length < maxImages && (
        <div
          onClick={() => !uploading && inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          style={{
            border: `2px dashed ${dragOver ? "var(--orange)" : "var(--border)"}`,
            borderRadius: "16px",
            padding: "28px 20px",
            textAlign: "center",
            cursor: uploading ? "default" : "pointer",
            background: dragOver ? "#FFF5F0" : "var(--white)",
            transition: "all 0.15s",
          }}>
          {uploading ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
              <div style={{ width: 28, height: 28, border: "3px solid var(--border)", borderTopColor: "var(--orange)", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
              <span style={{ fontSize: "13px", color: "var(--text-secondary)" }}>Uploading photos...</span>
            </div>
          ) : (
            <>
              <div style={{ fontSize: "32px", marginBottom: "8px" }}>📷</div>
              <p style={{ fontWeight: 600, fontSize: "14px", color: "var(--text-primary)", marginBottom: "4px" }}>
                Click or drag photos here
              </p>
              <p style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                JPG, PNG, WebP · Max 5MB · Up to {maxImages - value.length} more
              </p>
            </>
          )}
        </div>
      )}

      {error && (
        <p style={{ fontSize: "12px", color: "#DC2626", marginTop: "6px", display: "flex", alignItems: "center", gap: "4px" }}>
          ⚠️ {error}
        </p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        style={{ display: "none" }}
        onChange={handleInputChange}
      />
    </div>
  );
}