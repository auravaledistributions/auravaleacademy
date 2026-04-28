/* ═══════════════════════════════════════════════════════
   AURAVALE ACADEMY · shared.js
   Injects nav, footer, WhatsApp FAB, custom cursor.
   Handles language switching and active-page detection.

   Each HTML page declares:
     <body data-page="about">          ← which nav item is active
     <body data-pathdepth="0">          ← 0 for root, 1 for /blog/, 2 for /blog/post/
     <body data-lang="en">              ← 'en' (default) or 'id'

   Mounts into:
     <div id="nav-mount"></div>
     <div id="footer-mount"></div>
     <div id="wa-mount"></div>
     <div id="cursor-mount"></div>
   ═══════════════════════════════════════════════════════ */

(function(){
  'use strict';

  // ── Read page-level config from <body> data attributes ─
  const body         = document.body;
  const pageKey      = body.dataset.page      || '';     // e.g. 'about', 'blog'
  const pathDepth    = parseInt(body.dataset.pathdepth || '0', 10);
  let   activeLang   = body.dataset.lang      || 'en';

  // Resolve a stored language preference if there is one
  try {
    const stored = localStorage.getItem('auravale_lang');
    if (stored && (stored === 'en' || stored === 'id')) {
      activeLang = stored;
    }
  } catch(e) { /* ignore */ }

  // Path prefix for links (so /blog/post/ pages can link back to /about.html)
  // pathDepth 0 → ''         (root pages link directly: 'about.html')
  // pathDepth 1 → '../'      (one folder deep: '../about.html')
  // pathDepth 2 → '../../'   (two folders deep: '../../about.html')
  const prefix = '../'.repeat(pathDepth);

  // ── Load site config and build the chrome ───────────
  fetch(prefix + 'data/site.json')
    .then(r => r.json())
    .then(site => {
      buildNav(site);
      buildFooter(site);
      buildWhatsApp(site);
      buildCursor();
      attachScrollState();
      attachLangPersistence();
    })
    .catch(err => {
      console.error('Failed to load site config:', err);
      // Graceful fallback: still build cursor + scroll state even if data fails
      buildCursor();
      attachScrollState();
    });

  // ── NAV ──────────────────────────────────────────────
  function buildNav(site){
    const mount = document.getElementById('nav-mount');
    if (!mount) return;

    const navItems = site.nav[activeLang] || site.nav.en;

    const itemsHtml = navItems.map(item => {
      const isActive = item.key === pageKey ? ' active' : '';
      const ctaClass = item.cta ? ' nav-cta' : '';
      return `<a href="${prefix}${item.href}" class="${(isActive + ctaClass).trim()}">${item.label}</a>`;
    }).join('');

    const langToggleHtml = `
      <div class="lang">
        <button class="lb${activeLang === 'en' ? ' on' : ''}" data-lang="en">EN</button>
        <button class="lb${activeLang === 'id' ? ' on' : ''}" data-lang="id">ID</button>
      </div>`;

    const navHtml = `
      <nav class="site-nav">
        <a href="${prefix}index.html" class="nav-logo">${site.brand.name}<em>${site.brand.nameItalic}</em></a>
        <div class="nav-r">
          ${itemsHtml}
          ${langToggleHtml}
        </div>
      </nav>`;

    mount.outerHTML = navHtml;

    // Wire up language buttons
    document.querySelectorAll('.lb').forEach(btn => {
      btn.addEventListener('click', () => {
        const lang = btn.dataset.lang;
        try { localStorage.setItem('auravale_lang', lang); } catch(e){}
        // Reload to apply new language
        window.location.reload();
      });
    });
  }

  // ── FOOTER ───────────────────────────────────────────
  function buildFooter(site){
    const mount = document.getElementById('footer-mount');
    if (!mount) return;

    const footerData = site.footer[activeLang] || site.footer.en;
    const description = activeLang === 'id'
      ? site.brand.descriptionId
      : site.brand.description;
    const region = activeLang === 'id'
      ? site.contact.regionId
      : site.contact.region;

    const columnsHtml = footerData.columns.map(col => {
      const linksHtml = col.links.map(link => {
        const ext = link.external ? ' target="_blank" rel="noopener"' : '';
        // Internal links get the path prefix; external ones don't
        const href = link.external ? link.href : (prefix + link.href);
        return `<a href="${href}"${ext}>${link.label}</a>`;
      }).join('');
      return `<div class="fc"><h4>${col.heading}</h4>${linksHtml}</div>`;
    }).join('');

    const footerHtml = `
      <footer class="site-footer">
        <div class="fi">
          <div class="fb">
            <div class="lf">${site.brand.name}<em>${site.brand.nameItalic}</em></div>
            <div class="fb-tag">${site.brand.tagline}</div>
            <p>${description}</p>
          </div>
          ${columnsHtml}
        </div>
        <div class="fbot">
          <span>© ${new Date().getFullYear()} ${site.brand.name} ${site.brand.nameItalic} · ${site.contact.email}</span>
          <span>${region}</span>
        </div>
      </footer>`;

    mount.outerHTML = footerHtml;
  }

  // ── WHATSAPP FAB ─────────────────────────────────────
  function buildWhatsApp(site){
    const mount = document.getElementById('wa-mount');
    if (!mount) return;

    const ariaLabel = activeLang === 'id' ? 'Chat via WhatsApp' : 'Chat on WhatsApp';

    const waHtml = `
      <a class="wa" href="https://wa.me/${site.contact.whatsapp}" target="_blank" rel="noopener" aria-label="${ariaLabel}">
        <svg viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
      </a>`;

    mount.outerHTML = waHtml;
  }

  // ── CUSTOM CURSOR ────────────────────────────────────
  function buildCursor(){
    const mount = document.getElementById('cursor-mount');
    if (!mount) return;

    mount.outerHTML = `
      <div class="cur"></div>
      <div class="cur-r"></div>`;

    // Skip cursor logic on touch devices
    if ('ontouchstart' in window || window.innerWidth < 760) return;

    const c = document.querySelector('.cur');
    const r = document.querySelector('.cur-r');
    if (!c || !r) return;

    let mx = 0, my = 0, rx = 0, ry = 0;
    window.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      if (c) { c.style.left = mx + 'px'; c.style.top = my + 'px'; }
    });
    function loop(){
      if (r) {
        rx += (mx - rx) * 0.12;
        ry += (my - ry) * 0.12;
        r.style.left = rx + 'px';
        r.style.top  = ry + 'px';
      }
      requestAnimationFrame(loop);
    }
    loop();
  }

  // ── NAV SCROLL STATE ─────────────────────────────────
  function attachScrollState(){
    function applyState(){
      const nav = document.querySelector('nav.site-nav');
      if (!nav) return;
      if (window.scrollY > 30) nav.classList.add('solid');
      else nav.classList.remove('solid');
    }
    window.addEventListener('scroll', applyState);
    applyState();
  }

  // ── LANGUAGE PERSISTENCE ─────────────────────────────
  // Already wired in buildNav(). This is a placeholder for future expansion
  // (e.g. reactive language switching without a full reload).
  function attachLangPersistence(){
    // Currently handled inside buildNav via reload-on-click
  }

})();
