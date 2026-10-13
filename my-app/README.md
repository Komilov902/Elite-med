# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.


## Elite Med yangilanishlari
- Brauzer tabida `Elite Med | Medical centre` nomi va Elite Med favicon ko'rsatiladi.
- Vite starter uslubidagi global CSS olib tashlandi; sahifa to'liq kenglikda ko'rinadi.
- Tizimga kirgandan so'ng yuqorida dumaloq profil ikonkasi va hisob menyusi ko'rinadi.
- Profil menyusida hisob emaili, qabulga yozilish va chiqish mavjud.
- Google OAuth uchun Supabase'da Google provider yoqilgan va URL Configuration sozlangan bo'lishi kerak.

## Yangilanishlar (v2)
- Yangi Sign in / Sign up oynasi: tablar, Google tugmasi, parolni ko'rsatish, parol kuchi, "Parolni unutdingizmi?", email tasdiqlash holati.
- Haqiqiy Profil va Sozlamalar oynasi: ism/telefon, parol almashtirish, sayt tili (eslab qoladi), avtomatik to'ldirish.
- Yangi bo'limlar: tezkor ma'lumot (Hozir ochiq/yopiq), CTA banner, galereya, xarita, kengaytirilgan footer, mobil pastki panel, "yuqoriga" tugmasi.
- Telegram tokeni endi serverda: `api/book.js` (Vercel) — `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`.
- Sozlamalar: `src/lib/config.js` (ish vaqti, ijtimoiy tarmoqlar, galereya, xarita).
