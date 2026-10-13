import { useEffect, useState } from "react";
import { SITE } from "../lib/config.js";
import Mark from "./Mark.jsx";

const DAYS = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
const pad = (n) => String(n).padStart(2, "0");

function clinicNow() {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: SITE.timeZone,
    weekday: "short",
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  }).formatToParts(new Date());
  const get = (type) => parts.find((p) => p.type === type)?.value;
  return { day: DAYS[get("weekday")] ?? 0, minutes: (Number(get("hour")) % 24) * 60 + Number(get("minute")) };
}

function useOpenStatus(q) {
  const [, tick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => tick((n) => n + 1), 60000);
    return () => clearInterval(id);
  }, []);

  const { day, minutes } = clinicNow();
  const today = SITE.schedule[day];
  if (!today) {
    return { open: false, text: q.dayOff };
  }
  const [from, to] = today;
  if (minutes >= from * 60 && minutes < to * 60) return { open: true, text: q.closesAt(`${pad(to)}:00`) };
  if (minutes < from * 60) return { open: false, text: q.opensAt(`${pad(from)}:00`) };
  // after closing: find the next working day
  for (let i = 1; i <= 7; i += 1) {
    const next = SITE.schedule[(day + i) % 7];
    if (next) return { open: false, text: q.opensAt(`${pad(next[0])}:00`) };
  }
  return { open: false, text: "" };
}

const Icon = ({ d, children }) => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {d ? <path d={d} /> : children}
  </svg>
);

export function QuickInfo({ t, x, phones, mapUrl }) {
  const q = x.quick;
  const status = useOpenStatus(q);
  return (
    <section className="em-quick" aria-label="Elite Med">
      <ul className="em-wrap em-quick-in">
        <li>
          <span className="em-quick-ico"><Icon><path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21z" /><circle cx="12" cy="9.5" r="2.5" /></Icon></span>
          <div>
            <small>{q.address}</small>
            <a href={mapUrl} target="_blank" rel="noreferrer">{t.address}</a>
          </div>
        </li>
        <li>
          <span className="em-quick-ico"><Icon><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></Icon></span>
          <div>
            <small>{q.hours}</small>
            <strong>{t.hours[0]}</strong>
            <span className={"em-open" + (status.open ? " is-open" : "")}>
              <i aria-hidden="true" />
              {status.open ? q.openNow : q.closedNow}
              {status.text ? ` · ${status.text}` : ""}
            </span>
          </div>
        </li>
        <li>
          <span className="em-quick-ico"><Icon d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" /></span>
          <div>
            <small>{q.phone}</small>
            {phones.map((p) => (
              <a key={p.tel} href={`tel:${p.tel}`}>{p.label}</a>
            ))}
          </div>
        </li>
      </ul>
    </section>
  );
}

export function CtaBanner({ x, t, onBook, phone }) {
  return (
    <section className="em-sec em-cta-band">
      <div className="em-wrap em-cta-band-in">
        <div>
          <h2>{x.cta.title}</h2>
          <p>{x.cta.text}</p>
        </div>
        <div className="em-actions">
          <button className="em-btn em-btn-light" onClick={() => onBook({})}>{t.book}</button>
          <a className="em-btn em-btn-line" href={`tel:${phone.tel}`}>{phone.label}</a>
        </div>
      </div>
    </section>
  );
}

export function Gallery({ x, lang }) {
  const [view, setView] = useState(null);
  useEffect(() => {
    if (view === null) return undefined;
    const onKey = (e) => e.key === "Escape" && setView(null);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [view]);
  if (!SITE.gallery.length) return null;
  return (
    <section className="em-sec" id="gallery">
      <div className="em-wrap">
        <h2>{x.gallery.title}</h2>
        <p className="em-sub">{x.gallery.hint}</p>
        <ul className="em-gal">
          {SITE.gallery.map((g, i) => (
            <li key={g.src}>
              <button type="button" onClick={() => setView(i)} aria-label={g.alt?.[lang] || ""}>
                <img src={g.src} alt={g.alt?.[lang] || ""} loading="lazy" />
              </button>
            </li>
          ))}
        </ul>
      </div>
      {view !== null && (
        <div className="em-lightbox" role="dialog" aria-modal="true" onClick={() => setView(null)}>
          <img src={SITE.gallery[view].src} alt={SITE.gallery[view].alt?.[lang] || ""} />
        </div>
      )}
    </section>
  );
}

export function MapBlock({ x, mapUrl }) {
  if (!SITE.mapEmbed) return null;
  return (
    <section className="em-sec em-map" id="map">
      <div className="em-wrap">
        <h2>{x.map.title}</h2>
        <div className="em-map-frame">
          <iframe title={x.map.title} src={SITE.mapEmbed} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
        </div>
        <a className="em-link" href={mapUrl} target="_blank" rel="noreferrer">{x.map.open} →</a>
      </div>
    </section>
  );
}

export function FloatingActions({ t, x, phone, onBook }) {
  const [showTop, setShowTop] = useState(false);
  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 700);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <>
      <button
        type="button"
        className={"em-top" + (showTop ? " is-on" : "")}
        aria-label={x.float.top}
        tabIndex={showTop ? 0 : -1}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 14l6-6 6 6" /></svg>
      </button>
      <div className="em-dock">
        <a href={`tel:${phone.tel}`} className="em-dock-call">
          <Icon d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />
          {x.float.call}
        </a>
        <button type="button" onClick={() => onBook({})}>{t.book}</button>
      </div>
    </>
  );
}

const SOCIAL_LABEL = { telegram: "Telegram", instagram: "Instagram", facebook: "Facebook" };

export function SiteFooter({ t, x, links, phones, mapUrl }) {
  const socials = Object.entries(SITE.social).filter(([, url]) => url);
  return (
    <footer className="em-foot em-foot-rich">
      <div className="em-wrap em-foot-grid">
        <div className="em-foot-about">
          <a className="em-foot-brand" href="#top" aria-label="Elite Med">
            <Mark shield="#fff" eye="#06143d" size={28} />
            <span>Elite Med</span>
          </a>
          <p>{x.footer.about}</p>
        </div>
        <nav aria-label={x.footer.links}>
          <h4>{x.footer.links}</h4>
          {links.map(([id, label]) => (
            <a key={id} href={`#${id}`}>{label}</a>
          ))}
        </nav>
        <div>
          <h4>{x.footer.contacts}</h4>
          {phones.map((p) => (
            <a key={p.tel} href={`tel:${p.tel}`}>{p.label}</a>
          ))}
          <a href={mapUrl} target="_blank" rel="noreferrer">{t.address}</a>
        </div>
        {socials.length > 0 && (
          <div>
            <h4>{x.footer.social}</h4>
            {socials.map(([key, url]) => (
              <a key={key} href={url} target="_blank" rel="noreferrer">{SOCIAL_LABEL[key]}</a>
            ))}
          </div>
        )}
      </div>
      <p className="em-foot-copy">© 2026 Elite Med · {t.footer} · {x.footer.rights}</p>
    </footer>
  );
}
