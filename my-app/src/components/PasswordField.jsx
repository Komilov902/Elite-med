import { useState } from "react";

export function strengthScore(pw) {
  if (pw.length < 6) return 0;
  let s = 1;
  if (pw.length >= 10) s += 1;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) s += 1;
  if (/\d/.test(pw) && /[^A-Za-z0-9]/.test(pw)) s += 1;
  return Math.min(s, 4);
}

export default function PasswordField({ label, value, onChange, error, placeholder, autoComplete, show: showLabel, hide: hideLabel, meter, meterLabels, meterTitle }) {
  const [visible, setVisible] = useState(false);
  const score = strengthScore(value);
  return (
    <label className={"ea-field" + (error ? " has-error" : "")}>
      <span>{label}</span>
      <span className="ea-input-wrap">
        <input
          type={visible ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          aria-invalid={error ? "true" : undefined}
        />
        <button type="button" className="ea-eye" onClick={() => setVisible((v) => !v)} aria-label={visible ? hideLabel : showLabel}>
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" />
            <circle cx="12" cy="12" r="3" />
            {visible && <path d="M4 4l16 16" />}
          </svg>
        </button>
      </span>
      {meter && value && (
        <span className="ea-meter" aria-label={meterTitle}>
          <span className="ea-meter-bars" data-score={score}>
            <i /><i /><i /><i />
          </span>
          <small>{meterLabels[score]}</small>
        </span>
      )}
      {error && <em className="ea-err">{error}</em>}
    </label>
  );
}
