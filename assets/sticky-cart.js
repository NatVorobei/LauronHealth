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
  const stickyBar = document.getElementById('sticky-add-to-cart');
  const stickyBtn = stickyBar?.querySelector('.js-sticky-atc');
  const stickyWidgetMount = stickyBar?.querySelector('.smart-subscription-widget');

  const mainForm = document.querySelector('form.product-form[data-type="add-to-cart-form"]');
  const mainSubmitBtn = mainForm?.querySelector('button[type="submit"][name="add"]');
  const defaultATC = document.querySelector('[id^="ProductSubmitButton-"]') || mainSubmitBtn;

  if (!stickyBar || !stickyBtn || !stickyWidgetMount || !mainForm || !mainSubmitBtn || !defaultATC) return;

  // 1) Сабміт головної форми
  stickyBtn.addEventListener('click', () => {
    if (mainSubmitBtn) {
      mainSubmitBtn.click();
    } else if (mainForm.requestSubmit) {
      mainForm.requestSubmit();
    } else {
      mainForm.submit();
    }
  });

  // 2) Знаходимо Appstle-віджет
  const APPSTLE_SELECTORS = [
    '.appstle_subscription_widget',
    '.appstle-inline-widget',
    '[id^="appstle_widget_"]'
  ];
  function findAppstleWidget() {
    for (const sel of APPSTLE_SELECTORS) {
      const el = document.querySelector(sel);
      if (el) return el;
    }
    return null;
  }

  let appstleWidget = null;
  let mainWidgetContainer = null;

  const waitForWidget = new MutationObserver(() => {
    if (!appstleWidget) {
      appstleWidget = findAppstleWidget();
      if (appstleWidget) {
        mainWidgetContainer = appstleWidget.parentElement;
        waitForWidget.disconnect();
      }
    }
  });
  waitForWidget.observe(document.body, { childList: true, subtree: true });

  // 3) Показуємо sticky + переносимо віджет
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        stickyBar.classList.remove('show');
        // Повертаємо віджет назад
        if (appstleWidget && mainWidgetContainer && appstleWidget.parentElement !== mainWidgetContainer) {
          mainWidgetContainer.appendChild(appstleWidget);
        }
      } else {
        stickyBar.classList.add('show');
        // Переносимо віджет у sticky
        if (appstleWidget && stickyWidgetMount && appstleWidget.parentElement !== stickyWidgetMount) {
          stickyWidgetMount.appendChild(appstleWidget);
        }
      }
    });
  }, { root: null, threshold: 0 });

  io.observe(defaultATC);
});

