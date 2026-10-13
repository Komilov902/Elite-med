import { useEffect, useState } from "react";
import PasswordField from "./PasswordField.jsx";
import { Avatar } from "./AccountMenu.jsx";
import { displayName } from "../lib/auth.js";
import { ACCOUNT_T, AUTH_T } from "../i18n/extra.js";

export default function ProfileModal({ tab: initialTab, user, lang, setLang, prefs, setPrefs, auth, onClose, onSignOut }) {
  const c = ACCOUNT_T[lang];
  const a = AUTH_T[lang];
  const meta = user.user_metadata || {};
  const [tab, setTab] = useState(initialTab || "profile");
  const [name, setName] = useState(displayName(user));
  const [phone, setPhone] = useState(meta.phone_number || "");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null); // { ok: bool, text }
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  const goTab = (t) => {
    setTab(t);
    setErrors({});
    setStatus(null);
  };

  const fail = (err) => setStatus({ ok: false, text: a.errors[err.code] || a.errors.unknown });

  const saveProfile = async (e) => {
    e.preventDefault();
    const er = {};
    if (name.trim().length < 2) er.name = c.errors.name;
    if (phone.trim() && phone.replace(/\D/g, "").length < 9) er.phone = c.errors.phone;
    setErrors(er);
    setStatus(null);
    if (Object.keys(er).length) return;
    setBusy(true);
    try {
      await auth.updateProfile({ full_name: name.trim(), phone_number: phone.trim() });
      setStatus({ ok: true, text: c.saved });
    } catch (err) {
      fail(err);
    } finally {
      setBusy(false);
    }
  };

  const savePassword = async (e) => {
    e.preventDefault();
    const er = {};
    if (password.length < 6) er.password = a.errors.password;
    if (confirm !== password) er.confirm = a.errors.match;
    setErrors(er);
    setStatus(null);
    if (Object.keys(er).length) return;
    setBusy(true);
    try {
      await auth.updatePassword(password);
      setPassword("");
      setConfirm("");
      setStatus({ ok: true, text: c.passwordSaved });
    } catch (err) {
      fail(err);
    } finally {
      setBusy(false);
    }
  };

  const message = status && <p className={status.ok ? "ea-ok" : "ea-alert"} role="status">{status.text}</p>;

  return (
    <div className="ea-backdrop" role="presentation" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <section className="ea-modal ea-profile" role="dialog" aria-modal="true" aria-label={c.modalTitle}>
        <button className="ea-close" type="button" onClick={onClose} aria-label={a.close}>×</button>

        <header className="ea-profile-head">
          <Avatar user={user} />
          <span>
            <strong>{displayName(user) || c.user}</strong>
            <small>{user.email}</small>
          </span>
        </header>

        <div className="ea-tabs ea-tabs-3" role="tablist">
          {["profile", "security", "settings"].map((t) => (
            <button key={t} type="button" role="tab" aria-selected={tab === t} onClick={() => goTab(t)}>
              {c.tabs[t]}
            </button>
          ))}
        </div>

        <div className="ea-profile-body">
          {tab === "profile" && (
            <form className="ea-form" onSubmit={saveProfile} noValidate>
              <label className={"ea-field" + (errors.name ? " has-error" : "")}>
                <span>{c.fullName}</span>
                <input value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
                {errors.name && <em className="ea-err">{errors.name}</em>}
              </label>
              <label className={"ea-field" + (errors.phone ? " has-error" : "")}>
                <span>{c.phone}</span>
                <input type="tel" inputMode="tel" placeholder="+998" value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel" />
                {errors.phone && <em className="ea-err">{errors.phone}</em>}
              </label>
              <label className="ea-field">
                <span>{c.email}</span>
                <input value={user.email || ""} readOnly disabled />
                <small className="ea-muted">{c.emailNote}</small>
              </label>
              {message}
              <button className="em-btn em-btn-primary ea-submit" type="submit" disabled={busy}>{busy ? c.saving : c.save}</button>
            </form>
          )}

          {tab === "security" && (
            <form className="ea-form" onSubmit={savePassword} noValidate>
              <h3 className="ea-sub">{c.passwordTitle}</h3>
              <p className="ea-muted">{c.passwordNote}</p>
              <PasswordField label={c.newPassword} value={password} onChange={setPassword} error={errors.password} placeholder={a.passwordPh} autoComplete="new-password" show={a.show} hide={a.hide} meter meterLabels={a.strength} meterTitle={a.strengthLabel} />
              <PasswordField label={c.confirm} value={confirm} onChange={setConfirm} error={errors.confirm} autoComplete="new-password" show={a.show} hide={a.hide} />
              {message}
              <button className="em-btn em-btn-primary ea-submit" type="submit" disabled={busy}>{busy ? c.saving : c.save}</button>
            </form>
          )}

          {tab === "settings" && (
            <div className="ea-form">
              <div className="ea-field">
                <span>{c.language}</span>
                <div className="ea-seg" role="group" aria-label={c.language}>
                  {["uz", "ru"].map((l) => (
                    <button key={l} type="button" aria-pressed={lang === l} onClick={() => setLang(l)}>
                      {l === "uz" ? "O‘zbekcha" : "Русский"}
                    </button>
                  ))}
                </div>
                <small className="ea-muted">{c.languageNote}</small>
              </div>

              <label className="ea-switch-row">
                <span>
                  <strong>{c.autofill}</strong>
                  <small className="ea-muted">{c.autofillNote}</small>
                </span>
                <input type="checkbox" role="switch" checked={prefs.autofill} onChange={(e) => setPrefs({ autofill: e.target.checked })} />
                <i aria-hidden="true" />
              </label>

              <div className="ea-signout">
                <button type="button" className="em-btn em-btn-ghost" onClick={onSignOut}>{c.signout}</button>
                <small className="ea-muted">{c.signoutNote}</small>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
