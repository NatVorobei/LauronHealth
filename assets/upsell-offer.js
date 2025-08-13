// (function () {
//   if (window.__upsellBind) return; 
//   window.__upsellBind = true;

//   const SECTIONS = ['cart-drawer', 'cart-icon-bubble'];

//   async function fetchSections(sections) {
//     const url = `/?sections=${encodeURIComponent(sections.join(','))}`;
//     const res = await fetch(url, { credentials: 'same-origin', headers: { 'Accept': 'application/json' } });
//     if (!res.ok) throw new Error('Sections fetch failed');
//     return res.json();
//   }

//   function replaceCartDrawer(htmlMap) {
//     const html = htmlMap['cart-drawer'];
//     if (!html) return false;

//     const temp = document.createElement('div');
//     temp.innerHTML = html;

//     const newDrawer = temp.querySelector('#CartDrawer');
//     const curDrawer = document.querySelector('#CartDrawer');

//     if (newDrawer && curDrawer) {
//       curDrawer.replaceWith(newDrawer);
//       const drawerEl = document.querySelector('cart-drawer');
//       if (drawerEl && typeof drawerEl.open === 'function') drawerEl.open();
//       document.documentElement.classList.add('cart-open');
//       const overlay = document.getElementById('CartDrawer-Overlay') || document.querySelector('.cart-drawer__overlay');
//       if (overlay) overlay.classList.add('is-visible');
//       return true;
//     }
//     return false;
//   }

//   function replaceBubble(htmlMap) {
//     const html = htmlMap['cart-icon-bubble'];
//     if (!html) return;
//     const temp = document.createElement('div');
//     temp.innerHTML = html;
//     const newBubble = temp.querySelector('#cart-icon-bubble');
//     const curBubble = document.getElementById('cart-icon-bubble');
//     if (newBubble && curBubble) curBubble.replaceWith(newBubble);
//   }

//   document.addEventListener('submit', async (e) => {
//     const form = e.target.closest('.upsell-add-form');
//     if (!form) return;

//     e.preventDefault();

//     const btn = form.querySelector('.js-upsell-submit') || form.querySelector('[type="submit"]');
//     const spinner = form.querySelector('.loading__spinner');

//     if (btn) { btn.setAttribute('aria-disabled', 'true'); btn.classList.add('loading'); }
//     if (spinner) spinner.classList.remove('hidden');

//     try {
//       const fd = new FormData(form);
//       fd.append('sections_url', window.location.pathname);

//       const addRes = await fetch('/cart/add.js', {
//         method: 'POST',
//         credentials: 'same-origin',
//         headers: { 'Accept': 'application/json' },
//         body: fd
//       });
//       const addJson = await addRes.json();
//       if (!addRes.ok || (addJson && addJson.status)) {
//         console.warn('[Upsell] Add error:', addJson);
//         return;
//       }

//       const sectionsJson = await fetchSections(SECTIONS);
//       const drawerReplaced = replaceCartDrawer(sectionsJson);
//       replaceBubble(sectionsJson);

//       if (!drawerReplaced) {
//         const drawerEl = document.querySelector('cart-drawer');
//         if (drawerEl && typeof drawerEl.open === 'function') drawerEl.open();
//         document.documentElement.classList.add('cart-open');
//       }
//     } catch (err) {
//       console.error('[Upsell] Failure:', err);

//     } finally {
//       if (btn) { btn.classList.remove('loading'); btn.removeAttribute('aria-disabled'); }
//       if (spinner) spinner.classList.add('hidden');
//     }
//   });
// })();



(function () {
  if (window.__upsellClickBound) return;
  window.__upsellClickBound = true;

  document.addEventListener('click', async (e) => {
    const btn = e.target.closest('.js-upsell-submit');
    if (!btn) return;

    const form = btn.closest('.upsell-add-form');
    const id = form?.querySelector('input[name="id"]')?.value;
    const quantity = form?.querySelector('input[name="quantity"]')?.value || '1';
    if (!id) return;

    const spinner = form.querySelector('.loading__spinner');
    const cart = document.querySelector('cart-drawer') || document.querySelector('cart-notification');

    // UI: loading
    btn.setAttribute('aria-disabled', 'true');
    btn.classList.add('loading');
    spinner?.classList.remove('hidden');

    try {
      const fd = new FormData();
      fd.append('id', id);
      fd.append('quantity', quantity);

      // Попросимо сервер повернути секції для renderContents
      if (cart && typeof cart.getSectionsToRender === 'function') {
        const ids = cart.getSectionsToRender().map(s => s.id); // ['cart-drawer','cart-icon-bubble']
        fd.append('sections', ids);
        fd.append('sections_url', window.location.pathname);
        if (typeof cart.setActiveElement === 'function') cart.setActiveElement(document.activeElement);
      } else {
        fd.append('sections_url', window.location.pathname);
      }

      // ⬇️ ВАЖЛИВО: саме /cart/add (НЕ .js), як у product-form.js
      const res = await fetch(`${routes.cart_add_url}`, {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'X-Requested-With': 'XMLHttpRequest', 'Accept': 'application/json' },
        body: fd
      });
      const parsedState = await res.json();

      if (parsedState?.status) {
        console.warn('[Upsell] Add error:', parsedState);
        return; // тут можна показати свій тост із помилкою
      }

      if (cart && typeof cart.renderContents === 'function') {
        cart.renderContents(parsedState);   // ✅ стандартна логіка Dawn
      } else {
        // Фолбек, якщо раптом кастомізація теми незвична
        location.reload();
      }
    } catch (err) {
      console.error('[Upsell] Failure:', err);
    } finally {
      btn.classList.remove('loading');
      btn.removeAttribute('aria-disabled');
      spinner?.classList.add('hidden');
    }
  });
})();
