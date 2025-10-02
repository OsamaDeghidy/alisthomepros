# 🏠 A-List Home Professionals

منصة للخدمات المنزلية تربط بين أصحاب المنازل والمحترفين المهرة - مشابهة لموقع Upwork لكن مخصصة للخدمات المنزلية.

## 🚀 التقنيات المستخدمة

### Frontend Framework
- **Next.js 15.3.5** - React Framework with App Router
- **React 19.0.0** - JavaScript Library
- **TypeScript 5.0** - Type Safety

### UI & Styling
- **Tailwind CSS 4.0** - Utility-first CSS Framework
- **Lucide React 0.525.0** - Beautiful Icons
- **Next.js Fonts** - Google Fonts (Inter & Poppins)

### Development Tools
- **ESLint 9.0** - Code Linting
- **PostCSS 8.4.49** - CSS Processing
- **TypeScript Types** - Full Type Support

## 📦 المكتبات المطلوبة

### Core Dependencies
```json
{
  "next": "15.3.5",
  "react": "^19.0.0",
  "react-dom": "^19.0.0",
  "lucide-react": "^0.525.0"
}
```

### Dev Dependencies
```json
{
  "@eslint/eslintrc": "^3",
  "@tailwindcss/postcss": "^4",
  "@types/node": "^20",
  "@types/react": "^19",
  "@types/react-dom": "^19",
  "eslint": "^9",
  "eslint-config-next": "15.3.5",
  "postcss": "^8.4.49",
  "tailwindcss": "^4",
  "typescript": "^5"
}
```

## 🛠️ تثبيت المشروع

### 1. تثبيت المكتبات
```bash
# تثبيت جميع المكتبات
npm install

# أو تثبيت المكتبات الأساسية منفردة
npm install next@15.3.5 react@19.0.0 react-dom@19.0.0
npm install lucide-react@0.525.0

# تثبيت Dev Dependencies
npm install -D tailwindcss@4.0.0 @tailwindcss/postcss@4.0.0 postcss@8.4.49
npm install -D typescript@5.0.0 @types/node@20.0.0 @types/react@19.0.0 @types/react-dom@19.0.0
npm install -D eslint@9.0.0 eslint-config-next@15.3.5 @eslint/eslintrc@3.0.0
```

### 2. تشغيل المشروع
```bash
# تشغيل Development Server
npm run dev

# أو مع Turbopack (أسرع)
npm run dev --turbopack
```

### 3. بناء المشروع للإنتاج
```bash
# بناء المشروع
npm run build

# تشغيل النسخة المبنية
npm start
```

## 🎨 الألوان المستخدمة

### Primary Colors
- **Sky Blue**: `#00BFFF` - اللون الأساسي
- **Dark**: `#1F1F1F` - اللون الداكن
- **Yellow**: `#FFCE00` - اللون المميز

### CSS Variables
```css
:root {
  --primary-50: #e6fafe;
  --primary-100: #ccf5fd;
  --primary-200: #99ebfb;
  --primary-300: #66e1f9;
  --primary-400: #33d7f7;
  --primary-500: #00bfff;
  --primary-600: #0099cc;
  --primary-700: #007399;
  --primary-800: #004d66;
  --primary-900: #002633;
}
```

## 📁 بنية المشروع

```
client/
├── src/
│   ├── app/
│   │   ├── globals.css       # الستايل العام
│   │   ├── layout.tsx        # Layout رئيسي
│   │   └── page.tsx          # الصفحة الرئيسية
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx    # شريط التنقل
│   │   │   └── Footer.tsx    # الفوتر
│   │   ├── sections/
│   │   │   └── Hero.tsx      # قسم البداية
│   │   └── ui/               # UI Components
│   └── types/                # TypeScript Types
├── public/                   # الملفات العامة
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

## 🔧 أوامر مهمة

```bash
# تشغيل المشروع
npm run dev

# فحص الأخطاء
npm run lint

# بناء المشروع
npm run build

# تشغيل الإنتاج
npm start
```

## 🌟 جميع صفحات الموقع ووظائفها

### 🏠 الصفحات العامة (Public Pages)
- **`/`** - الصفحة الرئيسية: عرض الخدمات المتاحة ومقدمة عن الموقع
- **`/login`** - تسجيل الدخول: دخول المستخدمين المسجلين
- **`/register`** - إنشاء حساب: تسجيل حساب جديد للعملاء أو المحترفين
- **`/professionals`** - تصفح المحترفين: البحث عن مقدمي الخدمات المنزلية
- **`/professionals/[id]`** - بروفايل المحترف: عرض تفاصيل مقدم الخدمة وأعماله
- **`/find-work`** - البحث عن عمل: المحترفون يبحثون عن مشاريع جديدة
- **`/my-jobs`** - وظائفي: إدارة الوظائف الحالية للمحترفين
- **`/post-project`** - نشر مشروع: العملاء ينشرون مشاريعهم الجديدة
- **`/messages`** - الرسائل: التواصل بين العملاء والمحترفين مع نظام حجز المواعيد المتقدم
- **`/profile`** - الملف الشخصي: إدارة البيانات الشخصية
- **`/settings`** - الإعدادات: تخصيص حساب المستخدم
- **`/logout`** - تسجيل الخروج: خروج آمن من الحساب

### 👥 صفحات العملاء (Client Dashboard)
- **`/client/dashboard`** - لوحة تحكم العملاء: نظرة عامة على المشاريع والإحصائيات
- **`/client/projects`** - مشاريعي: إدارة ومتابعة جميع المشاريع
- **`/client/projects/[id]`** - تفاصيل المشروع: عرض تفصيلي للمشروع مع المعالم والوثائق والدفعات
- **`/client/contracts`** - العقود: إدارة عقود المشاريع والاتفاقيات
- **`/client/contracts/[id]`** - تفاصيل العقد: عرض تفصيلي للعقد مع المعالم والوثائق والتعديلات
- **`/client/payments`** - المدفوعات: إدارة الدفعات والفواتير
- **`/client/payments/methods`** - طرق الدفع: إدارة طرق الدفع (كروت، حسابات بنكية، PayPal)
- **`/client/payments/new`** - دفع جديد: إجراء دفعة جديدة للمشاريع والمعالم
- **`/client/reviews`** - التقييمات: كتابة وإدارة تقييمات المحترفين
- **`/client/favorites`** - المفضلة: قائمة المحترفين المفضلين مع إحصائيات وتفاصيل

### 🔧 صفحات المحترفين (Professional Dashboard)
- **`/professional/dashboard`** - لوحة تحكم المحترفين: نظرة عامة على الأعمال والإحصائيات
- **`/professional/proposals`** - عروضي: إدارة العروض المقدمة للمشاريع
- **`/professional/earnings`** - الأرباح: تتبع الأرباح وتاريخ الدفعات
- **`/professional/contracts`** - العقود: إدارة عقود الأعمال مع طلبات الدفع والإحصائيات
- **`/professional/portfolio`** - معرض الأعمال: عرض الأعمال السابقة بالصور والتفاصيل
- **`/professional/portfolio/new`** - إضافة مشروع جديد: رفع مشروع جديد للمعرض مع الصور والفيديوهات
- **`/professional/reviews`** - التقييمات: عرض تقييمات العملاء والرد عليها
- **`/professional/calendar`** - التقويم والمواعيد: إدارة المواعيد والجدولة مع العملاء
- **`/professional/availability`** - إعدادات التوفر: تحديد أوقات العمل وإعدادات الحجز
- **`/professional/time-tracker`** - تتبع الوقت: تسجيل وتتبع الوقت المستغرق في المشاريع
- **`/professional/tasks`** - إدارة المهام: تنظيم وتتبع مهام المشاريع المختلفة

### 🎯 نظام الأدوار (Role System)
**ملاحظة**: الأدوار تستخدم فقط للفلترة والإشعارات عند نشر المشاريع. جميع المحترفين يستخدمون نفس الصفحات والوظائف.

**الأدوار المتاحة:**
- **Home Pro** - المحترف الذي ينفذ الخدمة
- **A-List Specialist** - مستشار يقوم بالتنسيق والتخطيط  
- **Crew Member** - عضو فريق يتم توظيفه في مهمات صغيرة أو مساعدات

**الاختلافات بين الأدوار:**
- باقات الاشتراك والتسعير
- الإشعارات المستلمة حسب نوع المشروع
- فلترة المشاريع حسب الدور المطلوب

### ⚙️ صفحات الإعدادات (Settings Pages)
- **`/settings/profile`** - إعدادات الملف الشخصي: تعديل المعلومات الشخصية
- **`/settings/security`** - الأمان: إدارة كلمات المرور والأمان
- **`/settings/notifications`** - الإشعارات: تخصيص إعدادات الإشعارات
- **`/settings/payments`** - طرق الدفع: إدارة طرق الدفع والفواتير
- **`/settings/privacy`** - الخصوصية: إعدادات الخصوصية والأمان
- **`/settings/billing`** - الفواتير: سجل الفواتير والدفعات

### 📱 صفحات إضافية (Additional Pages)
- **`/help`** - مركز المساعدة: الأسئلة الشائعة والدعم
- **`/support`** - الدعم الفني: التواصل مع فريق الدعم
- **`/blog`** - المدونة: مقالات ونصائح منزلية
- **`/success-stories`** - قصص النجاح: تجارب المستخدمين الناجحة
- **`/pricing`** - الأسعار: خطط الأسعار والعضويات مع نظام الاشتراكات الجديد
- **`/terms`** - شروط الخدمة: الشروط والأحكام القانونية
- **`/privacy`** - سياسة الخصوصية: كيفية التعامل مع البيانات
- **`/about`** - حول الموقع: معلومات عن الشركة والرؤية
- **`/contact`** - اتصل بنا: طرق التواصل والعنوان

## 💳 نظام الاشتراكات الجديد (Subscription System)

### 🏠 Home Pro - للمحترفين
- **Basic**: $149.99/شهر
  - الوصول للعروض والتوظيف
  - نظام التقييم والتسويق الأساسي
  - دعم عبر البريد الإلكتروني
- **Premium**: $275/شهر (الأكثر شعبية)
  - جميع مميزات Basic
  - أدوات التسويق المتقدمة
  - دعم الأولوية وإدارة الفريق

### 👥 Crew Member - لأعضاء الفريق
- **Basic**: $89.99/شهر
  - التوظيف عند الطلب
  - الظهور في دليل الطاقم
  - تحميل معرض الأعمال
- **Premium**: $210/شهر (الأكثر شعبية)
  - جميع مميزات Basic
  - أولوية في التوظيف
  - أدوات محفظة متقدمة

### ⚙️ Specialist - للمختصين
- **Flat Rate**: $59.99/شهر
  - إدارة المشاريع الكاملة
  - تنسيق المهام ورفع التقارير
  - الوصول لجميع الأدوار

### 🔐 تكامل Stripe
- معالجة دفعات آمنة
- فوترة تلقائية شهرية
- إدارة الاشتراكات والإلغاء
- تجربة مجانية 7 أيام للباقات Premium

## 📧 التحديثات الأخيرة

### ✅ الصفحات المكتملة حديثاً
- [x] صفحة العقود للمحترفين مع طلبات الدفع
- [x] صفحة إضافة مشروع جديد للمعرض
- [x] صفحة تقييمات المحترفين مع الرد على التقييمات
- [x] صفحة تقييمات العملاء مع كتابة التقييمات
- [x] صفحة تفاصيل العقد للعملاء
- [x] صفحة طرق الدفع مع دعم Stripe
- [x] صفحة الدفع الجديد
- [x] صفحة المفضلة للعملاء
- [x] تحسينات على صفحة الرسائل مع نظام الحجز
- [x] نظام الاشتراكات الجديد مع Stripe

### 🔄 المميزات الجديدة
- **نظام الحجز المتقدم**: إدارة المواعيد مع مراعاة availability مقدم الخدمة
- **تكامل Stripe**: معالجة دفعات آمنة للاشتراكات والمدفوعات
- **إدارة المحفظة**: رفع وإدارة الصور والفيديوهات للمشاريع
- **نظام التقييمات**: تقييمات تفاعلية مع الرد والتفاعل
- **إدارة العقود**: تتبع المعالم والوثائق والتعديلات
- **نظام الدفع**: طرق دفع متعددة مع حماية الأموال

## 🌟 المميزات الحالية

### ✅ تم تطويرها
- [x] صفحة رئيسية مع Hero Section
- [x] قسم الخدمات الشائعة
- [x] قسم "كيف يعمل"
- [x] قسم المحترفين المميزين
- [x] قسم التقييمات
- [x] قسم المقالات
- [x] Header مع التنقل
- [x] Footer كامل
- [x] تصميم متجاوب
- [x] ألوان احترافية
- [x] نظام الاشتراكات مع Stripe
- [x] إدارة المحفظة والمشاريع
- [x] نظام التقييمات والتفاعل
- [x] إدارة العقود والمدفوعات
- [x] نظام الحجز والمواعيد المتقدم

### 🔄 قيد التطوير
- [ ] صفحة تسجيل الدخول
- [ ] صفحة إنشاء حساب
- [ ] صفحة البحث عن محترفين
- [ ] صفحة تفاصيل المحترف
- [ ] تكامل كامل مع Stripe للدفعات
- [ ] لوحة تحكم الأدمن

## 🎯 الاستخدام

### تشغيل المشروع أول مرة
1. تأكد من تثبيت Node.js (النسخة 18+)
2. فتح Terminal في مجلد المشروع
3. تشغيل `npm install`
4. تشغيل `npm run dev`
5. فتح المتصفح على `http://localhost:3000`

### إصلاح المشاكل الشائعة
- إذا واجهت خطأ في Tailwind: تأكد من تثبيت postcss
- إذا واجهت خطأ في TypeScript: تأكد من تثبيت جميع @types
- إذا واجهت خطأ في ESLint: تأكد من تثبيت eslint-config-next

## 📞 الدعم

للحصول على المساعدة:
1. تأكد من تثبيت جميع المكتبات المطلوبة
2. راجع ملف `requirements.txt` للمكتبات الكاملة
3. تأكد من استخدام النسخ الصحيحة من المكتبات

---

**آخر تحديث**: يناير 2025
**الحالة**: ✅ جاهز للاستخدام مع نظام الاشتراكات الجديد




echo "# upwork_homes" >> README.md
git init
git add README.md
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/OsamaDeghidy/upwork_homes.git
git push -u origin main
…or push an existing repository from the command line
git remote add origin https://github.com/OsamaDeghidy/upwork_homes.git
git branch -M main
git push -u origin main






[01:06:44.788] Running build in Washington, D.C., USA (East) – iad1
[01:06:44.789] Build machine configuration: 2 cores, 8 GB
[01:06:44.883] Cloning github.com/OsamaDeghidy/upwork_homes (Branch: master, Commit: db9cdf7)
[01:06:45.280] Previous build caches not available
[01:06:45.772] Cloning completed: 888.000ms
[01:06:46.764] Running "vercel build"
[01:06:47.232] Vercel CLI 44.3.0
[01:06:47.587] Installing dependencies...
[01:07:00.461] 
[01:07:00.462] added 402 packages in 13s
[01:07:00.462] 
[01:07:00.462] 161 packages are looking for funding
[01:07:00.462]   run `npm fund` for details
[01:07:00.515] Detected Next.js version: 15.3.5
[01:07:00.519] Running "npm run build"
[01:07:00.627] 
[01:07:00.627] > client@0.1.0 build
[01:07:00.627] > next build
[01:07:00.628] 
[01:07:01.242] Attention: Next.js now collects completely anonymous telemetry regarding usage.
[01:07:01.242] This information is used to shape Next.js' roadmap and prioritize features.
[01:07:01.242] You can learn more, including how to opt-out if you'd not like to participate in this anonymous program, by visiting the following URL:
[01:07:01.242] https://nextjs.org/telemetry
[01:07:01.242] 
[01:07:01.338]    ▲ Next.js 15.3.5
[01:07:01.338] 
[01:07:01.371]    Creating an optimized production build ...
[01:07:19.862]  ✓ Compiled successfully in 15.0s
[01:07:19.867]    Linting and checking validity of types ...
[01:07:29.459] 
[01:07:29.459] Failed to compile.
[01:07:29.459] 
[01:07:29.459] ./src/app/about/page.tsx
[01:07:29.459] 4:10  Error: 'Users' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.459] 4:47  Error: 'CheckCircle' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.459] 47:17  Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
[01:07:29.460] 87:28  Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
[01:07:29.460] 94:15  Warning: Using `<img>` could result in slower LCP and higher bandwidth. Consider using `<Image />` from `next/image` or a custom image loader to automatically optimize images. This may incur additional usage or cost from your provider. See: https://nextjs.org/docs/messages/no-img-element  @next/next/no-img-element
[01:07:29.460] 144:17  Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
[01:07:29.460] 167:17  Warning: Using `<img>` could result in slower LCP and higher bandwidth. Consider using `<Image />` from `next/image` or a custom image loader to automatically optimize images. This may incur additional usage or cost from your provider. See: https://nextjs.org/docs/messages/no-img-element  @next/next/no-img-element
[01:07:29.460] 188:26  Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
[01:07:29.460] 189:17  Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
[01:07:29.460] 
[01:07:29.460] ./src/app/client/contracts/[id]/page.tsx
[01:07:29.460] 15:3  Error: 'DollarSign' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.461] 17:3  Error: 'MapPin' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.461] 18:3  Error: 'User' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.461] 19:3  Error: 'Shield' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.461] 20:3  Error: 'Award' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.461] 22:3  Error: 'TrendingUp' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.461] 24:3  Error: 'Users' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.461] 28:3  Error: 'Settings' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.461] 32:3  Error: 'Minus' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.461] 35:3  Error: 'Globe' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.461] 36:3  Error: 'ExternalLink' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.461] 37:3  Error: 'Copy' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.462] 38:3  Error: 'RefreshCw' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.462] 39:3  Error: 'Save' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.462] 40:3  Error: 'X' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.462] 42:3  Error: 'Info' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.462] 43:3  Error: 'HelpCircle' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.462] 45:3  Error: 'Activity' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.462] 46:3  Error: 'Zap' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.462] 47:3  Error: 'Package' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.463] 48:3  Error: 'Truck' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.463] 49:3  Error: 'Construction' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.463] 50:3  Error: 'Hammer' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.463] 51:3  Error: 'Wrench' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.463] 52:3  Error: 'PaintBucket' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.470] 53:3  Error: 'Lightbulb' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.470] 54:3  Error: 'Gauge' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.470] 55:3  Error: 'Scale' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.470] 56:3  Error: 'Percent' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.471] 59:3  Error: 'Bookmark' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.471] 60:3  Error: 'Tag' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.471] 61:3  Error: 'Archive' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.471] 62:3  Error: 'Folder' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.471] 63:3  Error: 'FolderOpen' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.471] 65:3  Error: 'Image' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.471] 66:3  Error: 'Video' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.471] 67:3  Error: 'Mic' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.471] 68:3  Error: 'Speaker' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.471] 69:3  Error: 'Headphones' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.471] 70:3  Error: 'Keyboard' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.471] 71:3  Error: 'Mouse' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.471] 72:3  Error: 'Monitor' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.471] 73:3  Error: 'Smartphone' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.471] 74:3  Error: 'Tablet' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.471] 75:3  Error: 'Laptop' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.479] 76:14  Error: 'PrinterIcon' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.479] 77:3  Error: 'Camera' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.479] 78:3  Error: 'Home' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.479] 79:3  Error: 'Building' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.479] 80:3  Error: 'Briefcase' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.479] 81:3  Error: 'UserCheck' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.479] 82:3  Error: 'UserX' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.479] 83:3  Error: 'UserPlus' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.479] 84:3  Error: 'UserMinus' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.479] 85:3  Error: 'Crown' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.481] 86:3  Error: 'Medal' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.481] 87:3  Error: 'Trophy' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.482] 88:3  Error: 'Ribbon' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.482] 89:3  Error: 'Gift' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.484] 90:3  Error: 'ShoppingCart' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.485] 91:3  Error: 'ShoppingBag' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.485] 92:3  Error: 'Wallet' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.485] 93:3  Error: 'Banknote' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.485] 94:3  Error: 'Coins' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.485] 95:3  Error: 'Calculator' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.485] 96:3  Error: 'Thermometer' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.485] 97:3  Error: 'Battery' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.485] 98:3  Error: 'Wifi' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.485] 99:3  Error: 'Signal' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.486] 100:3  Error: 'Bluetooth' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.486] 101:3  Error: 'Usb' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.486] 102:3  Error: 'Plug' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.486] 103:3  Error: 'Power' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.486] 104:3  Error: 'Flame' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.494] 105:3  Error: 'Snowflake' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.494] 106:3  Error: 'Droplets' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.494] 107:3  Error: 'Wind' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.494] 108:3  Error: 'Cloud' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.494] 109:3  Error: 'Sun' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.494] 110:3  Error: 'Moon' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.494] 111:3  Error: 'Umbrella' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.494] 119:10  Error: 'showSignModal' is assigned a value but never used.  @typescript-eslint/no-unused-vars
[01:07:29.495] 120:10  Error: 'showAmendmentModal' is assigned a value but never used.  @typescript-eslint/no-unused-vars
[01:07:29.495] 354:9  Error: 'getStatusIcon' is assigned a value but never used.  @typescript-eslint/no-unused-vars
[01:07:29.495] 532:60  Error: 'index' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.495] 780:17  Warning: Using `<img>` could result in slower LCP and higher bandwidth. Consider using `<Image />` from `next/image` or a custom image loader to automatically optimize images. This may incur additional usage or cost from your provider. See: https://nextjs.org/docs/messages/no-img-element  @next/next/no-img-element
[01:07:29.495] 
[01:07:29.495] ./src/app/client/contracts/page.tsx
[01:07:29.495] 9:3  Error: 'Edit2' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.495] 16:3  Error: 'User' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.495] 17:3  Error: 'Filter' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.498] 21:3  Error: 'Award' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.498] 25:3  Error: 'Users' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.499] 28:3  Error: 'Receipt' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.499] 29:3  Error: 'Settings' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.499] 420:19  Warning: Using `<img>` could result in slower LCP and higher bandwidth. Consider using `<Image />` from `next/image` or a custom image loader to automatically optimize images. This may incur additional usage or cost from your provider. See: https://nextjs.org/docs/messages/no-img-element  @next/next/no-img-element
[01:07:29.499] 
[01:07:29.499] ./src/app/client/dashboard/page.tsx
[01:07:29.499] 6:3  Error: 'BarChart3' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.500] 12:3  Error: 'MessageCircle' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.500] 16:3  Error: 'AlertCircle' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.500] 18:3  Error: 'Eye' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.500] 19:3  Error: 'Heart' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.500] 20:3  Error: 'FileText' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.500] 21:3  Error: 'Filter' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.500] 22:3  Error: 'Search' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.501] 23:3  Error: 'Bell' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.501] 26:3  Error: 'Award' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.501] 27:3  Error: 'Shield' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.501] 31:10  Error: 'selectedPeriod' is assigned a value but never used.  @typescript-eslint/no-unused-vars
[01:07:29.501] 31:26  Error: 'setSelectedPeriod' is assigned a value but never used.  @typescript-eslint/no-unused-vars
[01:07:29.501] 209:21  Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
[01:07:29.501] 209:28  Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
[01:07:29.501] 270:25  Warning: Using `<img>` could result in slower LCP and higher bandwidth. Consider using `<Image />` from `next/image` or a custom image loader to automatically optimize images. This may incur additional usage or cost from your provider. See: https://nextjs.org/docs/messages/no-img-element  @next/next/no-img-element
[01:07:29.502] 369:21  Warning: Using `<img>` could result in slower LCP and higher bandwidth. Consider using `<Image />` from `next/image` or a custom image loader to automatically optimize images. This may incur additional usage or cost from your provider. See: https://nextjs.org/docs/messages/no-img-element  @next/next/no-img-element
[01:07:29.502] 410:21  Warning: Using `<img>` could result in slower LCP and higher bandwidth. Consider using `<Image />` from `next/image` or a custom image loader to automatically optimize images. This may incur additional usage or cost from your provider. See: https://nextjs.org/docs/messages/no-img-element  @next/next/no-img-element
[01:07:29.502] 
[01:07:29.502] ./src/app/client/favorites/page.tsx
[01:07:29.503] 9:3  Error: 'Calendar' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.503] 10:3  Error: 'DollarSign' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.503] 11:3  Error: 'User' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.503] 12:3  Error: 'Phone' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.503] 13:3  Error: 'Mail' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.504] 14:3  Error: 'MessageCircle' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.504] 17:3  Error: 'Filter' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.504] 21:3  Error: 'Plus' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.504] 22:3  Error: 'X' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.504] 23:3  Error: 'Check' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.505] 26:3  Error: 'Award' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.505] 27:3  Error: 'Shield' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.505] 28:3  Error: 'TrendingUp' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.505] 29:3  Error: 'Users' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.505] 30:3  Error: 'Briefcase' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.506] 31:3  Error: 'Target' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.506] 32:3  Error: 'Activity' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.506] 33:3  Error: 'BarChart3' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.506] 34:3  Error: 'PieChart' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.506] 35:3  Error: 'LineChart' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.507] 36:3  Error: 'Zap' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.507] 37:3  Error: 'Package' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.507] 38:3  Error: 'Truck' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.507] 39:3  Error: 'Construction' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.507] 40:3  Error: 'Hammer' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.508] 41:3  Error: 'Wrench' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.508] 42:3  Error: 'PaintBucket' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.508] 43:3  Error: 'Lightbulb' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.508] 44:3  Error: 'Gauge' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.508] 45:3  Error: 'Scale' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.509] 46:3  Error: 'Timer' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.509] 47:3  Error: 'Flag' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.509] 48:3  Error: 'Bookmark' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.509] 49:3  Error: 'Tag' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.509] 50:3  Error: 'Archive' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.509] 51:3  Error: 'Folder' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.510] 52:3  Error: 'FolderOpen' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.510] 53:3  Error: 'File' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.510] 54:3  Error: 'FileText' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.510] 55:3  Error: 'Image' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.510] 56:3  Error: 'Video' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.510] 57:3  Error: 'Mic' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.510] 58:3  Error: 'Speaker' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.511] 59:3  Error: 'Headphones' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.511] 60:3  Error: 'Keyboard' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.511] 61:3  Error: 'Mouse' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.511] 62:3  Error: 'Monitor' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.511] 63:3  Error: 'Smartphone' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.511] 64:3  Error: 'Tablet' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.511] 65:3  Error: 'Laptop' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.512] 66:3  Error: 'Printer' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.512] 67:3  Error: 'Camera' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.512] 68:3  Error: 'Home' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.512] 69:3  Error: 'Building' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.512] 70:3  Error: 'UserCheck' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.512] 71:3  Error: 'UserX' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.512] 72:3  Error: 'UserPlus' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.513] 73:3  Error: 'UserMinus' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.513] 74:3  Error: 'Crown' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.513] 75:3  Error: 'Medal' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.513] 76:3  Error: 'Trophy' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.513] 77:3  Error: 'Ribbon' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.513] 78:3  Error: 'Gift' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.513] 79:3  Error: 'ShoppingCart' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.514] 80:3  Error: 'ShoppingBag' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.514] 81:3  Error: 'CreditCard' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.514] 82:3  Error: 'Wallet' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.514] 83:3  Error: 'Receipt' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.514] 84:3  Error: 'Banknote' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.514] 85:3  Error: 'Coins' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.514] 86:3  Error: 'Calculator' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.515] 87:3  Error: 'Percent' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.515] 88:3  Error: 'Thermometer' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.515] 89:3  Error: 'Battery' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.515] 90:3  Error: 'Wifi' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.515] 91:3  Error: 'Signal' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.515] 92:3  Error: 'Bluetooth' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.515] 93:3  Error: 'Usb' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.516] 94:3  Error: 'Plug' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.516] 95:3  Error: 'Power' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.516] 96:3  Error: 'Flame' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.516] 97:3  Error: 'Snowflake' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.516] 98:3  Error: 'Droplets' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.516] 99:3  Error: 'Wind' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.516] 100:3  Error: 'Cloud' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.517] 101:3  Error: 'Sun' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.517] 102:3  Error: 'Moon' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.517] 103:3  Error: 'Umbrella' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.517] 104:3  Error: 'ExternalLink' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.517] 105:3  Error: 'Copy' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.517] 106:3  Error: 'RefreshCw' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.517] 107:3  Error: 'Download' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.518] 108:3  Error: 'Upload' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.518] 109:3  Error: 'Save' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.518] 110:3  Error: 'Edit2' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.518] 111:3  Error: 'Trash2' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.518] 112:3  Error: 'Settings' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.518] 113:3  Error: 'Bell' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.518] 114:3  Error: 'Info' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.519] 115:3  Error: 'HelpCircle' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.519] 116:3  Error: 'AlertCircle' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.519] 117:3  Error: 'Share2' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.519] 274:46  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
[01:07:29.519] 443:27  Warning: Using `<img>` could result in slower LCP and higher bandwidth. Consider using `<Image />` from `next/image` or a custom image loader to automatically optimize images. This may incur additional usage or cost from your provider. See: https://nextjs.org/docs/messages/no-img-element  @next/next/no-img-element
[01:07:29.519] 474:27  Warning: Using `<img>` could result in slower LCP and higher bandwidth. Consider using `<Image />` from `next/image` or a custom image loader to automatically optimize images. This may incur additional usage or cost from your provider. See: https://nextjs.org/docs/messages/no-img-element  @next/next/no-img-element
[01:07:29.519] 543:23  Warning: Using `<img>` could result in slower LCP and higher bandwidth. Consider using `<Image />` from `next/image` or a custom image loader to automatically optimize images. This may incur additional usage or cost from your provider. See: https://nextjs.org/docs/messages/no-img-element  @next/next/no-img-element
[01:07:29.520] 
[01:07:29.520] ./src/app/client/payments/methods/page.tsx
[01:07:29.521] 11:3  Error: 'Check' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.521] 14:3  Error: 'Star' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.521] 17:3  Error: 'Smartphone' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.521] 18:3  Error: 'Globe' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.521] 19:3  Error: 'Lock' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.522] 20:3  Error: 'Eye' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.522] 21:3  Error: 'EyeOff' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.522] 22:3  Error: 'Settings' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.522] 23:3  Error: 'Info' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.522] 27:3  Error: 'DollarSign' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.522] 28:3  Error: 'Percent' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.522] 29:3  Error: 'Calendar' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.523] 30:3  Error: 'User' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.523] 31:3  Error: 'Mail' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.523] 32:3  Error: 'Phone' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.523] 33:3  Error: 'MapPin' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.523] 34:3  Error: 'Flag' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.523] 35:3  Error: 'Copy' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.523] 36:3  Error: 'ExternalLink' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.525] 37:3  Error: 'RefreshCw' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.525] 38:3  Error: 'Download' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.525] 39:3  Error: 'Upload' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.525] 40:3  Error: 'Save' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.525] 41:3  Error: 'Bell' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.525] 42:3  Error: 'Award' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.526] 43:3  Error: 'Target' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.526] 44:3  Error: 'TrendingUp' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.526] 45:3  Error: 'Activity' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.526] 46:3  Error: 'BarChart3' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.526] 47:3  Error: 'PieChart' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.526] 48:3  Error: 'LineChart' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.527] 49:3  Error: 'Zap' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.527] 50:3  Error: 'Package' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.527] 51:3  Error: 'Truck' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.528] 52:3  Error: 'Construction' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.528] 53:3  Error: 'Hammer' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.528] 54:3  Error: 'Wrench' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.528] 55:3  Error: 'PaintBucket' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.528] 56:3  Error: 'Lightbulb' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.528] 57:3  Error: 'Gauge' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.528] 58:3  Error: 'Scale' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.529] 59:3  Error: 'Timer' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.529] 60:3  Error: 'Bookmark' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.529] 61:3  Error: 'Tag' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.529] 62:3  Error: 'Archive' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.530] 63:3  Error: 'Folder' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.530] 64:3  Error: 'FolderOpen' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.530] 65:3  Error: 'File' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.530] 66:3  Error: 'FileText' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.530] 67:3  Error: 'Image' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.531] 68:3  Error: 'Video' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.531] 69:3  Error: 'Mic' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.531] 70:3  Error: 'Speaker' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.532] 71:3  Error: 'Headphones' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.532] 72:3  Error: 'Keyboard' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.532] 73:3  Error: 'Mouse' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.532] 74:3  Error: 'Monitor' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.532] 75:3  Error: 'Tablet' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.533] 76:3  Error: 'Laptop' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.533] 77:3  Error: 'Printer' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.533] 78:3  Error: 'Camera' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.533] 79:3  Error: 'Home' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.534] 80:3  Error: 'Briefcase' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.534] 81:3  Error: 'Users' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.534] 82:3  Error: 'UserCheck' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.534] 83:3  Error: 'UserX' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.534] 84:3  Error: 'UserPlus' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.535] 85:3  Error: 'UserMinus' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.535] 86:3  Error: 'Crown' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.535] 87:3  Error: 'Medal' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.535] 88:3  Error: 'Trophy' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.536] 89:3  Error: 'Ribbon' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.536] 90:3  Error: 'Gift' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.536] 91:3  Error: 'ShoppingCart' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.536] 92:3  Error: 'ShoppingBag' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.536] 93:3  Error: 'Receipt' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.536] 94:3  Error: 'Banknote' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.536] 95:3  Error: 'Coins' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.536] 96:3  Error: 'Calculator' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.536] 97:3  Error: 'Balance' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.536] 98:3  Error: 'Thermometer' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.537] 99:3  Error: 'Battery' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.537] 100:3  Error: 'Wifi' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.537] 101:3  Error: 'Signal' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.537] 102:3  Error: 'Bluetooth' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.537] 103:3  Error: 'Usb' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.537] 104:3  Error: 'Plug' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.537] 105:3  Error: 'Power' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.537] 106:3  Error: 'Flame' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.537] 107:3  Error: 'Snowflake' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.537] 108:3  Error: 'Droplets' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.537] 109:3  Error: 'Wind' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.537] 110:3  Error: 'Cloud' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.537] 111:3  Error: 'Sun' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.537] 112:3  Error: 'Moon' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.537] 113:3  Error: 'Umbrella' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.537] 119:56  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
[01:07:29.537] 
[01:07:29.537] ./src/app/client/payments/new/page.tsx
[01:07:29.537] 9:3  Error: 'Calendar' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.537] 11:3  Error: 'Clock' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.537] 12:3  Error: 'AlertCircle' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.537] 15:3  Error: 'Lock' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.537] 16:3  Error: 'User' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.537] 17:3  Error: 'MapPin' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.537] 18:3  Error: 'Star' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.537] 19:3  Error: 'FileText' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.537] 20:3  Error: 'Receipt' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.538] 23:3  Error: 'Check' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.538] 24:3  Error: 'Eye' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.538] 25:3  Error: 'Bank' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.538] 27:3  Error: 'Calculator' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.538] 28:3  Error: 'Percent' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.538] 29:3  Error: 'Plus' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.538] 30:3  Error: 'Minus' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.538] 31:3  Error: 'Target' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.538] 32:3  Error: 'Flag' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.538] 33:3  Error: 'Timer' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.538] 34:3  Error: 'Award' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.538] 35:3  Error: 'TrendingUp' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.538] 36:3  Error: 'Activity' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.538] 37:3  Error: 'BarChart3' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.538] 38:3  Error: 'PieChart' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.538] 39:3  Error: 'LineChart' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.538] 40:3  Error: 'Zap' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.538] 41:3  Error: 'Package' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.538] 42:3  Error: 'Truck' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.538] 43:3  Error: 'Construction' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.538] 44:3  Error: 'Hammer' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.538] 45:3  Error: 'Wrench' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.538] 46:3  Error: 'PaintBucket' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.538] 47:3  Error: 'Lightbulb' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.538] 48:3  Error: 'Gauge' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.538] 49:3  Error: 'Scale' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.538] 50:3  Error: 'Bookmark' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.538] 51:3  Error: 'Tag' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.539] 52:3  Error: 'Archive' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.539] 53:3  Error: 'Folder' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.539] 54:3  Error: 'FolderOpen' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.539] 55:3  Error: 'File' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.539] 56:3  Error: 'Image' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.539] 57:3  Error: 'Video' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.539] 58:3  Error: 'Mic' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.539] 59:3  Error: 'Speaker' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.539] 60:3  Error: 'Headphones' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.539] 61:3  Error: 'Keyboard' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.539] 62:3  Error: 'Mouse' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.539] 63:3  Error: 'Monitor' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.539] 64:3  Error: 'Smartphone' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.539] 65:3  Error: 'Tablet' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.539] 66:3  Error: 'Laptop' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.539] 67:3  Error: 'Printer' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.539] 68:3  Error: 'Camera' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.539] 69:3  Error: 'Home' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.539] 70:3  Error: 'Building' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.539] 71:3  Error: 'Briefcase' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.539] 72:3  Error: 'Users' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.539] 73:3  Error: 'UserCheck' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.539] 74:3  Error: 'UserX' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.539] 75:3  Error: 'UserPlus' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.539] 76:3  Error: 'UserMinus' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.539] 77:3  Error: 'Crown' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.539] 78:3  Error: 'Medal' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.540] 79:3  Error: 'Trophy' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.540] 80:3  Error: 'Ribbon' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.540] 81:3  Error: 'Gift' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.540] 82:3  Error: 'ShoppingCart' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.540] 83:3  Error: 'ShoppingBag' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.540] 84:3  Error: 'Banknote' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.540] 85:3  Error: 'Coins' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.540] 86:3  Error: 'Balance' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.540] 87:3  Error: 'Thermometer' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.540] 88:3  Error: 'Battery' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.540] 89:3  Error: 'Wifi' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.540] 90:3  Error: 'Signal' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.540] 91:3  Error: 'Bluetooth' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.540] 92:3  Error: 'Usb' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.540] 93:3  Error: 'Plug' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.540] 94:3  Error: 'Power' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.540] 95:3  Error: 'Flame' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.540] 96:3  Error: 'Snowflake' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.540] 97:3  Error: 'Droplets' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.540] 98:3  Error: 'Wind' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.541] 99:3  Error: 'Cloud' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.541] 100:3  Error: 'Sun' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.541] 101:3  Error: 'Moon' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.541] 102:3  Error: 'Umbrella' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.541] 510:53  Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
[01:07:29.541] 
[01:07:29.541] ./src/app/client/payments/page.tsx
[01:07:29.541] 9:3  Error: 'Eye' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.542] 16:3  Error: 'MapPin' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.542] 18:3  Error: 'Filter' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.542] 21:3  Error: 'FileText' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.542] 23:3  Error: 'Shield' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.542] 24:3  Error: 'Star' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.542] 26:3  Error: 'ArrowUpRight' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.543] 27:3  Error: 'ArrowDownRight' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.543] 28:3  Error: 'Users' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.543] 29:3  Error: 'Settings' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.543] 30:3  Error: 'Bell' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.543] 31:3  Error: 'MessageCircle' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.543] 
[01:07:29.543] ./src/app/client/projects/[id]/page.tsx
[01:07:29.543] 8:3  Error: 'MapPin' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.543] 14:3  Error: 'AlertCircle' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.543] 18:3  Error: 'Edit2' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.543] 19:3  Error: 'Trash2' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.543] 20:3  Error: 'Plus' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.544] 24:3  Error: 'Image' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.544] 25:3  Error: 'Video' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.544] 26:3  Error: 'User' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.544] 27:3  Error: 'Users' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.544] 28:3  Error: 'Award' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.544] 30:3  Error: 'TrendingUp' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.544] 31:3  Error: 'Eye' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.544] 32:3  Error: 'Heart' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.544] 33:3  Error: 'Share2' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.544] 34:3  Error: 'Settings' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.544] 36:3  Error: 'Receipt' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.545] 41:3  Error: 'Banknote' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.545] 42:3  Error: 'Wallet' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.545] 43:3  Error: 'Send' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.545] 45:3  Error: 'Check' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.545] 47:3  Error: 'Calculator' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.545] 48:3  Error: 'PieChart' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.545] 49:3  Error: 'BarChart3' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.545] 50:3  Error: 'TrendingDown' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.545] 51:3  Error: 'RefreshCw' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.545] 52:3  Error: 'ExternalLink' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.545] 53:3  Error: 'Copy' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.545] 55:3  Error: 'HelpCircle' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.546] 56:3  Error: 'Target' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.546] 57:3  Error: 'Activity' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.546] 58:3  Error: 'Zap' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.546] 59:3  Error: 'Package' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.546] 60:3  Error: 'Truck' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.546] 61:3  Error: 'Construction' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.546] 62:3  Error: 'Hammer' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.546] 63:3  Error: 'Wrench' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.546] 64:3  Error: 'PaintBucket' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.546] 65:3  Error: 'Lightbulb' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.546] 66:3  Error: 'Gauge' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.546] 67:3  Error: 'Scale' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.546] 68:3  Error: 'Percent' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.546] 69:3  Error: 'LineChart' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.546] 70:3  Error: 'Database' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.546] 71:3  Error: 'Cloud' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.546] 72:3  Error: 'Server' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.546] 73:3  Error: 'Monitor' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.547] 74:3  Error: 'Smartphone' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.547] 75:3  Error: 'Tablet' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.547] 76:3  Error: 'Laptop' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.547] 77:3  Error: 'Desktop' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.547] 78:3  Error: 'Printer' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.547] 79:3  Error: 'Camera' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.547] 80:3  Error: 'Mic' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.547] 81:3  Error: 'Speaker' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.547] 82:3  Error: 'Headphones' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.547] 83:3  Error: 'Keyboard' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.547] 84:3  Error: 'Mouse' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.547] 85:3  Error: 'Gamepad' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.547] 86:3  Error: 'Joystick' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.547] 94:10  Error: 'showMilestones' is assigned a value but never used.  @typescript-eslint/no-unused-vars
[01:07:29.547] 94:26  Error: 'setShowMilestones' is assigned a value but never used.  @typescript-eslint/no-unused-vars
[01:07:29.548] 96:62  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
[01:07:29.548] 307:37  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
[01:07:29.548] 530:27  Warning: Using `<img>` could result in slower LCP and higher bandwidth. Consider using `<Image />` from `next/image` or a custom image loader to automatically optimize images. This may incur additional usage or cost from your provider. See: https://nextjs.org/docs/messages/no-img-element  @next/next/no-img-element
[01:07:29.548] 553:51  Error: 'index' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.548] 746:29  Warning: Using `<img>` could result in slower LCP and higher bandwidth. Consider using `<Image />` from `next/image` or a custom image loader to automatically optimize images. This may incur additional usage or cost from your provider. See: https://nextjs.org/docs/messages/no-img-element  @next/next/no-img-element
[01:07:29.548] 819:17  Warning: Using `<img>` could result in slower LCP and higher bandwidth. Consider using `<Image />` from `next/image` or a custom image loader to automatically optimize images. This may incur additional usage or cost from your provider. See: https://nextjs.org/docs/messages/no-img-element  @next/next/no-img-element
[01:07:29.548] 
[01:07:29.548] ./src/app/client/projects/page.tsx
[01:07:29.548] 6:3  Error: 'Filter' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.548] 14:3  Error: 'Clock' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.548] 15:3  Error: 'CheckCircle' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.548] 16:3  Error: 'AlertCircle' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.549] 18:3  Error: 'Eye' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.549] 19:3  Error: 'Edit2' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.549] 20:3  Error: 'Trash2' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.549] 22:3  Error: 'ChevronDown' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.549] 23:3  Error: 'Users' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.549] 369:21  Warning: Using `<img>` could result in slower LCP and higher bandwidth. Consider using `<Image />` from `next/image` or a custom image loader to automatically optimize images. This may incur additional usage or cost from your provider. See: https://nextjs.org/docs/messages/no-img-element  @next/next/no-img-element
[01:07:29.549] 398:21  Warning: Using `<img>` could result in slower LCP and higher bandwidth. Consider using `<Image />` from `next/image` or a custom image loader to automatically optimize images. This may incur additional usage or cost from your provider. See: https://nextjs.org/docs/messages/no-img-element  @next/next/no-img-element
[01:07:29.549] 497:27  Warning: Using `<img>` could result in slower LCP and higher bandwidth. Consider using `<Image />` from `next/image` or a custom image loader to automatically optimize images. This may incur additional usage or cost from your provider. See: https://nextjs.org/docs/messages/no-img-element  @next/next/no-img-element
[01:07:29.549] 
[01:07:29.550] ./src/app/client/reviews/page.tsx
[01:07:29.550] 8:3  Error: 'Filter' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.550] 10:3  Error: 'Calendar' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.550] 12:3  Error: 'MapPin' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.550] 15:3  Error: 'Trash2' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.550] 18:3  Error: 'Clock' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.550] 19:3  Error: 'AlertCircle' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.550] 22:3  Error: 'Download' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.550] 23:12  Error: 'ImageIcon' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.550] 24:3  Error: 'Upload' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.551] 25:3  Error: 'Camera' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.551] 30:3  Error: 'Flag' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.551] 31:3  Error: 'Award' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.551] 32:3  Error: 'Shield' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.551] 33:3  Error: 'Target' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.551] 34:3  Error: 'TrendingUp' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.551] 35:3  Error: 'Heart' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.551] 36:3  Error: 'Bookmark' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.551] 37:3  Error: 'Tag' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.551] 38:3  Error: 'FileText' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.552] 39:3  Error: 'Phone' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.552] 40:3  Error: 'Mail' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.552] 41:3  Error: 'Globe' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.552] 42:3  Error: 'ExternalLink' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.552] 43:3  Error: 'Copy' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.552] 44:3  Error: 'RefreshCw' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.552] 45:3  Error: 'Save' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.552] 46:3  Error: 'Info' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.552] 47:3  Error: 'HelpCircle' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.552] 48:3  Error: 'Settings' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.552] 49:3  Error: 'Bell' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.552] 50:3  Error: 'Archive' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.553] 51:3  Error: 'Folder' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.553] 52:3  Error: 'FolderOpen' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.553] 53:3  Error: 'File' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.553] 54:3  Error: 'Video' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.553] 55:3  Error: 'Mic' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.553] 56:3  Error: 'Speaker' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.553] 57:3  Error: 'Headphones' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.553] 58:3  Error: 'Keyboard' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.553] 59:3  Error: 'Mouse' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.553] 60:3  Error: 'Monitor' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.553] 61:3  Error: 'Smartphone' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.553] 62:3  Error: 'Tablet' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.554] 63:3  Error: 'Laptop' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.554] 64:3  Error: 'Printer' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.554] 66:3  Error: 'Home' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.554] 67:3  Error: 'Building' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.554] 68:3  Error: 'Briefcase' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.554] 69:3  Error: 'Users' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.554] 70:3  Error: 'UserCheck' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.554] 71:3  Error: 'UserX' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.554] 72:3  Error: 'UserPlus' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.554] 73:3  Error: 'UserMinus' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.554] 74:3  Error: 'Crown' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.555] 75:3  Error: 'Medal' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.555] 76:3  Error: 'Trophy' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.555] 77:3  Error: 'Ribbon' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.555] 78:3  Error: 'Gift' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.555] 79:3  Error: 'Package' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.555] 80:3  Error: 'ShoppingCart' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.555] 81:3  Error: 'ShoppingBag' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.555] 82:3  Error: 'CreditCard' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.555] 83:3  Error: 'Wallet' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.556] 84:3  Error: 'Receipt' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.556] 85:3  Error: 'Banknote' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.556] 86:3  Error: 'Coins' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.556] 87:3  Error: 'DollarSign' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.556] 88:3  Error: 'Percent' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.556] 89:3  Error: 'Calculator' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.556] 90:3  Error: 'Scale' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.556] 91:3  Error: 'Balance' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.556] 92:3  Error: 'Gauge' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.556] 93:3  Error: 'Meter' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.556] 94:3  Error: 'Thermometer' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.556] 95:3  Error: 'Battery' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.556] 96:3  Error: 'Wifi' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.557] 97:3  Error: 'Signal' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.557] 98:3  Error: 'Bluetooth' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.558] 99:3  Error: 'Usb' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.558] 100:3  Error: 'Plug' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.558] 101:3  Error: 'Power' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.558] 102:3  Error: 'Zap' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.558] 103:3  Error: 'Flame' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.558] 104:3  Error: 'Snowflake' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.558] 105:3  Error: 'Droplets' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.558] 106:3  Error: 'Wind' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.558] 107:3  Error: 'Cloud' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.558] 108:3  Error: 'Sun' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.558] 109:3  Error: 'Moon' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.559] 110:3  Error: 'Umbrella' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.559] 117:58  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
[01:07:29.559] 258:9  Error: 'ratingDistribution' is assigned a value but never used.  @typescript-eslint/no-unused-vars
[01:07:29.559] 283:37  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
[01:07:29.559] 415:21  Warning: Using `<img>` could result in slower LCP and higher bandwidth. Consider using `<Image />` from `next/image` or a custom image loader to automatically optimize images. This may incur additional usage or cost from your provider. See: https://nextjs.org/docs/messages/no-img-element  @next/next/no-img-element
[01:07:29.559] 481:19  Warning: Using `<img>` could result in slower LCP and higher bandwidth. Consider using `<Image />` from `next/image` or a custom image loader to automatically optimize images. This may incur additional usage or cost from your provider. See: https://nextjs.org/docs/messages/no-img-element  @next/next/no-img-element
[01:07:29.559] 530:21  Warning: Using `<img>` could result in slower LCP and higher bandwidth. Consider using `<Image />` from `next/image` or a custom image loader to automatically optimize images. This may incur additional usage or cost from your provider. See: https://nextjs.org/docs/messages/no-img-element  @next/next/no-img-element
[01:07:29.559] 621:17  Warning: Using `<img>` could result in slower LCP and higher bandwidth. Consider using `<Image />` from `next/image` or a custom image loader to automatically optimize images. This may incur additional usage or cost from your provider. See: https://nextjs.org/docs/messages/no-img-element  @next/next/no-img-element
[01:07:29.559] 729:25  Warning: Using `<img>` could result in slower LCP and higher bandwidth. Consider using `<Image />` from `next/image` or a custom image loader to automatically optimize images. This may incur additional usage or cost from your provider. See: https://nextjs.org/docs/messages/no-img-element  @next/next/no-img-element
[01:07:29.559] 
[01:07:29.559] ./src/app/contact/page.tsx
[01:07:29.559] 58:33  Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
[01:07:29.559] 58:79  Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
[01:07:29.559] 
[01:07:29.560] ./src/app/find-work/page.tsx
[01:07:29.560] 5:94  Error: 'Briefcase' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.560] 620:33  Warning: Using `<img>` could result in slower LCP and higher bandwidth. Consider using `<Image />` from `next/image` or a custom image loader to automatically optimize images. This may incur additional usage or cost from your provider. See: https://nextjs.org/docs/messages/no-img-element  @next/next/no-img-element
[01:07:29.560] 
[01:07:29.560] ./src/app/help/page.tsx
[01:07:29.560] 4:18  Error: 'HelpCircle' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.560] 
[01:07:29.560] ./src/app/how-it-works/page.tsx
[01:07:29.560] 4:68  Error: 'ArrowRight' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.560] 94:17  Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
[01:07:29.560] 
[01:07:29.560] ./src/app/login/page.tsx
[01:07:29.560] 5:35  Error: 'CheckCircle' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.560] 28:17  Warning: Using `<img>` could result in slower LCP and higher bandwidth. Consider using `<Image />` from `next/image` or a custom image loader to automatically optimize images. This may incur additional usage or cost from your provider. See: https://nextjs.org/docs/messages/no-img-element  @next/next/no-img-element
[01:07:29.561] 156:50  Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
[01:07:29.561] 
[01:07:29.561] ./src/app/logout/page.tsx
[01:07:29.561] 6:10  Error: 'LogOut' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.561] 
[01:07:29.561] ./src/app/messages/page.tsx
[01:07:29.561] 11:3  Error: 'MoreVertical' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.561] 16:3  Error: 'File' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.561] 20:3  Error: 'User' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.561] 22:3  Error: 'AlertCircle' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.561] 23:3  Error: 'Eye' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.561] 24:3  Error: 'Filter' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.561] 25:3  Error: 'Plus' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.561] 26:3  Error: 'Archive' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.562] 27:3  Error: 'Pin' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.562] 28:3  Error: 'Trash2' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.562] 29:3  Error: 'Settings' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.562] 32:3  Error: 'Timer' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.562] 33:3  Error: 'FileText' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.562] 34:3  Error: 'Download' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.562] 35:3  Error: 'Upload' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.562] 36:3  Error: 'Bookmark' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.562] 37:3  Error: 'Bell' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.562] 48:90  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
[01:07:29.562] 49:10  Error: 'showProjectDetails' is assigned a value but never used.  @typescript-eslint/no-unused-vars
[01:07:29.562] 49:30  Error: 'setShowProjectDetails' is assigned a value but never used.  @typescript-eslint/no-unused-vars
[01:07:29.562] 283:52  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
[01:07:29.563] 316:48  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
[01:07:29.563] 449:27  Warning: Using `<img>` could result in slower LCP and higher bandwidth. Consider using `<Image />` from `next/image` or a custom image loader to automatically optimize images. This may incur additional usage or cost from your provider. See: https://nextjs.org/docs/messages/no-img-element  @next/next/no-img-element
[01:07:29.563] 528:29  Warning: Using `<img>` could result in slower LCP and higher bandwidth. Consider using `<Image />` from `next/image` or a custom image loader to automatically optimize images. This may incur additional usage or cost from your provider. See: https://nextjs.org/docs/messages/no-img-element  @next/next/no-img-element
[01:07:29.563] 632:33  Warning: Using `<img>` could result in slower LCP and higher bandwidth. Consider using `<Image />` from `next/image` or a custom image loader to automatically optimize images. This may incur additional usage or cost from your provider. See: https://nextjs.org/docs/messages/no-img-element  @next/next/no-img-element
[01:07:29.563] 651:31  Warning: Using `<img>` could result in slower LCP and higher bandwidth. Consider using `<Image />` from `next/image` or a custom image loader to automatically optimize images. This may incur additional usage or cost from your provider. See: https://nextjs.org/docs/messages/no-img-element  @next/next/no-img-element
[01:07:29.563] 669:27  Warning: Image elements must have an alt prop, either with meaningful text, or an empty string for decorative images.  jsx-a11y/alt-text
[01:07:29.563] 728:17  Warning: Using `<img>` could result in slower LCP and higher bandwidth. Consider using `<Image />` from `next/image` or a custom image loader to automatically optimize images. This may incur additional usage or cost from your provider. See: https://nextjs.org/docs/messages/no-img-element  @next/next/no-img-element
[01:07:29.563] 807:39  Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
[01:07:29.563] 
[01:07:29.563] ./src/app/my-jobs/page.tsx
[01:07:29.563] 5:40  Error: 'Clock' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.563] 5:66  Error: 'AlertCircle' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.563] 5:79  Error: 'Users' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.563] 205:39  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
[01:07:29.563] 226:13  Warning: Using `<img>` could result in slower LCP and higher bandwidth. Consider using `<Image />` from `next/image` or a custom image loader to automatically optimize images. This may incur additional usage or cost from your provider. See: https://nextjs.org/docs/messages/no-img-element  @next/next/no-img-element
[01:07:29.564] 290:65  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
[01:07:29.564] 320:60  Error: `"` can be escaped with `&quot;`, `&ldquo;`, `&#34;`, `&rdquo;`.  react/no-unescaped-entities
[01:07:29.564] 320:83  Error: `"` can be escaped with `&quot;`, `&ldquo;`, `&#34;`, `&rdquo;`.  react/no-unescaped-entities
[01:07:29.564] 482:56  Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
[01:07:29.564] 
[01:07:29.564] ./src/app/page.tsx
[01:07:29.564] 231:21  Warning: Using `<img>` could result in slower LCP and higher bandwidth. Consider using `<Image />` from `next/image` or a custom image loader to automatically optimize images. This may incur additional usage or cost from your provider. See: https://nextjs.org/docs/messages/no-img-element  @next/next/no-img-element
[01:07:29.564] 344:23  Warning: Using `<img>` could result in slower LCP and higher bandwidth. Consider using `<Image />` from `next/image` or a custom image loader to automatically optimize images. This may incur additional usage or cost from your provider. See: https://nextjs.org/docs/messages/no-img-element  @next/next/no-img-element
[01:07:29.564] 431:19  Warning: Using `<img>` could result in slower LCP and higher bandwidth. Consider using `<Image />` from `next/image` or a custom image loader to automatically optimize images. This may incur additional usage or cost from your provider. See: https://nextjs.org/docs/messages/no-img-element  @next/next/no-img-element
[01:07:29.564] 470:21  Warning: Using `<img>` could result in slower LCP and higher bandwidth. Consider using `<Image />` from `next/image` or a custom image loader to automatically optimize images. This may incur additional usage or cost from your provider. See: https://nextjs.org/docs/messages/no-img-element  @next/next/no-img-element
[01:07:29.565] 
[01:07:29.565] ./src/app/post-project/page.tsx
[01:07:29.565] 4:8  Error: 'Link' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.566] 5:31  Error: 'Plus' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.566] 5:37  Error: 'X' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.566] 5:60  Error: 'Calendar' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.566] 5:80  Error: 'Image' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.566] 5:100  Error: 'Star' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.566] 153:134  Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
[01:07:29.566] 438:91  Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
[01:07:29.566] 
[01:07:29.566] ./src/app/pricing/page.tsx
[01:07:29.566] 4:79  Error: 'Award' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.566] 4:86  Error: 'Target' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.566] 4:94  Error: 'Briefcase' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.567] 4:105  Error: 'Hammer' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.567] 4:113  Error: 'Wrench' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.567] 288:115  Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
[01:07:29.567] 306:64  Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
[01:07:29.567] 
[01:07:29.567] ./src/app/professional/availability/page.tsx
[01:07:29.567] 4:8  Error: 'Link' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.567] 12:3  Error: 'X' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.567] 13:3  Error: 'CheckCircle' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.567] 14:3  Error: 'AlertCircle' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.567] 16:3  Error: 'Globe' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.567] 17:3  Error: 'MapPin' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.567] 18:3  Error: 'Bell' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.567] 19:3  Error: 'RefreshCw' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.567] 22:3  Error: 'Eye' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.567] 23:3  Error: 'EyeOff' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.567] 24:3  Error: 'Toggle' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.568] 25:3  Error: 'Zap' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.568] 26:3  Error: 'Moon' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.568] 27:3  Error: 'Sun' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.568] 28:3  Error: 'Coffee' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.568] 29:3  Error: 'Home' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.568] 30:3  Error: 'Car' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.568] 31:3  Error: 'Briefcase' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.568] 32:3  Error: 'Phone' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.568] 33:3  Error: 'Video' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.568] 34:3  Error: 'Users' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.568] 35:3  Error: 'DollarSign' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.568] 38:3  Error: 'Filter' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.568] 39:3  Error: 'Search' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.568] 41:3  Error: 'Upload' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.568] 45:10  Error: 'selectedDay' is assigned a value but never used.  @typescript-eslint/no-unused-vars
[01:07:29.569] 46:10  Error: 'showAddTimeSlot' is assigned a value but never used.  @typescript-eslint/no-unused-vars
[01:07:29.569] 46:27  Error: 'setShowAddTimeSlot' is assigned a value but never used.  @typescript-eslint/no-unused-vars
[01:07:29.569] 47:10  Error: 'editingSlot' is assigned a value but never used.  @typescript-eslint/no-unused-vars
[01:07:29.569] 47:50  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
[01:07:29.569] 199:9  Error: 'addTimeSlot' is assigned a value but never used.  @typescript-eslint/no-unused-vars
[01:07:29.569] 
[01:07:29.569] ./src/app/professional/calendar/page.tsx
[01:07:29.569] 6:3  Error: 'Calendar' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.569] 15:3  Error: 'User' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.569] 17:3  Error: 'Phone' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.569] 19:3  Error: 'Settings' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.569] 20:3  Error: 'Filter' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.569] 21:3  Error: 'Search' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.569] 22:3  Error: 'Download' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.569] 23:3  Error: 'RefreshCw' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.570] 26:3  Error: 'XCircle' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.570] 27:3  Error: 'Star' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.570] 28:3  Error: 'DollarSign' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.570] 29:3  Error: 'FileText' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.570] 30:3  Error: 'Bell' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.570] 34:3  Error: 'Briefcase' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.570] 39:10  Error: 'selectedDate' is assigned a value but never used.  @typescript-eslint/no-unused-vars
[01:07:29.571] 41:10  Error: 'showAddAppointment' is assigned a value but never used.  @typescript-eslint/no-unused-vars
[01:07:29.571] 42:10  Error: 'selectedAppointment' is assigned a value but never used.  @typescript-eslint/no-unused-vars
[01:07:29.571] 42:66  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
[01:07:29.571] 44:10  Error: 'showModal' is assigned a value but never used.  @typescript-eslint/no-unused-vars
[01:07:29.572] 404:22  Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
[01:07:29.572] 
[01:07:29.572] ./src/app/professional/contracts/page.tsx
[01:07:29.572] 10:3  Error: 'CheckCircle' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.572] 11:3  Error: 'XCircle' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.572] 12:3  Error: 'AlertCircle' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.572] 14:3  Error: 'Edit2' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.572] 15:3  Error: 'Send' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.572] 18:3  Error: 'Filter' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.572] 22:3  Error: 'Phone' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.573] 23:3  Error: 'Mail' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.573] 24:3  Error: 'Star' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.573] 26:3  Error: 'CreditCard' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.573] 27:3  Error: 'TrendingUp' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.573] 28:3  Error: 'Award' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.573] 29:3  Error: 'Target' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.573] 30:3  Error: 'Briefcase' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.573] 31:3  Error: 'Home' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.573] 32:3  Error: 'Settings' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.574] 33:3  Error: 'Bell' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.574] 35:3  Error: 'Archive' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.574] 36:3  Error: 'Trash2' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.574] 38:3  Error: 'Copy' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.574] 39:3  Error: 'RefreshCw' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.574] 40:3  Error: 'PieChart' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.574] 41:3  Error: 'BarChart3' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.575] 42:3  Error: 'TrendingDown' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.575] 43:3  Error: 'Zap' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.575] 44:3  Error: 'Shield' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.575] 45:3  Error: 'Bookmark' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.575] 46:3  Error: 'Flag' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.575] 47:3  Error: 'MessageSquare' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.575] 48:3  Error: 'Video' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.575] 49:3  Error: 'PhoneCall' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.576] 50:15  Error: 'CalendarIcon' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.576] 51:3  Error: 'Timer' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.576] 52:3  Error: 'Check' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.576] 54:3  Error: 'Info' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.576] 55:3  Error: 'Upload' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.576] 56:3  Error: 'FileIcon' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.576] 57:3  Error: 'Image' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.576] 58:3  Error: 'Paperclip' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.576] 59:3  Error: 'Tag' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.576] 60:3  Error: 'Users' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.576] 61:3  Error: 'Building' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.576] 62:3  Error: 'Globe' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.576] 63:3  Error: 'Percent' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.576] 64:3  Error: 'Receipt' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.576] 65:3  Error: 'Wallet' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.576] 66:3  Error: 'BanknoteIcon' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.576] 67:3  Error: 'PlusCircle' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.576] 68:3  Error: 'MinusCircle' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.576] 69:3  Error: 'Calculator' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.576] 70:3  Error: 'FileCheck' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.577] 71:3  Error: 'ClipboardList' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.577] 72:3  Error: 'Handshake' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.577] 73:3  Error: 'Signature' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.577] 74:3  Error: 'NotebookPen' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.577] 75:3  Error: 'CircleDollarSign' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.577] 76:3  Error: 'Activity' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.577] 77:3  Error: 'Package' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.577] 78:3  Error: 'Truck' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.577] 79:3  Error: 'Wrench' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.577] 80:3  Error: 'Hammer' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.577] 81:3  Error: 'PaintBucket' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.577] 82:3  Error: 'Lightbulb' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.577] 83:3  Error: 'Plug' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.577] 84:3  Error: 'Droplets' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.577] 85:3  Error: 'Snowflake' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.577] 86:3  Error: 'Flame' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.578] 87:3  Error: 'Leaf' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.578] 88:3  Error: 'TreePine' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.578] 89:3  Error: 'Flower' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.578] 90:3  Error: 'Sun' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.578] 91:3  Error: 'Moon' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.578] 92:3  Error: 'Cloud' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.578] 93:3  Error: 'Umbrella' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.578] 94:3  Error: 'Thermometer' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.579] 95:3  Error: 'Wind' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.579] 96:10  Error: 'ZapIcon' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.579] 97:3  Error: 'Construction' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.579] 98:3  Error: 'HardHat' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.579] 99:3  Error: 'Ruler' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.579] 100:3  Error: 'PenTool' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.579] 101:3  Error: 'Palette' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.579] 102:3  Error: 'Brush' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.580] 103:3  Error: 'Scissors' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.580] 104:3  Error: 'Drill' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.580] 105:13  Error: 'WrenchIcon' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.580] 106:3  Error: 'Cog' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.580] 107:3  Error: 'Gauge' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.580] 108:3  Error: 'Scale' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.580] 109:12  Error: 'TimerIcon' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.580] 110:12  Error: 'ClockIcon' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.581] 111:3  Error: 'Hourglass' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.581] 112:15  Error: 'CalendarIconAlt' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.581] 113:3  Error: 'CalendarDays' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.581] 114:3  Error: 'CalendarCheck' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.581] 115:3  Error: 'CalendarX' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.581] 116:3  Error: 'CalendarPlus' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.581] 117:3  Error: 'CalendarMinus' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.581] 118:3  Error: 'CalendarClock' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.582] 119:3  Error: 'CalendarRange' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.582] 120:3  Error: 'CalendarHeart' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.582] 121:3  Error: 'CalendarSearch' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.582] 122:3  Error: 'CalendarArrowDown' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.582] 123:3  Error: 'CalendarArrowUp' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.582] 124:3  Error: 'CalendarCheck2' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.582] 125:3  Error: 'CalendarX2' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.582] 129:10  Error: 'selectedContract' is assigned a value but never used.  @typescript-eslint/no-unused-vars
[01:07:29.583] 129:60  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
[01:07:29.583] 131:10  Error: 'showContractModal' is assigned a value but never used.  @typescript-eslint/no-unused-vars
[01:07:29.583] 
[01:07:29.583] ./src/app/professional/dashboard/page.tsx
[01:07:29.583] 6:3  Error: 'BarChart3' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.583] 7:3  Error: 'Users' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.583] 12:3  Error: 'MessageCircle' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.583] 13:3  Error: 'Star' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.583] 16:3  Error: 'AlertCircle' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.584] 17:3  Error: 'Eye' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.584] 18:3  Error: 'Heart' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.584] 20:3  Error: 'Filter' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.584] 22:3  Error: 'Bell' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.584] 25:3  Error: 'Award' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.584] 28:3  Error: 'Camera' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.584] 30:3  Error: 'Zap' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.584] 31:3  Error: 'PlusCircle' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.585] 32:3  Error: 'Activity' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.585] 33:3  Error: 'Bookmark' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.585] 34:3  Error: 'Settings' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.585] 38:10  Error: 'selectedPeriod' is assigned a value but never used.  @typescript-eslint/no-unused-vars
[01:07:29.585] 38:26  Error: 'setSelectedPeriod' is assigned a value but never used.  @typescript-eslint/no-unused-vars
[01:07:29.585] 280:21  Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
[01:07:29.585] 341:25  Warning: Using `<img>` could result in slower LCP and higher bandwidth. Consider using `<Image />` from `next/image` or a custom image loader to automatically optimize images. This may incur additional usage or cost from your provider. See: https://nextjs.org/docs/messages/no-img-element  @next/next/no-img-element
[01:07:29.585] 518:21  Warning: Using `<img>` could result in slower LCP and higher bandwidth. Consider using `<Image />` from `next/image` or a custom image loader to automatically optimize images. This may incur additional usage or cost from your provider. See: https://nextjs.org/docs/messages/no-img-element  @next/next/no-img-element
[01:07:29.586] 
[01:07:29.586] ./src/app/professional/earnings/page.tsx
[01:07:29.586] 7:3  Error: 'TrendingUp' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.586] 8:3  Error: 'TrendingDown' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.586] 9:3  Error: 'Calendar' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.589] 11:3  Error: 'Filter' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.589] 12:3  Error: 'Eye' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.589] 15:3  Error: 'PiggyBank' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.589] 17:3  Error: 'LineChart' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.590] 23:3  Error: 'Receipt' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.590] 24:3  Error: 'FileText' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.590] 25:3  Error: 'Settings' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.590] 29:10  Error: 'selectedPeriod' is assigned a value but never used.  @typescript-eslint/no-unused-vars
[01:07:29.590] 29:26  Error: 'setSelectedPeriod' is assigned a value but never used.  @typescript-eslint/no-unused-vars
[01:07:29.590] 
[01:07:29.590] ./src/app/professional/portfolio/new/page.tsx
[01:07:29.590] 8:3  Error: 'Plus' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.590] 15:3  Error: 'Eye' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.590] 16:3  Error: 'CheckCircle' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.591] 17:3  Error: 'AlertCircle' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.591] 18:3  Error: 'Star' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.591] 19:3  Error: 'Calendar' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.591] 20:3  Error: 'MapPin' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.591] 21:3  Error: 'DollarSign' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.591] 22:3  Error: 'Clock' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.591] 23:3  Error: 'User' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.591] 25:3  Error: 'Paperclip' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.591] 26:3  Error: 'Trash2' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.591] 27:3  Error: 'Edit2' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.591] 28:3  Error: 'Grid' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.592] 29:3  Error: 'List' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.592] 30:3  Error: 'Heart' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.593] 31:3  Error: 'Share2' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.593] 32:3  Error: 'Download' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.593] 34:3  Error: 'Award' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.593] 35:3  Error: 'TrendingUp' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.593] 36:3  Error: 'MessageCircle' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.593] 37:3  Error: 'Users' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.593] 38:3  Error: 'Briefcase' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.593] 39:3  Error: 'Home' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.594] 40:3  Error: 'Building' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.594] 41:3  Error: 'Wrench' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.594] 42:3  Error: 'Hammer' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.594] 43:3  Error: 'PaintBucket' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.594] 44:3  Error: 'Lightbulb' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.594] 45:3  Error: 'Plug' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.594] 46:3  Error: 'Droplets' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.594] 47:3  Error: 'Leaf' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.594] 48:3  Error: 'Palette' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.594] 49:3  Error: 'Scissors' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.595] 50:3  Error: 'Drill' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.595] 51:3  Error: 'Ruler' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.595] 52:3  Error: 'HardHat' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.595] 53:3  Error: 'Construction' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.595] 54:3  Error: 'Package' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.595] 55:3  Error: 'Truck' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.595] 56:3  Error: 'Shield' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.595] 57:3  Error: 'Zap' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.595] 58:3  Error: 'Flame' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.595] 59:3  Error: 'Snowflake' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.596] 60:3  Error: 'Sun' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.596] 61:3  Error: 'Moon' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.596] 62:3  Error: 'Cloud' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.596] 63:3  Error: 'Wind' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.596] 64:3  Error: 'Thermometer' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.596] 65:3  Error: 'Gauge' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.596] 66:3  Error: 'Scale' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.596] 67:3  Error: 'Timer' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.596] 68:3  Error: 'Hourglass' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.596] 69:3  Error: 'Target' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.596] 70:3  Error: 'Flag' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.596] 71:3  Error: 'Bookmark' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.596] 72:3  Error: 'Bell' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.597] 73:3  Error: 'Info' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.597] 74:3  Error: 'Check' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.597] 75:3  Error: 'AlertTriangle' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.597] 76:3  Error: 'HelpCircle' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.597] 77:3  Error: 'RefreshCw' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.597] 78:3  Error: 'Search' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.597] 79:3  Error: 'Filter' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.597] 80:3  Error: 'SortAsc' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.597] 81:3  Error: 'SortDesc' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.597] 82:3  Error: 'ChevronUp' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.597] 83:3  Error: 'ChevronDown' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.597] 84:3  Error: 'ChevronLeft' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.598] 85:3  Error: 'ChevronRight' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.598] 86:3  Error: 'MoreHorizontal' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.598] 87:3  Error: 'MoreVertical' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.598] 88:3  Error: 'Maximize' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.598] 89:3  Error: 'Minimize' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.598] 90:3  Error: 'Copy' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.598] 91:3  Error: 'ExternalLink' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.598] 92:3  Error: 'Mail' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.598] 93:3  Error: 'Phone' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.598] 94:3  Error: 'Globe' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.598] 95:3  Error: 'Lock' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.598] 96:3  Error: 'Unlock' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.598] 97:3  Error: 'Visibility' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.599] 98:3  Error: 'VisibilityOff' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.599] 99:3  Error: 'PlayCircle' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.599] 100:3  Error: 'PauseCircle' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.599] 101:3  Error: 'StopCircle' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.599] 102:3  Error: 'SkipBack' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.599] 103:3  Error: 'SkipForward' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.599] 104:3  Error: 'Repeat' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.599] 105:3  Error: 'Shuffle' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.599] 106:3  Error: 'Volume1' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.599] 107:3  Error: 'Volume2' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.599] 108:3  Error: 'VolumeX' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.599] 109:3  Error: 'Mic' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.599] 110:3  Error: 'MicOff' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.600] 111:3  Error: 'Speaker' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.600] 112:3  Error: 'Headphones' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.600] 113:3  Error: 'Radio' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.600] 114:3  Error: 'Wifi' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.600] 115:3  Error: 'WifiOff' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.600] 116:3  Error: 'Bluetooth' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.600] 117:3  Error: 'Usb' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.600] 118:3  Error: 'Battery' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.600] 119:3  Error: 'BatteryLow' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.600] 120:3  Error: 'Power' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.600] 121:3  Error: 'PowerOff' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.600] 122:3  Error: 'Cpu' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.600] 123:3  Error: 'HardDrive' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.601] 124:3  Error: 'Memory' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.601] 125:3  Error: 'Monitor' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.601] 126:3  Error: 'Keyboard' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.601] 127:3  Error: 'Mouse' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.601] 128:3  Error: 'Printer' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.601] 129:3  Error: 'Scanner' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.601] 130:3  Error: 'Webcam' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.601] 131:3  Error: 'Gamepad' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.601] 132:3  Error: 'Joystick' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.601] 133:3  Error: 'Smartphone' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.601] 134:3  Error: 'Tablet' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.601] 135:3  Error: 'Laptop' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.601] 136:3  Error: 'Desktop' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.602] 137:3  Error: 'Server' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.602] 138:12  Error: 'CloudIcon' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.602] 139:3  Error: 'Database' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.602] 140:3  Error: 'Code' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.602] 141:3  Error: 'Terminal' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.602] 142:3  Error: 'Command' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.602] 143:3  Error: 'GitBranch' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.602] 144:3  Error: 'GitCommit' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.602] 145:3  Error: 'GitMerge' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.602] 146:3  Error: 'GitPullRequest' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.602] 147:3  Error: 'Bug' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.602] 148:16  Error: 'LightbulbIcon' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.603] 149:3  Error: 'Rocket' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.603] 150:10  Error: 'ZapIcon' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.603] 151:12  Error: 'FlameIcon' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.603] 152:16  Error: 'SnowflakeIcon' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.603] 153:10  Error: 'SunIcon' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.603] 154:11  Error: 'MoonIcon' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.603] 155:11  Error: 'StarIcon' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.603] 156:12  Error: 'HeartIcon' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.603] 157:3  Error: 'Smile' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.603] 158:3  Error: 'Frown' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.603] 159:3  Error: 'Meh' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.603] 160:3  Error: 'Angry' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.603] 161:3  Error: 'Surprised' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.604] 162:3  Error: 'Neutral' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.604] 163:3  Error: 'Thumbsup' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.604] 164:3  Error: 'Thumbsdown' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.604] 165:3  Error: 'Clap' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.604] 166:3  Error: 'Wave' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.604] 167:3  Error: 'Peace' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.604] 168:3  Error: 'Muscle' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.604] 169:3  Error: 'Pray' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.604] 170:3  Error: 'Handshake' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.604] 171:3  Error: 'Fist' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.604] 172:3  Error: 'Victory' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.604] 173:3  Error: 'Crosshair' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.604] 174:13  Error: 'TargetIcon' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.605] 175:3  Error: 'Bullseye' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.605] 176:3  Error: 'Compass' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.605] 177:3  Error: 'Navigation' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.605] 178:3  Error: 'Map' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.605] 179:3  Error: 'Route' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.605] 180:3  Error: 'Milestone' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.605] 181:3  Error: 'Pin' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.605] 182:3  Error: 'Anchor' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.605] 183:3  Error: 'Plane' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.605] 184:3  Error: 'Car' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.605] 185:3  Error: 'Bike' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.605] 186:3  Error: 'Train' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.605] 187:3  Error: 'Bus' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.606] 188:3  Error: 'Ship' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.606] 189:3  Error: 'Fuel' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.606] 190:3  Error: 'ParkingCircle' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.606] 191:3  Error: 'Traffic' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.606] 192:3  Error: 'Road' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.606] 193:3  Error: 'Bridge' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.606] 194:3  Error: 'Tunnel' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.606] 195:3  Error: 'Castle' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.606] 196:3  Error: 'Church' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.606] 197:3  Error: 'Hospital' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.606] 198:3  Error: 'School' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.606] 199:3  Error: 'University' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.607] 200:3  Error: 'Library' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.607] 201:3  Error: 'Museum' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.607] 202:3  Error: 'Theater' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.607] 203:3  Error: 'Stadium' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.607] 204:3  Error: 'Store' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.607] 205:3  Error: 'ShoppingCart' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.607] 206:3  Error: 'ShoppingBag' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.607] 207:3  Error: 'CreditCard' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.607] 208:3  Error: 'Wallet' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.607] 209:3  Error: 'Receipt' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.607] 210:3  Error: 'Banknote' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.607] 211:3  Error: 'Coins' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.607] 212:3  Error: 'Calculator' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.608] 213:3  Error: 'Abacus' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.608] 214:12  Error: 'ScaleIcon' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.608] 215:3  Error: 'Balance' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.609] 216:3  Error: 'Percent' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.609] 217:3  Error: 'PlusCircle' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.609] 218:3  Error: 'MinusCircle' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.609] 219:3  Error: 'Equals' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.609] 220:3  Error: 'Divide' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.609] 221:3  Error: 'Multiply' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.609] 222:3  Error: 'Subtract' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.609] 223:3  Error: 'Add' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.609] 224:3  Error: 'Infinity' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.609] 225:3  Error: 'Pi' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.609] 226:3  Error: 'Sigma' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.609] 227:3  Error: 'Alpha' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.609] 228:3  Error: 'Beta' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.610] 229:3  Error: 'Gamma' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.610] 230:3  Error: 'Delta' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.610] 231:3  Error: 'Epsilon' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.610] 232:3  Error: 'Zeta' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.610] 233:3  Error: 'Eta' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.610] 234:3  Error: 'Theta' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.610] 235:3  Error: 'Iota' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.610] 236:3  Error: 'Kappa' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.610] 237:3  Error: 'Lambda' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.610] 238:3  Error: 'Mu' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.610] 239:3  Error: 'Nu' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.610] 240:3  Error: 'Xi' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.610] 241:3  Error: 'Omicron' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.611] 242:3  Error: 'Rho' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.611] 243:3  Error: 'Tau' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.611] 244:3  Error: 'Upsilon' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.611] 245:3  Error: 'Phi' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.611] 246:3  Error: 'Chi' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.611] 247:3  Error: 'Psi' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.611] 248:3  Error: 'Omega' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.611] 682:23  Warning: Using `<img>` could result in slower LCP and higher bandwidth. Consider using `<Image />` from `next/image` or a custom image loader to automatically optimize images. This may incur additional usage or cost from your provider. See: https://nextjs.org/docs/messages/no-img-element  @next/next/no-img-element
[01:07:29.611] 
[01:07:29.611] ./src/app/professional/portfolio/page.tsx
[01:07:29.611] 13:3  Error: 'Download' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.611] 17:3  Error: 'Filter' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.612] 24:3  Error: 'Users' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.612] 25:3  Error: 'CheckCircle' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.612] 26:12  Error: 'ImageIcon' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.612] 27:3  Error: 'Video' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.612] 28:3  Error: 'FileText' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.612] 29:3  Error: 'Settings' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.612] 31:3  Error: 'MessageCircle' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.612] 369:19  Warning: Using `<img>` could result in slower LCP and higher bandwidth. Consider using `<Image />` from `next/image` or a custom image loader to automatically optimize images. This may incur additional usage or cost from your provider. See: https://nextjs.org/docs/messages/no-img-element  @next/next/no-img-element
[01:07:29.615] 488:23  Warning: Using `<img>` could result in slower LCP and higher bandwidth. Consider using `<Image />` from `next/image` or a custom image loader to automatically optimize images. This may incur additional usage or cost from your provider. See: https://nextjs.org/docs/messages/no-img-element  @next/next/no-img-element
[01:07:29.615] 
[01:07:29.615] ./src/app/professional/proposals/page.tsx
[01:07:29.615] 17:3  Error: 'User' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.615] 18:3  Error: 'Filter' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.615] 25:3  Error: 'Award' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.615] 26:3  Error: 'Star' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.616] 27:3  Error: 'Users' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.616] 326:19  Warning: Using `<img>` could result in slower LCP and higher bandwidth. Consider using `<Image />` from `next/image` or a custom image loader to automatically optimize images. This may incur additional usage or cost from your provider. See: https://nextjs.org/docs/messages/no-img-element  @next/next/no-img-element
[01:07:29.616] 
[01:07:29.616] ./src/app/professional/reviews/page.tsx
[01:07:29.616] 7:3  Error: 'StarHalf' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.616] 8:3  Error: 'TrendingUp' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.616] 9:3  Error: 'TrendingDown' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.616] 10:3  Error: 'Filter' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.616] 12:3  Error: 'Calendar' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.616] 17:3  Error: 'ThumbsDown' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.616] 19:3  Error: 'Flag' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.616] 22:3  Error: 'Eye' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.616] 23:3  Error: 'BarChart3' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.617] 24:3  Error: 'PieChart' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.617] 25:3  Error: 'Activity' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.617] 26:3  Error: 'Award' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.617] 27:3  Error: 'Target' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.617] 28:3  Error: 'Zap' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.617] 29:3  Error: 'Heart' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.617] 30:3  Error: 'Clock' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.617] 32:3  Error: 'XCircle' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.617] 33:3  Error: 'AlertCircle' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.617] 34:3  Error: 'Info' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.617] 35:3  Error: 'Plus' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.617] 36:3  Error: 'Minus' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.618] 37:3  Error: 'ArrowUp' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.619] 38:3  Error: 'ArrowDown' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.619] 39:3  Error: 'ArrowRight' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.619] 41:3  Error: 'ChevronUp' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.619] 42:3  Error: 'ChevronDown' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.619] 43:3  Error: 'ChevronLeft' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.619] 44:3  Error: 'ChevronRight' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.619] 45:3  Error: 'MoreHorizontal' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.619] 47:3  Error: 'Edit2' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.619] 48:3  Error: 'Trash2' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.619] 49:3  Error: 'Settings' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.620] 50:3  Error: 'Bell' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.620] 51:3  Error: 'Bookmark' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.620] 52:3  Error: 'Tag' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.620] 53:3  Error: 'Image' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.620] 54:3  Error: 'FileText' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.620] 55:3  Error: 'Phone' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.620] 56:3  Error: 'Mail' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.620] 57:3  Error: 'Globe' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.620] 58:3  Error: 'ExternalLink' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.620] 59:3  Error: 'Copy' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.620] 60:3  Error: 'RefreshCw' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.620] 61:3  Error: 'Save' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.620] 63:3  Error: 'Check' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.620] 64:3  Error: 'Upload' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.621] 65:15  Error: 'DownloadIcon' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.621] 66:3  Error: 'Printer' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.621] 67:3  Error: 'Share' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.621] 68:3  Error: 'Send' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.621] 69:3  Error: 'Archive' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.621] 70:3  Error: 'Folder' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.621] 71:3  Error: 'FolderOpen' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.621] 72:3  Error: 'File' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.621] 73:3  Error: 'FileImage' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.621] 74:3  Error: 'FileVideo' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.621] 75:3  Error: 'FileAudio' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.621] 76:3  Error: 'FilePdf' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.621] 77:3  Error: 'FileSpreadsheet' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.622] 78:3  Error: 'FileCode' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.622] 79:3  Error: 'FileZip' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.622] 80:3  Error: 'Home' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.622] 81:3  Error: 'Building' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.622] 82:3  Error: 'Briefcase' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.623] 83:3  Error: 'Users' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.623] 84:3  Error: 'UserCheck' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.623] 85:3  Error: 'UserX' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.623] 86:3  Error: 'UserPlus' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.623] 87:3  Error: 'UserMinus' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.623] 88:3  Error: 'Crown' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.623] 89:3  Error: 'Shield' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.623] 90:3  Error: 'Medal' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.624] 91:3  Error: 'Trophy' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.624] 92:3  Error: 'Ribbon' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.624] 93:3  Error: 'Gift' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.624] 94:3  Error: 'Package' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.624] 95:3  Error: 'ShoppingCart' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.624] 96:3  Error: 'ShoppingBag' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.624] 97:3  Error: 'CreditCard' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.624] 98:3  Error: 'Wallet' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.624] 99:3  Error: 'Receipt' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.625] 100:3  Error: 'Banknote' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.625] 101:3  Error: 'Coins' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.625] 102:3  Error: 'DollarSign' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.625] 103:3  Error: 'Percent' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.625] 104:3  Error: 'Calculator' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.625] 105:3  Error: 'Scale' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.625] 106:3  Error: 'Balance' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.625] 107:3  Error: 'Gauge' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.626] 108:3  Error: 'Meter' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.626] 109:3  Error: 'Thermometer' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.626] 110:3  Error: 'Battery' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.626] 111:3  Error: 'Wifi' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.626] 112:3  Error: 'Signal' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.626] 113:3  Error: 'Bluetooth' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.626] 114:3  Error: 'Usb' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.626] 115:3  Error: 'Plug' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.627] 116:3  Error: 'Power' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.627] 117:10  Error: 'ZapIcon' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.627] 118:3  Error: 'Flame' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.627] 119:3  Error: 'Snowflake' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.627] 120:3  Error: 'Droplets' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.627] 121:3  Error: 'Wind' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.627] 122:3  Error: 'Cloud' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.627] 123:3  Error: 'Sun' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.627] 124:3  Error: 'Moon' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.628] 125:3  Error: 'Umbrella' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.628] 126:3  Error: 'Rainbow' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.628] 127:3  Error: 'Sunrise' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.628] 128:3  Error: 'Sunset' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.628] 129:3  Error: 'Mountain' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.628] 130:3  Error: 'Tree' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.628] 131:3  Error: 'Leaf' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.628] 132:3  Error: 'Flower' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.628] 133:3  Error: 'Seedling' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.629] 134:3  Error: 'Cactus' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.629] 135:3  Error: 'Palmtree' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.629] 136:3  Error: 'Evergreen' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.629] 137:3  Error: 'Deciduous' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.629] 138:3  Error: 'Grass' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.629] 139:3  Error: 'Clover' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.629] 140:3  Error: 'Mushroom' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.629] 141:3  Error: 'Carrot' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.630] 142:3  Error: 'Apple' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.636] 143:3  Error: 'Orange' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.636] 144:3  Error: 'Banana' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.636] 145:3  Error: 'Grape' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.636] 146:3  Error: 'Cherry' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.636] 147:3  Error: 'Strawberry' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.636] 148:3  Error: 'Lemon' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.636] 149:3  Error: 'Lime' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.636] 150:3  Error: 'Pineapple' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.636] 151:3  Error: 'Coconut' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.636] 152:3  Error: 'Avocado' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.637] 153:3  Error: 'Eggplant' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.637] 154:3  Error: 'Broccoli' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.637] 155:3  Error: 'Corn' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.637] 156:3  Error: 'Pepper' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.637] 157:3  Error: 'Tomato' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.637] 158:3  Error: 'Potato' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.637] 159:3  Error: 'Onion' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.637] 160:3  Error: 'Garlic' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.637] 161:3  Error: 'Ginger' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.637] 162:3  Error: 'Chili' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.646] 163:3  Error: 'Herbs' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.646] 164:3  Error: 'Spices' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.646] 165:3  Error: 'Salt' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.646] 166:3  Error: 'Sugar' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.646] 167:3  Error: 'Honey' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.646] 168:3  Error: 'Milk' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.646] 169:3  Error: 'Cheese' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.646] 170:3  Error: 'Butter' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.646] 171:3  Error: 'Bread' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.646] 172:3  Error: 'Cake' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.646] 173:3  Error: 'Cookie' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.647] 174:3  Error: 'Donut' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.647] 175:3  Error: 'Pizza' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.647] 176:3  Error: 'Burger' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.647] 177:3  Error: 'Hotdog' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.647] 178:3  Error: 'Sandwich' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.647] 179:3  Error: 'Taco' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.647] 180:3  Error: 'Burrito' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.647] 181:3  Error: 'Sushi' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.647] 182:3  Error: 'Ramen' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.647] 183:3  Error: 'Soup' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.647] 184:3  Error: 'Salad' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.647] 185:3  Error: 'Pasta' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.647] 186:3  Error: 'Rice' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.647] 187:3  Error: 'Noodles' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.648] 188:3  Error: 'Meat' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.648] 189:3  Error: 'Fish' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.648] 190:3  Error: 'Chicken' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.648] 191:3  Error: 'Egg' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.648] 192:3  Error: 'Bacon' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.648] 193:3  Error: 'Steak' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.648] 194:3  Error: 'Lobster' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.648] 195:3  Error: 'Shrimp' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.648] 196:3  Error: 'Crab' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.648] 197:3  Error: 'Oyster' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.648] 198:3  Error: 'Clam' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.648] 199:3  Error: 'Scallop' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.648] 200:3  Error: 'Mussel' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.648] 201:3  Error: 'Squid' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.652] 202:3  Error: 'Octopus' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.652] 203:3  Error: 'Jellyfish' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.652] 204:3  Error: 'Shark' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.652] 205:3  Error: 'Whale' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.652] 206:3  Error: 'Dolphin' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.652] 207:3  Error: 'Seal' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.652] 208:3  Error: 'Penguin' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.652] 209:3  Error: 'Polar' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.652] 210:3  Error: 'Bear' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.652] 211:3  Error: 'Lion' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.652] 212:3  Error: 'Tiger' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.652] 213:3  Error: 'Elephant' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.653] 214:3  Error: 'Giraffe' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.653] 215:3  Error: 'Zebra' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.654] 216:3  Error: 'Horse' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.654] 217:3  Error: 'Cow' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.654] 218:3  Error: 'Pig' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.654] 219:3  Error: 'Sheep' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.654] 220:3  Error: 'Goat' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.655] 221:14  Error: 'ChickenIcon' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.655] 222:3  Error: 'Duck' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.655] 223:3  Error: 'Turkey' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.655] 224:3  Error: 'Rabbit' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.655] 225:3  Error: 'Squirrel' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.655] 226:3  Error: 'Hedgehog' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.655] 227:3  Error: 'Bat' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.655] 228:3  Error: 'Wolf' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.655] 229:3  Error: 'Fox' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.655] 230:3  Error: 'Cat' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.655] 231:3  Error: 'Dog' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.655] 232:3  Error: 'Mouse' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.655] 233:3  Error: 'Hamster' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.656] 234:3  Error: 'Guinea' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.656] 235:3  Error: 'Ferret' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.656] 236:3  Error: 'Parrot' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.656] 237:3  Error: 'Eagle' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.656] 238:3  Error: 'Owl' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.656] 239:3  Error: 'Peacock' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.656] 240:3  Error: 'Flamingo' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.656] 241:3  Error: 'Swan' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.656] 242:3  Error: 'Goose' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.656] 243:3  Error: 'Pelican' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.656] 244:3  Error: 'Heron' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.656] 245:3  Error: 'Stork' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.656] 246:3  Error: 'Crane' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.656] 247:3  Error: 'Vulture' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.656] 248:3  Error: 'Hawk' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.656] 249:3  Error: 'Falcon' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.657] 250:3  Error: 'Kestrel' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.657] 251:3  Error: 'Osprey' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.657] 252:3  Error: 'Condor' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.657] 253:3  Error: 'Albatross' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.657] 254:3  Error: 'Petrel' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.657] 255:3  Error: 'Gull' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.657] 256:3  Error: 'Tern' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.657] 257:3  Error: 'Puffin' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.657] 258:3  Error: 'Cormorant' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.657] 259:3  Error: 'Gannet' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.657] 260:3  Error: 'Booby' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.657] 261:3  Error: 'Frigate' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.657] 262:3  Error: 'Tropicbird' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.657] 263:3  Error: 'Skua' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.657] 264:3  Error: 'Jaeger' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.658] 265:3  Error: 'Auk' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.658] 266:3  Error: 'Guillemot' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.658] 267:3  Error: 'Murre' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.658] 268:3  Error: 'Razorbill' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.658] 269:3  Error: 'Dovekie' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.658] 270:3  Error: 'Pigeon' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.658] 271:3  Error: 'Dove' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.658] 272:3  Error: 'Cuckoo' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.658] 273:3  Error: 'Nightjar' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.658] 274:3  Error: 'Swift' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.658] 275:3  Error: 'Hummingbird' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.658] 276:3  Error: 'Kingfisher' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.658] 277:3  Error: 'Bee' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.658] 278:3  Error: 'Wasp' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.658] 279:3  Error: 'Hornet' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.658] 280:3  Error: 'Ant' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.659] 281:3  Error: 'Termite' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.659] 282:3  Error: 'Cockroach' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.659] 283:3  Error: 'Beetle' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.659] 284:3  Error: 'Ladybug' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.659] 285:3  Error: 'Firefly' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.659] 286:3  Error: 'Dragonfly' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.659] 287:3  Error: 'Damselfly' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.659] 288:3  Error: 'Mayfly' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.659] 289:3  Error: 'Caddisfly' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.659] 290:3  Error: 'Lacewing' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.659] 291:3  Error: 'Antlion' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.659] 292:3  Error: 'Mantis' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.659] 293:3  Error: 'Walkingstick' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.659] 294:3  Error: 'Grasshopper' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.659] 295:3  Error: 'Cricket' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.660] 296:3  Error: 'Katydid' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.660] 297:3  Error: 'Cicada' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.660] 298:3  Error: 'Aphid' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.660] 299:3  Error: 'Whitefly' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.660] 300:3  Error: 'Thrips' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.660] 301:3  Error: 'Mite' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.660] 302:3  Error: 'Tick' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.660] 303:3  Error: 'Spider' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.660] 304:3  Error: 'Scorpion' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.660] 305:3  Error: 'Harvestman' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.660] 306:3  Error: 'Pseudoscorpion' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.660] 307:3  Error: 'Solifuge' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.660] 308:3  Error: 'Whipscorpion' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.661] 309:3  Error: 'Amblypygi' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.661] 310:3  Error: 'Ricinulei' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.661] 311:3  Error: 'Schizomida' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.661] 312:3  Error: 'Palpigradi' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.661] 313:3  Error: 'Opiliones' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.661] 314:3  Error: 'Acari' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.661] 315:3  Error: 'Araneae' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.661] 316:3  Error: 'Scorpiones' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.662] 317:3  Error: 'Pseudoscorpiones' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.662] 318:3  Error: 'Solifugae' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.662] 319:3  Error: 'Uropygi' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.662] 320:16  Error: 'AmblypygiIcon' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.663] 321:16  Error: 'RicinuleiIcon' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.663] 322:17  Error: 'SchizomidaIcon' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.663] 323:17  Error: 'PalpigradIcon' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.663] 329:56  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
[01:07:29.663] 456:32  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
[01:07:29.663] 602:17  Warning: Using `<img>` could result in slower LCP and higher bandwidth. Consider using `<Image />` from `next/image` or a custom image loader to automatically optimize images. This may incur additional usage or cost from your provider. See: https://nextjs.org/docs/messages/no-img-element  @next/next/no-img-element
[01:07:29.663] 639:25  Warning: Using `<img>` could result in slower LCP and higher bandwidth. Consider using `<Image />` from `next/image` or a custom image loader to automatically optimize images. This may incur additional usage or cost from your provider. See: https://nextjs.org/docs/messages/no-img-element  @next/next/no-img-element
[01:07:29.663] 721:19  Warning: Using `<img>` could result in slower LCP and higher bandwidth. Consider using `<Image />` from `next/image` or a custom image loader to automatically optimize images. This may incur additional usage or cost from your provider. See: https://nextjs.org/docs/messages/no-img-element  @next/next/no-img-element
[01:07:29.663] 
[01:07:29.663] ./src/app/professional/tasks/page.tsx
[01:07:29.663] 4:8  Error: 'Link' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.663] 7:3  Error: 'Square' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.663] 13:3  Error: 'User' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.663] 16:3  Error: 'XCircle' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.663] 18:3  Error: 'Filter' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.664] 21:3  Error: 'Tag' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.664] 23:3  Error: 'FileText' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.664] 24:3  Error: 'Image' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.664] 25:3  Error: 'Video' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.664] 27:3  Error: 'Star' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.664] 28:3  Error: 'Eye' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.664] 29:3  Error: 'Settings' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.664] 30:3  Error: 'RefreshCw' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.664] 31:3  Error: 'Download' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.664] 32:3  Error: 'Upload' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.664] 33:3  Error: 'Copy' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.664] 34:3  Error: 'Share2' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.664] 35:3  Error: 'Bell' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.664] 36:3  Error: 'Target' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.664] 37:3  Error: 'TrendingUp' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.665] 38:3  Error: 'BarChart3' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.665] 39:3  Error: 'PieChart' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.665] 41:3  Error: 'Award' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.665] 42:3  Error: 'Briefcase' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.666] 43:3  Error: 'Users' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.666] 44:3  Error: 'MapPin' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.666] 45:3  Error: 'Phone' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.666] 46:3  Error: 'Mail' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.666] 47:3  Error: 'DollarSign' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.667] 48:3  Error: 'Timer' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.667] 49:3  Error: 'Save' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.667] 51:3  Error: 'ChevronDown' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.667] 52:3  Error: 'ChevronUp' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.667] 53:3  Error: 'ChevronRight' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.670] 54:3  Error: 'ArrowRight' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.670] 55:3  Error: 'ArrowUp' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.670] 57:3  Error: 'Zap' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.670] 58:3  Error: 'Flame' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.670] 68:50  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
[01:07:29.670] 287:9  Error: 'updateTaskStatus' is assigned a value but never used.  @typescript-eslint/no-unused-vars
[01:07:29.670] 312:42  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
[01:07:29.670] 314:52  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
[01:07:29.670] 
[01:07:29.670] ./src/app/professional/time-tracker/page.tsx
[01:07:29.670] 16:3  Error: 'Filter' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.670] 19:3  Error: 'Upload' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.670] 20:3  Error: 'BarChart3' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.670] 22:3  Error: 'Users' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.670] 23:3  Error: 'Briefcase' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.671] 25:3  Error: 'CheckCircle' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.671] 26:3  Error: 'AlertCircle' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.671] 27:3  Error: 'Settings' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.671] 28:3  Error: 'Eye' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.671] 29:3  Error: 'RefreshCw' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.671] 30:3  Error: 'Zap' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.671] 31:3  Error: 'Target' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.671] 32:3  Error: 'Star' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.671] 33:3  Error: 'MapPin' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.671] 34:3  Error: 'Phone' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.671] 35:3  Error: 'Mail' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.671] 36:3  Error: 'MessageCircle' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.671] 37:3  Error: 'Save' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.671] 39:3  Error: 'ChevronLeft' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.671] 40:3  Error: 'ChevronRight' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.671] 41:3  Error: 'Copy' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.671] 42:3  Error: 'Share2' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.671] 43:3  Error: 'PieChart' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.671] 44:3  Error: 'Activity' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.671] 45:3  Error: 'Award' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.671] 46:15  Error: 'CalendarIcon' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.671] 47:3  Error: 'ClockIcon' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.671] 51:50  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
[01:07:29.671] 56:52  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
[01:07:29.672] 
[01:07:29.672] ./src/app/professionals/[id]/page.tsx
[01:07:29.672] 14:3  Error: 'Phone' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.672] 15:3  Error: 'Mail' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.672] 16:3  Error: 'Globe' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.672] 18:3  Error: 'DollarSign' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.672] 19:3  Error: 'Users' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.672] 20:3  Error: 'TrendingUp' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.672] 25:3  Error: 'Briefcase' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.672] 26:3  Error: 'Camera' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.672] 27:3  Error: 'FileText' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.672] 30:3  Error: 'Filter' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.672] 258:19  Warning: Using `<img>` could result in slower LCP and higher bandwidth. Consider using `<Image />` from `next/image` or a custom image loader to automatically optimize images. This may incur additional usage or cost from your provider. See: https://nextjs.org/docs/messages/no-img-element  @next/next/no-img-element
[01:07:29.672] 405:25  Warning: Using `<img>` could result in slower LCP and higher bandwidth. Consider using `<Image />` from `next/image` or a custom image loader to automatically optimize images. This may incur additional usage or cost from your provider. See: https://nextjs.org/docs/messages/no-img-element  @next/next/no-img-element
[01:07:29.672] 431:23  Warning: Using `<img>` could result in slower LCP and higher bandwidth. Consider using `<Image />` from `next/image` or a custom image loader to automatically optimize images. This may incur additional usage or cost from your provider. See: https://nextjs.org/docs/messages/no-img-element  @next/next/no-img-element
[01:07:29.672] 460:23  Warning: Using `<img>` could result in slower LCP and higher bandwidth. Consider using `<Image />` from `next/image` or a custom image loader to automatically optimize images. This may incur additional usage or cost from your provider. See: https://nextjs.org/docs/messages/no-img-element  @next/next/no-img-element
[01:07:29.672] 
[01:07:29.672] ./src/app/professionals/page.tsx
[01:07:29.672] 5:79  Error: 'Users' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.672] 5:93  Error: 'Briefcase' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.672] 5:104  Error: 'Phone' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.673] 5:117  Error: 'Shield' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.673] 551:31  Warning: Using `<img>` could result in slower LCP and higher bandwidth. Consider using `<Image />` from `next/image` or a custom image loader to automatically optimize images. This may incur additional usage or cost from your provider. See: https://nextjs.org/docs/messages/no-img-element  @next/next/no-img-element
[01:07:29.673] 624:33  Warning: Using `<img>` could result in slower LCP and higher bandwidth. Consider using `<Image />` from `next/image` or a custom image loader to automatically optimize images. This may incur additional usage or cost from your provider. See: https://nextjs.org/docs/messages/no-img-element  @next/next/no-img-element
[01:07:29.673] 
[01:07:29.673] ./src/app/profile/page.tsx
[01:07:29.673] 20:3  Error: 'FileText' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.673] 21:3  Error: 'Users' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.673] 79:17  Warning: Using `<img>` could result in slower LCP and higher bandwidth. Consider using `<Image />` from `next/image` or a custom image loader to automatically optimize images. This may incur additional usage or cost from your provider. See: https://nextjs.org/docs/messages/no-img-element  @next/next/no-img-element
[01:07:29.673] 
[01:07:29.673] ./src/app/projects/[id]/page.tsx
[01:07:29.673] 26:3  Error: 'ThumbsUp' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.673] 269:21  Warning: Using `<img>` could result in slower LCP and higher bandwidth. Consider using `<Image />` from `next/image` or a custom image loader to automatically optimize images. This may incur additional usage or cost from your provider. See: https://nextjs.org/docs/messages/no-img-element  @next/next/no-img-element
[01:07:29.673] 390:17  Warning: Using `<img>` could result in slower LCP and higher bandwidth. Consider using `<Image />` from `next/image` or a custom image loader to automatically optimize images. This may incur additional usage or cost from your provider. See: https://nextjs.org/docs/messages/no-img-element  @next/next/no-img-element
[01:07:29.673] 
[01:07:29.673] ./src/app/register/page.tsx
[01:07:29.673] 75:17  Warning: Using `<img>` could result in slower LCP and higher bandwidth. Consider using `<Image />` from `next/image` or a custom image loader to automatically optimize images. This may incur additional usage or cost from your provider. See: https://nextjs.org/docs/messages/no-img-element  @next/next/no-img-element
[01:07:29.673] 103:47  Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
[01:07:29.673] 116:47  Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
[01:07:29.673] 510:79  Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
[01:07:29.673] 
[01:07:29.673] ./src/app/services/page.tsx
[01:07:29.673] 87:17  Warning: Using `<img>` could result in slower LCP and higher bandwidth. Consider using `<Image />` from `next/image` or a custom image loader to automatically optimize images. This may incur additional usage or cost from your provider. See: https://nextjs.org/docs/messages/no-img-element  @next/next/no-img-element
[01:07:29.673] 145:18  Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
[01:07:29.674] 145:41  Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
[01:07:29.674] 
[01:07:29.674] ./src/app/settings/page.tsx
[01:07:29.674] 10:3  Error: 'CreditCard' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.674] 12:3  Error: 'Moon' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.674] 13:3  Error: 'Eye' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.674] 19:3  Error: 'Lock' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.674] 22:3  Error: 'Upload' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.674] 66:9  Error: 'settingsSections' is assigned a value but never used.  @typescript-eslint/no-unused-vars
[01:07:29.674] 
[01:07:29.674] ./src/app/terms/page.tsx
[01:07:29.674] 16:112  Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
[01:07:29.674] 
[01:07:29.674] ./src/components/layout/Footer.tsx
[01:07:29.674] 100:19  Warning: Using `<img>` could result in slower LCP and higher bandwidth. Consider using `<Image />` from `next/image` or a custom image loader to automatically optimize images. This may incur additional usage or cost from your provider. See: https://nextjs.org/docs/messages/no-img-element  @next/next/no-img-element
[01:07:29.674] 107:19  Warning: Using `<img>` could result in slower LCP and higher bandwidth. Consider using `<Image />` from `next/image` or a custom image loader to automatically optimize images. This may incur additional usage or cost from your provider. See: https://nextjs.org/docs/messages/no-img-element  @next/next/no-img-element
[01:07:29.674] 118:17  Warning: Using `<img>` could result in slower LCP and higher bandwidth. Consider using `<Image />` from `next/image` or a custom image loader to automatically optimize images. This may incur additional usage or cost from your provider. See: https://nextjs.org/docs/messages/no-img-element  @next/next/no-img-element
[01:07:29.674] 123:17  Warning: Using `<img>` could result in slower LCP and higher bandwidth. Consider using `<Image />` from `next/image` or a custom image loader to automatically optimize images. This may incur additional usage or cost from your provider. See: https://nextjs.org/docs/messages/no-img-element  @next/next/no-img-element
[01:07:29.674] 
[01:07:29.674] ./src/components/layout/Header.tsx
[01:07:29.674] 6:19  Error: 'ChevronDown' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.674] 6:93  Error: 'Crown' is defined but never used.  @typescript-eslint/no-unused-vars
[01:07:29.674] 11:10  Error: 'isUserMenuOpen' is assigned a value but never used.  @typescript-eslint/no-unused-vars
[01:07:29.674] 11:26  Error: 'setIsUserMenuOpen' is assigned a value but never used.  @typescript-eslint/no-unused-vars
[01:07:29.674] 29:55  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
[01:07:29.674] 57:9  Error: 'userNavigation' is assigned a value but never used.  @typescript-eslint/no-unused-vars
[01:07:29.674] 77:15  Warning: Using `<img>` could result in slower LCP and higher bandwidth. Consider using `<Image />` from `next/image` or a custom image loader to automatically optimize images. This may incur additional usage or cost from your provider. See: https://nextjs.org/docs/messages/no-img-element  @next/next/no-img-element
[01:07:29.674] 
[01:07:29.674] ./src/components/sections/Hero.tsx
[01:07:29.674] 157:17  Warning: Using `<img>` could result in slower LCP and higher bandwidth. Consider using `<Image />` from `next/image` or a custom image loader to automatically optimize images. This may incur additional usage or cost from your provider. See: https://nextjs.org/docs/messages/no-img-element  @next/next/no-img-element
[01:07:29.674] 
[01:07:29.674] ./src/lib/routes.ts
[01:07:29.675] 154:1  Warning: Assign object to a variable before exporting as module default  import/no-anonymous-default-export
[01:07:29.675] 
[01:07:29.675] info  - Need to disable some ESLint rules? Learn more here: https://nextjs.org/docs/app/api-reference/config/eslint#disabling-rules
[01:07:29.675] Error: Command "npm run build" exited with 1
[01:07:29.932] 
[01:07:33.316] Exiting build container







	Hazardous Removal	
	Pest Control	
	Fire Restoration	
	Water Damage Restoration	
	Mold Remediation	
	Hurricane Retrofits	
	Solar Panels	
	Custom Vanities	
	Shower & Tub Installs	
	Backsplashes	
	Countertops	
	Cabinetry	
	Bathroom Remodeling	
	Kitchen Remodeling	
	Outdoor Lighting	
	Pressure Washing	
	Pools	
	Hardscaping	
	Tree Services	
	Irrigation Systems	
	Sod Installation	
	Lawn Care	
	Weatherproofing	
	Garage Doors	
	French & Entry Doors	
	Sliding Glass Doors	
	Impact Windows	
	Window Installation	
	Textured Finishes	
	Wallpaper Services	
	Stucco & Plaster	
	Drywall	
	Exterior Painting	
	Interior Painting	
	Concrete Polishing	
	Epoxy Flooring	
	Carpet Installation	
	Tile & Stone Flooring	
	Laminate & Vinyl Flooring	
	Hardwood Flooring	
	Indoor Air Quality	
	Ventilation Systems	
	Thermostats	
	Ductwork	
	Heating Systems	
	AC Repair & Maintenance	
	AC Installation	
	Security Systems	
	Smart Home Automation	
	Smoke & Carbon Detectors	
	Ceiling Fans	
	EV Charging Stations	
	Generator Installation	
	Lighting Installation	
	Panel Upgrades	
	Septic Tank Services	
	Kitchen & Bath Plumbing	
	Repiping	
	Water Heaters	
	Sewer Line Services	
	Drain Cleaning –	
	Leak Detection & Repair	
	Sheds & Storage Buildings	
	Outdoor Kitchens	
	Fences & Gates	
	Pergolas & Gazebos	
	Dock Construction	
	Deck Building	
	Gutter Cleaning	
	Gutter Installation & Repair	
	Roof Coating & Sealing	
	Roof Inspections	
	Flat Roofing	
	Tile Roofing	
	Metal Roofing	
	Asphalt Shingle Roofing	
	Excavation & Grading	
	Demolition	
	Masonry	
	Concrete Work	
	Foundation Repair	
	Structural Framing	
	New Home Builds	
	Home Additions	
	Deck Repair	
	New Deck Installation	



	9manth taske

	p\help\page.tsx 1 - 160

9 tasks

اعتماد قصة مدفوعات موحّدة (بطاقات + ACH عبر National Bank Card Services أم تضمين PayPal؟) وصياغة نص قياسي موحّد لكل الصفحات

تحديث الهيرو في الصفحة الرئيسية بعنوان قوي وCTA “Post a Project” + شرح 3 خطوات مختصر وتحسينات تتبع التحويل

إضافة قسم عناصر ثقة على الصفحة الرئيسية (شهادات عملاء، أمثلة مشاريع مكتملة، شارات ترخيص/تأمين، شعارات موثوقية)

توحيد رسائل المدفوعات عبر الصفحات (التسعير، المساعدة، عن الموقع، السياسة، الشروط، الخدمات) وإزالة التناقضات (ذكر PayPal عند عدم دعمه)

استبدال بيانات الاتصال الوهمية (+1-555-123-4567) بالرقم والبريد الحقيقيين وساعات العمل، ويفضل تكوينها عبر متغيرات بيئة

مراجعة واجهات إدارة طرق الدفع وإخفاء/تعديل حقول PayPal إذا لم تكن معتمدة حالياً

إعادة تسمية/إخراج قسم "Our Projects" ليعرض مشاريع مكتملة مع صور قبل/بعد أو بيانات واقعية من الـ API إن توفرت

اختبارات يدوية وتحسين الأداء والفهارس ومعالجة الحالات الطرفية

خطة قياس وتحسين التحويل (أحداث تتبع، لوحة مؤشرات، A/B لاختبار الهيرو الجديد)





0/5 Tasks done

تأكيد أن Hero في الصفحة الرئيسية يعرض العنوان والـ CTA والشرح بثلاث خطوات كما طُلِب، وتحديثه إن لزم.

توحيد قصة الدفع عبر الموقع: استبدال أي ذكر لـ PayPal أو National Bank Card Services بنص مركزي من config/site.ts في صفحات Pricing وHelp وطرق الدفع وغيرها.

استبدال أي أرقام/إيميلات placeholder في كل الصفحات بقيم مركزية من config/site.ts.

تأكيد أن Hero في الصفحة الرئيسية يعرض العنوان والـ CTA والشرح بثلاث خطوات كما طُلِب، وتحديثه إن لزم.

توحيد قصة الدفع عبر الموقع: استبدال أي ذكر لـ PayPal أو National Bank Card Services بنص مركزي من config/site.ts في صفحات Pricing وHelp وطرق الدفع وغيرها.

استبدال أي أرقام/إيميلات placeholder في كل الصفحات بقيم مركزية من config/site.ts.

إضافة عناصر الثقة للصفحة الرئيسية: testimonials، أمثلة مشاريع، شارات ترخيص/تأمين، وشريط شعارات ثقة.

مراجعة بصرية عبر تشغيل الخادم المحلي ومعاينة التغييرات وإصلاح أي مشاكل CSS.

user52255012877
Copy
Delete
العميل    طلب التعديلات   دى اعمل خطه و ظبط التعديلات من غير ما تبوظا المشروع 
 1. Homepage conversion – Add a strong hero section headline like:
“Post Your Project — Get Vetted Florida Pros with Escrow Protection”
with a bold “Post a Project” CTA and a simple 3-step explainer.
2. Unify payments – The site currently shows “National Bank Card Services” on pricing but mentions PayPal/other methods in Help. We need one clear and consistent payments story across the whole site.
3. Fix placeholder details – Replace the placeholder phone number (+1-555-123-4567) with our real contact number and email, plus business hours.
4. Trust elements – Add testimonials, completed project examples, license/insurance verification badges, and trust logos on the homepage.
Builder


Search codebase for 'Pricing|/pricing|Help|/help|help-center|help centre|National Bank Card Services|PayPal|payment|payments|contact|phone|\+1-555-123-4567|555-123-4567|Testimonials|testimonial|licenses|insurance|badge|trust|hero|Hero|headline'
Search codebase for '(^|\/)app\/(pricing|help)(\/|$)|href: '\/pricing'|href: '\/help'|Pricing|Help Center|How payments work|PayPal|National Bank Card Services|Authorize.Net|Stripe|bank card'
Search codebase for 'Testimonial|Testimonials|testimonial|trust|Trusted|badge|Badges|verification_badges|Showcase|Completed Projects|portfolio|case studies|sections'
Search codebase for 'href: '/(client/)?projects/(new|create)'|post project|Post a Project|/projects/new|/client/projects/new|create project|new project'
Search codebase for '\+1-555-123-4567|555-123-4567|\(555\)|contact@|support@|Business Hours|Hours|Mon|Sun|Saturday|email'
client\src\app\page.tsx
1-350
client\src\components\sections\Hero.tsx
1-260
client\src\app\help\page.tsx
1-160
9 tasks
اعتماد قصة مدفوعات موحّدة (بطاقات + ACH عبر National Bank Card Services أم تضمين PayPal؟) وصياغة نص قياسي موحّد لكل الصفحات
تحديث الهيرو في الصفحة الرئيسية بعنوان قوي وCTA “Post a Project” + شرح 3 خطوات مختصر وتحسينات تتبع التحويل
إضافة قسم عناصر ثقة على الصفحة الرئيسية (شهادات عملاء، أمثلة مشاريع مكتملة، شارات ترخيص/تأمين، شعارات موثوقية)
توحيد رسائل المدفوعات عبر الصفحات (التسعير، المساعدة، عن الموقع، السياسة، الشروط، الخدمات) وإزالة التناقضات (ذكر PayPal عند عدم دعمه)
استبدال بيانات الاتصال الوهمية (+1-555-123-4567) بالرقم والبريد الحقيقيين وساعات العمل، ويفضل تكوينها عبر متغيرات بيئة
مراجعة واجهات إدارة طرق الدفع وإخفاء/تعديل حقول PayPal إذا لم تكن معتمدة حالياً
إعادة تسمية/إخراج قسم "Our Projects" ليعرض مشاريع مكتملة مع صور قبل/بعد أو بيانات واقعية من الـ API إن توفرت
اختبارات يدوية وتحسين الأداء والفهارس ومعالجة الحالات الطرفية
خطة قياس وتحسين التحويل (أحداث تتبع، لوحة مؤشرات، A/B لاختبار الهيرو الجديد)
Search codebase for 'Find paths for: homepage page (root app page.tsx), components/Hero.tsx, components/Footer.tsx, components/Header.tsx, app/pricing/page.tsx, app/help/page.tsx, lib/routes.ts, and any homepage data provider (homepageApi.ts). Return absolute paths.'
client\src\app\page.tsx
1-300
client\src\components\sections\Hero.tsx
1-250
client\src\services\homepageApi.ts
1-250
client\src\app\pricing\page.tsx
1-250
client\src\app\help\page.tsx
1-300
client\src\components\layout\Footer.tsx
1-300
client\src\components\sections\Hero.tsx
+51
-6

Review
homs\client\src\components\sections
Builder
Abnormally stopped


0/5 Tasks done
تحديث Hero في الصفحة الرئيسية بعنوان قوي وCTA "Post a Project" وإضافة شرح بثلاث خطوات بسيطة.
توحيد قصة الدفع (إزالة أي تعارض بين National Bank Card Services وPayPal) عبر صفحات Pricing وHelp وكل أماكن الذكر.
استبدال أرقام/إيميلات placeholder بتفاصيل الاتصال الحقيقية ووقت العمل، مع مركزتها في ملف إعداد واحد لاستخدامها عبر الموقع.
تحديث Hero في الصفحة الرئيسية بعنوان قوي وCTA "Post a Project" وإضافة شرح بثلاث خطوات بسيطة.
توحيد قصة الدفع (إزالة أي تعارض بين National Bank Card Services وPayPal) عبر صفحات Pricing وHelp وكل أماكن الذكر.
استبدال أرقام/إيميلات placeholder بتفاصيل الاتصال الحقيقية ووقت العمل، مع مركزتها في ملف إعداد واحد لاستخدامها عبر الموقع.
إضافة عناصر الثقة للصفحة الرئيسية: testimonials، أمثلة مشاريع مكتملة، شارات ترخيص/تأمين، شعارات ثقة.
مراجعة بصرية للواجهة بعد التغييرات ورفع أي تعديلات CSS لازمة للحفاظ على الاتساق.
client\src\components\sections\Hero.tsx
1-300
Search codebase for 'National Bank Card Services|PayPal|paypal'
Search codebase for 'Post a Project|post a project|/projects/new|/client/projects/new|/projects/create|/client/projects/create'
Search codebase for 'export default function Home|metadata.*home|<main|HomePage|src/app/page.tsx|A-List Home Pros'
Search codebase for '\+1-555-123-4567|555-123|\(555\)|example@|support@alishomepros|contact@|info@|support@|business hours|Mon|Sun'
client\src\app\page.tsx
1-420
client\src\app\page.tsx
421-900
client\src\app\help\page.tsx
1-220
client\src\app\contact\page.tsx
1-200
client\src\config\site.ts
+11
-0

Review
client\src\app\contact\page.tsx
+28
-5

Review
homs\client
client\src\config\site.ts
1-220
client\src\app\contact\page.tsx
1-320
client\src\app\contact\page.tsx
+1
-23

Review
Search codebase for 'PayPal|paypal|National Bank Card Services'
client\src\app\page.tsx
1-300
client\src\app\client\payments\methods\page.tsx
1-320
client\src\app\help\page.tsx
1-220
Search codebase for 'Find the Hero section component to update headline, CTA, and add 3-step explainer.'
0/5 Tasks done
تأكيد أن Hero في الصفحة الرئيسية يعرض العنوان والـ CTA والشرح بثلاث خطوات كما طُلِب، وتحديثه إن لزم.
توحيد قصة الدفع عبر الموقع: استبدال أي ذكر لـ PayPal أو National Bank Card Services بنص مركزي من config/site.ts في صفحات Pricing وHelp وطرق الدفع وغيرها.
استبدال أي أرقام/إيميلات placeholder في كل الصفحات بقيم مركزية من config/site.ts.
تأكيد أن Hero في الصفحة الرئيسية يعرض العنوان والـ CTA والشرح بثلاث خطوات كما طُلِب، وتحديثه إن لزم.
توحيد قصة الدفع عبر الموقع: استبدال أي ذكر لـ PayPal أو National Bank Card Services بنص مركزي من config/site.ts في صفحات Pricing وHelp وطرق الدفع وغيرها.
استبدال أي أرقام/إيميلات placeholder في كل الصفحات بقيم مركزية من config/site.ts.
إضافة عناصر الثقة للصفحة الرئيسية: testimonials، أمثلة مشاريع، شارات ترخيص/تأمين، وشريط شعارات ثقة.
مراجعة بصرية عبر تشغيل الخادم المحلي ومعاينة التغييرات وإصلاح أي مشاكل CSS.
client\src\config\site.ts
1-200
Search codebase for 'PayPal|paypal|National Bank Card Services'
Search codebase for 'Testimonials|Testimonial|reviews|trust|badge|badges|insurance|licensed|verified'
Search codebase for '\+1 \(555\)|555-123-4567|support@alisthomepros\.com|example@|hello@|contact@'
client\src\components\sections\Hero.tsx
1-250
homs\client\public
client\src\app\help\page.tsx
1-260
client\src\app\pricing\page.tsx
1-260
client\src\app\about\page.tsx
190-260
client\src\app\help\page.tsx
+17
-7

Review
Search codebase for '(export\s+const|export\s+default)\s+.*(CONTACT_|BUSINESS_HOURS|PAYMENTS_STORY|SITE|site)'



0/5 Tasks done
تحديث الهيرو بالعنوان المطلوب وCTA "Post a Project" مع التأكد من وجود الشرح بثلاث خطوات وعرض شريط شعارات الثقة.

توحيد قصة الدفع عبر كل الصفحات (Pricing, Help, About, Terms, وغيرهم) لاستخدام PAYMENTS_STORY من config/site.ts بدل PayPal/National Bank Card Services.
استبدال أرقام الهاتف والإيميلات placeholder في جميع الصفحات بقيم CONTACT_PHONE/CONTACT_EMAIL وساعات العمل BUSINESS_HOURS_* من config/site.ts.
تحديث الهيرو بالعنوان المطلوب وCTA "Post a Project" مع التأكد من وجود الشرح بثلاث خطوات وعرض شريط شعارات الثقة.
توحيد قصة الدفع عبر كل الصفحات (Pricing, Help, About, Terms, وغيرهم) لاستخدام PAYMENTS_STORY من config/site.ts بدل PayPal/National Bank Card Services.
استبدال أرقام الهاتف والإيميلات placeholder في جميع الصفحات بقيم CONTACT_PHONE/CONTACT_EMAIL وساعات العمل BUSINESS_HOURS_* من config/site.ts.
تشغيل الخادم المحلي ومعاينة التغييرات بصرياً وإصلاح أي مشاكل CSS.
إضافة عناصر الثقة في الصفحة الرئيسية: testimonials، أمثلة مشاريع من البيانات الموجودة، شارات ترخيص/تأمين، وشريط شعارات (Angie’s List, Trustpilot

3 tasks

تحميل شعارات Florida Contractors Association و Better Business Bureau و HomeAdvisor و Angie's List

تحديث مكون Hero لعرض الشعارات الجديدة

التحقق من عرض الشعارات في الصفحة الرئيسية

تحديث مسارات الشعارات في مكون Hero

التحقق من عرض الشعارات في الصفحة الرئيسية

إعادة تشغيل الخادم المحلي لمعاينة التغييرات

تحديث أحجام الشعارات في مكون Hero لتكون ضعف الحجم الحالي

التحقق من عرض الشعارات بالحجم الجديد في الصفحة الرئيسية

ضبط المسافات بين الشعارات إذا لزم الأمر



### 2. الإجراءات التالية:
1. 1.
   إنشاء ملف sitemap.xml يحتوي على جميع صفحات الموقع
2. 2.
   تنفيذ العناوين والأوصاف التعريفية الفريدة لكل صفحة
3. 3.
   إضافة مخططات JSON-LD للمنظمة والأعمال المحلية والأسئلة الشائعة والمنتجات
4. 4.
   تكوين Open Graph و Twitter Cards لتحسين مشاركة الروابط

### 4. الموارد المطلوبة:
- مطور واجهة أمامية لتنفيذ التغييرات
- مختص SEO لمراجعة التنفيذ
- أدوات اختبار SEO للتحقق من صحة التنفيذ


6/6 Tasks done

All tasks completed

تحليل هيكل المشروع وفهم البنية الحالية

إنشاء ملف robots.txt وإضافته للمشروع

إنشاء ملف sitemap.xml وإضافته للمشروع

تنفيذ العناوين والأوصاف التعريفية الفريدة لجميع الصفحات

تنفيذ مخطط JSON-LD للمنظمة والأعمال المحلية والأسئلة الشائعة والمنتجات

ضمان إعداد Open Graph و Twitter Cards لمشاركة الروابط بشكل نظيف



3/4 Tasks done

إصلاح خطأ في صفحة about/page.tsx - مشكلة في بنية JSX

التحقق من تثبيت جميع التبعيات المطلوبة

تشغيل البناء مرة أخرى للتأكد من حل جميع الأخطاء

إصلاح خطأ في مكون ProjectIntakeForm.tsx - مشكلة في استيراد framer-motion

إصلاح خطأ في صفحة about/page.tsx - مشكلة في بنية JSX

التحقق من تثبيت جميع التبعيات المطلوبة

تشغيل البناء مرة أخرى للتأكد من حل جميع الأخطاء


5/5 Tasks done

All tasks completed

إصلاح خطأ BookConsultationModal.tsx ليكون وحدة نمطية صحيحة

إصلاح خطأ تصدير AuthProvider في src/components/providers/AuthProvider.tsx

إصلاح خطأ تصدير ToastProvider في src/components/providers/ToastProvider.tsx

تشغيل البناء النهائي للتأكد من حل جميع الأخطاء

إصلاح خطأ TypeScript في layout.tsx - 'pathname' is possibly 'null'



5/5 Tasks done

All tasks completed

Change lang/dir in layout.tsx to English and LTR

Update ToastProvider to use LTR direction

Convert StickyCallToAction texts to English

Convert ProjectIntakeForm texts to English

Run local server and visually preview changes

0/4 Tasks done

إعادة تصميم قسم البطل للصفحة الرئيسية بإضافة خلفية متدرجة وشارات الثقة وCTA احترافي

تحسين بطاقات الميزات لضمان مظهر عصري ومتسق مع الهوية

تشغيل خادم التطوير وفتح معاينة للتحقق البصري من التغييرات

إعادة تصميم قسم البطل للصفحة الرئيسية بإضافة خلفية متدرجة وشارات الثقة وCTA احترافي

تحسين بطاقات الميزات لضمان مظهر عصري ومتسق مع الهوية

تشغيل خادم التطوير وفتح معاينة للتحقق البصري من التغييرات

تحسين أقسام الضمان وحل النزاعات بإطار بصري أنيق


