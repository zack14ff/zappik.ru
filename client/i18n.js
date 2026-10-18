/* ======================================================================
   i18n.js — переключатель EN / RU для страниц PotaAlpha.

   Английский — язык по умолчанию: он написан прямо в HTML, так что без JS
   страница остаётся английской. Элементам с data-i18n="ключ" русский текст
   берётся из словаря RU ниже. Язык запоминается в браузере; принудительно:
   ?lang=ru или ?lang=en.
   ====================================================================== */
(() => {
  const RU = {
    title_rel: 'PotaAlpha — клиент Minecraft Alpha 1.1.2_01',
    title_soon: 'PotaAlpha — скоро · клиент Minecraft Alpha 1.1.2_01',

    nav_about: 'О клиенте',
    nav_features: 'Возможности',
    nav_install: 'Установка',
    nav_community: 'Сообщество',
    nav_stay: 'Следить',
    back: 'Zakodka',

    sub: 'Клиент для Minecraft Alpha 1.1.2_01',
    gamever: 'Версия игры:',
    status_live: 'Релиз',
    status_soon: 'Скоро',
    rel_date: 'Дата релиза:',
    tba: 'будет объявлена',
    btn_download: 'Скачать',
    btn_notify: 'Узнать о релизе в Discord',
    btn_current: 'Текущий релиз',

    about_h: 'О клиенте',
    about_p: 'PotaAlpha — клиент для Minecraft Alpha 1.1.2_01. Он добавляет шляпы и кастомные модели игроков, облегчающие абилки, настраиваемый HUD и подсказки команд, как в новых версиях, а ещё адаптирован под сервер PlanetNostalgia.',
    about_p_soon: 'Новая версия PotaAlpha — клиента для Minecraft Alpha 1.1.2_01 — почти готова. Вот что в ней будет.',
    made_h: 'Для кого',
    made_p: 'Для игроков PlanetNostalgia и всех, кто хочет немного современных удобств в классической Alpha.',
    card_next: 'Следующая версия: скоро →',
    card_current: 'Текущий релиз →',

    feat_h: 'Возможности',
    badge_soon: 'Скоро',
    f1_h: 'Шляпы и аксессуары',
    f1_p: 'Аксессуары на голову:',
    f2_h: 'Кастомные модели игроков',
    f2_p: 'Меняй внешний вид персонажа:',
    f3_h: 'Адаптация под PlanetNostalgia',
    f3_p: 'Клиент адаптирован под сервер PlanetNostalgia, включая систему жизней.',
    f4_h: 'Облегчающие абилки',
    f4_p: 'Помогают в игре:',
    f4_more: 'и другие',
    f5_h: 'HUD v2',
    f5_p: 'Кастомизируемый интерфейс:',
    f5_a: 'Координаты',
    f5_b: 'FPS',
    f5_c: 'Время на компьютере',
    f5_d: 'IP сервера',
    f5_e: 'Список включённых модулей',
    f5_f: 'Свои стили модулей',
    f6_h: 'Подсказки команд',
    f6_p: 'Подсказки команд, как в новых версиях игры.',

    install_h: 'Как установить',
    install_p: 'Нужны Java и лаунчер, который умеет запускать старые версии игры.',
    s1: '<b>Установи Java.</b> Подойдёт любая современная версия, если лаунчер умеет запускать старые версии.',
    s2: '<b>Поставь лаунчер для старых версий.</b> Например, <a href="https://betacraft.uk/downloads" target="_blank" rel="noopener">BetaCraft</a> или ZloyLauncher.',
    s3: '<b>Создай профиль с версией a1.1.2_01.</b> Выбери её в списке версий лаунчера.',
    s4: '<b>Добавь PotaAlpha и запусти.</b> Опиши, куда положить файл клиента или как включить его в лаунчере.',
    tag_draft: 'шаблон',

    stay_h: 'Следи за новостями',
    stay_p: 'О релизе мы сообщим в Discord первыми. Заходи, чтобы не пропустить.',
    comm_h: 'Сообщество',
    comm_p: 'Новости, вопросы и обсуждения — в Discord. Остальные мои проекты — на Modrinth.',
    footer: '© zakap · <a href="index.html">Zakodka</a> 2026 · Minecraft — торговая марка Mojang / Microsoft. Проект не связан с Mojang.'
  };

  const root = document.documentElement;
  const KEY = 'potaLang';
  const els = Array.from(document.querySelectorAll('[data-i18n]'));
  const enTitle = document.title;

  // английский — то, что уже написано в HTML
  els.forEach((e) => { e.dataset.en = e.innerHTML; });

  function apply(lang) {
    root.lang = lang;
    els.forEach((e) => {
      const k = e.dataset.i18n;
      e.innerHTML = (lang === 'ru' && RU[k]) ? RU[k] : e.dataset.en;
    });
    // embed-карточки (embed.js кладёт им data-en / data-ru)
    document.querySelectorAll('[data-ru]').forEach((e) => {
      e.textContent = lang === 'ru' ? e.dataset.ru : e.dataset.en;
    });
    const tk = root.dataset.titleKey;
    document.title = (lang === 'ru' && tk && RU[tk]) ? RU[tk] : enTitle;
    document.querySelectorAll('[data-lang-btn]').forEach((b) => {
      b.setAttribute('aria-pressed', String(b.dataset.langBtn === lang));
    });
  }

  function initial() {
    try {
      const q = new URLSearchParams(location.search).get('lang');
      if (q === 'ru' || q === 'en') return q;
    } catch (e) { /* без параметров */ }
    try {
      const s = localStorage.getItem(KEY);
      if (s === 'ru' || s === 'en') return s;
    } catch (e) { /* localStorage может быть недоступен */ }
    return 'en';   // по умолчанию — английский
  }

  document.querySelectorAll('[data-lang-btn]').forEach((b) => {
    b.addEventListener('click', () => {
      try { localStorage.setItem(KEY, b.dataset.langBtn); } catch (e) { /* не страшно */ }
      apply(b.dataset.langBtn);
    });
  });

  // lang нужно выставить до embed.js, чтобы карточки сразу строились на нужном языке
  root.lang = initial();
  apply(root.lang);
})();
