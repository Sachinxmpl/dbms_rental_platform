interface AvatarProps {
  name: string;
  url?: string;
  size?: number;
}

export function Avatar({ name, url, size = 40 }: AvatarProps) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return url ? (
    <img
      src={url}
      alt={name}
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        objectFit: "cover",
      }}
    />
  ) : (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: "var(--orange)",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: size * 0.35,
        fontWeight: 700,
      }}
    >
      {initials}
    </div>
  );
}
