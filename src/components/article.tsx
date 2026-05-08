import type { ReactNode } from "react";
import { Link } from "react-router";

export function ArticleLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-[720px] px-6 pb-24 pt-10">{children}</div>
    </div>
  );
}

export function BackLink({
  to = "/",
  label = "← Home",
}: {
  to?: string;
  label?: string;
}) {
  return (
    <nav className="mb-12">
      <Link
        to={to}
        className="font-sans text-sm text-ink-muted transition-colors hover:text-ink-strong"
      >
        {label}
      </Link>
    </nav>
  );
}

export function ArticleHeader({
  label,
  title,
  subtitle,
  byline,
}: {
  label: string;
  title: string;
  subtitle?: string;
  byline?: { author: string; meta: string };
}) {
  return (
    <header className="mb-12">
      <p className="mb-4 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-ink-faint">
        {label}
      </p>
      <h1 className="mb-6 font-sans text-4xl font-extrabold leading-[1.12] tracking-tight text-ink-strong md:text-5xl">
        {title}
      </h1>
      {subtitle && (
        <p className="mb-8 text-lg leading-relaxed text-ink-muted md:text-xl">
          {subtitle}
        </p>
      )}
      {byline && (
        <div className="border-y border-rule py-5 font-sans">
          <p className="text-base font-medium text-ink-strong">
            {byline.author}
          </p>
          <p className="mt-1 text-sm text-ink-muted">{byline.meta}</p>
        </div>
      )}
    </header>
  );
}

export function ArticleFooter({
  to = "/",
  label = "← Back to home",
}: {
  to?: string;
  label?: string;
}) {
  return (
    <footer className="mt-20 border-t border-rule pt-8">
      <Link
        to={to}
        className="font-sans text-sm text-ink-muted transition-colors hover:text-ink-strong"
      >
        {label}
      </Link>
    </footer>
  );
}

export function Section({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="mt-14 first:mt-0">
      <h2 className="mb-6 font-sans text-3xl font-bold leading-tight tracking-tight text-ink-strong md:text-[2rem]">
        {title}
      </h2>
      {children}
    </section>
  );
}

export function Subsection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="mt-10 first:mt-0">
      <h3 className="mb-5 font-sans text-xl font-semibold leading-snug tracking-tight text-ink-strong md:text-2xl">
        {title}
      </h3>
      {children}
    </div>
  );
}

export function P({ children }: { children: ReactNode }) {
  return (
    <p className="mb-7 text-[1.125rem] leading-[1.7] text-ink md:text-[1.1875rem]">
      {children}
    </p>
  );
}

export function Divider() {
  return (
    <div
      aria-hidden
      className="my-16 text-center font-sans text-2xl tracking-[0.5em] text-ink-faint"
    >
      · · ·
    </div>
  );
}

export function Figure({
  src,
  alt,
  index,
  caption,
}: {
  src: string;
  alt: string;
  index?: number;
  caption?: string;
}) {
  const text = caption ?? alt;
  return (
    <figure className="my-10">
      <img
        src={src}
        alt={alt}
        className="w-full rounded-sm border border-rule"
      />
      <figcaption className="mt-3 text-center font-sans text-sm leading-relaxed text-ink-faint">
        {index !== undefined && (
          <>
            <span className="font-medium text-ink-muted">
              Figure {index}.
            </span>{" "}
          </>
        )}
        {text}
      </figcaption>
    </figure>
  );
}

export function Code({ children }: { children: ReactNode }) {
  return (
    <code className="rounded-md bg-[#f3f2ee] px-1.5 py-0.5 font-mono text-[0.88em] text-ink-strong">
      {children}
    </code>
  );
}

export function CodeBlock({
  children,
  label,
}: {
  children: string;
  label?: string;
}) {
  return (
    <div className="my-8 overflow-hidden rounded-xl border border-rule bg-[#fafaf8] shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
      {label && (
        <div className="border-b border-rule bg-white/70 px-5 py-2.5 font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-faint">
          {label}
        </div>
      )}
      <pre className="overflow-x-auto px-5 py-4 font-mono text-[13px] leading-[1.6] text-ink">
        {children}
      </pre>
    </div>
  );
}

export function List({
  items,
  ordered = false,
}: {
  items: ReactNode[];
  ordered?: boolean;
}) {
  const className = `mb-7 space-y-3 pl-6 text-[1.125rem] leading-[1.7] text-ink md:text-[1.1875rem] ${
    ordered ? "list-decimal" : "list-disc"
  }`;
  if (ordered) {
    return (
      <ol className={className}>
        {items.map((item, i) => (
          <li key={i} className="pl-1">
            {item}
          </li>
        ))}
      </ol>
    );
  }
  return (
    <ul className={className}>
      {items.map((item, i) => (
        <li key={i} className="pl-1">
          {item}
        </li>
      ))}
    </ul>
  );
}

export function Table({
  columns,
  rows,
  caption,
}: {
  columns: ReactNode[];
  rows: ReactNode[][];
  caption?: string;
}) {
  return (
    <figure className="my-10">
      <div className="overflow-x-auto rounded-xl border border-rule">
        <table className="w-full border-collapse font-sans text-sm">
          <thead>
            <tr className="bg-[#fafaf8]">
              {columns.map((col, i) => (
                <th
                  key={i}
                  className="border-b border-rule px-4 py-3 text-left font-semibold text-ink-strong"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rIdx) => (
              <tr
                key={rIdx}
                className="border-b border-rule last:border-b-0 even:bg-[#fcfcfa]"
              >
                {row.map((cell, cIdx) => (
                  <td
                    key={cIdx}
                    className="px-4 py-3 align-top text-ink first:font-medium first:text-ink-strong"
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {caption && (
        <figcaption className="mt-3 text-center font-sans text-sm leading-relaxed text-ink-faint">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

export function Pass() {
  return (
    <span className="inline-flex items-center gap-1.5 font-sans text-sm font-medium text-accent">
      <span
        aria-hidden
        className="inline-block h-1.5 w-1.5 rounded-full bg-accent"
      />
      passed
    </span>
  );
}
