document.addEventListener("DOMContentLoaded", function () {
  setupScrollProgress();
  setupRevealSections();
  setupStatCount();
  setupBackToTop();
  setupContactForm();
  setupActiveNav();
});

function setupScrollProgress() {
  const progressBar = document.getElementById("progressBar");

  window.addEventListener("scroll", function () {
    const scrollTop = window.scrollY;
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (scrollTop / scrollHeight) * 100;
    progressBar.style.width = progress + "%";
  });
}

function setupRevealSections() {
  const revealItems = document.querySelectorAll(".reveal");

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  }, { threshold: 0.15 });

  revealItems.forEach(function (item) {
    observer.observe(item);
  });
}

function setupStatCount() {
  const numbers = document.querySelectorAll(".stat-number");

  numbers.forEach(function (number) {
    const target = Number(number.dataset.target);
    let current = 0;
    const increment = Math.max(1, Math.ceil(target / 50));

    const timer = setInterval(function () {
      current += increment;

      if (current >= target) {
        number.textContent = target;
        clearInterval(timer);
      } else {
        number.textContent = current;
      }
    }, 20);
  });
}

function setupBackToTop() {
  const button = document.getElementById("backToTop");

  window.addEventListener("scroll", function () {
    if (window.scrollY > 500) {
      button.classList.add("show");
    } else {
      button.classList.remove("show");
    }
  });

  button.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

function setupContactForm() {
  const form = document.getElementById("contactForm");
  const message = document.getElementById("formMessage");

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    message.textContent = "Message submitted for demo purposes.";
    form.reset();
  });
}

function setupActiveNav() {
  const sections = document.querySelectorAll("main section[id]");
  const navLinks = document.querySelectorAll(".main-nav a");

  window.addEventListener("scroll", function () {
    let currentId = "";

    sections.forEach(function (section) {
      const top = section.offsetTop - 120;
      const height = section.offsetHeight;

      if (window.scrollY >= top && window.scrollY < top + height) {
        currentId = section.getAttribute("id");
      }
    });

    navLinks.forEach(function (link) {
      link.classList.remove("active");

      if (link.getAttribute("href") === "#" + currentId) {
        link.classList.add("active");
      }
    });
  });
}