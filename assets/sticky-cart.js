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
