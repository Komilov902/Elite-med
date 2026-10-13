import { useCallback, useEffect, useMemo, useState } from "react";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const STORAGE_KEY = "elite-med-auth-session";

export const AUTH_CONFIGURED = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

export class AuthError extends Error {
  constructor(code) {
    super(code);
    this.code = code;
  }
}

/* ---------- session storage ---------- */

const now = () => Math.floor(Date.now() / 1000);

function readSession() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY));
  } catch {
    return null;
  }
}

function writeSession(session) {
  try {
    if (session) localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    else localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* storage may be blocked (private mode) — the session just won't persist */
  }
}

function toSession(data, prev) {
  return {
    access_token: data.access_token,
    refresh_token: data.refresh_token || prev?.refresh_token || null,
    expires_at: data.expires_at || now() + (Number(data.expires_in) || 3600),
    user: data.user || prev?.user || null,
  };
}

/* ---------- API ---------- */

function codeFrom(status, data) {
  const raw = String(data.error_code || data.msg || data.message || data.error_description || data.error || "");
  const text = raw.toLowerCase();
  if (status === 429 || /rate.?limit/.test(text)) return "rate_limited";
  if (/invalid.?(login|credentials)/.test(text)) return "invalid_credentials";
  if (/already.*(registered|exists)/.test(text) || /user_already_exists/.test(text)) return "user_already_exists";
  if (/not.?confirmed/.test(text)) return "email_not_confirmed";
  if (/weak_password|password should be|at least/.test(text)) return "weak_password";
  if (/same_password|different from the old/.test(text)) return "same_password";
  if (/invalid.*email|email_address_invalid/.test(text)) return "invalid_email";
  if (status === 401 || /jwt|session/.test(text)) return "session_expired";
  return "unknown";
}

async function api(path, { method = "POST", body, token } = {}) {
  if (!AUTH_CONFIGURED) throw new AuthError("not_configured");
  let res;
  try {
    res = await fetch(`${SUPABASE_URL}/auth/v1/${path}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        apikey: SUPABASE_ANON_KEY,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new AuthError("network");
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new AuthError(codeFrom(res.status, data));
  return data;
}

/** Returns a session whose access token is still valid, refreshing it when needed. */
async function freshSession() {
  const session = readSession();
  if (!session?.access_token) return null;
  if (session.expires_at - 60 > now()) return session;
  if (!session.refresh_token) {
    writeSession(null);
    return null;
  }
  try {
    const data = await api("token?grant_type=refresh_token", { body: { refresh_token: session.refresh_token } });
    const next = toSession(data, session);
    writeSession(next);
    return next;
  } catch (err) {
    if (err.code === "network") return session; // keep the user signed in while offline
    writeSession(null);
    return null;
  }
}

const redirectUrl = () => `${window.location.origin}/`;

/* ---------- hook ---------- */

export function useAuth() {
  const [user, setUser] = useState(() => (AUTH_CONFIGURED ? readSession()?.user || null : null));
  const [recovery, setRecovery] = useState(false);
  const [notice, setNotice] = useState(""); // error returned in the URL after OAuth

  useEffect(() => {
    if (!AUTH_CONFIGURED) return undefined;
    let active = true;

    const clearHash = () =>
      window.history.replaceState({}, document.title, `${window.location.pathname}${window.location.search}`);

    const boot = async () => {
      const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));

      if (hash.get("error") || hash.get("error_description")) {
        if (active) setNotice(hash.get("error_code") || hash.get("error") || "unknown");
        clearHash();
      }

      const accessToken = hash.get("access_token");
      if (accessToken) {
        const session = {
          access_token: accessToken,
          refresh_token: hash.get("refresh_token"),
          expires_at: Number(hash.get("expires_at")) || now() + (Number(hash.get("expires_in")) || 3600),
          user: null,
        };
        try {
          session.user = await api("user", { method: "GET", token: accessToken });
          writeSession(session);
          if (active) {
            setUser(session.user);
            if (hash.get("type") === "recovery") setRecovery(true);
          }
        } catch {
          /* fall through: user simply stays signed out */
        }
        clearHash();
        return;
      }

      const session = await freshSession();
      if (!session) {
        if (active) setUser(null);
        return;
      }
      try {
        const fresh = await api("user", { method: "GET", token: session.access_token });
        writeSession({ ...session, user: fresh });
        if (active) setUser(fresh);
      } catch (err) {
        if (err.code === "network") return;
        writeSession(null);
        if (active) setUser(null);
      }
    };

    boot();
    return () => {
      active = false;
    };
  }, []);

  const signIn = useCallback(async (email, password) => {
    const data = await api("token?grant_type=password", { body: { email, password } });
    const session = toSession(data);
    writeSession(session);
    setUser(session.user);
  }, []);

  const signUp = useCallback(async ({ email, password, name }) => {
    const data = await api(`signup?redirect_to=${encodeURIComponent(redirectUrl())}`, {
      body: { email, password, data: { full_name: name } },
    });
    if (data.access_token) {
      const session = toSession(data);
      writeSession(session);
      setUser(session.user);
      return "signed_in";
    }
    const created = data.user || data;
    // Supabase hides "already registered" when email confirmation is on: identities comes back empty.
    if (Array.isArray(created?.identities) && created.identities.length === 0) {
      throw new AuthError("user_already_exists");
    }
    return "confirm";
  }, []);

  const signOut = useCallback(async () => {
    const session = readSession();
    writeSession(null);
    setUser(null);
    if (session?.access_token) {
      try {
        await api("logout", { token: session.access_token });
      } catch {
        /* the local session is already gone */
      }
    }
  }, []);

  const resetPassword = useCallback(
    (email) => api(`recover?redirect_to=${encodeURIComponent(redirectUrl())}`, { body: { email } }),
    []
  );

  const updateUser = useCallback(async (body) => {
    const session = await freshSession();
    if (!session) {
      setUser(null);
      throw new AuthError("session_expired");
    }
    const updated = await api("user", { method: "PUT", token: session.access_token, body });
    writeSession({ ...session, user: updated });
    setUser(updated);
  }, []);

  const updateProfile = useCallback((meta) => updateUser({ data: meta }), [updateUser]);
  const updatePassword = useCallback((password) => updateUser({ password }), [updateUser]);

  const googleUrl = useCallback(
    () =>
      `${SUPABASE_URL}/auth/v1/authorize?provider=google&redirect_to=${encodeURIComponent(redirectUrl())}&apikey=${encodeURIComponent(SUPABASE_ANON_KEY)}`,
    []
  );

  return useMemo(
    () => ({
      user,
      recovery,
      notice,
      clearNotice: () => setNotice(""),
      finishRecovery: () => setRecovery(false),
      signIn,
      signUp,
      signOut,
      resetPassword,
      updateProfile,
      updatePassword,
      googleUrl,
    }),
    [user, recovery, notice, signIn, signUp, signOut, resetPassword, updateProfile, updatePassword, googleUrl]
  );
}

/* ---------- small helpers used by the UI ---------- */

export function displayName(user) {
  const meta = user?.user_metadata || {};
  return (meta.full_name || meta.name || "").trim();
}

export function avatarUrl(user) {
  const meta = user?.user_metadata || {};
  return meta.avatar_url || meta.picture || "";
}

export function initials(user) {
  const name = displayName(user);
  const source = name || user?.email || "?";
  const parts = source.split(/[\s@._-]+/).filter(Boolean);
  return ((parts[0]?.[0] || "?") + (name && parts[1] ? parts[1][0] : "")).toUpperCase();
}

/* ---------- local preferences (language, autofill) ---------- */

const PREFS_KEY = "elite-med-prefs";

export function readPrefs() {
  try {
    return { lang: "uz", autofill: true, ...(JSON.parse(localStorage.getItem(PREFS_KEY)) || {}) };
  } catch {
    return { lang: "uz", autofill: true };
  }
}

export function savePrefs(patch) {
  const next = { ...readPrefs(), ...patch };
  try {
    localStorage.setItem(PREFS_KEY, JSON.stringify(next));
  } catch {
    /* ignore */
  }
  return next;
}
