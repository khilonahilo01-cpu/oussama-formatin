# دورة التجارة الإلكترونية والصناعة المحلية — By Oussama Sena

صفحة هبوط + لوحة تسيير الطلبات. HTML و CSS و JavaScript فقط، بلا أي build.

## الملفات

| الملف | الدور |
|---|---|
| `index.html` · `styles.css` · `script.js` | صفحة الهبوط العمومية |
| `admin.html` · `admin.css` · `admin.js` | لوحة تسيير الطلبات — **لا تُرفع للأنترنت** |
| `favicon.svg` · `robots.txt` | أيقونة التبويب ومنع فهرسة اللوحة |
| `publish/` | **مجلد النشر الجاهز** — هذا الذي ترفعه، بلا ملفات اللوحة |

---

## خطوات الإطلاق

### 1. استقبال الطلبات — عبر Netlify Forms (لا يحتاج أي إعداد في الكود)

النموذج مضبوط مسبقاً على `delivery: 'netlify'` في `script.js`. Netlify يلتقط الطلبات وحده بمجرد رفع الموقع — بلا حساب إضافي، بلا مفتاح، وبلا حدّ شهري على الخطط الحالية.

بعد الرفع مباشرة:

1. **الطلبات**: Netlify ← موقعك ← تبويب **Forms** ← نموذج `tasjil`
2. **التنبيه بالبريد**: Forms ← **Settings** ← *Form notifications* ← **Add notification → Email** ← اكتب `ousssamaformation@gmail.com`

> ⚠️ نماذج Netlify **لا تشتغل على الحاسوب محلياً** — تنشط فقط على الموقع المرفوع. لذلك أول شيء تديره بعد الرفع: سجّل طلباً تجريبياً وتأكد أنه ظهر في تبويب Forms ووصلك بالبريد.

> إذا فشل الإرسال لأي سبب (أنترنت الزائر انقطع مثلاً)، الصفحة تعرض له رسالة صفراء تطلب منه التأكيد عبر واتساب حتى لا يضيع الطلب.

**بديل** إن أردت البريد مباشرة بدل لوحة Netlify: خذ مفتاحاً مجانياً من https://web3forms.com (250 طلب/شهر) وضع في `script.js`:

```js
delivery: 'web3forms',
web3formsKey: 'الصق-المفتاح-هنا',
```

### 2. بدّل باقي الإعدادات في `script.js`

```js
whatsapp:  '213555000000',                       // ← رقمك الحقيقي
instagram: 'https://instagram.com/oussama.sena',  // ← حسابك الحقيقي
video: { src: '' }                                // ← رابط فيديو الشهادة (يوتيوب أو ملف)

const RESULTS = [ … ];   // ← نتائج طلابك الحقيقية، أو [] فيختفي القسم
```

### 3. أعد بناء مجلد النشر

```bash
cd /Users/mac/oussama-course && rm -rf publish/*.html publish/*.css publish/*.js publish/*.svg publish/robots.txt && cp index.html styles.css script.js favicon.svg robots.txt publish/
```

### 4. ارفع

1. افتح https://app.netlify.com/drop
2. اسحب مجلد **`publish`** إلى الصفحة
3. يعطيك رابطاً فورياً بشهادة SSL
4. لربط نطاقك الخاص: `Site settings → Domain management → Add custom domain`

---

## قائمة التحقق قبل الإطلاق

- [ ] بعد الرفع: طلب تجريبي وصل إلى تبويب **Forms** في Netlify + تنبيه البريد مفعّل
- [ ] رقم واتساب حقيقي في `CONFIG.whatsapp`
- [ ] رابط إنستغرام حقيقي في `CONFIG.instagram`
- [ ] `RESULTS` فيها نتائج حقيقية أو `[]` تماماً — لا تنشر نصوصاً نموذجية
- [ ] صورة `publish/assets/og.jpg` بمقاس 1200×630 لمعاينة الرابط في واتساب وفايسبوك
- [ ] **لا ترفع `admin.*`** — كلمة السر مكتوبة داخل الملف ويقدر أي زائر يقرأها

## عند أي تعديل بعد النشر

زد رقم `?v=1` إلى `?v=2` في `index.html` (سطري `styles.css` و `script.js`) حتى يأخذ الزوار النسخة الجديدة بدل النسخة المحفوظة في متصفحهم.

## لوحة التسيير

تفتحها محلياً فقط: `http://localhost:5179/admin.html` — كلمة السر في `admin.js` (`ADMIN.password`).

⚠️ اللوحة تقرأ من `localStorage` أي أنها تعرض فقط الطلبات المسجَّلة في نفس المتصفح. مصدر الطلبات الحقيقي بعد الإطلاق هو **بريدك**. اللوحة تبقى مفيدة كسجلّ تُدخل فيه الطلبات يدوياً وتتابع حالتها. لتصبح لوحة حقيقية تتزامن من أي جهاز، الخطوة القادمة هي ربطها بـ Supabase.

## التشغيل محلياً

```bash
python3 -m http.server 5179 --directory /Users/mac/oussama-course
```

ثم افتح http://localhost:5179
