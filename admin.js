/* ==========================================================
   لوحة تسيير الطلبات — By Oussama Sena
   البيانات في Supabase (جدول registrations)
   الدخول بحساب Supabase حقيقي — لا كلمة سر داخل الكود
   ========================================================== */

/* ----------------------------------------------------------
   1) الإعدادات — عدّل هذه القيم فقط
   نفس القيم الموجودة في script.js
   ---------------------------------------------------------- */
const ADMIN = {
  // نفس قيم script.js بالضبط  (Project Settings → API Keys)
  // 🔴 لا تضع أبداً مفتاح sb_secret_… هنا — ذاك يتجاوز كل الحماية
  supabase: {
    url:     'https://ldqohbckqnmpvfglgdje.supabase.co',
    publishableKey: 'sb_publishable_lM5uJsvKJL0Ax1-uMAe4Jw_WyRwNFny'
  },
  price: 29000,    // سعر الدورة بالدينار (لحساب المداخيل)
  countryCode: '213'
};

const TABLE = 'registrations';
const STATUSES = ['جديد', 'تم التواصل', 'مؤكد', 'ملغى'];

const WILAYAS = [
  'أدرار','الشلف','الأغواط','أم البواقي','باتنة','بجاية','بسكرة','بشار','البليدة','البويرة',
  'تمنراست','تبسة','تلمسان','تيارت','تيزي وزو','الجزائر','الجلفة','جيجل','سطيف','سعيدة',
  'سكيكدة','سيدي بلعباس','عنابة','قالمة','قسنطينة','المدية','مستغانم','المسيلة','معسكر','ورقلة',
  'وهران','البيض','إليزي','برج بوعريريج','بومرداس','الطارف','تندوف','تيسمسيلت','الوادي','خنشلة',
  'سوق أهراس','تيبازة','ميلة','عين الدفلى','النعامة','عين تموشنت','غرداية','غليزان','تيميمون','برج باجي مختار',
  'أولاد جلال','بني عباس','عين صالح','عين قزام','تڨرت','جانت','المغير','المنيعة'
];

/* حالة الواجهة */
const view = { filter: 'الكل', q: '', sort: 'new', open: new Set() };
let rows = [];        // الطلبات المحمّلة من Supabase
let session = null;   // { access_token, refresh_token }


/* ==========================================================
   2) الاتصال بـ Supabase (REST مباشرة، بلا مكتبات)
   ========================================================== */
const sbConfigured = () => !!(ADMIN.supabase.url && ADMIN.supabase.publishableKey);
const sbUrl = path => ADMIN.supabase.url.replace(/\/$/, '') + path;

function authHeaders(extra = {}) {
  return Object.assign({
    apikey: ADMIN.supabase.publishableKey,
    Authorization: 'Bearer ' + (session ? session.access_token : ADMIN.supabase.publishableKey)
  }, extra);
}

/** طلب مع تجديد تلقائي للجلسة إذا انتهت صلاحيتها */
async function sbFetch(path, opts = {}, retry = true) {
  const res = await fetch(sbUrl(path), Object.assign({}, opts, {
    headers: authHeaders(opts.headers || {})
  }));

  if (res.status === 401 && retry && session && session.refresh_token) {
    const ok = await refreshSession();
    if (ok) return sbFetch(path, opts, false);
  }
  return res;
}

async function signIn(email, password) {
  const res = await fetch(sbUrl('/auth/v1/token?grant_type=password'), {
    method: 'POST',
    headers: { apikey: ADMIN.supabase.publishableKey, 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.error_description || json.msg || json.message || 'تعذّر الدخول');
  return json;
}

async function refreshSession() {
  try {
    const res = await fetch(sbUrl('/auth/v1/token?grant_type=refresh_token'), {
      method: 'POST',
      headers: { apikey: ADMIN.supabase.publishableKey, 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: session.refresh_token })
    });
    if (!res.ok) return false;
    const json = await res.json();
    saveSession(json);
    return true;
  } catch (_) {
    return false;
  }
}

function saveSession(json) {
  session = { access_token: json.access_token, refresh_token: json.refresh_token };
  try { sessionStorage.setItem('sbSession', JSON.stringify(session)); } catch (_) {}
}

function loadSession() {
  try {
    const raw = sessionStorage.getItem('sbSession');
    session = raw ? JSON.parse(raw) : null;
  } catch (_) { session = null; }
  return session;
}

function clearSession() {
  session = null;
  try { sessionStorage.removeItem('sbSession'); } catch (_) {}
}


/* ==========================================================
   3) عمليات الجدول
   ========================================================== */
async function fetchRows() {
  const res = await sbFetch(`/rest/v1/${TABLE}?select=*&order=created_at.desc`);
  if (!res.ok) throw new Error('HTTP ' + res.status + ' — ' + await res.text());
  return res.json();
}

async function patchRow(id, patch) {
  const res = await sbFetch(`/rest/v1/${TABLE}?id=eq.${encodeURIComponent(id)}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Prefer: 'return=minimal' },
    body: JSON.stringify(patch)
  });
  if (!res.ok) throw new Error('HTTP ' + res.status);
}

async function deleteRow(id) {
  const res = await sbFetch(`/rest/v1/${TABLE}?id=eq.${encodeURIComponent(id)}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('HTTP ' + res.status);
}

async function insertRows(list) {
  const res = await sbFetch(`/rest/v1/${TABLE}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Prefer: 'return=minimal' },
    body: JSON.stringify(list)
  });
  if (!res.ok) throw new Error('HTTP ' + res.status + ' — ' + await res.text());
}


/* ==========================================================
   4) أدوات مساعدة
   ========================================================== */
const esc = s => String(s == null ? '' : s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

/** يحوّل 0555123456 إلى 213555123456 لرابط واتساب */
function waNumber(phone) {
  let d = String(phone || '').replace(/\D/g, '');
  if (d.startsWith('00')) d = d.slice(2);
  if (d.startsWith(ADMIN.countryCode)) return d;
  if (d.startsWith('0')) d = d.slice(1);
  return ADMIN.countryCode + d;
}

function fmtDate(iso) {
  const d = new Date(iso);
  if (isNaN(d)) return '—';
  const p = n => String(n).padStart(2, '0');
  return `${p(d.getDate())}/${p(d.getMonth() + 1)}/${d.getFullYear()} — ${p(d.getHours())}:${p(d.getMinutes())}`;
}

const money = n => n.toLocaleString('en-US') + ' دج';

let toastTimer;
function toast(msg) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { el.hidden = true; }, 2800);
}


/* ==========================================================
   5) الدخول
   ========================================================== */
function initGate() {
  const gate = document.getElementById('gate');
  const app  = document.getElementById('app');
  const err  = document.getElementById('gateErr');

  const enter = async () => {
    gate.hidden = true;
    app.hidden = false;
    await reload();
  };

  if (!sbConfigured()) {
    err.textContent = 'إعدادات Supabase ناقصة في admin.js';
    return;
  }

  if (loadSession()) { enter(); return; }

  document.getElementById('gateForm').addEventListener('submit', async e => {
    e.preventDefault();
    const email = document.getElementById('gEmail').value.trim();
    const pw    = document.getElementById('pw');
    const btn   = document.getElementById('gateBtn');

    err.textContent = '';
    btn.classList.add('is-loading');
    btn.disabled = true;

    try {
      saveSession(await signIn(email, pw.value));
      pw.value = '';
      await enter();
    } catch (e2) {
      err.textContent = /invalid/i.test(e2.message)
        ? 'البريد أو كلمة السر غير صحيحة'
        : e2.message;
      pw.value = '';
      pw.focus();
    }

    btn.classList.remove('is-loading');
    btn.disabled = false;
  });

  document.getElementById('logoutBtn').addEventListener('click', () => {
    clearSession();
    location.reload();
  });
}


/* ==========================================================
   6) التحميل والعرض
   ========================================================== */
async function reload() {
  try {
    rows = await fetchRows();
    render();
  } catch (e) {
    console.error(e);
    if (/401|403/.test(e.message)) {
      clearSession();
      toast('انتهت الجلسة — أعد الدخول');
      setTimeout(() => location.reload(), 1200);
    } else {
      toast('تعذّر تحميل الطلبات');
    }
  }
}

function filtered() {
  const q = view.q.trim().toLowerCase();

  const out = rows.filter(r => {
    if (view.filter !== 'الكل' && r.status !== view.filter) return false;
    if (!q) return true;
    return [r.name, r.phone, r.wilaya, r.goal, r.note]
      .some(v => String(v || '').toLowerCase().includes(q));
  });

  const byDate = (a, b) => new Date(b.created_at) - new Date(a.created_at);
  if (view.sort === 'new')    out.sort(byDate);
  if (view.sort === 'old')    out.sort((a, b) => -byDate(a, b));
  if (view.sort === 'name')   out.sort((a, b) => String(a.name).localeCompare(String(b.name), 'ar'));
  if (view.sort === 'wilaya') out.sort((a, b) => String(a.wilaya).localeCompare(String(b.wilaya), 'ar'));

  return out;
}

function render() {
  const list = filtered();

  const n = s => rows.filter(r => r.status === s).length;
  document.getElementById('kTotal').textContent = rows.length;
  document.getElementById('kNew').textContent   = n('جديد');
  document.getElementById('kCall').textContent  = n('تم التواصل');
  document.getElementById('kOk').textContent    = n('مؤكد');
  document.getElementById('kNo').textContent    = n('ملغى');
  document.getElementById('kMoney').textContent = money(n('مؤكد') * ADMIN.price);

  document.querySelectorAll('.kpi[data-filter]').forEach(b => {
    b.classList.toggle('is-active', b.dataset.filter === view.filter);
  });

  document.getElementById('count').textContent =
    rows.length ? `عرض ${list.length} من ${rows.length} طلب` : '';

  document.getElementById('empty').hidden = rows.length > 0;
  document.getElementById('list').innerHTML = list.map(card).join('');
}

function card(r) {
  const open = view.open.has(r.id);
  const wa = 'https://wa.me/' + waNumber(r.phone) + '?text=' + encodeURIComponent(
    `السلام عليكم ${r.name}، بخصوص تسجيلك في دورة التجارة الإلكترونية والصناعة المحلية (15 و16 أوت — الشراڤة).`
  );

  return `
<article class="item" data-status="${esc(r.status)}" data-id="${esc(r.id)}">
  <div class="item__head" data-toggle>
    <div class="item__id">
      <div class="item__name">${esc(r.name)}</div>
      <div class="item__meta">
        <span class="item__phone">${esc(r.phone)}</span>
        <span><b>${esc(r.wilaya)}</b></span>
        <span>${fmtDate(r.created_at)}</span>
      </div>
    </div>
    <span class="badge" data-s="${esc(r.status)}">${esc(r.status)}</span>
  </div>

  ${open ? `
  <div class="item__body">
    <div class="facts">
      <div class="f"><b>الخبرة</b><span>${esc(r.experience) || '—'}</span></div>
      <div class="f"><b>لديه منتج</b><span>${esc(r.product) || '—'}</span></div>
      <div class="f"><b>التواصل</b><span>${esc(r.contact) || '—'}</span></div>
      <div class="f" style="grid-column:1/-1"><b>الهدف</b><span>${esc(r.goal) || '—'}</span></div>
    </div>

    <div class="statusrow">
      ${STATUSES.map(s => `
        <button type="button" class="st ${s === r.status ? 'is-on' : ''}" data-s="${s}" data-set="${s}">${s}</button>
      `).join('')}
    </div>

    <div class="notewrap">
      <label for="n-${esc(r.id)}">ملاحظة</label>
      <textarea id="n-${esc(r.id)}" rows="2" data-note placeholder="مثال: طلب التأجيل، دفع العربون…">${esc(r.note)}</textarea>
    </div>

    <div class="item__acts">
      <a class="act act--wa" href="${wa}" target="_blank" rel="noopener">واتساب</a>
      <a class="act act--call" href="tel:${esc(String(r.phone).replace(/\s/g, ''))}">اتصال</a>
      <button type="button" class="act act--del" data-del>حذف</button>
    </div>
  </div>` : ''}
</article>`;
}


/* ==========================================================
   7) التفاعل
   ========================================================== */
function initUI() {
  document.querySelectorAll('.kpi[data-filter]').forEach(b => {
    b.addEventListener('click', () => { view.filter = b.dataset.filter; render(); });
  });

  document.getElementById('q').addEventListener('input', e => {
    view.q = e.target.value;
    render();
  });

  document.getElementById('sort').addEventListener('change', e => {
    view.sort = e.target.value;
    render();
  });

  document.getElementById('refreshBtn').addEventListener('click', async () => {
    await reload();
    toast('تم التحديث');
  });

  const list = document.getElementById('list');

  list.addEventListener('click', async e => {
    const item = e.target.closest('.item');
    if (!item) return;
    const id = item.dataset.id;

    if (e.target.closest('[data-toggle]')) {
      view.open.has(id) ? view.open.delete(id) : view.open.add(id);
      render();
      return;
    }

    const st = e.target.closest('[data-set]');
    if (st) {
      const row = rows.find(r => r.id === id);
      const old = row.status;
      row.status = st.dataset.set;      // تحديث فوري للواجهة
      render();
      try {
        await patchRow(id, { status: row.status });
      } catch (_) {
        row.status = old;               // تراجع عند الفشل
        render();
        toast('تعذّر حفظ الحالة');
      }
      return;
    }

    if (e.target.closest('[data-del]')) {
      const row = rows.find(r => r.id === id);
      if (!confirm(`حذف طلب "${row ? row.name : ''}" نهائياً؟`)) return;
      try {
        await deleteRow(id);
        rows = rows.filter(r => r.id !== id);
        view.open.delete(id);
        render();
        toast('تم حذف الطلب');
      } catch (_) {
        toast('تعذّر الحذف');
      }
    }
  });

  list.addEventListener('change', async e => {
    const ta = e.target.closest('[data-note]');
    if (!ta) return;
    const id = e.target.closest('.item').dataset.id;
    try {
      await patchRow(id, { note: ta.value });
      const row = rows.find(r => r.id === id);
      if (row) row.note = ta.value;
      toast('تم حفظ الملاحظة');
    } catch (_) {
      toast('تعذّر حفظ الملاحظة');
    }
  });

  document.getElementById('exportBtn').addEventListener('click', exportCSV);
  document.getElementById('backupBtn').addEventListener('click', backup);
  document.getElementById('importFile').addEventListener('change', restore);

  initAddModal();
}


/* ==========================================================
   8) التصدير والنسخ الاحتياطي
   ========================================================== */
function download(name, content, type) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}

function stamp() {
  const d = new Date();
  const p = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

function exportCSV() {
  if (!rows.length) { toast('لا توجد طلبات للتصدير'); return; }

  const head = ['الاسم', 'الهاتف', 'الولاية', 'الخبرة', 'لديه منتج', 'الهدف', 'التواصل', 'الحالة', 'ملاحظة', 'التاريخ'];
  const cell = v => '"' + String(v == null ? '' : v).replace(/"/g, '""') + '"';

  const csv = [head.map(cell).join(',')]
    .concat(rows.map(r => [r.name, r.phone, r.wilaya, r.experience, r.product, r.goal, r.contact, r.status, r.note, fmtDate(r.created_at)].map(cell).join(',')))
    .join('\r\n');

  // BOM حتى تظهر العربية بشكل صحيح في Excel
  download(`طلبات-الدورة-${stamp()}.csv`, '﻿' + csv, 'text/csv;charset=utf-8');
  toast('تم تصدير الملف');
}

function backup() {
  if (!rows.length) { toast('لا توجد طلبات'); return; }
  download(`نسخة-احتياطية-${stamp()}.json`, JSON.stringify(rows, null, 2), 'application/json');
  toast('تم حفظ النسخة الاحتياطية');
}

function restore(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = async () => {
    try {
      const incoming = JSON.parse(reader.result);
      if (!Array.isArray(incoming)) throw new Error('bad');

      // نتفادى التكرار بمقارنة الهاتف + الاسم
      const seen = new Set(rows.map(r => (r.phone || '') + '|' + (r.name || '')));
      const fresh = incoming
        .filter(r => r && r.name && r.phone && !seen.has(r.phone + '|' + r.name))
        .map(r => ({
          name: r.name, phone: r.phone, wilaya: r.wilaya || '',
          experience: r.experience || '', product: r.product || '',
          goal: r.goal || '', contact: r.contact || '',
          status: r.status || 'جديد', note: r.note || ''
        }));

      if (!fresh.length) { toast('كل الطلبات موجودة مسبقاً'); }
      else {
        await insertRows(fresh);
        await reload();
        toast(`تمت إضافة ${fresh.length} طلب`);
      }
    } catch (_) {
      toast('الملف غير صالح أو تعذّر الرفع');
    }
    e.target.value = '';
  };
  reader.readAsText(file);
}


/* ==========================================================
   9) إضافة طلب يدوي
   ========================================================== */
function initAddModal() {
  const modal = document.getElementById('addModal');
  const form  = document.getElementById('addForm');
  const sel   = document.getElementById('mWilaya');

  WILAYAS.forEach(w => {
    const o = document.createElement('option');
    o.value = w; o.textContent = w;
    sel.appendChild(o);
  });

  const close = () => { modal.hidden = true; form.reset(); };

  document.getElementById('addBtn').addEventListener('click', () => {
    modal.hidden = false;
    document.getElementById('mName').focus();
  });

  modal.addEventListener('click', e => {
    if (e.target === modal || e.target.closest('[data-close]')) close();
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !modal.hidden) close();
  });

  form.addEventListener('submit', async e => {
    e.preventDefault();
    try {
      await insertRows([{
        name:   document.getElementById('mName').value.trim(),
        phone:  document.getElementById('mPhone').value.trim(),
        wilaya: sel.value,
        experience: '—',
        product: '—',
        goal: '',
        contact: 'واتساب',
        status: 'جديد',
        note: document.getElementById('mNote').value.trim()
      }]);
      close();
      await reload();
      toast('تمت إضافة الطلب');
    } catch (_) {
      toast('تعذّرت الإضافة');
    }
  });
}


/* ==========================================================
   10) التشغيل
   ========================================================== */
document.addEventListener('DOMContentLoaded', () => {
  initGate();
  initUI();
});
