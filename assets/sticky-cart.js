// document.addEventListener("DOMContentLoaded", function () {
//     const stickyBar = document.getElementById("sticky-add-to-cart");
//     const targetButton = document.querySelector('[id^="ProductSubmitButton-"]');

//     if (!stickyBar || !targetButton) return;

//     const observer = new IntersectionObserver(
//         function (entries) {
//             entries.forEach(entry => {
//                 if (entry.isIntersecting) {
//                     stickyBar.classList.remove("show");
//                 } else {
//                     stickyBar.classList.add("show");
//                 }
//             });
//         },
//         {
//             root: null,
//             threshold: 0
//         }
//     );

//     observer.observe(targetButton);
// });

// //Select variants
// document.addEventListener('DOMContentLoaded', function () {
//     const mainForm = document.querySelector('form[action^="/cart/add"]');
//     const stickyForm = document.querySelector('#sticky-add-to-cart form');

//     if (!mainForm || !stickyForm) return;

//     const mainVariantInput = mainForm.querySelector('input[name="id"]');
//     const stickyVariantInput = stickyForm.querySelector('input[name="id"]');

//     const mainAddBtn = mainForm.querySelector('button[type="submit"]');
//     const stickyAddBtn = stickyForm.querySelector('button[type="submit"]');
//     const stickySoldOut = stickyForm.querySelector('.sold-out-message');

//     let stickySellingPlanInput = stickyForm.querySelector('input[name="selling_plan"]');
//     if (!stickySellingPlanInput) {
//       stickySellingPlanInput = document.createElement('input');
//       stickySellingPlanInput.type = 'hidden';
//       stickySellingPlanInput.name = 'selling_plan';
//       stickyForm.appendChild(stickySellingPlanInput);
//     }

//     function syncStickyState() {
//       if (!mainVariantInput || !stickyVariantInput || !mainAddBtn || !stickyAddBtn) return;

//       stickyVariantInput.value = mainVariantInput.value;

//       const isDisabled = mainAddBtn.disabled;
//       stickyAddBtn.disabled = isDisabled;

//       if (isDisabled) {
//         stickySoldOut?.classList.remove('hidden');
//       } else {
//         stickySoldOut?.classList.add('hidden');
//       }

//       const selectedSellingPlan = mainForm.querySelector('input[name="selling_plan"]:checked');
//       if (selectedSellingPlan) {
//         stickySellingPlanInput.value = selectedSellingPlan.value;
//       } else {
//         stickySellingPlanInput.removeAttribute('value');
//       }
//       if (window.AppstleMemberships && typeof window.AppstleMemberships.updateProduct === 'function') {
//         window.AppstleMemberships.updateProduct({ variantId: mainVariantInput.value });
//       }
//     }

//     const observer = new MutationObserver(syncStickyState);
//     observer.observe(mainForm, {
//       childList: true,
//       subtree: true,
//       attributes: true,
//     });

//     mainForm.addEventListener('change', syncStickyState);
//     syncStickyState();
//   });

// //Subscription
// document.addEventListener('DOMContentLoaded', function () {
//     const customSelect = document.querySelector('#custom-subscription-select');
//     const realForm = document.querySelector('form[action^="/cart/add"]');

//     if (!customSelect || !realForm) return;

//     function updateSellingPlansInSelect() {
//       const realSellingPlans = document.querySelectorAll('input[name="selling_plan"]');

//       customSelect.innerHTML = '';

//       const addedValues = new Set();

//       const oneTimeLabel = document.querySelector('label[for="purchase-option-one-time"]');
//       if (oneTimeLabel) {
//         const option = document.createElement('option');
//         option.value = '';
//         option.textContent = oneTimeLabel.textContent.trim();
//         customSelect.appendChild(option);
//       }

//       realSellingPlans.forEach((plan) => {
//         const value = plan.value;
//         if (addedValues.has(value)) return;
//         addedValues.add(value);

//         const label = plan.nextElementSibling;
//         if (!label) return;

//         const labelText = label.textContent?.trim();

//         if (!labelText || labelText.toLowerCase() === 'subscription') return;

//         const option = document.createElement('option');
//         option.value = value;
//         option.textContent = labelText;
//         customSelect.appendChild(option);
//       });

//       const checkedPlan = Array.from(realSellingPlans).find((r) => r.checked);
//       if (checkedPlan) {
//         customSelect.value = checkedPlan.value;
//       } else {
//         customSelect.value = '';
//       }
//     }

//     customSelect.addEventListener('change', function () {
//       const selectedValue = customSelect.value;
//       const realSellingPlans = document.querySelectorAll('input[name="selling_plan"]');
//       realSellingPlans.forEach((radio) => {
//         radio.checked = radio.value === selectedValue;
//       });

//       const event = new Event('change', { bubbles: true });
//       realForm.dispatchEvent(event);
//     });

//     const appstleWidget = document.querySelector('.smart-subscription-widget');
//     if (!appstleWidget) return;

//     const observer = new MutationObserver(function () {
//       if (document.querySelector('input[name="selling_plan"]')) {
//         updateSellingPlansInSelect();
//       }
//     });

//     observer.observe(appstleWidget, { childList: true, subtree: true });

//     setTimeout(() => {
//       updateSellingPlansInSelect();
//     }, 1000);
//   });


//   //Caret
//   document.addEventListener('DOMContentLoaded', function () {
//     const select = document.querySelector('.custom-subscription-select');

//     if (!select) return;

//     select.addEventListener('pointerdown', () => {
//       setTimeout(() => {
//         select.classList.add('open');
//       }, 0);
//     });

//     function closeSelect() {
//       select.classList.remove('open');
//     }

//     select.addEventListener('blur', closeSelect);
//     select.addEventListener('change', closeSelect);
//     select.addEventListener('focusout', closeSelect);
//   });

(function () {
  function onReady(fn){ if(document.readyState!=='loading') fn(); else document.addEventListener('DOMContentLoaded',fn); }

  onReady(function () {
    const stickyBar   = document.getElementById('sticky-add-to-cart');
    if (!stickyBar) return;

    const targetButton =
      document.querySelector('[id^="ProductSubmitButton-"]') ||
      document.querySelector('form.product-form button[name="add"]');

    const mainForm   = document.querySelector('form[action^="/cart/add"]') || document.querySelector('form.product-form');
    const stickyForm = stickyBar.querySelector('form');

    if (!targetButton || !mainForm || !stickyForm) return;

    const mainVariantInput   = mainForm.querySelector('input[name="id"]');
    const stickyVariantInput = stickyForm.querySelector('input[name="id"]');

    const mainAddBtn   = mainForm.querySelector('button[type="submit"], button[name="add"]');
    const stickyAddBtn = stickyForm.querySelector('button[type="submit"], button[name="add"]');
    const stickySoldOut = stickyForm.querySelector('.sold-out-message');

    // hidden selling_plan у sticky
    let stickySellingPlanInput = stickyForm.querySelector('input[name="selling_plan"]');
    if (!stickySellingPlanInput) {
      stickySellingPlanInput = document.createElement('input');
      stickySellingPlanInput.type = 'hidden';
      stickySellingPlanInput.name = 'selling_plan';
      stickyForm.appendChild(stickySellingPlanInput);
    }

    // --- Показ/приховування sticky ---
    try {
      const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            stickyBar.classList.remove('show'); // важливо для opacity
          } else {
            stickyBar.classList.add('show');
          }
        });
      }, {root:null, threshold:0});
      io.observe(targetButton);

      // початкова перевірка (якщо вже проскролено)
      setTimeout(() => {
        const r = targetButton.getBoundingClientRect();
        const visible = r.top < window.innerHeight && r.bottom >= 0;
        if (!visible) stickyBar.classList.add('show');
      }, 0);
    } catch(e) {
      // Fallback по скролу (на всякий)
      window.addEventListener('scroll', () => {
        if (window.scrollY > 400) stickyBar.classList.add('show');
        else stickyBar.classList.remove('show');
      });
    }

    // --- Синхронізація стану sticky з основною формою ---
    function syncStickyState() {
      if (mainVariantInput && stickyVariantInput) {
        stickyVariantInput.value = mainVariantInput.value;
      }
      if (mainAddBtn && stickyAddBtn) {
        const dis = !!mainAddBtn.disabled;
        stickyAddBtn.disabled = dis;
        if (stickySoldOut) stickySoldOut.classList.toggle('hidden', !dis);
      }

      // Проставляємо вибраний selling_plan у hidden стіки
      const checkedPlan = mainForm.querySelector('input[name="selling_plan"]:checked');
      if (checkedPlan) {
        stickySellingPlanInput.value = checkedPlan.value;
      } else {
        stickySellingPlanInput.removeAttribute('value');
      }
    }

    // --- Кастомний селект підписок у стіки (твоя логіка), але safe ---
    const customSelect = document.getElementById('custom-subscription-select');
    function buildPlansSelect() {
      if (!customSelect) return;
      const radios = Array.from(document.querySelectorAll('input[name="selling_plan"]'));
      if (!radios.length) return;

      customSelect.innerHTML = '';
      const seen = new Set();

      const oneTimeLabel = document.querySelector('label[for="purchase-option-one-time"]');
      if (oneTimeLabel) {
        const opt = document.createElement('option');
        opt.value = '';
        opt.textContent = (oneTimeLabel.textContent || 'One-time purchase').trim();
        customSelect.appendChild(opt);
      } else {
        // дефолт
        const opt = document.createElement('option');
        opt.value = '';
        opt.textContent = 'One-time purchase';
        customSelect.appendChild(opt);
      }

      radios.forEach(r => {
        const val = r.value;
        if (seen.has(val)) return;
        seen.add(val);

        const label = r.nextElementSibling;
        const txt = (label?.textContent || '').trim();
        if (!txt || txt.toLowerCase() === 'subscription') return;

        const opt = document.createElement('option');
        opt.value = val;
        opt.textContent = txt;
        customSelect.appendChild(opt);
      });

      // Виставляємо поточний
      const checked = radios.find(r => r.checked);
      customSelect.value = checked ? checked.value : '';
    }

    if (customSelect) {
      // при зміні селекту — клікаємо по відповідному radio у головній формі
      customSelect.addEventListener('change', () => {
        const val = customSelect.value;
        const radios = document.querySelectorAll('input[name="selling_plan"]');
        radios.forEach(r => (r.checked = r.value === val));
        // Тригеримо зміну для Appstle/Shopify
        mainForm.dispatchEvent(new Event('change', { bubbles: true }));
        syncStickyState();
      });

      // caret open/close
      customSelect.addEventListener('pointerdown', () => setTimeout(()=>customSelect.classList.add('open'),0));
      ['blur','change','focusout'].forEach(ev => customSelect.addEventListener(ev,()=>customSelect.classList.remove('open')));
    }

    // --- Обсервери для авто-синху ---
    // 1) Будь-які зміни у головній формі (Appstle теж міняє DOM)
    const mo = new MutationObserver(() => {
      buildPlansSelect();
      syncStickyState();
    });
    mo.observe(mainForm, { childList:true, subtree:true, attributes:true, characterData:false });

    // 2) Подія change на формі
    mainForm.addEventListener('change', () => {
      buildPlansSelect();
      syncStickyState();
    });

    // Початковий синх
    setTimeout(() => {
      buildPlansSelect();
      syncStickyState();
    }, 300);

    // На випадок динамічного перезавантаження секції в Dawn
    document.addEventListener('shopify:section:load', () => {
      buildPlansSelect();
      syncStickyState();
    });
  });
})();



