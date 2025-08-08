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

document.addEventListener('DOMContentLoaded', function () {
  // --- елементи sticky ---
  const stickyBar = document.getElementById('sticky-add-to-cart');
  if (!stickyBar) return;

  const stickyMount = stickyBar.querySelector('.sticky-form-mount');
  if (!stickyMount) return;

  // --- допоміжні пошуки під Dawn ---
  function findProductForm() {
    // Dawn: основна product form завжди має class="product-form"
    // і часто data-type="add-to-cart-form"
    return (
      document.querySelector('form.product-form[data-type="add-to-cart-form"]') ||
      document.querySelector('form.product-form[action^="/cart/add"]') ||
      document.querySelector('form.product-form') ||
      null
    );
  }

  function findNativeATC() {
    // Dawn: ID починається з ProductSubmitButton-
    return (
      document.querySelector('button[id^="ProductSubmitButton-"]') ||
      // запасні варіанти
      document.querySelector('form.product-form button[name="add"]') ||
      document.querySelector('.product-form__submit[name="add"]') ||
      null
    );
  }

  let productForm = findProductForm();
  if (!productForm) return;

  // збережемо куди повертати форму
  let originalParent = productForm.parentElement;

  // -------- логіка переносу форми --------
  function moveFormToSticky() {
    if (productForm && productForm.parentElement !== stickyMount) {
      stickyMount.appendChild(productForm);
    }
  }
  function moveFormBack() {
    if (productForm && originalParent && productForm.parentElement !== originalParent) {
      originalParent.appendChild(productForm);
    }
  }

  // -------- основний режим: IntersectionObserver по рідній кнопці --------
  let nativeATC = findNativeATC();

  function setupObserver() {
    if (!nativeATC) return false;

    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // рідна кнопка видима -> sticky ховаємо, форму повертаємо
          stickyBar.classList.remove('show');
          moveFormBack();
        } else {
          // рідна кнопка зникла -> показуємо sticky і переносимо форму
          stickyBar.classList.add('show');
          moveFormToSticky();
        }
      });
    }, { root: null, threshold: 0 });

    io.observe(nativeATC);

    // початкова перевірка: якщо кнопка вже поза в’юпортом — покажи sticky
    setTimeout(() => {
      const rect = nativeATC.getBoundingClientRect();
      const inViewport = rect.top < window.innerHeight && rect.bottom >= 0;
      if (!inViewport) {
        stickyBar.classList.add('show');
        moveFormToSticky();
      }
    }, 0);

    return true;
  }

  // спробуємо налаштувати спостерігача; якщо не вийшло — резервний режим
  let observerReady = setupObserver();

  if (!observerReady) {
    // чекати появи кнопки (ранні рендери/динаміка Dawn)
    const waitForATC = new MutationObserver(() => {
      nativeATC = findNativeATC();
      if (nativeATC) {
        waitForATC.disconnect();
        setupObserver();
      }
    });
    waitForATC.observe(document.body, { childList: true, subtree: true });

    // резерв: показ sticky після 500px скролу
    window.addEventListener('scroll', () => {
      if (window.scrollY > 500) {
        stickyBar.classList.add('show');
        moveFormToSticky();
      } else {
        stickyBar.classList.remove('show');
        moveFormBack();
      }
    });
  }

  // -------- реакція на перерендер секцій (Dawn) --------
  document.addEventListener('shopify:section:load', () => {
    // перевизначаємо референси, бо DOM міг змінитися
    const newForm = findProductForm();
    if (newForm && newForm !== productForm) {
      productForm = newForm;
      originalParent = productForm.parentElement;
    }
    nativeATC = findNativeATC();
    // якщо sticky вже показаний — переконаємось, що форма переміщена
    if (stickyBar.classList.contains('show')) {
      moveFormToSticky();
    }
  });
});





