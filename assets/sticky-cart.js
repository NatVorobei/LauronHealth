document.addEventListener("DOMContentLoaded", function () {
    const stickyBar = document.getElementById("sticky-add-to-cart");
    const targetButton = document.querySelector('[id^="ProductSubmitButton-"]');

    if (!stickyBar || !targetButton) return;

    const observer = new IntersectionObserver(
        function (entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    stickyBar.classList.remove("show");
                } else {
                    stickyBar.classList.add("show");
                }
            });
        },
        {
            root: null,
            threshold: 0
        }
    );

    observer.observe(targetButton);
});

//Select variants
document.addEventListener('DOMContentLoaded', function () {
    const mainForm = document.querySelector('form[action^="/cart/add"]');
    const stickyForm = document.querySelector('#sticky-add-to-cart form');

    if (!mainForm || !stickyForm) return;

    const mainVariantInput = mainForm.querySelector('input[name="id"]');
    const stickyVariantInput = stickyForm.querySelector('input[name="id"]');

    const mainAddBtn = mainForm.querySelector('button[type="submit"]');
    const stickyAddBtn = stickyForm.querySelector('button[type="submit"]');
    const stickySoldOut = stickyForm.querySelector('.sold-out-message');

    let stickySellingPlanInput = stickyForm.querySelector('input[name="selling_plan"]');
    if (!stickySellingPlanInput) {
      stickySellingPlanInput = document.createElement('input');
      stickySellingPlanInput.type = 'hidden';
      stickySellingPlanInput.name = 'selling_plan';
      stickyForm.appendChild(stickySellingPlanInput);
    }

    function syncStickyState() {
      if (!mainVariantInput || !stickyVariantInput || !mainAddBtn || !stickyAddBtn) return;

      stickyVariantInput.value = mainVariantInput.value;

      const isDisabled = mainAddBtn.disabled;
      stickyAddBtn.disabled = isDisabled;

      if (isDisabled) {
        stickySoldOut?.classList.remove('hidden');
      } else {
        stickySoldOut?.classList.add('hidden');
      }

      const selectedSellingPlan = mainForm.querySelector('input[name="selling_plan"]:checked');
      if (selectedSellingPlan) {
        stickySellingPlanInput.value = selectedSellingPlan.value;
      } else {
        stickySellingPlanInput.removeAttribute('value');
      }
      if (window.AppstleMemberships && typeof window.AppstleMemberships.updateProduct === 'function') {
        window.AppstleMemberships.updateProduct({ variantId: mainVariantInput.value });
      }

      setTimeout(() => {
        if (window.updateStickyPlansSelect) window.updateStickyPlansSelect();
      }, 350);
    }

    const observer = new MutationObserver(syncStickyState);
    observer.observe(mainForm, {
      childList: true,
      subtree: true,
      attributes: true,
    });

    mainForm.addEventListener('change', syncStickyState);
    syncStickyState();
  });

//Subscription
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

//Subscription
document.addEventListener('DOMContentLoaded', function () {
  const customSelect = document.querySelector('#custom-subscription-select');
  const wrapper = document.querySelector('.custom-subscription-wrapper');
  const realForm = document.querySelector('form[action^="/cart/add"]');

  if (!customSelect || !realForm) return;

  function updateSellingPlansInSelect() {
    const realSellingPlans = document.querySelectorAll('input[name="selling_plan"]:not([disabled])');

    const prevValue = customSelect.value;
    customSelect.innerHTML = '';
    const addedValues = new Set();

    realSellingPlans.forEach((plan) => {
      const value = plan.value;
      if (addedValues.has(value)) return;
      addedValues.add(value);

      const label = plan.nextElementSibling;
      const labelText = (label && label.textContent || '').trim();
      if (!labelText) return;

      const opt = document.createElement('option');
      opt.value = value;
      opt.textContent = labelText;
      customSelect.appendChild(opt);
    });

    if (customSelect.options.length === 0) {
      if (wrapper) wrapper.style.display = 'none';
      return;
    } else {
      if (wrapper) wrapper.style.display = '';
    }

    const checkedPlan = Array.from(realSellingPlans).find((r) => r.checked);
    if (checkedPlan && Array.from(customSelect.options).some(o => o.value === checkedPlan.value)) {
      customSelect.value = checkedPlan.value;
    } else if (prevValue && Array.from(customSelect.options).some(o => o.value === prevValue)) {
      customSelect.value = prevValue;
    } else {
      customSelect.selectedIndex = 0;
      const firstValue = customSelect.value;
      Array.from(realSellingPlans).forEach(r => { r.checked = (r.value === firstValue); });
      realForm.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }

  window.updateStickyPlansSelect = function () {
    updateSellingPlansInSelect();
  };

  customSelect.addEventListener('change', function () {
    const selectedValue = customSelect.value;
    const realSellingPlans = document.querySelectorAll('input[name="selling_plan"]');
    realSellingPlans.forEach((radio) => {
      radio.checked = radio.value === selectedValue;
    });
    realForm.dispatchEvent(new Event('change', { bubbles: true }));
  });

  realForm.addEventListener('change', function (e) {
    if (e.target && e.target.name === 'selling_plan') {
      updateSellingPlansInSelect();
    }
  });

  const appstleWidget = document.querySelector('.smart-subscription-widget');
  if (!appstleWidget) return;

  const observer = new MutationObserver(function () {
    updateSellingPlansInSelect();
  });
  observer.observe(appstleWidget, {
    childList: true,
    subtree: true,
    attributes: true,
    characterData: true
  });

  setTimeout(updateSellingPlansInSelect, 1000);
});


  //Caret
  document.addEventListener('DOMContentLoaded', function () {
    const select = document.querySelector('.custom-subscription-select');

    if (!select) return;

    select.addEventListener('pointerdown', () => {
      setTimeout(() => {
        select.classList.add('open');
      }, 0);
    });

    function closeSelect() {
      select.classList.remove('open');
    }

    select.addEventListener('blur', closeSelect);
    select.addEventListener('change', closeSelect);
    select.addEventListener('focusout', closeSelect);
  });

// IOS
document.addEventListener('DOMContentLoaded', () => {
  const bar = document.getElementById('sticky-add-to-cart');
  if (!bar || !window.visualViewport) return;

  const vv = window.visualViewport;

  function place() {
    let off = Math.max(0, window.innerHeight - vv.height - vv.offsetTop);

    if ('pageTop' in vv && typeof vv.pageTop === 'number') {
      const bottomOfLayout = window.scrollY + window.innerHeight;
      const bottomOfVisual = vv.pageTop + vv.height;
      off = Math.max(0, bottomOfLayout - bottomOfVisual);
    }

    bar.style.bottom = `calc(env(safe-area-inset-bottom, 0px) + ${off}px)`;
  }

  if ('ongeometrychange' in vv) vv.addEventListener('geometrychange', place, { passive: true });
  vv.addEventListener('resize', place, { passive: true });
  vv.addEventListener('scroll', place, { passive: true });
  window.addEventListener('resize', place, { passive: true });
  window.addEventListener('scroll', place, { passive: true });
  window.addEventListener('orientationchange', place, { passive: true });

  place();
});




