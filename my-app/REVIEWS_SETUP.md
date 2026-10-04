# Elite Med sharhlar tizimi

Bu loyiha sharhlarni Supabase orqali saqlaydi. Alohida backend server kerak emas.

## 1. Supabase project

Supabase'da yangi project oching va **SQL Editor**ga `SUPABASE_SETUP.sql` faylidagi SQL'ni to'liq ishga tushiring.

## 2. API ma'lumotlari

Supabase project ichidan:
- Project URL
- anon/public key

qiymatlarini oling.

## 3. `.env`

Loyiha rootidagi `.env`ga:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

Telegram sozlamalari ham shu `.env`da qoladi.

## 4. Ishga tushirish

`.env`ni saqlagandan keyin Vite'ni qayta ishga tushiring:

```bash
npm run dev
```

Sharh yuborilganda database'ga yoziladi va boshqa foydalanuvchilar ham ko'radi.
