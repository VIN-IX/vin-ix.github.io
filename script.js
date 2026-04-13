/*
    Main site interactions for the NONSO website.

    Reference notes:
    These sources helped guide the theme toggle, browser storage,
    clipboard copy behavior, and general DOM interaction patterns used here.

    Official / documentation sources
    - MDN: Window.localStorage
      https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
    - MDN: Storage.getItem()
      https://developer.mozilla.org/en-US/docs/Web/API/Storage/getItem
    - MDN: Navigator.clipboard
      https://developer.mozilla.org/en-US/docs/Web/API/Navigator/clipboard
    - MDN: Clipboard.writeText()
      https://developer.mozilla.org/en-US/docs/Web/API/Clipboard/writeText
    - MDN: Clipboard API
      https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API

    Practical learning / explanation sources
    - javascript.info: LocalStorage, sessionStorage
      https://javascript.info/localstorage
    - javascript.info: Storing data in the browser
      https://javascript.info/data-storage
    - javascript.info: The Modern JavaScript Tutorial
      https://javascript.info/

    General learning / quick-reference sources
    - W3Schools: JavaScript Web Storage API
      https://www.w3schools.com/js/js_api_web_storage.asp
*/

document.addEventListener("DOMContentLoaded", function () {
    const themeToggle = document.getElementById("themeToggle");
    const savedTheme = localStorage.getItem("theme");

    // Keep the visitor's theme choice between page loads.
    if (savedTheme === "light") {
        document.body.classList.add("light-theme");
    }

    if (themeToggle) {
        updateThemeButtonText(themeToggle);

        themeToggle.addEventListener("click", function () {
            document.body.classList.toggle("light-theme");

            if (document.body.classList.contains("light-theme")) {
                localStorage.setItem("theme", "light");
            } else {
                localStorage.setItem("theme", "dark");
            }

            updateThemeButtonText(themeToggle);
        });
    }

    const copyEmailButton = document.getElementById("copyEmailButton");

    if (copyEmailButton) {
        copyEmailButton.addEventListener("click", function () {
            navigator.clipboard.writeText("unegbuvincent@gmail.com").then(function () {
                showToast("Email copied");
            });
        });
    }

    setupJavaScriptPage();
    setupBasketballPage();
});

function updateThemeButtonText(button) {
    if (document.body.classList.contains("light-theme")) {
        button.textContent = "Dark Mode";
    } else {
        button.textContent = "Light Mode";
    }
}

function setupJavaScriptPage() {
    const searchInput = document.getElementById("jsSearchInput");
    const filterButtons = document.querySelectorAll(".filter-btn");
    const cards = document.querySelectorAll(".js-card");
    const copyButtons = document.querySelectorAll(".copy-code-btn");
    const toggleButtons = document.querySelectorAll(".toggle-example-btn");
    const cardContainer = document.getElementById("jsCardContainer");

    // Exit early on pages that do not use the JavaScript reference layout.
    if (!searchInput || !cardContainer) {
        return;
    }

    let activeFilter = "all";

    function filterCards() {
        const searchValue = searchInput.value.toLowerCase().trim();
        let visibleCount = 0;

        cards.forEach(function (card) {
            const category = card.dataset.category;
            const searchText = card.dataset.search;

            const matchesFilter = activeFilter === "all" || category === activeFilter;
            const matchesSearch = searchText.includes(searchValue);

            if (matchesFilter && matchesSearch) {
                card.style.display = "";
                visibleCount += 1;
            } else {
                card.style.display = "none";
            }
        });

        let noResults = document.getElementById("noResultsMessage");

        if (visibleCount === 0) {
            if (!noResults) {
                noResults = document.createElement("div");
                noResults.id = "noResultsMessage";
                noResults.className = "no-results";
                noResults.textContent = "No concepts matched your search or filter.";
                cardContainer.appendChild(noResults);
            }
        } else if (noResults) {
            noResults.remove();
        }
    }

    searchInput.addEventListener("input", filterCards);

    filterButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            filterButtons.forEach(function (currentButton) {
                currentButton.classList.remove("active");
            });

            button.classList.add("active");
            activeFilter = button.dataset.filter;
            filterCards();
        });
    });

    copyButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            const codeId = button.dataset.codeId;
            const codeBlock = document.getElementById(codeId);

            if (codeBlock) {
                navigator.clipboard.writeText(codeBlock.textContent).then(function () {
                    showToast("Code copied");
                });
            }
        });
    });

    toggleButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            const detailBox = button.parentElement.nextElementSibling;

            if (detailBox.classList.contains("hidden")) {
                detailBox.classList.remove("hidden");
                button.textContent = "Hide Details";
            } else {
                detailBox.classList.add("hidden");
                button.textContent = "Show Details";
            }
        });
    });
}

function setupBasketballPage() {
    const basketballButtons = document.querySelectorAll(".basketball-toggle-btn");

    if (basketballButtons.length === 0) {
        return;
    }

    basketballButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            const card = button.closest(".basketball-card");
            const detailBox = card.querySelector(".basketball-detail");

            if (detailBox.classList.contains("hidden")) {
                detailBox.classList.remove("hidden");
                button.textContent = "Hide Details";
            } else {
                detailBox.classList.add("hidden");
                button.textContent = "Show Details";
            }
        });
    });
}

function showToast(message) {
    let toast = document.getElementById("toastMessage");

    if (!toast) {
        toast = document.createElement("div");
        toast.id = "toastMessage";
        toast.className = "toast";
        document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(toast.hideTimeout);

    toast.hideTimeout = setTimeout(function () {
        toast.classList.remove("show");
    }, 1600);
}