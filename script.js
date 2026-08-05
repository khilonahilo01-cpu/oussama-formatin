/* ==========================================================
   دورة التجارة الإلكترونية والصناعة المحلية — By Oussama Sena
   ملف الجافاسكريبت
   ========================================================== */

/* ----------------------------------------------------------
   1) الإعدادات — عدّل هذه القيم فقط
   ---------------------------------------------------------- */
const CONFIG = {
  // رقم واتساب بالصيغة الدولية بدون + وبدون مسافات (213 = الجزائر)
  whatsapp: '213555000000',
  // رابط حساب إنستغرام
  instagram: 'https://instagram.com/oussama.sena',

  // طريقة استقبال الطلبات:
  //   'netlify'   → نماذج Netlify: مجانية وغير محدودة، بلا حساب إضافي ولا مفتاح.
  //                 ⚠️ لا تشتغل محلياً — تنشط فقط بعد رفع الموقع على Netlify.
  //                 تشوف الطلبات في: Netlify → موقعك → Forms
  //                 وللتنبيه بالبريد: Forms → Settings → Form notifications → Email
  //   'web3forms' → بديل، يحتاج مفتاحاً من https://web3forms.com (250 طلب/شهر مجاناً)
  //   ''          → بلا إرسال: حفظ محلي + زر واتساب فقط
  delivery: 'netlify',

  // يُستعمل فقط إذا كانت delivery = 'web3forms'
  web3formsKey: '',
  // معلومات الدورة (تُستعمل في رسالة واتساب)
  course: {
    title: 'دورة التجارة الإلكترونية والصناعة المحلية',
    date: '15 و16 أوت',
    place: 'الشراڤة',
    price: '29,000 دج'
  },

  // فيديو الشهادة — اتركه فارغاً ولن يظهر القسم إطلاقاً
  // src: رابط يوتيوب  →  https://www.youtube.com/watch?v=XXXX
  //      أو ملف محلي  →  assets/temoignage.mp4
  // poster: صورة الغلاف (اختيارية) → assets/poster.jpg
  video: {
    src: '',
    poster: '',
    label: 'شهادة أحد المشاركين'
  }
};

/* ----------------------------------------------------------
   نتائج الطلاب
   ⚠️ هذه بيانات نموذجية — بدّلها بنتائج حقيقية قبل النشر،
   واحذف أي بطاقة لا تملك عنها نتيجة فعلية.
   image: مسار صورة الطالب (اختياري) مثال: 'assets/ahmed.jpg'
   ---------------------------------------------------------- */
const RESULTS = [
  { name: 'اسم الطالب الأول',  wilaya: 'الولاية', badge: 'اكتب النتيجة هنا', quote: 'اكتب هنا شهادة الطالب بكلماته.', image: '' },
  { name: 'اسم الطالب الثاني', wilaya: 'الولاية', badge: 'اكتب النتيجة هنا', quote: 'اكتب هنا شهادة الطالب بكلماته.', image: '' },
  { name: 'اسم الطالب الثالث', wilaya: 'الولاية', badge: 'اكتب النتيجة هنا', quote: 'اكتب هنا شهادة الطالب بكلماته.', image: '' }
];

/* ----------------------------------------------------------
   2) قائمة الولايات
   ---------------------------------------------------------- */
const WILAYAS = [
  'أدرار','الشلف','الأغواط','أم البواقي','باتنة','بجاية','بسكرة','بشار','البليدة','البويرة',
  'تمنراست','تبسة','تلمسان','تيارت','تيزي وزو','الجزائر','الجلفة','جيجل','سطيف','سعيدة',
  'سكيكدة','سيدي بلعباس','عنابة','قالمة','قسنطينة','المدية','مستغانم','المسيلة','معسكر','ورقلة',
  'وهران','البيض','إليزي','برج بوعريريج','بومرداس','الطارف','تندوف','تيسمسيلت','الوادي','خنشلة',
  'سوق أهراس','تيبازة','ميلة','عين الدفلى','النعامة','عين تموشنت','غرداية','غليزان','تيميمون','برج باجي مختار',
  'أولاد جلال','بني عباس','عين صالح','عين قزام','تڨرت','جانت','المغير','المنيعة'
];


/* ==========================================================
   3) روابط التواصل
   ========================================================== */
function waLink(message) {
  const base = 'https://wa.me/' + CONFIG.whatsapp;
  return message ? base + '?text=' + encodeURIComponent(message) : base;
}

function initLinks() {
  const defaultMsg =
    `السلام عليكم، أريد الاستفسار عن ${CONFIG.course.title} (${CONFIG.course.date} — ${CONFIG.course.place}).`;

  document.querySelectorAll('[data-wa-link]').forEach(a => {
    a.href = waLink(defaultMsg);
  });
  document.querySelectorAll('[data-ig-link]').forEach(a => {
    a.href = CONFIG.instagram;
  });

  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
}


/* ==========================================================
   4) الشريط العلوي — حالة التمرير
   ========================================================== */
function initTopbar() {
  const bar = document.getElementById('topbar');
  if (!bar) return;
  const onScroll = () => bar.classList.toggle('is-stuck', window.scrollY > 20);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}


/* ==========================================================
   5) حركات الظهور عند التمرير
   ========================================================== */
function initReveal() {
  const items = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    items.forEach(el => el.classList.add('is-in'));
    return;
  }

  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      // تأخير بسيط متدرج داخل نفس المجموعة
      const siblings = [...entry.target.parentElement.children].filter(n => n.classList.contains('reveal'));
      const i = Math.min(siblings.indexOf(entry.target), 5);
      entry.target.style.transitionDelay = (i * 70) + 'ms';
      entry.target.classList.add('is-in');
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  items.forEach(el => io.observe(el));
}


/* ==========================================================
   5ب) نتائج الطلاب
   ========================================================== */
const escape = s => String(s == null ? '' : s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;');

function initResults() {
  const grid = document.getElementById('resultsGrid');
  const section = document.getElementById('nataij');
  if (!grid) return;

  // لا توجد نتائج → نُخفي القسم كاملاً
  if (!RESULTS.length) {
    if (section) section.hidden = true;
    return;
  }

  grid.innerHTML = RESULTS.map(r => `
    <article class="result reveal">
      <div class="result__top">
        <span class="result__ava">${
          r.image ? `<img src="${escape(r.image)}" alt="" loading="lazy">` : escape(r.name.trim().charAt(0))
        }</span>
        <span class="result__who">
          <b>${escape(r.name)}</b>
          <span>${escape(r.wilaya)}</span>
        </span>
      </div>
      ${r.badge ? `<p class="result__badge">${escape(r.badge)}</p>` : ''}
      ${r.quote ? `<p class="result__quote">${escape(r.quote)}</p>` : ''}
    </article>`).join('');
}


/* ==========================================================
   5ج) فيديو الشهادة — لا يُحمَّل إلا عند الضغط (أسرع للصفحة)
   ========================================================== */
function youtubeId(url) {
  const m = String(url).match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/);
  return m ? m[1] : '';
}

function initVideo() {
  const box = document.getElementById('videoBlock');
  const src = CONFIG.video.src.trim();
  if (!box || !src) return;   // لا فيديو → لا يظهر شيء

  const yt = youtubeId(src);
  const poster = CONFIG.video.poster
    ? `style="background-image:url('${escape(CONFIG.video.poster)}')"`
    : (yt ? `style="background-image:url('https://i.ytimg.com/vi/${yt}/hqdefault.jpg')"` : '');

  box.hidden = false;
  box.classList.add('reveal');
  box.innerHTML = `
    <div class="video">
      <button type="button" class="video__poster" ${poster} aria-label="تشغيل الفيديو">
        <span class="video__btn"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg></span>
        <span class="video__label">${escape(CONFIG.video.label)}</span>
      </button>
    </div>`;

  box.querySelector('.video__poster').addEventListener('click', e => {
    const player = yt
      ? `<iframe src="https://www.youtube-nocookie.com/embed/${yt}?autoplay=1&rel=0" title="${escape(CONFIG.video.label)}" allow="accelerometer; autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>`
      : `<video controls autoplay playsinline src="${escape(src)}"></video>`;
    e.currentTarget.closest('.video').innerHTML = player;
  });
}


/* ==========================================================
   6) الأسئلة الشائعة — فتح واحد في كل مرة
   ========================================================== */
function initFaq() {
  const all = document.querySelectorAll('.faq .qa');
  all.forEach(item => {
    item.addEventListener('toggle', () => {
      if (!item.open) return;
      all.forEach(other => { if (other !== item) other.open = false; });
    });
  });
}


/* ==========================================================
   7) نموذج التسجيل
   ========================================================== */
function initForm() {
  const form = document.getElementById('regForm');
  if (!form) return;

  // تعبئة الولايات
  const select = document.getElementById('fWilaya');
  const frag = document.createDocumentFragment();
  WILAYAS.forEach((w, i) => {
    const opt = document.createElement('option');
    opt.value = w;
    opt.textContent = String(i + 1).padStart(2, '0') + ' — ' + w;
    frag.appendChild(opt);
  });
  select.appendChild(frag);

  // تنظيف رقم الهاتف أثناء الكتابة
  const phone = document.getElementById('fPhone');
  phone.addEventListener('input', () => {
    phone.value = phone.value.replace(/[^\d+\s]/g, '');
    clearError(phone.closest('.field'), 'fPhone');
  });

  // إزالة رسالة الخطأ عند التعديل
  form.querySelectorAll('input, select, textarea').forEach(el => {
    el.addEventListener('change', () => {
      const field = el.closest('.field');
      const key = el.type === 'radio' ? el.name : el.id;
      clearError(field, key);
    });
  });

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const errors = validate(form);
    showErrors(form, errors);

    if (errors.length) {
      const first = form.querySelector('.field.is-invalid');
      if (first) {
        first.scrollIntoView({ behavior: 'smooth', block: 'center' });
        const input = first.querySelector('input, select, textarea');
        if (input) setTimeout(() => input.focus({ preventScroll: true }), 400);
      }
      return;
    }

    const data = collect(form);
    saveLocally(data);

    // الإرسال — لا يمنع ظهور رسالة النجاح إذا فشل
    let delivered = true;
    if (deliveryEnabled()) {
      const btn = form.querySelector('button[type="submit"]');
      btn.classList.add('is-loading');
      btn.disabled = true;
      try {
        await sendLead(data);
      } catch (err) {
        delivered = false;
        console.warn('تعذّر إرسال الطلب:', err);
      }
      btn.classList.remove('is-loading');
      btn.disabled = false;
    }

    showSuccess(data, delivered);
  });

  // زر "تسجيل شخص آخر"
  const again = document.getElementById('againBtn');
  if (again) {
    again.addEventListener('click', () => {
      document.getElementById('successBox').hidden = true;
      form.hidden = false;
      form.reset();
      form.querySelectorAll('.field').forEach(f => f.classList.remove('is-invalid'));
      form.querySelectorAll('.err').forEach(s => s.textContent = '');
      form.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }
}

/* --- التحقق من البيانات --- */
function validate(form) {
  const errors = [];
  const val = n => (form.elements[n] ? String(form.elements[n].value || '').trim() : '');

  if (val('name').length < 3) {
    errors.push(['fName', 'يرجى كتابة الاسم واللقب كاملاً']);
  }

  const digits = val('phone').replace(/\D/g, '');
  if (digits.length < 9) {
    errors.push(['fPhone', 'يرجى إدخال رقم هاتف صحيح']);
  }

  if (!val('wilaya')) {
    errors.push(['fWilaya', 'يرجى اختيار الولاية']);
  }

  [['experience', 'يرجى اختيار إجابة'],
   ['product', 'يرجى اختيار إجابة'],
   ['contact', 'يرجى اختيار طريقة التواصل']].forEach(([name, msg]) => {
    if (!form.querySelector(`input[name="${name}"]:checked`)) errors.push([name, msg]);
  });

  return errors;
}

function showErrors(form, errors) {
  form.querySelectorAll('.field').forEach(f => f.classList.remove('is-invalid'));
  form.querySelectorAll('.err').forEach(s => s.textContent = '');

  errors.forEach(([key, msg]) => {
    const span = form.querySelector(`.err[data-err="${key}"]`);
    if (!span) return;
    span.textContent = msg;
    span.closest('.field').classList.add('is-invalid');
  });
}

function clearError(field, key) {
  if (!field) return;
  field.classList.remove('is-invalid');
  const span = field.querySelector(`.err[data-err="${key}"]`);
  if (span) span.textContent = '';
}

/* --- جمع البيانات --- */
function collect(form) {
  const fd = new FormData(form);
  return {
    id:         'r' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
    name:       (fd.get('name')    || '').trim(),
    phone:      (fd.get('phone')   || '').trim(),
    wilaya:      fd.get('wilaya')   || '',
    experience:  fd.get('experience') || '',
    product:     fd.get('product')  || '',
    goal:       (fd.get('goal')     || '').trim(),
    contact:     fd.get('contact')  || '',
    date:        new Date().toISOString(),
    status:     'جديد',   // تُدار من لوحة التحكم admin.html
    note:       ''
  };
}

/* --- هل الإرسال مفعّل؟ --- */
function deliveryEnabled() {
  if (CONFIG.delivery === 'netlify')   return true;
  if (CONFIG.delivery === 'web3forms') return !!CONFIG.web3formsKey;
  return false;
}

/* --- توجيه الطلب حسب الطريقة المختارة --- */
function sendLead(data) {
  if (CONFIG.delivery === 'netlify')   return sendToNetlify(data);
  if (CONFIG.delivery === 'web3forms') return sendToEmail(data);
  return Promise.resolve();
}

/* --- الإرسال عبر نماذج Netlify ---
   أسماء الحقول هي نفسها الموجودة في HTML حتى يتعرّف عليها Netlify --- */
async function sendToNetlify(data) {
  const form = document.getElementById('regForm');
  const body = new URLSearchParams({
    'form-name':  form.getAttribute('name'),
    name:         data.name,
    phone:        data.phone,
    wilaya:       data.wilaya,
    experience:   data.experience,
    product:      data.product,
    goal:         data.goal || '—',
    contact:      data.contact
  });

  const res = await fetch('/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString()
  });

  if (!res.ok) throw new Error('HTTP ' + res.status);
}

/* --- الإرسال إلى البريد عبر Web3Forms (بديل) --- */
async function sendToEmail(data) {
  const res = await fetch('https://api.web3forms.com/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      access_key: CONFIG.web3formsKey,
      subject: 'طلب تسجيل جديد — ' + data.name,
      from_name: CONFIG.course.title,
      'الاسم واللقب': data.name,
      'رقم الهاتف': data.phone,
      'الولاية': data.wilaya,
      'الخبرة في التجارة الإلكترونية': data.experience,
      'لديه منتج حالياً': data.product,
      'الهدف من الدورة': data.goal || '—',
      'طريقة التواصل المفضلة': data.contact
    })
  });

  const json = await res.json().catch(() => ({}));
  if (!res.ok || !json.success) throw new Error(json.message || 'HTTP ' + res.status);
}

/* --- حفظ محلي (نسخة احتياطية في متصفح الزائر) --- */
function saveLocally(data) {
  try {
    const key = 'registrations';
    const list = JSON.parse(localStorage.getItem(key) || '[]');
    list.push(data);
    localStorage.setItem(key, JSON.stringify(list));
  } catch (_) { /* التخزين غير متاح — نتجاهل */ }
}

/* --- عرض رسالة النجاح ---
   delivered=false يعني تعذّر إرسال البريد، فنُلحّ على زر واتساب حتى لا يضيع الطلب */
function showSuccess(data, delivered = true) {
  const form = document.getElementById('regForm');
  const box  = document.getElementById('successBox');

  const sub = box.querySelector('.success__sub');
  if (sub && !delivered) {
    sub.textContent = 'لضمان وصول طلبك، أرسل لنا تأكيداً عبر واتساب من الزر أسفله.';
    sub.classList.add('success__sub--warn');
  }

  const msg = [
    'السلام عليكم، أريد تأكيد تسجيلي في ' + CONFIG.course.title,
    '',
    'الاسم: ' + data.name,
    'الهاتف: ' + data.phone,
    'الولاية: ' + data.wilaya,
    'الخبرة: ' + data.experience,
    'لدي منتج: ' + data.product,
    (data.goal ? 'الهدف: ' + data.goal : ''),
    'طريقة التواصل: ' + data.contact,
    '',
    CONFIG.course.date + ' — ' + CONFIG.course.place + ' — ' + CONFIG.course.price
  ].filter(Boolean).join('\n');

  const waBtn = box.querySelector('[data-wa-link]');
  if (waBtn) waBtn.href = waLink(msg);

  form.hidden = true;
  box.hidden = false;
  box.scrollIntoView({ behavior: 'smooth', block: 'center' });
}


/* ==========================================================
   8) التشغيل
   ========================================================== */
document.addEventListener('DOMContentLoaded', () => {
  initLinks();
  initTopbar();
  initResults();   // قبل initReveal حتى تُرصد البطاقات الجديدة
  initVideo();
  initReveal();
  initFaq();
  initForm();
});
