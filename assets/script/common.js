const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -100px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1";
      entry.target.style.transform = "translateY(0)";
    }
  });
}, observerOptions);

document.addEventListener("DOMContentLoaded", () => {
  const navList = document.querySelector(".nav-links");
  const mobileBtn = document.querySelector(".mobile-menu-btn");
  const navbar = document.querySelector(".navbar");
  const iconMenu = document.querySelector(".icon-menu");
  const iconClose = document.querySelector(".icon-close");

  /* ── Clone auth buttons / user profile into sidebar for mobile ── */
  if (navList) {
    const authButtons = document.querySelector("#auth-buttons");
    const userProfile = document.querySelector("#user-profile");

    // Clone auth buttons into sidebar
    if (authButtons) {
      const sidebarAuth = document.createElement("div");
      sidebarAuth.className = "sidebar-auth active";
      Array.from(authButtons.children).forEach((child) => {
        sidebarAuth.appendChild(child.cloneNode(true));
      });
      navList.appendChild(sidebarAuth);
    }

    // Clone user profile into sidebar (always — visibility controlled by index.js)
    if (userProfile) {
      const sidebarProfile = document.createElement("div");
      sidebarProfile.className = "sidebar-profile";
      sidebarProfile.id = "sidebar-profile";
      sidebarProfile.innerHTML = userProfile.innerHTML;
      navList.appendChild(sidebarProfile);
    }
  }

  /* ── Create backdrop overlay ── */
  const backdrop = document.createElement("div");
  backdrop.className = "nav-backdrop";
  document.body.appendChild(backdrop);

  /* ── Helper to close sidebar ── */
  function closeSidebar() {
    if (!navList || !mobileBtn) return;
    navList.classList.remove("open");
    mobileBtn.setAttribute("aria-expanded", "false");
    backdrop.classList.remove("active");
    document.documentElement.style.overflow = "";
    if (iconMenu) iconMenu.style.display = "";
    if (iconClose) iconClose.style.display = "none";
  }

  function openSidebar() {
    if (!navList || !mobileBtn) return;
    navList.classList.add("open");
    mobileBtn.setAttribute("aria-expanded", "true");
    backdrop.classList.add("active");
    document.documentElement.style.overflow = "hidden";
    if (iconMenu) iconMenu.style.display = "none";
    if (iconClose) iconClose.style.display = "";
  }

  /* ── Hamburger toggle ── */
  if (mobileBtn && navList) {
    mobileBtn.addEventListener("click", () => {
      const isOpen = navList.classList.contains("open");
      if (isOpen) {
        closeSidebar();
      } else {
        openSidebar();
      }
    });

    // Close when clicking an anchor link within sidebar
    navList.addEventListener("click", (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      closeSidebar();
    });

    // Close on backdrop click
    backdrop.addEventListener("click", closeSidebar);

    // Close on Escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && navList.classList.contains("open")) {
        closeSidebar();
      }
    });
  }

  /* ── Scroll Animations ── */
  const animatedElements = document.querySelectorAll(
    ".feature-card, .step, .ecosystem-item, .impact-card, .highlight, .vision-card, .mission-card, .problem-list li, .solution-content p, .business-card",
  );

  animatedElements.forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(30px)";
    el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    observer.observe(el);
  });

  /* ── Navbar Shadow on Scroll ── */
  window.addEventListener("scroll", () => {
    if (!navbar) return;
    const currentScroll = window.pageYOffset;

    navbar.style.boxShadow =
      currentScroll > 100
        ? "0 4px 12px rgba(0, 0, 0, 0.15)"
        : "0 4px 6px rgba(0, 0, 0, 0.1)";
  });

  /* ── Smooth Scroll for Anchor Links ── */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (event) => {
      const target = document.querySelector(anchor.getAttribute("href"));
      if (!target) return;

      event.preventDefault();
      const offsetTop = target.offsetTop - 80;
      window.scrollTo({ top: offsetTop, behavior: "smooth" });
    });
  });

  /* ── Copy Referral Link ── */
  const copyBtn = document.querySelector(".copy-btn");
  if (copyBtn) {
    copyBtn.addEventListener("click", () => {
      const referralLink = document.querySelector(".referral-link");
      if (referralLink) {
        navigator.clipboard.writeText(referralLink.value);
        const originalText = copyBtn.textContent;
        copyBtn.textContent = "Copied!";
        setTimeout(() => {
          copyBtn.textContent = originalText;
        }, 2000);
      }
    });
  }

  /* ── CTA Button Scroll ── */
  const ctaButtons = document.querySelectorAll(".btn-primary, .btn-secondary");
  ctaButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      if (!btn.closest("a") && !btn.classList.contains("copy-btn")) {
        e.preventDefault();
        const featuresSection = document.querySelector("#features");
        if (featuresSection) {
          const offsetTop = featuresSection.offsetTop - 80;
          window.scrollTo({ top: offsetTop, behavior: "smooth" });
        }
      }
    });
  });
});
