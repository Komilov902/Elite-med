import { useEffect, useRef, useState } from "react";
import { avatarUrl, displayName, initials } from "../lib/auth.js";
import { ACCOUNT_T } from "../i18n/extra.js";

export function Avatar({ user, small }) {
  const url = avatarUrl(user);
  return (
    <span className={"ea-avatar" + (small ? " is-small" : "")} aria-hidden="true">
      {url ? <img src={url} alt="" referrerPolicy="no-referrer" /> : initials(user)}
    </span>
  );
}

export default function AccountMenu({ user, lang, onBook, onOpenProfile, onSignOut }) {
  const c = ACCOUNT_T[lang];
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const name = displayName(user);

  useEffect(() => {
    if (!open) return undefined;
    const onDown = (e) => ref.current && !ref.current.contains(e.target) && setOpen(false);
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const run = (fn) => () => {
    setOpen(false);
    fn();
  };

  return (
    <div className="ea-account" ref={ref}>
      <button className="ea-account-btn" type="button" aria-label={c.menu} aria-expanded={open} aria-haspopup="menu" onClick={() => setOpen((v) => !v)}>
        <Avatar user={user} />
        <span className="ea-account-name">{name.split(" ")[0] || c.user}</span>
        <span className="ea-chev" aria-hidden="true" />
      </button>
      {open && (
        <div className="ea-menu" role="menu">
          <div className="ea-menu-head">
            <Avatar user={user} small />
            <span>
              <strong>{name || c.user}</strong>
              <small>{user.email}</small>
            </span>
          </div>
          <button role="menuitem" type="button" onClick={run(() => onOpenProfile("profile"))}>{c.profile}</button>
          <button role="menuitem" type="button" onClick={run(() => onOpenProfile("settings"))}>{c.settings}</button>
          <button role="menuitem" type="button" onClick={run(() => onBook({}))}>{c.book}</button>
          <div className="ea-menu-sep" />
          <button role="menuitem" type="button" className="is-danger" onClick={run(onSignOut)}>{c.signout}</button>
        </div>
      )}
    </div>
  );
}
