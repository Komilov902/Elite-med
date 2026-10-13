import { useEffect, useRef, useState } from "react";
import Mark from "./Mark.jsx";
import PasswordField from "./PasswordField.jsx";
import { AUTH_CONFIGURED } from "../lib/auth.js";
import { AUTH_T } from "../i18n/extra.js";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const GoogleLogo = () => (
  <svg viewBox="0 0 48 48" width="20" height="20" aria-hidden="true">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
  </svg>
);

/** mode: "signin" | "signup" | "forgot" | "recovery" */
export default function AuthModal({ mode, setMode, onClose, lang, auth, initialError }) {
  const a = AUTH_T[lang];
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState(initialError || "");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(null); // { kind: "confirm" | "reset", email }
  const firstRef = useRef(null);

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

  useEffect(() => {
    firstRef.current?.focus();
  }, [mode, sent]);

  const switchMode = (m) => {
    setMode(m);
    setErrors({});
    setFormError("");
    setSent(null);
    setPassword("");
    setConfirm("");
  };

  const validate = () => {
    const e = {};
    if (mode === "signup" && name.trim().length < 2) e.name = a.errors.name;
    if (mode !== "recovery" && !EMAIL_RE.test(email.trim())) e.email = a.errors.email;
    if (mode !== "forgot" && password.length < 6) e.password = a.errors.password;
    if (mode === "recovery" && confirm !== password) e.confirm = a.errors.match;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (ev) => {
    ev.preventDefault();
    setFormError("");
    if (!validate()) return;
    setBusy(true);
    try {
      const mail = email.trim();
      if (mode === "signin") {
        await auth.signIn(mail, password);
        onClose();
      } else if (mode === "signup") {
        const result = await auth.signUp({ email: mail, password, name: name.trim() });
        if (result === "signed_in") onClose();
        else setSent({ kind: "confirm", email: mail });
      } else if (mode === "forgot") {
        await auth.resetPassword(mail);
        setSent({ kind: "reset", email: mail });
      } else {
        await auth.updatePassword(password);
        auth.finishRecovery();
        onClose();
      }
    } catch (err) {
      setFormError(a.errors[err.code] || a.errors.unknown);
    } finally {
      setBusy(false);
    }
  };

  const google = () => {
    if (!AUTH_CONFIGURED) {
      setFormError(a.errors.not_configured);
      return;
    }
    window.location.href = auth.googleUrl();
  };

  const titles = {
    signin: [a.signinTitle, a.signinText, a.submitSignin],
    signup: [a.signupTitle, a.signupText, a.submitSignup],
    forgot: [a.forgotTitle, a.forgotText, a.submitForgot],
    recovery: [a.recoveryTitle, a.recoveryText, a.submitRecovery],
  };
  const [title, text, submitLabel] = titles[mode];
  const showTabs = mode === "signin" || mode === "signup";

  return (
    <div className="ea-backdrop" role="presentation" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <section className="ea-modal" role="dialog" aria-modal="true" aria-labelledby="ea-title">
        <aside className="ea-aside" aria-hidden="true">
          <div className="ea-aside-brand">
            <Mark shield="#fff" eye="#0B3FCB" size={40} />
            <span>Elite Med</span>
          </div>
          <h3>{a.asideTitle}</h3>
          <ul>
            {a.benefits.map((b) => (
              <li key={b}>
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12.5l4.5 4.5L19 7.5" />
                </svg>
                {b}
              </li>
            ))}
          </ul>
        </aside>

        <div className="ea-main">
          <button className="ea-close" type="button" onClick={onClose} aria-label={a.close}>×</button>

          {sent ? (
            <div className="ea-sent">
              <span className="ea-sent-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="5" width="18" height="14" rx="3" />
                  <path d="M4 7.5l8 6 8-6" />
                </svg>
              </span>
              <h2 id="ea-title">{sent.kind === "confirm" ? a.sentTitleConfirm : a.sentTitleReset}</h2>
              <p>{sent.kind === "confirm" ? a.sentTextConfirm(sent.email) : a.sentTextReset(sent.email)}</p>
              <p className="ea-muted">{a.sentSpam}</p>
              <button ref={firstRef} type="button" className="em-btn em-btn-primary ea-submit" onClick={() => switchMode("signin")}>
                {a.signin}
              </button>
            </div>
          ) : (
            <>
              {showTabs && (
                <div className="ea-tabs" role="tablist">
                  {["signin", "signup"].map((m) => (
                    <button key={m} type="button" role="tab" aria-selected={mode === m} onClick={() => switchMode(m)}>
                      {m === "signin" ? a.signin : a.signup}
                    </button>
                  ))}
                </div>
              )}

              <h2 id="ea-title">{title}</h2>
              <p className="ea-lead">{text}</p>

              {showTabs && (
                <>
                  <button className="ea-google" type="button" onClick={google}>
                    <GoogleLogo />
                    {a.google}
                  </button>
                  <div className="ea-or"><span>{a.or}</span></div>
                </>
              )}

              <form className="ea-form" onSubmit={submit} noValidate>
                {mode === "signup" && (
                  <label className={"ea-field" + (errors.name ? " has-error" : "")}>
                    <span>{a.name}</span>
                    <input ref={firstRef} type="text" autoComplete="name" value={name} placeholder={a.namePh} onChange={(e) => setName(e.target.value)} aria-invalid={errors.name ? "true" : undefined} />
                    {errors.name && <em className="ea-err">{errors.name}</em>}
                  </label>
                )}

                {mode !== "recovery" && (
                  <label className={"ea-field" + (errors.email ? " has-error" : "")}>
                    <span>{a.email}</span>
                    <input ref={mode === "signup" ? undefined : firstRef} type="email" autoComplete="email" inputMode="email" value={email} placeholder="name@example.com" onChange={(e) => setEmail(e.target.value)} aria-invalid={errors.email ? "true" : undefined} />
                    {errors.email && <em className="ea-err">{errors.email}</em>}
                  </label>
                )}

                {mode !== "forgot" && (
                  <PasswordField
                    label={mode === "recovery" ? a.newPassword : a.password}
                    value={password}
                    onChange={setPassword}
                    error={errors.password}
                    placeholder={a.passwordPh}
                    autoComplete={mode === "signin" ? "current-password" : "new-password"}
                    show={a.show}
                    hide={a.hide}
                    meter={mode === "signup" || mode === "recovery"}
                    meterLabels={a.strength}
                    meterTitle={a.strengthLabel}
                  />
                )}

                {mode === "recovery" && (
                  <PasswordField label={a.confirm} value={confirm} onChange={setConfirm} error={errors.confirm} autoComplete="new-password" show={a.show} hide={a.hide} />
                )}

                {mode === "signin" && (
                  <button type="button" className="ea-link ea-forgot" onClick={() => switchMode("forgot")}>{a.forgot}</button>
                )}

                {formError && <p className="ea-alert" role="alert">{formError}</p>}

                <button className="em-btn em-btn-primary ea-submit" type="submit" disabled={busy}>
                  {busy ? a.busy : submitLabel}
                </button>
              </form>

              {mode === "forgot" && (
                <button type="button" className="ea-link ea-back" onClick={() => switchMode("signin")}>{a.back}</button>
              )}
              {showTabs && (
                <p className="ea-switch">
                  {mode === "signin" ? a.noAccount : a.haveAccount}{" "}
                  <button type="button" className="ea-link" onClick={() => switchMode(mode === "signin" ? "signup" : "signin")}>
                    {mode === "signin" ? a.signup : a.signin}
                  </button>
                </p>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}
