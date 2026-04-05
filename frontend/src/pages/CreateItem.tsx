import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { itemsApi } from "../api/client";
import { Button } from "../components/ui/Button";
import { Input, TextArea } from "../components/ui/Input";
import { Card } from "../components/ui/Card";
import { ImageUpload } from "../components/ui/ImageUpload";
import { LocationPicker } from "../components/ui/LocationPicker";
import { toast } from "../hooks/useToast";
import axios from "axios";

const CATEGORIES = [
  "ELECTRONICS",
  "MUSICAL_INSTRUMENTS",
  "VEHICLES",
  "SPORTS_EQUIPMENT",
  "TOOLS",
  "CLOTHING",
  "OTHER",
];

export default function CreateItem() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "ELECTRONICS",
    pricePerDay: "",
    depositAmount: "",
  });
  const [location, setLocation] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set =
    (k: keyof typeof form) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.title || form.title.length < 3) e.title = "At least 3 characters";
    if (!form.description || form.description.length < 10)
      e.description = "At least 10 characters";
    if (!form.pricePerDay || Number(form.pricePerDay) <= 0)
      e.pricePerDay = "Enter a valid price";
    if (!form.depositAmount || Number(form.depositAmount) <= 0)
      e.depositAmount = "Enter a valid deposit";
    if (!location) e.location = "Please pick a location on the map";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const item = await itemsApi.create({
        ...form,
        pricePerDay: Number(form.pricePerDay),
        depositAmount: Number(form.depositAmount),
        location,
        images,
      });
      toast("Item listed successfully!", "success");
      navigate(`/items/${item.id}`);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        toast(
          err.response?.data?.message ?? "Failed to create listing",
          "error",
        );
      } else {
        toast("Something went wrong ");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 680, margin: "0 auto", padding: "40px 24px" }}>
      <h1
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "36px",
          fontWeight: 900,
          marginBottom: "8px",
        }}
      >
        List an Item
      </h1>
      <p style={{ color: "var(--text-secondary)", marginBottom: "32px" }}>
        Turn your idle items into income.
      </p>

      <Card>
        <form
          onSubmit={submit}
          style={{ display: "flex", flexDirection: "column", gap: "24px" }}
        >
          <Input
            label="Title"
            required
            value={form.title}
            onChange={set("title")}
            placeholder="e.g. Yamaha Acoustic Guitar"
            error={errors.title}
          />

          <TextArea
            label="Description"
            required
            value={form.description}
            onChange={set("description")}
            placeholder="Describe condition, accessories, usage rules..."
            error={errors.description}
          />

          <div>
            <label
              style={{
                fontSize: "13px",
                fontWeight: 600,
                display: "block",
                marginBottom: "6px",
              }}
            >
              Category
            </label>
            <select
              value={form.category}
              onChange={set("category")}
              style={{
                width: "100%",
                padding: "12px 20px",
                border: "1.5px solid var(--border)",
                borderRadius: "var(--radius-pill)",
                fontSize: "14px",
                background: "var(--white)",
                fontFamily: "var(--font-body)",
                outline: "none",
              }}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c.replace(/_/g, " ")}
                </option>
              ))}
            </select>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "16px",
            }}
          >
            <Input
              label="Price per day (रू)"
              type="number"
              required
              value={form.pricePerDay}
              onChange={set("pricePerDay")}
              placeholder="200"
              error={errors.pricePerDay}
            />
            <Input
              label="Security Deposit (रू)"
              type="number"
              required
              value={form.depositAmount}
              onChange={set("depositAmount")}
              placeholder="2000"
              hint="Held until item is returned"
              error={errors.depositAmount}
            />
          </div>

          {/* Map location picker */}
          <div>
            <LocationPicker value={location} onChange={setLocation} />
            {errors.location && (
              <p
                style={{ fontSize: "12px", color: "#DC2626", marginTop: "4px" }}
              >
                {errors.location}
              </p>
            )}
          </div>

          {/* Image uploader */}
          <ImageUpload value={images} onChange={setImages} maxImages={5} />

          <div
            style={{
              background: "#FFFBF0",
              border: "1px solid #FDE68A",
              borderRadius: "var(--radius-sm)",
              padding: "14px 16px",
              fontSize: "13px",
              color: "#92400E",
            }}
          >
            💡 Tip: Set a deposit higher than potential damage risk. This
            protects you if the item isn't returned or is damaged.
          </div>

          <Button type="submit" fullWidth size="lg" loading={loading}>
            Publish Listing
          </Button>
        </form>
      </Card>
    </div>
  );
}
