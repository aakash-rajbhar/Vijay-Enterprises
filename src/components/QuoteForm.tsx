"use client";

import { useMemo, useState } from "react";
import { servicesList } from "@/lib/services";
import { productCategories } from "@/lib/products";
import { site } from "@/lib/site";

type Errors = Partial<Record<"name" | "email" | "need" | "quantity", string>>;

export function QuoteForm({ defaultProduct }: { defaultProduct?: string }) {
  const initialNeed = defaultProduct ? `product:${defaultProduct}` : "";
  const [values, setValues] = useState({
    name: "",
    company: "",
    email: "",
    need: initialNeed,
    material: "",
    quantity: "",
    message: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);

  const needLabel = useMemo(() => {
    if (values.need.startsWith("service:")) {
      return values.need.replace("service:", "");
    }
    if (values.need.startsWith("product:")) {
      const slug = values.need.replace("product:", "");
      return productCategories.find((p) => p.slug === slug)?.name ?? slug;
    }
    return values.need;
  }, [values.need]);

  const set = (key: keyof typeof values) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setValues((v) => ({ ...v, [key]: e.target.value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const next: Errors = {};
    if (!values.name.trim()) next.name = "Enter your name.";
    if (!values.email.trim()) next.email = "Enter your email address.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) next.email = "Enter a valid email address.";
    if (!values.need) next.need = "Choose what you need.";
    if (!values.quantity.trim()) next.quantity = "Enter a quantity.";

    setErrors(next);
    if (Object.keys(next).length > 0) {
      const first = Object.keys(next)[0];
      document.getElementById(`field-${first}`)?.focus();
      return;
    }

    const subject = `Quote request — ${needLabel} — Vijay Enterprises`;
    const body = [
      `Name: ${values.name}`,
      `Company: ${values.company || "—"}`,
      `Email: ${values.email}`,
      `What you need: ${needLabel}`,
      `Material and thickness: ${values.material || "—"}`,
      `Quantity: ${values.quantity}`,
      `Message: ${values.message || "—"}`,
      "",
      "Please attach your drawing or sketch (DXF, DWG, PDF, STEP or photo).",
    ].join("\n");

    const href = `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = href;
    setSubmitted(true);
  };

  if (submitted) {
    const subject = `Quote request — ${needLabel} — Vijay Enterprises`;
    const body = [
      `Name: ${values.name}`,
      `Company: ${values.company || "—"}`,
      `Email: ${values.email}`,
      `What you need: ${needLabel}`,
      `Material and thickness: ${values.material || "—"}`,
      `Quantity: ${values.quantity}`,
      `Message: ${values.message || "—"}`,
      "",
      "Please attach your drawing or sketch (DXF, DWG, PDF, STEP or photo).",
    ].join("\n");
    const href = `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    return (
      <div className="rounded-[var(--radius-card)] border border-steel-200 bg-white p-6 md:p-8" role="status" aria-live="polite">
        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-spark">Email ready</p>
        <h2 className="mt-4 font-display text-3xl leading-tight">Your email app should open.</h2>
        <p className="mt-4 max-w-[48ch] text-sm text-steel-500">
          If it did not open, use the button below. Attach the drawing to the email before sending.
        </p>
        <a
          href={href}
          className="mt-6 inline-flex items-center gap-3 rounded-pill bg-spark px-5 py-3 text-sm text-white transition-colors hover:bg-spark-deep"
        >
          Open the email again
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
            <path d="M1 9L9 1M9 1H1M9 1V9" stroke="currentColor" strokeWidth="1.2" />
          </svg>
        </a>
        <button
          type="button"
          onClick={() => setSubmitted(false)}
          className="mt-4 block text-sm text-steel-500 underline underline-offset-4 hover:text-ink"
        >
          Edit the details
        </button>
      </div>
    );
  }

  const inputBase =
    "h-14 w-full rounded-[14px] border bg-white px-4 text-sm text-ink outline-none transition-shadow placeholder:text-steel-500 focus:ring-2 focus:ring-spark focus:ring-offset-2";
  const labelBase = "mb-2 block text-[0.8125rem] text-ink";

  return (
    <form onSubmit={onSubmit} noValidate className="rounded-[var(--radius-card)] border border-steel-200 bg-white p-6 md:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={labelBase} htmlFor="field-name">
            Name
          </label>
          <input
            id="field-name"
            value={values.name}
            onChange={set("name")}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "error-name" : undefined}
            className={`${inputBase} ${errors.name ? "border-spark" : "border-steel-200"}`}
            placeholder="Your name"
            autoComplete="name"
          />
          {errors.name && <p id="error-name" className="mt-2 text-xs text-spark-deep">{errors.name}</p>}
        </div>
        <div>
          <label className={labelBase} htmlFor="field-company">
            Company <span className="text-steel-500">(optional)</span>
          </label>
          <input
            id="field-company"
            value={values.company}
            onChange={set("company")}
            className={`${inputBase} border-steel-200`}
            placeholder="Company name"
            autoComplete="organization"
          />
        </div>
        <div className="sm:col-span-2">
          <label className={labelBase} htmlFor="field-email">
            Email
          </label>
          <input
            id="field-email"
            type="email"
            value={values.email}
            onChange={set("email")}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "error-email" : undefined}
            className={`${inputBase} ${errors.email ? "border-spark" : "border-steel-200"}`}
            placeholder="you@company.com"
            autoComplete="email"
          />
          {errors.email && <p id="error-email" className="mt-2 text-xs text-spark-deep">{errors.email}</p>}
        </div>
        <div className="sm:col-span-2">
          <label className={labelBase} htmlFor="field-need">
            What you need
          </label>
          <div className="relative">
            <select
              id="field-need"
              value={values.need}
              onChange={set("need")}
              aria-invalid={Boolean(errors.need)}
              aria-describedby={errors.need ? "error-need" : undefined}
              className={`${inputBase} appearance-none pr-12 ${errors.need ? "border-spark" : "border-steel-200"}`}
            >
              <option value="">Choose a service or product</option>
              <optgroup label="Services">
                {servicesList.map((s) => (
                  <option key={s.number} value={`service:${s.title}`}>
                    {s.title}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Products">
                {productCategories.map((p) => (
                  <option key={p.slug} value={`product:${p.slug}`}>
                    {p.name}
                  </option>
                ))}
              </optgroup>
            </select>
            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-steel-500" aria-hidden="true">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.2" />
              </svg>
            </span>
          </div>
          {errors.need && <p id="error-need" className="mt-2 text-xs text-spark-deep">{errors.need}</p>}
        </div>
        <div>
          <label className={labelBase} htmlFor="field-material">
            Material and thickness <span className="text-steel-500">(optional)</span>
          </label>
          <input
            id="field-material"
            value={values.material}
            onChange={set("material")}
            className={`${inputBase} border-steel-200`}
            placeholder="e.g. MS, 3 mm"
          />
        </div>
        <div>
          <label className={labelBase} htmlFor="field-quantity">
            Quantity
          </label>
          <input
            id="field-quantity"
            value={values.quantity}
            onChange={set("quantity")}
            aria-invalid={Boolean(errors.quantity)}
            aria-describedby={errors.quantity ? "error-quantity" : undefined}
            className={`${inputBase} ${errors.quantity ? "border-spark" : "border-steel-200"}`}
            placeholder="e.g. 25 pieces"
          />
          {errors.quantity && <p id="error-quantity" className="mt-2 text-xs text-spark-deep">{errors.quantity}</p>}
        </div>
        <div className="sm:col-span-2">
          <label className={labelBase} htmlFor="field-message">
            Message <span className="text-steel-500">(optional)</span>
          </label>
          <textarea
            id="field-message"
            value={values.message}
            onChange={set("message")}
            rows={4}
            className="w-full rounded-[14px] border border-steel-200 bg-white px-4 py-3 text-sm text-ink outline-none transition-shadow placeholder:text-steel-500 focus:ring-2 focus:ring-spark focus:ring-offset-2"
            placeholder="What the part has to do, finish, deadline, delivery location in Delhi NCR"
          />
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-[34ch] text-xs text-steel-500">
          This opens your email app. Attach the drawing to the email before sending.
        </p>
        <button
          type="submit"
          className="inline-flex h-12 items-center justify-center gap-3 rounded-pill bg-spark px-6 text-sm text-white transition-colors hover:bg-spark-deep"
        >
          Send enquiry
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-ink/15">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
              <path d="M1 9L9 1M9 1H1M9 1V9" stroke="currentColor" strokeWidth="1.2" />
            </svg>
          </span>
        </button>
      </div>
    </form>
  );
}
