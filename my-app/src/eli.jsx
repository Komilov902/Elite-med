import { useEffect, useRef, useState } from "react";
import "./ElitemedSite.scss";


const PHONES = [
  { tel: "+998886164444", label: "+998 88 616 44 44" },
  { tel: "+998755428777", label: "+998 75 542 87 77" },
];
const MAP_URL = "https://maps.app.goo.gl/ai1mzanjcTAhjKxd7";



const TELEGRAM_BOT_TOKEN = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = import.meta.env.VITE_TELEGRAM_CHAT_ID;
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;


const PRICES = {
  diagnostics: null,
  consultation: null,
  laser: null,
  dental: null,
};

const SERVICE_PRICE_KEY = ["diagnostics", "laser", null, null, "dental", null];


const DOCTORS = [
  {
    name: "Ism Familiya 1",
    photo: "",
    role: { uz: "Oftalmolog-jarroh", ru: "Офтальмолог-хирург" },
    exp: { uz: "X yil", ru: "X лет" },
    edu: { uz: "Universitet nomi", ru: "Название вуза" },
    certs: { uz: ["Sertifikat nomi"], ru: ["Название сертификата"] },
    focus: { uz: ["Yoʻnalish 1", "Yoʻnalish 2"], ru: ["Направление 1", "Направление 2"] },
  },
  {
    name: "Ism Familiya 2",
    photo: "",
    role: { uz: "Lazer jarrohi", ru: "Лазерный хирург" },
    exp: { uz: "X yil", ru: "X лет" },
    edu: { uz: "Universitet nomi", ru: "Название вуза" },
    certs: { uz: ["Sertifikat nomi"], ru: ["Название сертификата"] },
    focus: { uz: ["Yoʻnalish 1", "Yoʻnalish 2"], ru: ["Направление 1", "Направление 2"] },
  },
  {
    name: "Ism Familiya 3",
    photo: "",
    role: { uz: "Stomatolog", ru: "Стоматолог" },
    exp: { uz: "X yil", ru: "X лет" },
    edu: { uz: "Universitet nomi", ru: "Название вуза" },
    certs: { uz: ["Sertifikat nomi"], ru: ["Название сертификата"] },
    focus: { uz: ["Yoʻnalish 1", "Yoʻnalish 2"], ru: ["Направление 1", "Направление 2"] },
  },
  {
    name: "Ism Familiya 4",
    photo: "",
    role: { uz: "Bolalar shifokori", ru: "Детский врач" },
    exp: { uz: "X yil", ru: "X лет" },
    edu: { uz: "Universitet nomi", ru: "Название вуза" },
    certs: { uz: ["Sertifikat nomi"], ru: ["Название сертификата"] },
    focus: { uz: ["Yoʻnalish 1", "Yoʻnalish 2"], ru: ["Направление 1", "Направление 2"] },
  },
  {
    name: "Ism Familiya 5",
    photo: "",
    role: { uz: "Optometrist", ru: "Оптометрист" },
    exp: { uz: "X yil", ru: "X лет" },
    edu: { uz: "Universitet nomi", ru: "Название вуза" },
    certs: { uz: ["Sertifikat nomi"], ru: ["Название сертификата"] },
    focus: { uz: ["Yoʻnalish 1", "Yoʻnalish 2"], ru: ["Направление 1", "Направление 2"] },
  },
  {
    name: "Ism Familiya 6",
    photo: "",
    role: { uz: "Diagnost shifokor", ru: "Врач-диагност" },
    exp: { uz: "X yil", ru: "X лет" },
    edu: { uz: "Universitet nomi", ru: "Название вуза" },
    certs: { uz: ["Sertifikat nomi"], ru: ["Название сертификата"] },
    focus: { uz: ["Yoʻnalish 1", "Yoʻnalish 2"], ru: ["Направление 1", "Направление 2"] },
  },
];


const INITIAL_REVIEWS = [];

const T = {
  uz: {
    nav: { services: "Xizmatlar", prices: "Narxlar", doctors: "Shifokorlar", faq: "Savollar", contact: "Aloqa" },
    book: "Qabulga yozilish",
    call: "Qoʻngʻiroq qilish",
    menu: "Menyu",
    heroTitle: "Koʻrishingiz va salomatligingiz ishonchli qoʻllarda",
    heroText:
      "Kitob tumanidagi zamonaviy tibbiyot markazi: diagnostika, lazer jarrohligi, optika, stomatologiya va bolalar shifokori bir joyda.",

    whyTitle: "Nega aynan Elite Med?",
    why: [
      ["Zamonaviy uskunalar", "Aniq tashxis uchun zamonaviy tibbiy uskunalar."],
      ["Tajribali mutaxassislar", "Har bir yoʻnalish boʻyicha malakali shifokorlar."],
      ["Diagnostika bir joyda", "Tekshiruv va maslahat — bitta markazda."],
      ["Bolalar shifokori", "Eng kichik bemorlar uchun alohida qabul."],
      ["Optika", "Koʻz oynagi va linzalar shu yerning oʻzida."],
      ["Qulay yozilish", "Telefon yoki sayt orqali qabulga yoziling."],
    ],

    servicesTitle: "Xizmatlarimiz",
    servicesHint: "Batafsil maʼlumot uchun xizmat ustiga bosing",
    labels: {
      who: "Kimlar uchun",
      how: "Qanday oʻtadi",
      duration: "Davomiyligi",
      prep: "Tayyorgarlik",
      contra: "Qarshi koʻrsatmalar",
      price: "Narxi",
    },
    services: [
      {
        name: "Zamonaviy diagnostika",
        desc: "Zamonaviy uskunalarda tekshiruv va aniq tashxis.",
        who: "Koʻrish yoki umumiy holat boʻyicha shikoyati bor yoki profilaktik tekshiruvdan oʻtmoqchi boʻlganlar.",
        how: "Shifokor koʻrigi, kerakli tekshiruvlar va natijalarni tushuntirish.",
        group: "consult",
      },
      {
        name: "Lazer jarrohligi",
        desc: "Lazer texnologiyasi yordamida jarrohlik amaliyotlari.",
        who: "Shifokor koʻrikdan soʻng lazer amaliyotini tavsiya qilgan bemorlar.",
        how: "Avval shifokor koʻrigi va tekshiruvlar, soʻng amaliyot va tiklanish boʻyicha tavsiyalar.",
        group: "surgery",
      },
      {
        name: "Toʻr parda va kataraktaning choksiz jarrohligi",
        desc: "Choksiz usulda toʻr parda va katarakta jarrohligi.",
        who: "Toʻr parda yoki katarakta tashxisi qoʻyilgan va jarrohlik tavsiya etilgan bemorlar.",
        how: "Choksiz usulda jarrohlik; amaliyotdan oldin va keyin shifokor nazorati.",
        group: "surgery",
      },
      {
        name: "Optika",
        desc: "Koʻz oynagi va linzalarni tanlash.",
        who: "Koʻz oynagi yoki kontakt linza tanlamoqchi boʻlganlar.",
        how: "Koʻrishni tekshirish natijasiga qarab oyna yoki linza tanlanadi.",
        group: "consult",
      },
      {
        name: "Stomatologiya",
        desc: "Tishlarni davolash va parvarishlash.",
        who: "Tish ogʻrigʻi, tekshiruv yoki profilaktika uchun murojaat qilganlar.",
        how: "Koʻrik, kerak boʻlsa davolash va parvarish boʻyicha tavsiyalar.",
        group: "consult",
      },
      {
        name: "Bolalar shifokori",
        desc: "Bolalar uchun alohida shifokor qabuli.",
        who: "Bolasini koʻrikdan oʻtkazmoqchi yoki shikoyatlari bor ota-onalar.",
        how: "Bolaga mos muloyim qabul, koʻrik va ota-onaga tavsiyalar.",
        group: "consult",
      },
    ],
    groups: {
      consult: {
        duration: "Xizmat turiga qarab; yozilishda aniqlashtiriladi.",
        prep: "Kerak boʻlsa, yozilishda aytamiz.",
        contra: "Shifokor koʻrikda aniqlaydi.",
      },
      surgery: {
        duration: "Amaliyot turi va bemor holatiga qarab shifokor aytadi.",
        prep: "Amaliyotdan oldin shifokor koʻrigi va tekshiruvlar; batafsil koʻrsatma beriladi.",
        contra: "Shifokor koʻrik va tekshiruvlardan soʻng individual belgilaydi.",
      },
    },
    priceAsk: "Narxni aniqlashtirish",
    bookThis: "Yozilish",

    processTitle: "Qabul qanday oʻtadi",
    steps: [
      ["Yozilish", "Telefon yoki sayt orqali qulay vaqtga yoziling."],
      ["Diagnostika", "Zamonaviy uskunalarda kerakli tekshiruvlar."],
      ["Maslahat", "Shifokor natijalarni tushuntiradi."],
      ["Davolash va tavsiyalar", "Davolash rejasi va keyingi tavsiyalar."],
    ],

    pricesTitle: "Narxlar",
    priceItems: {
      diagnostics: "Diagnostika",
      consultation: "Konsultatsiya",
      laser: "Lazer jarrohligi",
      dental: "Stomatologiya",
    },
    priceNote:
      "Narxlar oʻzgarib turadi, shuning uchun eskirgan raqamlarni koʻrsatmaymiz. Amaldagi narxni bizdan aniqlashtiring.",

    doctorsTitle: "Shifokorlarimiz",
    doctorsHint: "Ismi va lavozimini koʻrish uchun rasm ustiga olib boring yoki bosing",
    prev: "Oldingi",
    next: "Keyingi",
    docLabels: { exp: "Tajriba", edu: "Taʼlim", certs: "Sertifikatlar", focus: "Yoʻnalishlar" },
    bookDoctor: "Shifokorga yozilish",

    reviewsTitle: "Bemorlar sharhlari",
    reviewsMap: "Google Maps’da koʻrish",

    faqTitle: "Koʻp beriladigan savollar",
    faq: [
      ["Oldindan yozilish kerakmi?", "Yozilish tavsiya etiladi: bu kutish vaqtini qisqartiradi. Telefon orqali yoki saytdagi forma bilan yozilishingiz mumkin."],
      ["Diagnostika qancha davom etadi?", "Davomiyligi tekshiruv turiga bogʻliq. Yozilishda aniq vaqtni aytib beramiz."],
      ["Boshqa tumandan kelsam boʻladimi?", "Ha, boshqa tumanlardan kelganlarni ham qabul qilamiz. Manzil: Kitob tumani, 2-sonli MTM (Lola bogʻchasi) roʻparasida."],
      ["Bolalarni qabul qilasizlarmi?", "Ha, markazimizda bolalar shifokori qabul qiladi."],
      ["Tekshiruvga qanday tayyorlanish kerak?", "Tayyorgarlik tekshiruv turiga bogʻliq. Yozilganingizda nimalarga eʼtibor berishni aytamiz."],
      ["Muddatli toʻlov (rassrochka) bormi?", "Bu haqda maʼlumot olish uchun bizga qoʻngʻiroq qiling."],
    ],

    contactTitle: "Bizga keling yoki qoʻngʻiroq qiling",
    addressLabel: "Manzil",
    address: "Kitob tumani, 2-sonli MTM (Lola bogʻchasi) roʻparasida",
    phoneLabel: "Telefon",
    hoursLabel: "Ish vaqti",
    hours: ["Dushanba–Shanba: 08:00–18:00", "Yakshanba: dam olish"],
    openMap: "Xaritada ochish",
    footer: "Tibbiyot markazi",

    form: {
      title: "Qabulga yozilish",
      doctor: "Shifokor",
      name: "Ismingiz",
      phone: "Telefon raqami",
      service: "Xizmat",
      choose: "Tanlang",
      other: "Boshqa",
      date: "Qulay sana",
      comment: "Izoh (ixtiyoriy)",
      send: "Yuborish",
      sending: "Yuborilmoqda…",
      required: "Ism va telefon raqamini toʻldiring.",
      ok: "Ariza qabul qilindi",
      okText: "Tez orada siz bilan bogʻlanamiz.",
      err: "Ariza yuborilmadi. Iltimos, qoʻngʻiroq qiling:",
      close: "Yopish",
    },
  },

  ru: {
    nav: { services: "Услуги", prices: "Цены", doctors: "Врачи", faq: "Вопросы", contact: "Контакты" },
    book: "Записаться на приём",
    call: "Позвонить",
    menu: "Меню",
    heroTitle: "Ваше зрение и здоровье — в надёжных руках",
    heroText:
      "Современный медицинский центр в Китабском районе: диагностика, лазерная хирургия, оптика, стоматология и детский врач в одном месте.",

    whyTitle: "Почему Elite Med?",
    why: [
      ["Современное оборудование", "Современная медицинская техника для точной диагностики."],
      ["Опытные специалисты", "Квалифицированные врачи по каждому направлению."],
      ["Диагностика в одном месте", "Обследование и консультация — в одном центре."],
      ["Детский врач", "Отдельный приём для самых маленьких пациентов."],
      ["Оптика", "Очки и линзы — прямо в центре."],
      ["Удобная запись", "Запишитесь по телефону или через сайт."],
    ],

    servicesTitle: "Наши услуги",
    servicesHint: "Нажмите на услугу, чтобы увидеть подробности",
    labels: {
      who: "Кому подходит",
      how: "Как проходит",
      duration: "Длительность",
      prep: "Подготовка",
      contra: "Противопоказания",
      price: "Стоимость",
    },
    services: [
      {
        name: "Современная диагностика",
        desc: "Обследование на современном оборудовании и точный диагноз.",
        who: "Тем, у кого есть жалобы на зрение или общее состояние, а также для профилактического осмотра.",
        how: "Осмотр врача, необходимые обследования и объяснение результатов.",
        group: "consult",
      },
      {
        name: "Лазерная хирургия",
        desc: "Хирургические операции с применением лазерных технологий.",
        who: "Пациентам, которым врач после осмотра рекомендовал лазерное вмешательство.",
        how: "Сначала осмотр и обследования, затем операция и рекомендации по восстановлению.",
        group: "surgery",
      },
      {
        name: "Бесшовная хирургия сетчатки и катаракты",
        desc: "Бесшовный метод операций на сетчатке и при катаракте.",
        who: "Пациентам с диагнозом «патология сетчатки» или «катаракта», которым рекомендована операция.",
        how: "Операция бесшовным методом; наблюдение врача до и после вмешательства.",
        group: "surgery",
      },
      {
        name: "Оптика",
        desc: "Подбор очков и линз.",
        who: "Тем, кто хочет подобрать очки или контактные линзы.",
        how: "Очки или линзы подбираются по результатам проверки зрения.",
        group: "consult",
      },
      {
        name: "Стоматология",
        desc: "Лечение и уход за зубами.",
        who: "При зубной боли, для осмотра или профилактики.",
        how: "Осмотр, при необходимости лечение и рекомендации по уходу.",
        group: "consult",
      },
      {
        name: "Детский врач",
        desc: "Отдельный приём для детей.",
        who: "Родителям, которые хотят показать ребёнка врачу или у кого есть жалобы.",
        how: "Бережный приём, осмотр и рекомендации родителям.",
        group: "consult",
      },
    ],
    groups: {
      consult: {
        duration: "Зависит от услуги; уточняется при записи.",
        prep: "Если потребуется, сообщим при записи.",
        contra: "Определяет врач на осмотре.",
      },
      surgery: {
        duration: "Зависит от вида операции и состояния пациента; скажет врач.",
        prep: "Перед операцией — осмотр врача и обследования; подробные инструкции выдаются отдельно.",
        contra: "Врач определяет индивидуально после осмотра и обследований.",
      },
    },
    priceAsk: "Уточнить цену",
    bookThis: "Записаться",

    processTitle: "Как проходит приём",
    steps: [
      ["Запись", "Запишитесь на удобное время по телефону или через сайт."],
      ["Диагностика", "Необходимые обследования на современном оборудовании."],
      ["Консультация", "Врач объясняет результаты."],
      ["Лечение и рекомендации", "План лечения и дальнейшие рекомендации."],
    ],

    pricesTitle: "Цены",
    priceItems: {
      diagnostics: "Диагностика",
      consultation: "Консультация",
      laser: "Лазерная хирургия",
      dental: "Стоматология",
    },
    priceNote:
      "Цены меняются, поэтому мы не показываем устаревшие цифры. Уточните актуальную стоимость у нас.",

    doctorsTitle: "Наши врачи",
    doctorsHint: "Наведите на фото (на телефоне — нажмите), чтобы увидеть имя и должность",
    prev: "Назад",
    next: "Вперёд",
    docLabels: { exp: "Стаж", edu: "Образование", certs: "Сертификаты", focus: "Направления работы" },
    bookDoctor: "Записаться к врачу",

    reviewsTitle: "Отзывы пациентов",
    reviewsMap: "Смотреть в Google Maps",

    faqTitle: "Частые вопросы",
    faq: [
      ["Нужно ли заранее записываться?", "Запись рекомендуется: так меньше ждать. Записаться можно по телефону или через форму на сайте."],
      ["Сколько длится диагностика?", "Зависит от вида обследования. Точное время назовём при записи."],
      ["Можно ли приехать из другого района?", "Да, принимаем пациентов из других районов. Адрес: Китабский район, напротив МТМ №2 (детский сад «Лола»)."],
      ["Принимаете ли детей?", "Да, в нашем центре ведёт приём детский врач."],
      ["Как подготовиться к обследованию?", "Подготовка зависит от вида обследования. При записи подскажем, на что обратить внимание."],
      ["Есть ли рассрочка?", "Чтобы узнать об этом, позвоните нам."],
    ],

    contactTitle: "Приходите или звоните",
    addressLabel: "Адрес",
    address: "Китабский район, напротив МТМ №2 (детский сад «Лола»)",
    phoneLabel: "Телефон",
    hoursLabel: "Часы работы",
    hours: ["Пн–Сб: 08:00–18:00", "Вс: выходной"],
    openMap: "Открыть на карте",
    footer: "Медицинский центр",

    form: {
      title: "Записаться на приём",
      doctor: "Врач",
      name: "Ваше имя",
      phone: "Номер телефона",
      service: "Услуга",
      choose: "Выберите",
      other: "Другое",
      date: "Желаемая дата",
      comment: "Комментарий (необязательно)",
      send: "Отправить",
      sending: "Отправка…",
      required: "Заполните имя и номер телефона.",
      ok: "Заявка принята",
      okText: "Мы скоро свяжемся с вами.",
      err: "Заявка не отправилась. Пожалуйста, позвоните:",
      close: "Закрыть",
    },
  },
};



function Mark({ shield = "currentColor", eye = "#fff", size = 34 }) {
  return (
    <svg width={size} height={size * 1.15} viewBox="0 0 100 115" aria-hidden="true">
      <path d="M8 6h84v54c0 28-24 46-42 55C32 106 8 88 8 60z" fill={shield} />
      <ellipse cx="50" cy="57" rx="32" ry="22" fill={eye} />
      <path fill={shield} d="M44 44h12v7h8v12h-8v7H44v-7h-8V51h8z" />
    </svg>
  );
}

function Silhouette() {
  return (
    <svg className="em-sil" viewBox="0 0 100 130" aria-hidden="true">
      <circle cx="50" cy="46" r="20" fill="rgba(255,255,255,.85)" />
      <path d="M10 130c0-28 18-46 40-46s40 18 40 46z" fill="rgba(255,255,255,.85)" />
    </svg>
  );
}

function EyeArt() {
  return (
    <svg className="em-eye" viewBox="0 0 400 260" aria-hidden="true">
      <g fill="none" stroke="#fff" strokeWidth="2">
        <path opacity=".55" d="M8 130C80 26 320 26 392 130 320 234 80 234 8 130Z" />
        <circle opacity=".35" cx="200" cy="130" r="96" />
        <circle opacity=".3" cx="200" cy="130" r="70" />
        <circle opacity=".25" cx="200" cy="130" r="46" />
      </g>
      <circle cx="200" cy="130" r="32" fill="#fff" />
      <path fill="#0B3FCB" d="M194 114h12v10h10v12h-10v10h-12v-10h-10v-12h10z" />
    </svg>
  );
}

function Stars({ n = 5 }) {
  return (
    <span className="em-stars" role="img" aria-label={`${n} / 5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <svg key={i} width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5L2.5 9.4l6.6-.9z"
            fill={i < n ? "#F5B301" : "#D3E0F5"}
          />
        </svg>
      ))}
    </span>
  );
}

const priceText = (p, lang) => (p ? p[lang] : null);

function PhoneLinks({ className }) {
  return PHONES.map((p) => (
    <a key={p.tel} className={className} href={`tel:${p.tel}`}>
      {p.label}
    </a>
  ));
}


function BookingModal({ t, preset, onClose }) {
  const f = t.form;
  const firstRef = useRef(null);
  const today = new Date().toISOString().slice(0, 10);
  const [data, setData] = useState({
    name: "",
    phone: "",
    service: preset.service || "",
    date: "",
    comment: "",
  });
  const [status, setStatus] = useState("idle"); 

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    firstRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  const set = (k) => (e) => setData((d) => ({ ...d, [k]: e.target.value }));

  const submit = async () => {
    const digits = data.phone.replace(/\D/g, "");
    if (!data.name.trim() || digits.length < 9) {
      setStatus("invalid");
      return;
    }
    setStatus("sending");
    try {
      if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
        throw new Error("Telegram settings are not set");
      }

      const message = [
  "🩺 ELITE MED",
  "━━━━━━━━━━━━━━━━━━━━",
  "",
  "📋 YANGI QABULGA ARIZA",
  "",
  `👤 Bemor:`,
  `   ${data.name}`,
  "",
  `📞 Telefon:`,
  `   ${data.phone}`,
  "",
  `🏥 Xizmat:`,
  `   ${data.service || "Tanlanmagan"}`,
  "",
  `📅 Qulay sana:`,
  `   ${data.date || "Tanlanmagan"}`,
  "",
  `👨‍⚕️ Shifokor:`,
  `   ${preset.doctor || "Tanlanmagan"}`,
  "",
  `📝 Izoh:`,
  `   ${data.comment || "Yo‘q"}`,
  "",
  "━━━━━━━━━━━━━━━━━━━━",
  "📍 Elite Med",
].join("\n");

      const res = await fetch(
        `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: TELEGRAM_CHAT_ID,
            text: message,
          }),
        }
      );

      const result = await res.json();
      if (!res.ok || !result.ok) {
        throw new Error(result.description || `HTTP ${res.status}`);
      }

      setStatus("ok");
    } catch (err) {
      console.warn("Booking failed:", err);
      setStatus("error");
    }
  };

  return (
    <div className="em-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="em-modal" role="dialog" aria-modal="true" aria-label={f.title}>
        <button className="em-modal-x" onClick={onClose} aria-label={f.close}>
          ×
        </button>

        {status === "ok" ? (
          <div className="em-done">
            <svg width="56" height="56" viewBox="0 0 56 56" aria-hidden="true">
              <circle cx="28" cy="28" r="28" fill="#0B3FCB" />
              <path d="M16 29l8 8 16-17" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <h3>{f.ok}</h3>
            <p>{f.okText}</p>
            <button className="em-btn em-btn-solid" onClick={onClose}>
              {f.close}
            </button>
          </div>
        ) : (
          <div className="em-fields">
            <h3>{f.title}</h3>
            {preset.doctor && (
              <p className="em-preset">
                {f.doctor}: <strong>{preset.doctor}</strong>
              </p>
            )}

            <label>
              {f.name}
              <input ref={firstRef} type="text" autoComplete="name" value={data.name} onChange={set("name")} />
            </label>
            <label>
              {f.phone}
              <input
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="+998"
                value={data.phone}
                onChange={set("phone")}
              />
            </label>
            <label>
              {f.service}
              <select value={data.service} onChange={set("service")}>
                <option value="">{f.choose}</option>
                {t.services.map((s) => (
                  <option key={s.name} value={s.name}>
                    {s.name}
                  </option>
                ))}
                <option value={f.other}>{f.other}</option>
              </select>
            </label>
            <label>
              {f.date}
              <input type="date" min={today} value={data.date} onChange={set("date")} />
            </label>
            <label>
              {f.comment}
              <textarea rows="3" value={data.comment} onChange={set("comment")} />
            </label>

            {status === "invalid" && <p className="em-msg em-msg-warn">{f.required}</p>}
            {status === "error" && (
              <p className="em-msg em-msg-err">
                {f.err} <PhoneLinks className="em-msg-phone" />
              </p>
            )}

            <button className="em-btn em-btn-solid" onClick={submit} disabled={status === "sending"}>
              {status === "sending" ? f.sending : f.send}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function Header({ lang, setLang, t, onBook }) {
  const [open, setOpen] = useState(false);
  const links = [
    ["services", t.nav.services],
    ["prices", t.nav.prices],
    ["doctors", t.nav.doctors],
    ["faq", t.nav.faq],
    ["contact", t.nav.contact],
  ];
  return (
    <header className="em-head">
      <div className="em-head-in">
        <a className="em-brand" href="#top" aria-label="Elite Med">
          <Mark shield="#0B3FCB" eye="#fff" size={30} />
          <span>
            Elite Med
            <small>Medical centre</small>
          </span>
        </a>
        <nav className="em-nav" aria-label="Menu">
          {links.map(([id, label]) => (
            <a key={id} href={`#${id}`}>
              {label}
            </a>
          ))}
        </nav>
        <div className="em-right">
          <div className="em-lang" role="group" aria-label="Til / Язык">
            {["uz", "ru"].map((l) => (
              <button key={l} aria-pressed={lang === l} onClick={() => setLang(l)}>
                {l === "uz" ? "UZ" : "RU"}
              </button>
            ))}
          </div>
          <button className="em-cta" onClick={() => onBook({})}>
            {t.book}
          </button>
          <button
            className="em-burger"
            aria-label={t.menu}
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>
      {open && (
        <nav className="em-menu" aria-label={t.menu}>
          {links.map(([id, label]) => (
            <a key={id} href={`#${id}`} onClick={() => setOpen(false)}>
              {label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}

function Hero({ t, onBook }) {
  return (
    <section className="em-hero" id="top">
      <div className="em-hero-in">
        <div>
          <h1 className="korish">{t.heroTitle}</h1>
          <p>{t.heroText}</p>
          <div className="em-actions">
            <button className="em-btn em-btn-light" onClick={() => onBook({})}>
              {t.book}
            </button>
            <a className="em-btn em-btn-line" href={`tel:${PHONES[0].tel}`}>
              {t.call}
            </a>
          </div>
        </div>
        <EyeArt />
      </div>
    </section>
  );
}

function Why({ t }) {
  return (
    <section className="em-sec">
      <div className="em-wrap">
        <h2>{t.whyTitle}</h2>
        <ul className="em-why">
          {t.why.map(([title, text]) => (
            <li key={title}>
              <h3>{title}</h3>
              <p>{text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Services({ t, lang, onBook }) {
  const [open, setOpen] = useState(null);
  const L = t.labels;
  return (
    <section className="em-sec em-tint" id="services">
      <div className="em-wrap">
        <h2>{t.servicesTitle}</h2>
        <p className="em-sub">{t.servicesHint}</p>
        <ul className="em-svc-list">
          {t.services.map((s, i) => {
            const g = t.groups[s.group];
            const key = SERVICE_PRICE_KEY[i];
            const price = key ? priceText(PRICES[key], lang) : null;
            const isOpen = open === i;
            return (
              <li key={s.name} className={"em-svc" + (isOpen ? " open" : "")}>
                <button
                  className="em-svc-head"
                  aria-expanded={isOpen}
                  aria-controls={`svc-${i}`}
                  onClick={() => setOpen(isOpen ? null : i)}
                >
                  <span className="em-svc-name">{s.name}</span>
                  <span className="em-svc-desc">{s.desc}</span>
                  <span className="em-svc-chev" aria-hidden="true" />
                </button>
                <div className="em-svc-body" id={`svc-${i}`} role="region">
                  <div className="em-svc-in">
                    <dl>
                      <div><dt>{L.who}</dt><dd>{s.who}</dd></div>
                      <div><dt>{L.how}</dt><dd>{s.how}</dd></div>
                      <div><dt>{L.duration}</dt><dd>{g.duration}</dd></div>
                      <div><dt>{L.prep}</dt><dd>{g.prep}</dd></div>
                      <div><dt>{L.contra}</dt><dd>{g.contra}</dd></div>
                      <div><dt>{L.price}</dt><dd>{price || t.priceAsk}</dd></div>
                    </dl>
                    <div className="em-svc-actions">
                      <button className="em-btn em-btn-solid" onClick={() => onBook({ service: s.name })}>
                        {t.bookThis}
                      </button>
                      {!price && (
                        <a className="em-btn em-btn-ghost" href={`tel:${PHONES[0].tel}`}>
                          {t.priceAsk}
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

function Process({ t }) {
  return (
    <section className="em-sec">
      <div className="em-wrap">
        <h2>{t.processTitle}</h2>
        <ol className="em-steps">
          {t.steps.map(([title, text]) => (
            <li key={title}>
              <h3>{title}</h3>
              <p>{text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Prices({ t, lang }) {
  return (
    <section className="em-sec em-tint" id="prices">
      <div className="em-wrap">
        <h2>{t.pricesTitle}</h2>
        <ul className="em-prices">
          {Object.keys(PRICES).map((k) => {
            const p = priceText(PRICES[k], lang);
            return (
              <li key={k}>
                <span className="em-pname">{t.priceItems[k]}</span>
                {p ? (
                  <span className="em-pval">{p}</span>
                ) : (
                  <a className="em-btn em-btn-ghost" href={`tel:${PHONES[0].tel}`}>
                    {t.priceAsk}
                  </a>
                )}
              </li>
            );
          })}
        </ul>
        <p className="em-note">{t.priceNote}</p>
      </div>
    </section>
  );
}

function Doctors({ t, lang, onBook }) {
  const ringRef = useRef(null);
  const motion = useRef({ angle: 0, target: 0, paused: false });
  const [hover, setHover] = useState(false);
  const [active, setActive] = useState(null);
  const [shown, setShown] = useState(0);
  const n = DOCTORS.length;
  const step = 360 / n;
  const L = t.docLabels;

  useEffect(() => {
    motion.current.paused = hover || active !== null;
  }, [hover, active]);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf;
    let last = performance.now();
    const loop = (now) => {
      const dt = Math.min(now - last, 50);
      last = now;
      const m = motion.current;
      if (!m.paused && !reduce) m.target += dt * 0.018; // ~18°/s
      m.angle += (m.target - m.angle) * Math.min(1, dt * 0.008);
      if (ringRef.current) {
        ringRef.current.style.transform = `translateZ(calc(var(--r) * -1)) rotateY(${-m.angle}deg)`;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  const nudge = (dir) => {
    const m = motion.current;
    const idx = Math.round(m.target / step) + dir;
    m.target = idx * step;
    setShown(((idx % n) + n) % n);
  };

  const pick = (i) => {
    setActive(i);
    setShown(i);
  };

  const d = DOCTORS[shown];

  return (
    <section className="em-sec em-docs" id="doctors">
      <div className="em-wrap">
        <h2 className="titi">{t.doctorsTitle}</h2>
        <p className="em-hint">{t.doctorsHint}</p>
      </div>
      <div
        className="em-stage"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onClick={(e) => {
          if (e.target === e.currentTarget) setActive(null);
        }}
      >
        <div className="em-ring" ref={ringRef}>
          {DOCTORS.map((doc, i) => (
            <div
              className="em-slot"
              key={doc.name}
              style={{ transform: `rotateY(${i * step}deg) translateZ(var(--r))` }}
            >
              <button
                className={"em-dcard" + (active === i ? " on" : "")}
                onClick={() => (active === i ? setActive(null) : pick(i))}
                onFocus={() => pick(i)}
                aria-label={`${doc.name}, ${doc.role[lang]}`}
              >
                {doc.photo ? (
                  <img className="em-photo" src={doc.photo} alt="" loading="lazy" />
                ) : (
                  <span
                    className="em-ph"
                    style={{
                      background: `linear-gradient(160deg, hsl(${215 + i * 6} 80% 30%), hsl(${200 + i * 4} 85% 48%))`,
                    }}
                  >
                    <Silhouette />
                  </span>
                )}
                <span className="em-dinfo">
                  <span className="em-dname">{doc.name}</span>
                  <span className="em-drole">{doc.role[lang]}</span>
                </span>
              </button>
            </div>
          ))}
        </div>
      </div>
      <div className="em-ctrl">
        <button onClick={() => nudge(-1)} aria-label={t.prev}>
          ‹
        </button>
        <button onClick={() => nudge(1)} aria-label={t.next}>
          ›
        </button>
      </div>

      <div className="em-wrap em-dprof" aria-live="polite">
        <div className="em-dprof-head">
          <h3>{d.name}</h3>
          <p>{d.role[lang]}</p>
        </div>
        <dl>
          <div><dt>{L.exp}</dt><dd>{d.exp[lang]}</dd></div>
          <div><dt>{L.edu}</dt><dd>{d.edu[lang]}</dd></div>
          <div>
            <dt>{L.certs}</dt>
            <dd>
              <ul>{d.certs[lang].map((c) => <li key={c}>{c}</li>)}</ul>
            </dd>
          </div>
          <div>
            <dt>{L.focus}</dt>
            <dd>
              <ul>{d.focus[lang].map((c) => <li key={c}>{c}</li>)}</ul>
            </dd>
          </div>
        </dl>
        <button className="em-btn em-btn-light" onClick={() => onBook({ doctor: d.name })}>
          {t.bookDoctor}
        </button>
      </div>
    </section>
  );
}

function Reviews({ t, lang }) {
  const [reviews, setReviews] = useState([]);
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [rating, setRating] = useState(5);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const loadReviews = async () => {
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/reviews?select=id,name,rating,comment,created_at&order=created_at.desc`,
        {
          headers: {
            apikey: SUPABASE_ANON_KEY,
            Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          },
        }
      );
      if (!res.ok) throw new Error("Sharhlarni yuklab bo‘lmadi");
      const rows = await res.json();
      setReviews(rows);
    } catch (err) {
      console.warn("Reviews load failed:", err);
      setError(lang === "uz" ? "Sharhlarni yuklab bo‘lmadi." : "Не удалось загрузить отзывы.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const submitReview = async (e) => {
    e.preventDefault();
    setError("");
    setSent(false);

    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      setError(lang === "uz" ? "Sharhlar tizimi hali ulanmagan." : "Система отзывов ещё не подключена.");
      return;
    }
    if (name.trim().length < 2 || text.trim().length < 3) {
      setError(lang === "uz" ? "Ism va sharhni to‘ldiring." : "Заполните имя и отзыв.");
      return;
    }

    setSending(true);
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/reviews`, {
        method: "POST",
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          "Content-Type": "application/json",
          Prefer: "return=representation",
        },
        body: JSON.stringify({
          name: name.trim().slice(0, 80),
          rating,
          comment: text.trim().slice(0, 1000),
        }),
      });

      const result = await res.json().catch(() => []);
      if (!res.ok) {
        throw new Error(result?.message || result?.hint || "Sharh yuborilmadi");
      }

      const created = Array.isArray(result) ? result[0] : result;
      if (created) setReviews((prev) => [created, ...prev]);
      setName("");
      setText("");
      setRating(5);
      setSent(true);
    } catch (err) {
      console.warn("Review submit failed:", err);
      setError(lang === "uz" ? "Sharh yuborilmadi. Qayta urinib ko‘ring." : "Отзыв не отправлен. Попробуйте ещё раз.");
    } finally {
      setSending(false);
    }
  };

  const average = reviews.length
    ? (reviews.reduce((sum, r) => sum + Number(r.rating || 0), 0) / reviews.length).toFixed(1)
    : "0.0";

  return (
    <section className="em-sec" id="reviews">
      <div className="em-wrap">
        <div className="em-reviews-head">
          <div>
            <h2>{t.reviewsTitle}</h2>
            <p className="em-reviews-subtitle">
              {lang === "uz" ? "Xizmatimiz haqida fikringizni qoldiring" : "Оставьте своё мнение о нашем сервисе"}
            </p>
          </div>
          <div className="em-rating-summary">
            <strong>{average}</strong>
            <Stars n={Math.round(Number(average)) || 0} />
            <span>{reviews.length} {lang === "uz" ? "ta sharh" : "отзывов"}</span>
          </div>
        </div>

        <form className="em-review-form" onSubmit={submitReview}>
          <div className="em-review-fields">
            <label>
              <span>{lang === "uz" ? "Ismingiz" : "Ваше имя"}</span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={80}
                placeholder={lang === "uz" ? "Ismingizni kiriting" : "Введите имя"}
              />
            </label>
            <label>
              <span>{lang === "uz" ? "Fikringiz" : "Ваш отзыв"}</span>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                maxLength={1000}
                rows={4}
                placeholder={lang === "uz" ? "Xizmatimiz haqida fikringiz..." : "Ваше мнение о нашей работе..."}
              />
            </label>
          </div>

          <div className="em-review-actions">
            <div className="em-review-rating">
              <span>{lang === "uz" ? "Baholang:" : "Оцените:"}</span>
              <div className="em-rating-picker" role="radiogroup" aria-label="Rating">
                {Array.from({ length: 5 }, (_, i) => {
                  const value = i + 1;
                  return (
                    <button
                      type="button"
                      key={value}
                      className={value <= rating ? "is-active" : ""}
                      onClick={() => setRating(value)}
                      aria-label={`${value} / 5`}
                    >
                      ★
                    </button>
                  );
                })}
              </div>
            </div>
            <button className="em-btn em-btn-primary" type="submit" disabled={sending}>
              {sending ? (lang === "uz" ? "Yuborilmoqda…" : "Отправка…") : (lang === "uz" ? "Fikr qoldirish" : "Оставить отзыв")}
            </button>
          </div>

          {sent && <p className="em-review-success">{lang === "uz" ? "Rahmat! Fikringiz qabul qilindi." : "Спасибо! Ваш отзыв опубликован."}</p>}
          {error && <p className="em-review-error">{error}</p>}
        </form>

        <div className="em-revs">
          {loading ? (
            <p className="em-reviews-empty">{lang === "uz" ? "Sharhlar yuklanmoqda…" : "Загрузка отзывов…"}</p>
          ) : reviews.length ? (
            reviews.map((r) => (
              <blockquote key={r.id}>
                <Stars n={Number(r.rating)} />
                <p>{r.comment}</p>
                <cite>{r.name}</cite>
              </blockquote>
            ))
          ) : (
            <p className="em-reviews-empty">
              {lang === "uz" ? "Hozircha sharhlar yo‘q. Birinchi bo‘lib fikr qoldiring!" : "Пока нет отзывов. Оставьте первый отзыв!"}
            </p>
          )}
        </div>

        <a className="em-link" href={MAP_URL} target="_blank" rel="noreferrer">
          {t.reviewsMap} →
        </a>
      </div>
    </section>
  );
}

function Faq({ t }) {
  return (
    <section className="em-sec em-tint" id="faq">
      <div className="em-wrap em-faq-wrap">
        <h2>{t.faqTitle}</h2>
        <div className="em-faq">
          {t.faq.map(([q, a]) => (
            <details key={q}>
              <summary>{q}</summary>
              <p>{a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact({ t }) {
  return (
    <section className="em-sec em-contact" id="contact">
      <div className="em-wrap em-contact-in">
        <div>
          <h2 className="bizga">{t.contactTitle}</h2>
          <a className="em-btn em-btn-light" href={MAP_URL} target="_blank" rel="noreferrer">
            {t.openMap}
          </a>
        </div>
        <dl>
          <dt>{t.addressLabel}</dt>
          <dd className="em-addr">{t.address}</dd>
          <dt>{t.phoneLabel}</dt>
          <dd>
            <PhoneLinks className="em-phone" />
          </dd>
          <dt>{t.hoursLabel}</dt>
          <dd className="em-hours">
            {t.hours.map((h) => (
              <span key={h}>{h}</span>
            ))}
          </dd>
        </dl>
      </div>
    </section>
  );
}


export default function ElitemedSite() {
  const [lang, setLang] = useState("uz");
  const [booking, setBooking] = useState(null); 
  const t = T[lang];

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const closeBooking = useRef(() => setBooking(null)).current;

  return (
    <div className="em">
      <Header lang={lang} setLang={setLang} t={t} onBook={setBooking} />
      <main>
        <Hero t={t} onBook={setBooking} />
        <Why t={t} />
        <Services t={t} lang={lang} onBook={setBooking} />
        <Process t={t} />
        <Prices t={t} lang={lang} />
        <Doctors t={t} lang={lang} onBook={setBooking} />
        <Reviews t={t} lang={lang} />
        <Faq t={t} />
        <Contact t={t} />
      </main>
      <footer className="em-foot">© 2026 Elite Med · {t.footer}</footer>
      {booking && <BookingModal key={lang} t={t} preset={booking} onClose={closeBooking} />}
    </div>
  );
}