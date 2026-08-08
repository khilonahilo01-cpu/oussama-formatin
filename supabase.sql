-- ==========================================================
--  إعداد قاعدة البيانات — دورة التجارة الإلكترونية والصناعة المحلية
--  انسخ هذا الملف كاملاً والصقه في:
--  Supabase → مشروعك → SQL Editor → New query → Run
-- ==========================================================

-- 1) الجدول
create table if not exists public.registrations (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  name        text not null,
  phone       text not null,
  wilaya      text,
  experience  text,
  product     text,
  goal        text,
  contact     text,
  status      text not null default 'جديد',
  note        text default ''
);

-- فهرس لتسريع الترتيب حسب التاريخ
create index if not exists registrations_created_at_idx
  on public.registrations (created_at desc);


-- 2) تفعيل الحماية على مستوى الصف (مهم جداً)
alter table public.registrations enable row level security;


-- 3) السياسات
--    نحذف القديمة أولاً حتى يمكن تشغيل الملف أكثر من مرة بلا خطأ
drop policy if exists "زائر يسجّل"      on public.registrations;
drop policy if exists "مسيّر يقرأ"      on public.registrations;
drop policy if exists "مسيّر يعدّل"     on public.registrations;
drop policy if exists "مسيّر يحذف"      on public.registrations;

-- أي زائر يقدر يرسل طلب تسجيل… فقط الإرسال
create policy "زائر يسجّل"
  on public.registrations for insert
  to anon, authenticated
  with check (true);

-- القراءة والتعديل والحذف: فقط لمن سجّل دخوله (أنت)
create policy "مسيّر يقرأ"
  on public.registrations for select
  to authenticated using (true);

create policy "مسيّر يعدّل"
  on public.registrations for update
  to authenticated using (true) with check (true);

create policy "مسيّر يحذف"
  on public.registrations for delete
  to authenticated using (true);


-- ==========================================================
--  بعد تشغيل هذا الملف، خطوتان في واجهة Supabase:
--
--  1) أنشئ حساب الدخول إلى اللوحة:
--     Authentication → Users → Add user → Create new user
--     البريد: ousssamaformation@gmail.com  + كلمة سر قوية
--     ✅ فعّل خيار Auto Confirm User
--
--  2) ⚠️ أغلق التسجيل العمومي — بدونها أي شخص ينشئ حساباً ويقرأ كل الطلبات:
--     Authentication → Sign In / Providers → Email
--     أطفئ  "Allow new users to sign up"
-- ==========================================================
