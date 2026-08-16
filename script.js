/* ==========================================================
   دورة التجارة الإلكترونية والصناعة المحلية — By Oussama Sena
   ملف الجافاسكريبت
   ========================================================== */

/* ----------------------------------------------------------
   1) الإعدادات — عدّل هذه القيم فقط
   ---------------------------------------------------------- */
const CONFIG = {
  // رقم واتساب بالصيغة الدولية بدون + وبدون مسافات (213 = الجزائر)
  whatsapp: '213558717245',

  // طريقة استقبال الطلبات:
  //   'supabase'  → قاعدة بيانات حقيقية، وهي المستعملة حالياً. اضبط القيم أسفله.
  //   'netlify'   → نماذج Netlify (تحتاج تفعيل Form detection ثم إعادة نشر)
  //   'web3forms' → يحتاج مفتاحاً من https://web3forms.com (250 طلب/شهر مجاناً)
  //   ''          → بلا إرسال: زر واتساب فقط
  delivery: 'supabase',

  // Supabase — من: Project Settings → API Keys
  // ⚠️ نفس هاتين القيمتين تُوضعان أيضاً في admin.js
  // المفتاح publishable عمومي ومكشوف عمداً؛ الحماية تأتي من سياسات RLS (انظر supabase.sql)
  // 🔴 لا تضع أبداً مفتاح sb_secret_… هنا — ذاك يتجاوز كل الحماية
  supabase: {
    url:     'https://ldqohbckqnmpvfglgdje.supabase.co',
    publishableKey: 'sb_publishable_lM5uJsvKJL0Ax1-uMAe4Jw_WyRwNFny'
  },

  // يُستعمل فقط إذا كانت delivery = 'web3forms'
  web3formsKey: '',
  // معلومات الدورة (تُستعمل في رسالة واتساب)
  course: {
    title: 'دورة التجارة الإلكترونية والصناعة المحلية',
    date: '25 و26 أوت',
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
   آراء المشاركين — تعليقات حقيقية منقولة كما كُتبت
   ⚠️ لا تضف هنا إلا تعليقاً حقيقياً تملك دليله.
   image: صورة المعلّق (اختيارية) مثال: 'assets/yakob.jpg'
   ---------------------------------------------------------- */
const REVIEWS = [
  { name: 'Melissa',
    text: 'سلام عليكم كوتش والله أفضل كوتش في دنيا دخلت فرحانة للدار', image: '' },

  { name: '«الحاجّة» لتسجيلات العمرة',
    text: 'ماشاء الله جيت مترددة والله دوك راني راضية بزاف على المعلومات، يعطيك الصحا اوسامة مدامك مع السبور', image: '' },

  { name: 'SERVICE',
    text: 'دورة في القمة، شكرا أستاذ ستفدنا منك بزاف ❤️', image: '' },

  { name: 'Foued Phone',
    text: 'افضل حاجة ديرها كي تستثمر في نفسك باش تتعلم مجال بصح. اسامة تلقى عندو غير بلغة صح، الارقام و احصائيات دقيقة، وين كل نقطة تشرح و توضح عن تجربة و خبرة كبيرة. الله يبارك 🙏', image: '' },

  { name: 'biloubilou433',
    text: 'Vraiment formation t7asha mel 9alb, des astuces, des stats réel, des chiffres réalisé. Machaa allah yaatik saha w rabi y9adrek, et même suivi après.', image: '' },

  { name: 'sabrina sabi',
    text: 'Vraiment formation numéro 1 👏 fi la Algerie pour chaque personne 7ab ybda ykhdam sérieux. Bonne courage pour tt', image: '' },

  { name: 'kids shop',
    text: 'الله يبارك، إنسان صح تع ميدان', image: '' },

  { name: 'kobya_21',
    text: 'لي حب معلومات قوة من ثيران يروح عند اسامة عينيه مغمضين 👏🔥', image: '' },

  { name: 'Yakob',
    text: 'اسامة اسطورة الخياطة فالجزائر ✅', image: '' }
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
  const section = document.getElementById('araa');
  if (!grid) return;

  // لا توجد آراء → نُخفي القسم كاملاً
  if (!REVIEWS.length) {
    if (section) section.hidden = true;
    return;
  }

  grid.innerHTML = REVIEWS.map(r => `
    <article class="result reveal">
      <div class="result__top">
        <span class="result__ava">${
          r.image ? `<img src="${escape(r.image)}" alt="" loading="lazy">` : escape(r.name.trim().charAt(0))
        }</span>
        <span class="result__who">
          <b>${escape(r.name)}</b>
        </span>
        <span class="result__stars" aria-label="خمس نجوم">★★★★★</span>
      </div>
      <p class="result__quote">${escape(r.text)}</p>
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
   5د) تتبّع مسار التحويل — حدث InitiateCheckout
   يُطلق مرة واحدة في الزيارة عندما يُبدي الزائر نيّة التسجيل:
   إما بالضغط على زر تسجيل، أو بوصول النموذج إلى شاشته.
   الفائدة: يعطي ميتا إشارات أكثر بكثير من Lead وحده،
   فتتعلّم الخوارزمية أسرع في بداية الحملة.
   ========================================================== */
function initFunnelTracking() {
  let fired = false;

  const fire = () => {
    if (fired || typeof fbq !== 'function') return;
    fired = true;
    fbq('track', 'InitiateCheckout', { content_name: CONFIG.course.title });
  };

  // 1) الضغط على أي زر يقود إلى النموذج
  document.querySelectorAll('a[href="#tasjil"]').forEach(a => {
    a.addEventListener('click', fire, { passive: true });
  });

  // 2) أو ظهور النموذج على الشاشة (لمن ينزل بالتمرير مباشرة)
  const wrap = document.querySelector('.formwrap');
  if (wrap && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      if (entries.some(e => e.isIntersecting)) { fire(); io.disconnect(); }
    }, { threshold: 0.15 });
    io.observe(wrap);
  }
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

    // فخّ الروبوتات: الحقل مخفي عن البشر، فإن كان ممتلئاً فهو روبوت.
    // نُظهر له رسالة نجاح كاذبة حتى لا يعيد المحاولة، ولا نُرسل شيئاً.
    const bot = form.elements['bot-field'];
    if (bot && bot.value.trim()) { showSuccess(collect(form)); return; }

    const data = collect(form);

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

    // حدث التحويل لميتا — بعد تسجيل بشري حقيقي فقط،
    // لا يُطلق للروبوتات لأنها ترجع من الفخّ أعلاه قبل الوصول إلى هنا.
    //
    // نستعمل CompleteRegistration لا Lead لسببين:
    //   1) ميتا تحجب حدث Lead على هذا الحساب (restricted event / suppressed)
    //   2) «إكمال تسجيل» هو الوصف الأدقّ لما يفعله هذا النموذج فعلاً
    //
    // يُرسَل مرتين بنفس المعرّف: من المتصفح ومن الخادم.
    // ميتا تدمجهما في تسجيلة واحدة بفضل eventID/event_id.
    const eventId = 'reg-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

    if (typeof fbq === 'function') {
      fbq('track', 'CompleteRegistration',
        { content_name: CONFIG.course.title, status: true },
        { eventID: eventId }
      );
    }

    sendServerEvent(data, eventId);
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
  if (CONFIG.delivery === 'supabase')  return !!(CONFIG.supabase.url && CONFIG.supabase.publishableKey);
  if (CONFIG.delivery === 'netlify')   return true;
  if (CONFIG.delivery === 'web3forms') return !!CONFIG.web3formsKey;
  return false;
}

/* --- توجيه الطلب حسب الطريقة المختارة --- */
function sendLead(data) {
  if (CONFIG.delivery === 'supabase')  return sendToSupabase(data);
  if (CONFIG.delivery === 'netlify')   return sendToNetlify(data);
  if (CONFIG.delivery === 'web3forms') return sendToEmail(data);
  return Promise.resolve();
}

/* --- نسخة الخادم من حدث التحويل (Conversions API) ---
   تصل ميتا حتى لو حجب متصفح الزائر البيكسل.
   إن لم تكن الدالة منشورة أو التوكن غير مضبوط، تفشل بصمت ولا تؤثر على شيء. */
function sendServerEvent(data, eventId) {
  fetch('/.netlify/functions/capi', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      event_id:     eventId,
      phone:        data.phone,
      content_name: CONFIG.course.title,
      source_url:   location.href
    })
  }).catch(() => { /* لا يهم — بيكسل المتصفح كافٍ */ });
}

/* --- الإرسال إلى Supabase ---
   سياسة RLS تسمح بـ INSERT فقط للزوار، أما القراءة فتتطلب دخولاً --- */
async function sendToSupabase(data) {
  const { url, publishableKey } = CONFIG.supabase;

  const res = await fetch(url.replace(/\/$/, '') + '/rest/v1/registrations', {
    method: 'POST',
    headers: {
      apikey: publishableKey,
      Authorization: 'Bearer ' + publishableKey,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal'
    },
    body: JSON.stringify({
      name:       data.name,
      phone:      data.phone,
      wilaya:     data.wilaya,
      experience: data.experience,
      product:    data.product,
      goal:       data.goal,
      contact:    data.contact
    })
  });

  if (!res.ok) throw new Error('HTTP ' + res.status + ' — ' + await res.text());
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
  initFunnelTracking();   // بعد initForm حتى يكون النموذج جاهزاً
});
