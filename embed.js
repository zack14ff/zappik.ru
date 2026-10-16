/* ======================================================================
   embed.js — ссылки, которые выглядят как embed в Discord.

   Использование:
     <a data-embed href="https://..." data-site="Discord"
        data-title="Заголовок" data-desc="Описание" data-color="#5865f2"
        data-image="картинка.jpg">текст ссылки (если нет data-title)</a>

   Всё, что не указано явно, берётся так:
     - для ссылок на этот же сайт — og:title / og:description / og:image
       со страницы-цели (внешние сайты из браузера не читаются, там
       нужны data-атрибуты);
     - иначе — текст ссылки и имя хоста.

   Без JS ссылка остаётся обычной ссылкой.
   ====================================================================== */
(() => {
  const STYLE = `
    .dc-embed{
      display:flex; max-width:520px; margin:0 0 12px;
      background:#2b2d31; border-radius:4px; overflow:hidden;
      font-family:'Onest', 'Segoe UI', Tahoma, sans-serif; color:#dbdee1;
      text-align:left;
    }
    .dc-bar{width:4px; flex-shrink:0; background:var(--dc, #5865f2);}
    .dc-body{padding:12px 16px 14px; min-width:0; display:flex; flex-direction:column; gap:4px;}
    .dc-site{font-size:.72rem; color:#b5bac1; letter-spacing:.02em;}
    .dc-title{
      font-size:1rem; font-weight:600; color:#00a8fc; text-decoration:none;
      line-height:1.3; overflow-wrap:anywhere;
    }
    .dc-title:hover{text-decoration:underline;}
    .dc-desc{font-size:.88rem; color:#dbdee1; line-height:1.45; overflow-wrap:anywhere;}
    .dc-img{margin-top:8px; width:100%; max-height:260px; object-fit:cover; border-radius:4px; display:block;}
    .dc-embed-stack{display:flex; flex-direction:column; align-items:flex-start;}
  `;

  const style = document.createElement('style');
  style.textContent = STYLE;
  document.head.appendChild(style);

  const sameOrigin = (url) => {
    try {
      const u = new URL(url, location.href);
      return u.origin === location.origin && /^https?:$/.test(u.protocol) ? u : null;
    } catch { return null; }
  };

  // og-теги со страницы того же сайта (на file:// и внешних ссылках пропускаем)
  async function readOg(url) {
    const u = sameOrigin(url);
    if (!u) return {};
    try {
      const res = await fetch(u.href);
      if (!res.ok) return {};
      const doc = new DOMParser().parseFromString(await res.text(), 'text/html');
      const meta = (p) => doc.querySelector(`meta[property="${p}"]`)?.getAttribute('content') || '';
      return {
        title: meta('og:title') || doc.title || '',
        desc: meta('og:description') || '',
        image: meta('og:image') ? new URL(meta('og:image'), u.href).href : ''
      };
    } catch { return {}; }
  }

  function build(a, info) {
    const url = new URL(a.href, location.href);
    const site = a.dataset.site || url.hostname.replace(/^www\./, '');
    const title = a.dataset.title || info.title || a.textContent.trim() || url.href;
    const desc = a.dataset.desc || info.desc || '';
    const image = a.dataset.image || info.image || '';

    const wrap = document.createElement('div');
    wrap.className = 'dc-embed';
    wrap.style.setProperty('--dc', a.dataset.color || '#5865f2');

    const bar = document.createElement('div');
    bar.className = 'dc-bar';

    const body = document.createElement('div');
    body.className = 'dc-body';

    const siteEl = document.createElement('div');
    siteEl.className = 'dc-site';
    siteEl.textContent = site;

    const titleEl = document.createElement('a');
    titleEl.className = 'dc-title';
    titleEl.href = a.href;
    titleEl.textContent = title;
    if (a.target) titleEl.target = a.target;
    if (a.rel) titleEl.rel = a.rel;

    body.append(siteEl, titleEl);

    if (desc) {
      const descEl = document.createElement('div');
      descEl.className = 'dc-desc';
      descEl.textContent = desc;
      body.append(descEl);
    }

    if (image) {
      const img = document.createElement('img');
      img.className = 'dc-img';
      img.loading = 'lazy';
      img.alt = '';
      img.src = image;
      // битая картинка не должна оставлять пустую рамку
      img.addEventListener('error', () => img.remove());
      body.append(img);
    }

    wrap.append(bar, body);
    return wrap;
  }

  async function init() {
    const links = Array.from(document.querySelectorAll('a[data-embed]'));
    await Promise.all(links.map(async (a) => {
      const info = await readOg(a.href);
      a.replaceWith(build(a, info));
    }));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
